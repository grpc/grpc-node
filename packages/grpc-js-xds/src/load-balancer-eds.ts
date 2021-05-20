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

import { connectivityState as ConnectivityState, status as Status, Metadata, logVerbosity as LogVerbosity, experimental, StatusObject } from '@grpc/grpc-js';
import { getSingletonXdsClient, XdsClient, XdsClusterDropStats } from './xds-client';
import { ClusterLoadAssignment__Output } from './generated/envoy/config/endpoint/v3/ClusterLoadAssignment';
import { Locality__Output } from './generated/envoy/api/v2/core/Locality';
import { LocalitySubchannelAddress, PriorityChild, PriorityLoadBalancingConfig } from './load-balancer-priority';
import LoadBalancer = experimental.LoadBalancer;
import ChannelControlHelper = experimental.ChannelControlHelper;
import registerLoadBalancerType = experimental.registerLoadBalancerType;
import LoadBalancingConfig = experimental.LoadBalancingConfig;
import SubchannelAddress = experimental.SubchannelAddress;
import subchannelAddressToString = experimental.subchannelAddressToString;
import ChildLoadBalancerHandler = experimental.ChildLoadBalancerHandler;
import UnavailablePicker = experimental.UnavailablePicker;
import Picker = experimental.Picker;
import PickResultType = experimental.PickResultType;
import { validateLoadBalancingConfig } from '@grpc/grpc-js/build/src/experimental';
import { WeightedTarget, WeightedTargetLoadBalancingConfig } from './load-balancer-weighted-target';
import { LrsLoadBalancingConfig } from './load-balancer-lrs';
import { Watcher } from './xds-stream-state/xds-stream-state';
import Filter = experimental.Filter;
import BaseFilter = experimental.BaseFilter;
import FilterFactory = experimental.FilterFactory;
import FilterStackFactory = experimental.FilterStackFactory;
import CallStream = experimental.CallStream;

const TRACER_NAME = 'eds_balancer';

function trace(text: string): void {
  experimental.trace(LogVerbosity.DEBUG, TRACER_NAME, text);
}

const TYPE_NAME = 'eds';

function localityToName(locality: Locality__Output) {
  return `{region=${locality.region},zone=${locality.zone},sub_zone=${locality.sub_zone}}`;
}

const DEFAULT_MAX_CONCURRENT_REQUESTS = 1024;

export class EdsLoadBalancingConfig implements LoadBalancingConfig {
  private maxConcurrentRequests: number;
  getLoadBalancerName(): string {
    return TYPE_NAME;
  }
  toJsonObject(): object {
    const jsonObj: {[key: string]: any} = {
      cluster: this.cluster,
      locality_picking_policy: this.localityPickingPolicy.map(policy => policy.toJsonObject()),
      endpoint_picking_policy: this.endpointPickingPolicy.map(policy => policy.toJsonObject()),
      max_concurrent_requests: this.maxConcurrentRequests
    };
    if (this.edsServiceName !== undefined) {
      jsonObj.eds_service_name = this.edsServiceName;
    }
    if (this.lrsLoadReportingServerName !== undefined) {
      jsonObj.lrs_load_reporting_server_name = this.lrsLoadReportingServerName;
    }
    return {
      [TYPE_NAME]: jsonObj
    };
  }

  constructor(private cluster: string, private localityPickingPolicy: LoadBalancingConfig[], private endpointPickingPolicy: LoadBalancingConfig[], private edsServiceName?: string, private lrsLoadReportingServerName?: string, maxConcurrentRequests?: number) {
    this.maxConcurrentRequests = maxConcurrentRequests ?? DEFAULT_MAX_CONCURRENT_REQUESTS;
  }

  getCluster() {
    return this.cluster;
  }

  getLocalityPickingPolicy() {
    return this.localityPickingPolicy;
  }

  getEndpointPickingPolicy() {
    return this.endpointPickingPolicy;
  }

