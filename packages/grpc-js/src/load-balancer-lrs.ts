/*
 * Copyright 2020 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import {
  LoadBalancer,
  ChannelControlHelper,
  registerLoadBalancerType,
  getFirstUsableConfig,
} from './load-balancer';
import { SubchannelAddress } from './subchannel';
import {
  LoadBalancingConfig,
  isLrsLoadBalancingConfig,
} from './load-balancing-config';
import { ChildLoadBalancerHandler } from './load-balancer-child-handler';
import { ConnectivityState } from './channel';
import { Picker, PickArgs, PickResultType, PickResult } from './picker';
import { XdsClusterLocalityStats, XdsClient } from './xds-client';
import { Filter, BaseFilter, FilterFactory } from './filter';
import { StatusObject, Call } from './call-stream';
import { Status } from './constants';
import { FilterStackFactory } from './filter-stack';

const TYPE_NAME = 'lrs';

/**
 * Filter class that reports when the call ends.
 */
class CallEndTrackingFilter extends BaseFilter implements Filter {
  constructor(private localityStatsReporter: XdsClusterLocalityStats) {
    super();
  }

  receiveTrailers(status: StatusObject) {
    this.localityStatsReporter.addCallFinished(status.code !== Status.OK);
    return status;
  }
}

class CallEndTrackingFilterFactory
  implements FilterFactory<CallEndTrackingFilter> {
  constructor(private localityStatsReporter: XdsClusterLocalityStats) {}

  createFilter(callStream: Call): CallEndTrackingFilter {
    return new CallEndTrackingFilter(this.localityStatsReporter);
  }
}

/**
 * Picker that delegates picking to another picker, and reports when calls
 * created using those picks start and end.
 */
class LoadReportingPicker implements Picker {
  constructor(
    private wrappedPicker: Picker,
    private localityStatsReporter: XdsClusterLocalityStats
  ) {}

  pick(pickArgs: PickArgs): PickResult {
    const wrappedPick = this.wrappedPicker.pick(pickArgs);
    if (wrappedPick.pickResultType === PickResultType.COMPLETE) {
      const trackingFilterFactory = new CallEndTrackingFilterFactory(
        this.localityStatsReporter
      );
      /* In the unlikely event that the wrappedPick already has an
       * extraFilterFactory, preserve it in a FilterStackFactory. */
      const extraFilterFactory = wrappedPick.extraFilterFactory
        ? new FilterStackFactory([
            wrappedPick.extraFilterFactory,
            trackingFilterFactory,
          ])
        : trackingFilterFactory;
      return {
        pickResultType: PickResultType.COMPLETE,
        subchannel: wrappedPick.subchannel,
        status: null,
        onCallStarted: () => {
          wrappedPick.onCallStarted?.();
          this.localityStatsReporter.addCallStarted();
        },
        extraFilterFactory: extraFilterFactory,
      };
    } else {
      return wrappedPick;
    }
  }
}

/**
 * "Load balancer" that delegates the actual load balancing logic to another
 * LoadBalancer class and adds hooks to track when calls started using that
 * LoadBalancer start and end, and uses the XdsClient to report that
 * information back to the xDS server.
 */
export class LrsLoadBalancer implements LoadBalancer {
  private childBalancer: ChildLoadBalancerHandler;
  private localityStatsReporter: XdsClusterLocalityStats | null = null;

  constructor(private channelControlHelper: ChannelControlHelper) {
    this.childBalancer = new ChildLoadBalancerHandler({
      createSubchannel: (subchannelAddress, subchannelArgs) =>
        channelControlHelper.createSubchannel(
          subchannelAddress,
          subchannelArgs
        ),
      requestReresolution: () => channelControlHelper.requestReresolution(),
      updateState: (connectivityState: ConnectivityState, picker: Picker) => {
        if (this.localityStatsReporter !== null) {
          picker = new LoadReportingPicker(picker, this.localityStatsReporter);
        }
        channelControlHelper.updateState(connectivityState, picker);
      },
    });
  }

  updateAddressList(
    addressList: SubchannelAddress[],
    lbConfig: LoadBalancingConfig,
    attributes: { [key: string]: unknown }
  ): void {
    if (!isLrsLoadBalancingConfig(lbConfig)) {
      return;
    }
    if (!(attributes.xdsClient instanceof XdsClient)) {
      return;
    }
    const lrsConfig = lbConfig.lrs;
    this.localityStatsReporter = attributes.xdsClient.addClusterLocalityStats(
      lrsConfig.lrs_load_reporting_server_name,
      lrsConfig.cluster_name,
      lrsConfig.eds_service_name,
      lrsConfig.locality
    );
    const childPolicy: LoadBalancingConfig = getFirstUsableConfig(
      lrsConfig.child_policy
    ) ?? { name: 'pick_first', pick_first: {} };
    this.childBalancer.updateAddressList(addressList, childPolicy, attributes);
  }
  exitIdle(): void {
    this.childBalancer.exitIdle();
  }
  resetBackoff(): void {
    this.childBalancer.resetBackoff();
  }
  destroy(): void {
    this.childBalancer.destroy();
  }
  getTypeName(): string {
    return TYPE_NAME;
  }
}

export function setup() {
  registerLoadBalancerType(TYPE_NAME, LrsLoadBalancer);
}
