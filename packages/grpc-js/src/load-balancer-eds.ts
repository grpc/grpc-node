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
  isEdsLoadBalancingConfig,
  EdsLoadBalancingConfig,
  PriorityLbConfig,
  PriorityChild,
  WeightedTarget,
  PriorityLoadBalancingConfig,
} from './load-balancing-config';
import { ChildLoadBalancerHandler } from './load-balancer-child-handler';
import { XdsClient, Watcher } from './xds-client';
import { ClusterLoadAssignment__Output } from './generated/envoy/api/v2/ClusterLoadAssignment';
import { ConnectivityState } from './channel';
import { UnavailablePicker } from './picker';
import { Locality__Output } from './generated/envoy/api/v2/core/Locality';
import { LocalitySubchannelAddress } from './load-balancer-priority';
import { Status } from './constants';
import { Metadata } from './metadata';

const TYPE_NAME = 'eds';

function localityToName(locality: Locality__Output) {
  return `{region=${locality.region},zone=${locality.zone},sub_zone=${locality.sub_zone}}`;
}

/**
 * This class load balances over a cluster by making an EDS request and then
 * transforming the result into a configuration for another load balancing
 * policy.
 */
export class EdsLoadBalancer implements LoadBalancer {
  /**
   * The child load balancer that will handle balancing the results of the EDS
   * requests.
   */
  private childBalancer: ChildLoadBalancerHandler;
  private xdsClient: XdsClient | null = null;
  private edsServiceName: string | null = null;
  private watcher: Watcher<ClusterLoadAssignment__Output>;
  /**
   * Indicates whether the watcher has already been passed to this.xdsClient
   * and is getting updates.
   */
  private isWatcherActive = false;

  private lastestConfig: EdsLoadBalancingConfig | null = null;
  private latestAttributes: { [key: string]: unknown } = {};
  private latestEdsUpdate: ClusterLoadAssignment__Output | null = null;

  /**
   * The priority of each locality the last time we got an update.
   */
  private localityPriorities: Map<string, number> = new Map<string, number>();
  /**
   * The name we assigned to each priority number the last time we got an
   * update.
   */
  private priorityNames: string[] = [];

  private nextPriorityChildNumber = 0;