  getEdsServiceName() {
    return this.edsServiceName;
  }

  getLrsLoadReportingServerName() {
    return this.lrsLoadReportingServerName;
  }

  getMaxConcurrentRequests() {
    return this.maxConcurrentRequests;
  }

  static createFromJson(obj: any): EdsLoadBalancingConfig {
    if (!('cluster' in obj && typeof obj.cluster === 'string')) {
      throw new Error('eds config must have a string field cluster');
    }
    if (!('locality_picking_policy' in obj && Array.isArray(obj.locality_picking_policy))) {
      throw new Error('eds config must have a locality_picking_policy array');
    }
    if (!('endpoint_picking_policy' in obj && Array.isArray(obj.endpoint_picking_policy))) {
      throw new Error('eds config must have an endpoint_picking_policy array');
    }
    if ('eds_service_name' in obj && !(obj.eds_service_name === undefined || typeof obj.eds_service_name === 'string')) {
      throw new Error('eds config eds_service_name field must be a string if provided');
    }
    if ('lrs_load_reporting_server_name' in obj && (!obj.lrs_load_reporting_server_name === undefined || typeof obj.lrs_load_reporting_server_name === 'string')) {
      throw new Error('eds config lrs_load_reporting_server_name must be a string if provided');
    }
    if ('max_concurrent_requests' in obj && (!obj.max_concurrent_requests === undefined || typeof obj.max_concurrent_requests === 'number')) {
      throw new Error('eds config max_concurrent_requests must be a number if provided');
    }
    return new EdsLoadBalancingConfig(obj.cluster, obj.locality_picking_policy.map(validateLoadBalancingConfig), obj.endpoint_picking_policy.map(validateLoadBalancingConfig), obj.eds_service_name, obj.lrs_load_reporting_server_name, obj.max_concurrent_requests);
  }
}

class CallEndTrackingFilter extends BaseFilter implements Filter {
  constructor(private onCallEnd: () => void) {
    super();
  }
  receiveTrailers(status: StatusObject) {
    this.onCallEnd();
    return status;
  }
}

class CallTrackingFilterFactory implements FilterFactory<CallEndTrackingFilter> {
  constructor(private onCallEnd: () => void) {}

