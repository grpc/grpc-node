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

import { connectivityState, status, Metadata, logVerbosity, experimental } from '@grpc/grpc-js';
import { getSingletonXdsClient, XdsClient } from './xds-client';
import { Cluster__Output } from './generated/envoy/api/v2/Cluster';
import SubchannelAddress = experimental.SubchannelAddress;
import UnavailablePicker = experimental.UnavailablePicker;
import ChildLoadBalancerHandler = experimental.ChildLoadBalancerHandler;
import LoadBalancer = experimental.LoadBalancer;
import ChannelControlHelper = experimental.ChannelControlHelper;
import registerLoadBalancerType = experimental.registerLoadBalancerType;
import LoadBalancingConfig = experimental.LoadBalancingConfig;
import { EdsLoadBalancingConfig } from './load-balancer-eds';
import { Watcher } from './xds-stream-state/xds-stream-state';

const TRACER_NAME = 'cds_balancer';

function trace(text: string): void {
  experimental.trace(logVerbosity.DEBUG, TRACER_NAME, text);
}

const TYPE_NAME = 'cds';

export class CdsLoadBalancingConfig implements LoadBalancingConfig {
  getLoadBalancerName(): string {
    return TYPE_NAME;
  }

  toJsonObject(): object {
    return {
      [TYPE_NAME]: {
        cluster: this.cluster
      }
    }
  }

  constructor(private cluster: string) {}

  getCluster() {
    return this.cluster;
  }

  static createFromJson(obj: any): CdsLoadBalancingConfig {
    if ('cluster' in obj) {
      return new CdsLoadBalancingConfig(obj.cluster);
    } else {
      throw new Error('Missing "cluster" in cds load balancing config');
    }
  }
}

export class CdsLoadBalancer implements LoadBalancer {
  private childBalancer: ChildLoadBalancerHandler;
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
        /* the lrs_server.self field indicates that the same server should be
         * used for load reporting as for other xDS operations. Setting
         * lrsLoadReportingServerName to the empty string sets that behavior.
         * Otherwise, if the field is omitted, load reporting is disabled. */
        const edsConfig: EdsLoadBalancingConfig = new EdsLoadBalancingConfig(update.name, [], [], update.eds_cluster_config!.service_name === '' ? undefined : update.eds_cluster_config!.service_name, update.lrs_server?.self ? '' : undefined);
        trace('Child update EDS config: ' + JSON.stringify(edsConfig));
        this.childBalancer.updateAddressList(
          [],
          edsConfig,
          this.latestAttributes
        );
      },
      onResourceDoesNotExist: () => {
        this.isWatcherActive = false;
        this.channelControlHelper.updateState(connectivityState.TRANSIENT_FAILURE, new UnavailablePicker({code: status.UNAVAILABLE, details: 'CDS resource does not exist', metadata: new Metadata()}));
        this.childBalancer.destroy();
      },
      onTransientError: (statusObj) => {
        if (this.latestCdsUpdate === null) {
          channelControlHelper.updateState(
            connectivityState.TRANSIENT_FAILURE,
            new UnavailablePicker({
              code: status.UNAVAILABLE,
              details: `xDS request failed with error ${statusObj.details}`,
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
    if (!(lbConfig instanceof CdsLoadBalancingConfig)) {
      trace('Discarding address list update with unrecognized config ' + JSON.stringify(lbConfig, undefined, 2));
      return;
    }
    trace('Received update with config ' + JSON.stringify(lbConfig, undefined, 2));
    this.latestAttributes = attributes;

    /* If the cluster is changing, disable the old watcher before adding the new
     * one */
    if (
      this.isWatcherActive &&
      this.latestConfig?.getCluster() !== lbConfig.getCluster()
    ) {
      trace('Removing old cluster watcher for cluster name ' + this.latestConfig!.getCluster());
      getSingletonXdsClient().removeClusterWatcher(
        this.latestConfig!.getCluster(),
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
      trace('Adding new cluster watcher for cluster name ' + lbConfig.getCluster());
      getSingletonXdsClient().addClusterWatcher(lbConfig.getCluster(), this.watcher);
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
    trace('Destroying load balancer with cluster name ' + this.latestConfig?.getCluster());
    this.childBalancer.destroy();
    if (this.isWatcherActive) {
      getSingletonXdsClient().removeClusterWatcher(
        this.latestConfig!.getCluster(),
        this.watcher
      );
    }
  }
  getTypeName(): string {
    return TYPE_NAME;
  }
}

export function setup() {
  registerLoadBalancerType(TYPE_NAME, CdsLoadBalancer, CdsLoadBalancingConfig);
}
