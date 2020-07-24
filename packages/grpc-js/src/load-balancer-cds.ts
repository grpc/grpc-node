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
} from './load-balancer';
import { SubchannelAddress } from './subchannel';
import {
  LoadBalancingConfig,
  isCdsLoadBalancingConfig,
  EdsLbConfig,
  CdsLoadBalancingConfig,
} from './load-balancing-config';
import { XdsClient, Watcher } from './xds-client';
import { ChildLoadBalancerHandler } from './load-balancer-child-handler';
import { Cluster__Output } from './generated/envoy/api/v2/Cluster';
import { ConnectivityState } from './channel';
import { UnavailablePicker } from './picker';
import { Status } from './constants';
import { Metadata } from './metadata';

const TYPE_NAME = 'cds';

export class CdsLoadBalancer implements LoadBalancer {
  private childBalancer: ChildLoadBalancerHandler;
  private xdsClient: XdsClient | null = null;
  private watcher: Watcher<Cluster__Output>;

  private isWatcherActive = false;

  private latestCdsUpdate: Cluster__Output | null = null;

  private latestConfig: CdsLoadBalancingConfig | null = null;
  private latestAttributes: { [key: string]: unknown } = {};

  constructor(private readonly channelControlHelper: ChannelControlHelper) {
    this.childBalancer = new ChildLoadBalancerHandler(channelControlHelper);
    this.watcher = {
      onValidUpdate: (update) => {
        this.latestCdsUpdate = update;
        const edsConfig: EdsLbConfig = {
          cluster: update.name,
          edsServiceName:
            update.eds_cluster_config!.service_name === ''
              ? undefined
              : update.eds_cluster_config!.service_name,
          localityPickingPolicy: [],
          endpointPickingPolicy: [],
        };
        if (update.lrs_server?.self) {
          /* the lrs_server.self field indicates that the same server should be
           * used for load reporting as for other xDS operations. Setting
           * lrsLoadReportingServerName to the empty string sets that behavior.
           * Otherwise, if the field is omitted, load reporting is disabled. */
          edsConfig.lrsLoadReportingServerName = '';
        }
        this.childBalancer.updateAddressList(
          [],
          { name: 'eds', eds: edsConfig },
          this.latestAttributes
        );
      },
      onResourceDoesNotExist: () => {
        this.xdsClient?.removeClusterWatcher(
          this.latestConfig!.cds.cluster,
          this.watcher
        );
        this.isWatcherActive = false;
      },
      onTransientError: (status) => {
        if (this.latestCdsUpdate === null) {
          channelControlHelper.updateState(
            ConnectivityState.TRANSIENT_FAILURE,
            new UnavailablePicker({
              code: Status.UNAVAILABLE,
              details: `xDS request failed with error ${status.details}`,
              metadata: new Metadata(),
            })
          );
        }
      },
    };
  }

  updateAddressList(
    addressList: SubchannelAddress[],
    lbConfig: LoadBalancingConfig,
    attributes: { [key: string]: unknown }
  ): void {
    if (!isCdsLoadBalancingConfig(lbConfig)) {
      return;
    }
    if (!(attributes.xdsClient instanceof XdsClient)) {
      return;
    }
    this.xdsClient = attributes.xdsClient;
    this.latestAttributes = attributes;

    /* If the cluster is changing, disable the old watcher before adding the new
     * one */
    if (
      this.isWatcherActive &&
      this.latestConfig?.cds.cluster !== lbConfig.cds.cluster
    ) {
      this.xdsClient.removeClusterWatcher(
        this.latestConfig!.cds.cluster,
        this.watcher
      );
      /* Setting isWatcherActive to false here lets us have one code path for
       * calling addClusterWatcher */
      this.isWatcherActive = false;
      /* If we have a new name, the latestCdsUpdate does not correspond to
       * the new config, so it is no longer valid */
      this.latestCdsUpdate = null;
    }

    this.latestConfig = lbConfig;

    if (!this.isWatcherActive) {
      this.xdsClient.addClusterWatcher(lbConfig.cds.cluster, this.watcher);
      this.isWatcherActive = true;
    }
  }
  exitIdle(): void {
    this.childBalancer.exitIdle();
  }
  resetBackoff(): void {
    this.childBalancer.resetBackoff();
  }
  destroy(): void {
    this.childBalancer.destroy();
    if (this.isWatcherActive) {
      this.xdsClient?.removeClusterWatcher(
        this.latestConfig!.cds.cluster,
        this.watcher
      );
    }
  }
  getTypeName(): string {
    return TYPE_NAME;
  }
}

export function setup() {
  registerLoadBalancerType(TYPE_NAME, CdsLoadBalancer);
}