  createFilter(callStream: CallStream) {
    return new CallEndTrackingFilter(this.onCallEnd);
  }
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
  private edsServiceName: string | null = null;
  private watcher: Watcher<ClusterLoadAssignment__Output>;
  /**
   * Indicates whether the watcher has already been passed to the xdsClient
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

  private clusterDropStats: XdsClusterDropStats | null = null;

  private concurrentRequests: number = 0;

  constructor(private readonly channelControlHelper: ChannelControlHelper) {
    this.childBalancer = new ChildLoadBalancerHandler({
      createSubchannel: (subchannelAddress, subchannelArgs) =>
        this.channelControlHelper.createSubchannel(
          subchannelAddress,
          subchannelArgs
        ),
      requestReresolution: () =>
        this.channelControlHelper.requestReresolution(),
      updateState: (connectivityState, originalPicker) => {
        if (this.latestEdsUpdate === null) {
          return;
        }
        const edsPicker: Picker = {
          pick: (pickArgs) => {
            const dropCategory = this.checkForDrop();
            /* If we drop the call, it ends with an UNAVAILABLE status.
             * Otherwise, delegate picking the subchannel to the child
             * balancer. */
            if (dropCategory === null) {
              const originalPick = originalPicker.pick(pickArgs);
              let extraFilterFactory: FilterFactory<Filter> = new CallTrackingFilterFactory(() => {
                this.concurrentRequests -= 1;
              });
              if (originalPick.extraFilterFactory) {
                extraFilterFactory = new FilterStackFactory([originalPick.extraFilterFactory, extraFilterFactory]);
              }
              return {
                pickResultType: originalPick.pickResultType,
                status: originalPick.status,
                subchannel: originalPick.subchannel,
                onCallStarted: () => {
                  originalPick.onCallStarted?.();
                  this.concurrentRequests += 1;
                },
                extraFilterFactory: extraFilterFactory
              };
            } else {
              let details: string;
              if (dropCategory === true) {
                details = 'Call dropped by load balancing policy.';
                this.clusterDropStats?.addUncategorizedCallDropped();
              } else {
                details = `Call dropped by load balancing policy. Category: ${dropCategory}`;
                this.clusterDropStats?.addCallDropped(dropCategory);
              }
              return {
                pickResultType: PickResultType.DROP,
                status: {
                  code: Status.UNAVAILABLE,
                  details: details,
                  metadata: new Metadata(),
                },
                subchannel: null,
                extraFilterFactory: null,
                onCallStarted: null
              };
            }
          },
        };
        this.channelControlHelper.updateState(connectivityState, edsPicker);
      },
    });
    this.watcher = {
      onValidUpdate: (update) => {
        trace('Received EDS update for ' + this.edsServiceName + ': ' + JSON.stringify(update, undefined, 2));
        this.latestEdsUpdate = update;
        this.updateChild();
      },
      onResourceDoesNotExist: () => {
        this.isWatcherActive = false;
        this.channelControlHelper.updateState(ConnectivityState.TRANSIENT_FAILURE, new UnavailablePicker({code: Status.UNAVAILABLE, details: 'EDS resource does not exist', metadata: new Metadata()}));
        this.childBalancer.destroy();
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
   * Check whether a single call should be dropped according to the current
   * policy, based on randomly chosen numbers. Returns the drop category if
   * the call should be dropped, and null otherwise. true is a valid
   * output, as a sentinel value indicating a drop with no category.
   */
  private checkForDrop(): string | true | null {
    if (this.lastestConfig && this.concurrentRequests >= this.lastestConfig.getMaxConcurrentRequests()) {
      return true;
    }
    if (!this.latestEdsUpdate?.policy) {
      return null;
    }
    /* The drop_overloads policy is a list of pairs of category names and
     * probabilities. For each one, if the random number is within that
     * probability range, we drop the call citing that category. Otherwise, the
     * call proceeds as usual. */
    for (const dropOverload of this.latestEdsUpdate.policy.drop_overloads) {
      if (!dropOverload.drop_percentage) {
        continue;
      }
      let randNum: number;
      switch (dropOverload.drop_percentage.denominator) {
        case 'HUNDRED':
          randNum = Math.random() * 100;
          break;
        case 'TEN_THOUSAND':
          randNum = Math.random() * 10_000;
          break;
        case 'MILLION':
          randNum = Math.random() * 1_000_000;
          break;
        default:
          continue;
      }
      if (randNum < dropOverload.drop_percentage.numerator) {
        return dropOverload.category;
      }
    }
    return null;
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
    /**
     * New replacement for this.localityPriorities, mapping locality names to
     * priority values. The replacement occurrs at the end of this method.
     */
    const newLocalityPriorities: Map<string, number> = new Map<
      string,
      number
    >();
    /* We are given a list of localities, each of which has a priority. This
     * loop consolidates localities into buckets by priority, while also
     * simplifying the data structure to make the later steps simpler */
    for (const endpoint of this.latestEdsUpdate.endpoints) {
      if (!endpoint.load_balancing_weight) {
        continue;
      }
      const addresses: SubchannelAddress[] = endpoint.lb_endpoints.filter(lbEndpoint => lbEndpoint.health_status === 'UNKNOWN' || lbEndpoint.health_status === 'HEALTHY').map(
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
      if (addresses.length > 0) {
        let localityArray = priorityList[endpoint.priority];
        if (localityArray === undefined) {
          localityArray = [];
          priorityList[endpoint.priority] = localityArray;
        }
        localityArray.push({
          locality: endpoint.locality!,
          addresses: addresses,
          weight: endpoint.load_balancing_weight.value,
        });
        newLocalityPriorities.set(
          localityToName(endpoint.locality!),
          endpoint.priority
        );
      }
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
      // Skip priorities that have no localities with healthy endpoints
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
        /* Use the endpoint picking policy from the config, default to
         * round_robin. */
        const endpointPickingPolicy: LoadBalancingConfig[] = [
          ...this.lastestConfig.getEndpointPickingPolicy(),
          validateLoadBalancingConfig({ round_robin: {} }),
        ];
        let childPolicy: LoadBalancingConfig[];
        if (this.lastestConfig.getLrsLoadReportingServerName() !== undefined) {
          childPolicy = [new LrsLoadBalancingConfig(this.lastestConfig.getCluster(), this.lastestConfig.getEdsServiceName() ?? '', this.lastestConfig.getLrsLoadReportingServerName()!, localityObj.locality, endpointPickingPolicy)];
        } else {
          childPolicy = endpointPickingPolicy;
        }
        childTargets.set(localityToName(localityObj.locality), {
          weight: localityObj.weight,
          child_policy: childPolicy,
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
          new WeightedTargetLoadBalancingConfig(childTargets),
        ],
      });
    }
    /* Contract the priority names array if it is sparse. This config only
     * cares about the order of priorities, not their specific numbers */
    const childConfig: PriorityLoadBalancingConfig = new PriorityLoadBalancingConfig(priorityChildren, newPriorityNames.filter((value) => value !== undefined));
    trace('Child update addresses: ' + addressList.map(address => '(' + subchannelAddressToString(address) + ' path=' + address.localityPath + ')'));
    trace('Child update priority config: ' + JSON.stringify(childConfig.toJsonObject(), undefined, 2));
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
    if (!(lbConfig instanceof EdsLoadBalancingConfig)) {
      trace('Discarding address list update with unrecognized config ' + JSON.stringify(lbConfig.toJsonObject(), undefined, 2));
      return;
    }
    trace('Received update with config: ' + JSON.stringify(lbConfig, undefined, 2));
    this.lastestConfig = lbConfig;
    this.latestAttributes = attributes;
    const newEdsServiceName = lbConfig.getEdsServiceName() ?? lbConfig.getCluster();

    /* If the name is changing, disable the old watcher before adding the new
     * one */
    if (this.isWatcherActive && this.edsServiceName !== newEdsServiceName) {
      trace('Removing old endpoint watcher for edsServiceName ' + this.edsServiceName)
      getSingletonXdsClient().removeEndpointWatcher(this.edsServiceName!, this.watcher);
      /* Setting isWatcherActive to false here lets us have one code path for
       * calling addEndpointWatcher */
      this.isWatcherActive = false;
      /* If we have a new name, the latestEdsUpdate does not correspond to
       * the new config, so it is no longer valid */
      this.latestEdsUpdate = null;
    }

    this.edsServiceName = newEdsServiceName;

    if (!this.isWatcherActive) {
      trace('Adding new endpoint watcher for edsServiceName ' + this.edsServiceName);
      getSingletonXdsClient().addEndpointWatcher(this.edsServiceName, this.watcher);
      this.isWatcherActive = true;
    }

    if (lbConfig.getLrsLoadReportingServerName()) {
      this.clusterDropStats = getSingletonXdsClient().addClusterDropStats(
        lbConfig.getLrsLoadReportingServerName()!,
        lbConfig.getCluster(),
        lbConfig.getEdsServiceName() ?? ''
      );
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
    trace('Destroying load balancer with edsServiceName ' + this.edsServiceName);
    if (this.edsServiceName) {
      getSingletonXdsClient().removeEndpointWatcher(this.edsServiceName, this.watcher);
    }
    this.childBalancer.destroy();
  }
  getTypeName(): string {
    return TYPE_NAME;
  }
}

export function setup() {
  registerLoadBalancerType(TYPE_NAME, EdsLoadBalancer, EdsLoadBalancingConfig);
}