  constructor(private readonly channelControlHelper: ChannelControlHelper) {
    this.childBalancer = new ChildLoadBalancerHandler(channelControlHelper);
    this.watcher = {
      onValidUpdate: (update) => {
        this.latestEdsUpdate = update;
        this.updateChild();
      },
      onResourceDoesNotExist: () => {
        /* TODO(murgatroid99): Figure out what needs to be done here after
         * implementing CDS */
      },
      onTransientError: (status) => {
        if (this.latestEdsUpdate === null) {
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

  /**
   * Should be called when this balancer gets a new config and when the
   * XdsClient returns a new ClusterLoadAssignment.
   */
  private updateChild() {
    if (!(this.lastestConfig && this.latestEdsUpdate)) {
      return;
    }
    /**
     * Maps each priority number to the list of localities with that priority,
     * and the list of addresses associated with each locality.
     */
    const priorityList: {
      locality: Locality__Output;
      weight: number;
      addresses: SubchannelAddress[];
    }[][] = [];
    const newLocalityPriorities: Map<string, number> = new Map<
      string,
      number
    >();
    /* We are given a list of localities, each of which has a priority. This
     * loop consolidates localities into buckets by priority, while also
     * simplifying the data structure to make the later steps simpler */
    for (const endpoint of this.latestEdsUpdate.endpoints) {
      let localityArray = priorityList[endpoint.priority];
      if (localityArray === undefined) {
        localityArray = [];
        priorityList[endpoint.priority] = localityArray;
      }
      const addresses: SubchannelAddress[] = endpoint.lb_endpoints.map(
        (lbEndpoint) => {
          /* The validator in the XdsClient class ensures that each endpoint has
           * a socket_address with an IP address and a port_value. */
          const socketAddress = lbEndpoint.endpoint!.address!.socket_address!;
          return {
            host: socketAddress.address!,
            port: socketAddress.port_value!,
          };
        }
      );
      localityArray.push({
        locality: endpoint.locality!,
        addresses: addresses,
        weight: endpoint.load_balancing_weight?.value ?? 0,
      });
      newLocalityPriorities.set(
        localityToName(endpoint.locality!),
        endpoint.priority
      );
    }

    const newPriorityNames: string[] = [];
    const addressList: LocalitySubchannelAddress[] = [];
    const priorityChildren: Map<string, PriorityChild> = new Map<
      string,
      PriorityChild
    >();
    /* The algorithm here is as follows: for each priority we are given, from
     * high to low:
     * - If the previous mapping had any of the same localities at the same or
     *   a lower priority, use the matching name from the highest such
     *   priority, unless the new mapping has already used that name.
     * - Otherwise, construct a new name using this.nextPriorityChildNumber.
     */
    for (const [priority, localityArray] of priorityList.entries()) {
      if (localityArray === undefined) {
        continue;
      }
      /**
       * Highest (smallest number) priority value that any of the localities in
       * this locality array had a in the previous mapping.
       */
      let highestOldPriority = Infinity;
      for (const localityObj of localityArray) {
        const oldPriority = this.localityPriorities.get(
          localityToName(localityObj.locality)
        );
        if (
          oldPriority !== undefined &&
          oldPriority >= priority &&
          oldPriority < highestOldPriority
        ) {
          highestOldPriority = oldPriority;
        }
      }
      let newPriorityName: string;
      if (highestOldPriority === Infinity) {
        /* No existing priority at or below the same number as the priority we
         * are looking at had any of the localities in this priority. So, we
         * use a new name. */
        newPriorityName = `child${this.nextPriorityChildNumber++}`;
      } else {
        const newName = this.priorityNames[highestOldPriority];
        if (newPriorityNames.indexOf(newName) < 0) {
          newPriorityName = newName;
        } else {
          newPriorityName = `child${this.nextPriorityChildNumber++}`;
        }
      }
      newPriorityNames[priority] = newPriorityName;

      const childTargets: Map<string, WeightedTarget> = new Map<
        string,
        WeightedTarget
      >();
      for (const localityObj of localityArray) {
        childTargets.set(localityToName(localityObj.locality), {
          weight: localityObj.weight,
          /* TODO(murgatroid99): Insert an lrs config around the round_robin
           * config after implementing lrs */
          /* Use the endpoint picking policy from the config, default to
           * round_robin. */
          child_policy: [
            ...this.lastestConfig.eds.endpointPickingPolicy,
            { name: 'round_robin', round_robin: {} },
          ],
        });
        for (const address of localityObj.addresses) {
          addressList.push({
            localityPath: [
              newPriorityName,
              localityToName(localityObj.locality),
            ],
            ...address,
          });
        }
      }

      priorityChildren.set(newPriorityName, {
        config: [
          {
            name: 'weighted_target',
            weighted_target: {
              targets: childTargets,
            },
          },
        ],
      });
    }
    const childConfig: PriorityLoadBalancingConfig = {
      name: 'priority',
      priority: {
        children: priorityChildren,
        /* Contract the priority names array if it is sparse. This config only
         * cares about the order of priorities, not their specific numbers */
        priorities: newPriorityNames.filter((value) => value !== undefined),
      },
    };
    this.childBalancer.updateAddressList(
      addressList,
      childConfig,
      this.latestAttributes
    );

    this.localityPriorities = newLocalityPriorities;
    this.priorityNames = newPriorityNames;
  }

  updateAddressList(
    addressList: SubchannelAddress[],
    lbConfig: LoadBalancingConfig,
    attributes: { [key: string]: unknown }
  ): void {
    if (!isEdsLoadBalancingConfig(lbConfig)) {
      return;
    }
    if (!(attributes.xdsClient instanceof XdsClient)) {
      return;
    }
    this.lastestConfig = lbConfig;
    this.latestAttributes = attributes;
    this.xdsClient = attributes.xdsClient;
    const newEdsServiceName = lbConfig.eds.edsServiceName ?? lbConfig.eds.cluster;

    /* If the name is changing, disable the old watcher before adding the new
     * one */
    if (this.isWatcherActive && this.edsServiceName !== newEdsServiceName) {
      this.xdsClient.removeEndpointWatcher(this.edsServiceName!, this.watcher);
      /* Setting isWatcherActive to false here lets us have one code path for
        * calling addEndpointWatcher */
      this.isWatcherActive = false;
      /* If we have a new name, the latestEdsUpdate does not correspond to
        * the new config, so it is no longer valid */
      this.latestEdsUpdate = null;
    }

    this.edsServiceName = newEdsServiceName;

    if (!this.isWatcherActive) {
      this.xdsClient.addEndpointWatcher(this.edsServiceName, this.watcher);
      this.isWatcherActive = true;
    }

    /* If updateAddressList is called after receiving an update and the update
     * is still valid, we want to update the child config with the information
     * in the new EdsLoadBalancingConfig. */
    this.updateChild();
  }
  exitIdle(): void {
    this.childBalancer.exitIdle();
  }
  resetBackoff(): void {
    this.childBalancer.resetBackoff();
  }
  destroy(): void {
    if (this.edsServiceName) {
      this.xdsClient?.removeEndpointWatcher(this.edsServiceName, this.watcher);
    }
    this.childBalancer.destroy();
  }
  getTypeName(): string {
    return TYPE_NAME;
  }
}

export function setup() {
  registerLoadBalancerType(TYPE_NAME, EdsLoadBalancer);
}
