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

import { connectivityState as ConnectivityState, StatusObject, status as Status, experimental } from '@grpc/grpc-js';
import { Locality__Output } from './generated/envoy/api/v2/core/Locality';
import { XdsClusterLocalityStats, XdsClient, getSingletonXdsClient } from './xds-client';
import LoadBalancer = experimental.LoadBalancer;
import ChannelControlHelper = experimental.ChannelControlHelper;
import registerLoadBalancerType = experimental.registerLoadBalancerType;
import getFirstUsableConfig = experimental.getFirstUsableConfig;
import SubchannelAddress = experimental.SubchannelAddress;
import LoadBalancingConfig = experimental.LoadBalancingConfig;
import ChildLoadBalancerHandler = experimental.ChildLoadBalancerHandler;
import Picker = experimental.Picker;
import PickArgs = experimental.PickArgs;
import PickResultType = experimental.PickResultType;
import PickResult = experimental.PickResult;
import Filter = experimental.Filter;
import BaseFilter = experimental.BaseFilter;
import FilterFactory = experimental.FilterFactory;
import FilterStackFactory = experimental.FilterStackFactory;
import Call = experimental.CallStream;
import validateLoadBalancingConfig = experimental.validateLoadBalancingConfig

const TYPE_NAME = 'lrs';

export class LrsLoadBalancingConfig implements LoadBalancingConfig {
  getLoadBalancerName(): string {
    return TYPE_NAME;
  }
  toJsonObject(): object {
    return {
      [TYPE_NAME]: {
        cluster_name: this.clusterName,
        eds_service_name: this.edsServiceName,
        lrs_load_reporting_server_name: this.lrsLoadReportingServerName,
        locality: this.locality,
        child_policy: this.childPolicy.map(policy => policy.toJsonObject())
      }
    }
  }

  constructor(private clusterName: string, private edsServiceName: string, private lrsLoadReportingServerName: string, private locality: Locality__Output, private childPolicy: LoadBalancingConfig[]) {}

  getClusterName() {
    return this.clusterName;
  }

  getEdsServiceName() {
    return this.edsServiceName;
  }

  getLrsLoadReportingServerName() {
    return this.lrsLoadReportingServerName;
  }

  getLocality() {
    return this.locality;
  }

  getChildPolicy() {
    return this.childPolicy;
  }

  static createFromJson(obj: any): LrsLoadBalancingConfig {
    if (!('cluster_name' in obj && typeof obj.cluster_name === 'string')) {
      throw new Error('lrs config must have a string field cluster_name');
    }
    if (!('eds_service_name' in obj && typeof obj.eds_service_name === 'string')) {
      throw new Error('lrs config must have a string field eds_service_name');
    }
    if (!('lrs_load_reporting_server_name' in obj && typeof obj.lrs_load_reporting_server_name === 'string')) {
      throw new Error('lrs config must have a string field lrs_load_reporting_server_name');
    }
    if (!('locality' in obj && obj.locality !== null && typeof obj.locality === 'object')) {
      throw new Error('lrs config must have an object field locality');
    }
    if ('region' in obj.locality && typeof obj.locality.region !== 'string') {
      throw new Error('lrs config locality.region field must be a string if provided');
    }
    if ('zone' in obj.locality && typeof obj.locality.zone !== 'string') {
      throw new Error('lrs config locality.zone field must be a string if provided');
    }
    if ('sub_zone' in obj.locality && typeof obj.locality.sub_zone !== 'string') {
      throw new Error('lrs config locality.sub_zone field must be a string if provided');
    }
    if (!('child_policy' in obj && Array.isArray(obj.child_policy))) {
      throw new Error('lrs config must have a child_policy array');
    }
    return new LrsLoadBalancingConfig(obj.cluster_name, obj.eds_service_name, obj.lrs_load_reporting_server_name, {
      region: obj.locality.region ?? '',
      zone: obj.locality.zone ?? '',
      sub_zone: obj.locality.sub_zone ?? ''
    }, obj.child_policy.map(validateLoadBalancingConfig));
  }
}

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
    if (!(lbConfig instanceof LrsLoadBalancingConfig)) {
      return;
    }
    this.localityStatsReporter = getSingletonXdsClient().addClusterLocalityStats(
      lbConfig.getLrsLoadReportingServerName(),
      lbConfig.getClusterName(),
      lbConfig.getEdsServiceName(),
      lbConfig.getLocality()
    );
    const childPolicy: LoadBalancingConfig = getFirstUsableConfig(
      lbConfig.getChildPolicy(),
      true
    );
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
  registerLoadBalancerType(TYPE_NAME, LrsLoadBalancer, LrsLoadBalancingConfig);
}
