/*
 * Copyright 2024 gRPC authors.
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
 */

import { experimental, logVerbosity, Metadata, status, StatusObject } from "@grpc/grpc-js";
import { Listener__Output } from "./generated/envoy/config/listener/v3/Listener";
import { RouteConfiguration__Output } from "./generated/envoy/config/route/v3/RouteConfiguration";
import { VirtualHost__Output } from "./generated/envoy/config/route/v3/VirtualHost";
import { CdsUpdate, ClusterResourceType } from "./xds-resource-type/cluster-resource-type";
import { Watcher, XdsClient } from "./xds-client";
import { Locality__Output } from "./generated/envoy/config/core/v3/Locality";
import { DropCategory } from "./load-balancer-xds-cluster-impl";
import Endpoint = experimental.Endpoint;
import Resolver = experimental.Resolver;
import createResolver = experimental.createResolver;
import StatusOr = experimental.StatusOr;
import { decodeSingleResource, HTTP_CONNECTION_MANGER_TYPE_URL } from "./resources";
import { RouteConfigurationResourceType } from "./xds-resource-type/route-config-resource-type";
import { ListenerResourceType } from "./xds-resource-type/listener-resource-type";
import { ClusterLoadAssignment__Output } from "./generated/envoy/config/endpoint/v3/ClusterLoadAssignment";
import { EndpointResourceType } from "./xds-resource-type/endpoint-resource-type";
import { SocketAddress__Output } from "./generated/envoy/config/core/v3/SocketAddress";
import { EXPERIMENTAL_DUALSTACK_ENDPOINTS } from "./environment";

const TRACER_NAME = 'xds_resolver';

function trace(text: string): void {
  experimental.trace(logVerbosity.DEBUG, TRACER_NAME, text);
}

interface WeightedEndpoint {
  endpoint: Endpoint;
  weight: number;
}

interface LocalityEntry {
  locality: Locality__Output;
  weight: number;
  endpoints: WeightedEndpoint[];
}

interface PriorityEntry {
  localities: LocalityEntry[];
}

interface EndpointResource {
  priorities: PriorityEntry[];
  dropCategories: DropCategory[];
}

export interface EndpointConfig {
  type: 'endpoint';
  endpoints?: EndpointResource;
  resolutionNote?: string;
}

export interface AggregateConfig {
  type: 'aggregate';
  leafClusters: string[];
}

export interface ClusterConfig {
  cluster: CdsUpdate;
  children: EndpointConfig | AggregateConfig;
}

export interface ClusterResult {
  clusterConfig?: ClusterConfig;
  status?: StatusObject;
}

export interface XdsConfig {
  listener: Listener__Output;
  routeConfig: RouteConfiguration__Output;
  virtualHost: VirtualHost__Output;
  clusters: Map<string, StatusOr<ClusterConfig>>;
}

export interface XdsConfigWatcher {
  onUpdate(xdsConfig: StatusOr<XdsConfig>): void;
}

interface AggregateClusterInfo {
  type: 'AGGREGATE';
  cdsUpdate: CdsUpdate;
}

interface EdsClusterInfo {
  type: 'EDS';
  cdsUpdate: CdsUpdate;
  edsServiceName: string;
  watcher: Watcher<ClusterLoadAssignment__Output>;
  latestUpdate?: EndpointResource;
  resolutionNote?: string;
}

interface LogicalDnsClusterInfo {
  type: 'LOGICAL_DNS';
  cdsUpdate: CdsUpdate;
  dnsHostname: string;
  resolver: Resolver;
  latestUpdate?: EndpointResource;
  resolutionNote?: string;
}

type ClusterInfo = AggregateClusterInfo | EdsClusterInfo | LogicalDnsClusterInfo;

interface ClusterEntry {
  watcher: Watcher<CdsUpdate>;
  latestUpdate?: StatusOr<ClusterInfo>;
  children: string[];
}

interface ClusterGraph {
  [name: string]: ClusterEntry;
}

type ClusterTreeUpdatedResult = {result: true} | {result: false, reason: string};

function isClusterTreeFullyUpdated(tree: ClusterGraph, roots: string[]): ClusterTreeUpdatedResult {
  const toCheck: string[] = [...roots];
  const visited = new Set<string>();
  while (toCheck.length > 0) {
    const next = toCheck.shift()!;
    if (visited.has(next)) {
      continue;
    }
    visited.add(next);
    if (!tree[next]) {
      return {
        result: false,
        reason: 'Missing expected cluster entry ' + next
      };
    }
    if (!tree[next].latestUpdate) {
      return {
        result: false,
        reason: 'Cluster entry ' + next + ' not updated'
      };
    }
    if (tree[next].latestUpdate.ok) {
      if (tree[next].latestUpdate.value.type !== 'AGGREGATE') {
        if (!(tree[next].latestUpdate.value.latestUpdate)) {
          return {
            result: false,
            reason: 'Cluster entry ' + next + ' endpoint not updated'
          };
        }
      }
    }
    toCheck.push(...tree[next].children);
  }
  return {result: true};
}

// Better match type has smaller value.
enum MatchType {
  EXACT_MATCH,
  SUFFIX_MATCH,
  PREFIX_MATCH,
  UNIVERSE_MATCH,
  INVALID_MATCH,
};

function domainPatternMatchType(domainPattern: string): MatchType {
  if (domainPattern.length === 0) {
    return MatchType.INVALID_MATCH;
  }
  if (domainPattern.indexOf('*') < 0) {
    return MatchType.EXACT_MATCH;
  }
  if (domainPattern === '*') {
    return MatchType.UNIVERSE_MATCH;
  }
  if (domainPattern.startsWith('*')) {
    return MatchType.SUFFIX_MATCH;
  }
  if (domainPattern.endsWith('*')) {
    return MatchType.PREFIX_MATCH;
  }
  return MatchType.INVALID_MATCH;
}

function domainMatch(matchType: MatchType, domainPattern: string, expectedHostName: string) {
  switch (matchType) {
    case MatchType.EXACT_MATCH:
      return expectedHostName === domainPattern;
    case MatchType.SUFFIX_MATCH:
      return expectedHostName.endsWith(domainPattern.substring(1));
    case MatchType.PREFIX_MATCH:
      return expectedHostName.startsWith(domainPattern.substring(0, domainPattern.length - 1));
    case MatchType.UNIVERSE_MATCH:
      return true;
    case MatchType.INVALID_MATCH:
      return false;
  }
}

interface HasDomains {
  domains: string[];
}

export function findVirtualHostForDomain<T extends HasDomains>(virutalHostList: T[], domain: string): T | null {
  let targetVhost: T | null = null;
  let bestMatchType: MatchType = MatchType.INVALID_MATCH;
  let longestMatch = 0;
  for (const virtualHost of virutalHostList) {
    for (const domainPattern of virtualHost.domains) {
      const matchType = domainPatternMatchType(domainPattern);
      // If we already have a match of a better type, skip this one
      if (matchType > bestMatchType) {
        continue;
      }
      // If we already have a longer match of the same type, skip this one
      if (matchType === bestMatchType && domainPattern.length <= longestMatch) {
        continue;
      }
      if (domainMatch(matchType, domainPattern, domain)) {
        targetVhost = virtualHost;
        bestMatchType = matchType;
        longestMatch = domainPattern.length;
      }
      if (bestMatchType === MatchType.EXACT_MATCH) {
        break;
      }
    }
    if (bestMatchType === MatchType.EXACT_MATCH) {
      break;
    }
  }
  return targetVhost;
}

function getEdsResource(edsUpdate: ClusterLoadAssignment__Output): EndpointResource {
  const result: PriorityEntry[] = [];
  const dropCategories: DropCategory[] = [];
  if (edsUpdate.policy) {
    for (const dropOverload of edsUpdate.policy.drop_overloads) {
      if (!dropOverload.drop_percentage) {
        continue;
      }
      let requestsPerMillion: number;
      switch (dropOverload.drop_percentage.denominator) {
        case 'HUNDRED':
          requestsPerMillion = dropOverload.drop_percentage.numerator * 10_000;
          break;
        case 'TEN_THOUSAND':
          requestsPerMillion = dropOverload.drop_percentage.numerator * 100;
          break;
        case 'MILLION':
          requestsPerMillion = dropOverload.drop_percentage.numerator;
          break;
      }
      dropCategories.push({
        category: dropOverload.category,
        requests_per_million: requestsPerMillion
      });
    }
  }
  for (const endpoint of edsUpdate.endpoints) {
    if (!endpoint.load_balancing_weight) {
      continue;
    }
    const endpoints: WeightedEndpoint[] = endpoint.lb_endpoints.filter(lbEndpoint => lbEndpoint.health_status === 'UNKNOWN' || lbEndpoint.health_status === 'HEALTHY').map(
      (lbEndpoint) => {
        /* The validator in the XdsClient class ensures that each endpoint has
         * a socket_address with an IP address and a port_value. */
        let socketAddresses: SocketAddress__Output[];
        if (EXPERIMENTAL_DUALSTACK_ENDPOINTS) {
          socketAddresses = [
            lbEndpoint.endpoint!.address!.socket_address!,
            ...lbEndpoint.endpoint!.additional_addresses.map(additionalAddress => additionalAddress.address!.socket_address!)
          ];
        } else {
          socketAddresses = [lbEndpoint.endpoint!.address!.socket_address!];
        }
        return {
          endpoint: {
            addresses: socketAddresses.map(socketAddress => ({
              host: socketAddress.address!,
              port: socketAddress.port_value!
            }))
          },
          weight: lbEndpoint.load_balancing_weight?.value ?? 1
        };
      }
    );
    if (endpoints.length === 0) {
      continue;
    }
    let priorityEntry: PriorityEntry;
    if (result[endpoint.priority]) {
      priorityEntry = result[endpoint.priority];
    } else {
      priorityEntry = {
        localities: []
      };
      result[endpoint.priority] = priorityEntry;
    }
    priorityEntry.localities.push({
      locality: endpoint.locality!,
      endpoints: endpoints,
      weight: endpoint.load_balancing_weight.value
    });
  }
  // Collapse spaces in sparse array
  return {
    priorities: result.filter(priority => priority),
    dropCategories: dropCategories
  };
}

function getDnsResource(endpoints: Endpoint[]): EndpointResource {
  const endpoint: Endpoint = {
    addresses: endpoints.map(endpoint => endpoint.addresses).flat()
  }
  return {
    priorities: [{
      localities: [{
        locality: {
          region: '',
          zone: '',
          sub_zone: ''
        },
        weight: 1,
        endpoints: [{endpoint: endpoint, weight: 1}]
      }]
    }],
    dropCategories: []
  }
}

export class XdsDependencyManager {
  private ldsWatcher: Watcher<Listener__Output>;
  private rdsWatcher: Watcher<RouteConfiguration__Output>;
  private latestListener: Listener__Output | null = null;
  private latestRouteConfigName: string | null = null;
  private latestRouteConfiguration: RouteConfiguration__Output | null = null;
  private clusterRoots: string[] = [];
  private subscribedClusters: {[cluster: string]: number} = {};
  private clusterForest: ClusterGraph = {};
  constructor(private xdsClient: XdsClient, private listenerResourceName: string, private dataPlaneAuthority: string, private watcher: XdsConfigWatcher) {
    this.ldsWatcher = new Watcher<Listener__Output>({
      onResourceChanged: (update: Listener__Output) => {
        if (!update.api_listener) {
          this.trace('Received Listener resource not usable on client');
          this.handleListenerDoesNotExist();
          return;
        }
        this.latestListener = update;
        const httpConnectionManager = decodeSingleResource(HTTP_CONNECTION_MANGER_TYPE_URL, update.api_listener!.api_listener!.value);
        switch (httpConnectionManager.route_specifier) {
          case 'rds': {
            const routeConfigName = httpConnectionManager.rds!.route_config_name;
            if (this.latestRouteConfigName !== routeConfigName) {
              if (this.latestRouteConfigName !== null) {
                this.trace('RDS.cancelWatch(' + this.latestRouteConfigName + '): Route config name changed');
                RouteConfigurationResourceType.cancelWatch(this.xdsClient, this.latestRouteConfigName, this.rdsWatcher);
                this.latestRouteConfiguration = null;
                this.clusterRoots = [];
                this.pruneOrphanClusters();
              }
              this.trace('RDS.startWatch(' + routeConfigName + '): New route config name');
              RouteConfigurationResourceType.startWatch(this.xdsClient, routeConfigName, this.rdsWatcher);
              this.latestRouteConfigName = routeConfigName;
            }
            break;
          }
          case 'route_config':
            if (this.latestRouteConfigName) {
              this.trace('RDS.cancelWatch(' + this.latestRouteConfigName + '): Listener switched to embedded route config');
              RouteConfigurationResourceType.cancelWatch(this.xdsClient, this.latestRouteConfigName, this.rdsWatcher);
              this.latestRouteConfigName = null;
            }
            this.handleRouteConfig(httpConnectionManager.route_config!);
            break;
          default:
            // This is prevented by the validation rules
        }
      },
      onError: (error: StatusObject) => {
        /* A transient error only needs to bubble up as a failure if we have
         * not already provided a ServiceConfig for the upper layer to use */
        if (!this.latestListener) {
          this.trace('Resolution error due to xDS client transient error ' + error.details);
          this.watcher.onUpdate({
            ok: false,
            error: {
              ...error,
              details: `Listener ${listenerResourceName}: ${error.details}`
            }
          });
        }
      },
      onResourceDoesNotExist: () => {
        this.trace('Resolution error: LDS resource does not exist');
        this.handleListenerDoesNotExist();
      }
    });
    this.rdsWatcher = new Watcher<RouteConfiguration__Output>({
      onResourceChanged: (update: RouteConfiguration__Output) => {
        this.handleRouteConfig(update);
      },
      onError: (error: StatusObject) => {
        if (!this.latestRouteConfiguration) {
          this.watcher.onUpdate({
            ok: false,
            error: {
              ...error,
              details: `RouteConfiguration ${this.latestRouteConfigName}: ${error.details}`
            }
          });
        }
      },
      onResourceDoesNotExist: () => {
        this.watcher.onUpdate({
          ok: false,
          error: {
            code: status.UNAVAILABLE,
            details: `RouteConfiguration ${this.latestRouteConfigName} does not exist`,
            metadata: new Metadata()
          }
        });
        this.clusterRoots = [];
        this.pruneOrphanClusters();
      }
    });
    this.trace('LDS.startWatch(' + listenerResourceName + '): Startup');
    ListenerResourceType.startWatch(this.xdsClient, listenerResourceName, this.ldsWatcher);
  }

  private trace(text: string) {
    trace('[' + this.listenerResourceName + '] ' + text);
  }

  private handleListenerDoesNotExist() {
    if (this.latestRouteConfigName) {
      this.trace('RDS.cancelWatch(' + this.latestRouteConfigName + '): LDS resource does not exist');
      RouteConfigurationResourceType.cancelWatch(this.xdsClient, this.latestRouteConfigName, this.rdsWatcher);
      this.latestRouteConfigName = null;
      this.latestRouteConfiguration = null;
      this.clusterRoots = [];
      this.pruneOrphanClusters();
    }
    this.watcher.onUpdate({
      ok: false,
      error: {
        code: status.UNAVAILABLE,
        details: `Listener ${this.listenerResourceName} does not exist`,
        metadata: new Metadata()
      }
    });
  }

  private maybeSendUpdate() {
    if (!this.latestListener) {
      this.trace('Not sending update: no Listener update received');
      return;
    }
    if (!this.latestRouteConfiguration) {
      this.trace('Not sending update: no RouteConfiguration update received');
      return;
    }
    const clusterTreeUpdated = isClusterTreeFullyUpdated(this.clusterForest, this.clusterRoots);
    if (!clusterTreeUpdated.result) {
      this.trace('Not sending update: ' + clusterTreeUpdated.reason);
      return;
    }
    const update: XdsConfig = {
      listener: this.latestListener,
      routeConfig: this.latestRouteConfiguration,
      virtualHost: findVirtualHostForDomain(this.latestRouteConfiguration.virtual_hosts, this.dataPlaneAuthority)!,
      clusters: new Map()
    };
    for (const [clusterName, entry] of Object.entries(this.clusterForest)) {
      if (!entry.latestUpdate) {
        this.trace('Not sending update: Cluster entry ' + clusterName + ' not updated (not caught by isClusterTreeFullyUpdated)');
        return;
      }
      if (entry.latestUpdate.ok) {
        let clusterChildren: EndpointConfig | AggregateConfig;
        if (entry.latestUpdate.value.type === 'AGGREGATE') {
          clusterChildren = {
            type: 'aggregate',
            leafClusters: entry.children
          };
        } else {
          clusterChildren = {
            type: 'endpoint',
            endpoints: entry.latestUpdate.value.latestUpdate ? entry.latestUpdate.value.latestUpdate : undefined,
            resolutionNote: entry.latestUpdate.value.resolutionNote
          };
        }
        update.clusters.set(clusterName, {
          ok: true,
          value: {
            cluster: entry.latestUpdate.value.cdsUpdate,
            children: clusterChildren
          }
        });
      } else {
        update.clusters.set(clusterName, {
          ok: false,
          error: entry.latestUpdate.error
        });
      }
    }
    this.watcher.onUpdate({ok: true, value: update});
  }

  private addCluster(clusterName: string) {
    if (clusterName in this.clusterForest) {
      return;
    }
    const entry: ClusterEntry = {
      watcher: new Watcher<CdsUpdate>({
        onResourceChanged: (update: CdsUpdate) => {
          switch (update.type) {
            case 'AGGREGATE':
              if (entry.latestUpdate?.ok) {
                switch (entry.latestUpdate.value.type) {
                  case 'AGGREGATE':
                    break;
                  case 'EDS':
                    this.trace('EDS.cancelWatch(' + entry.latestUpdate.value.edsServiceName + '): Cluster switched to aggregate');
                    EndpointResourceType.cancelWatch(this.xdsClient, entry.latestUpdate.value.edsServiceName, entry.latestUpdate.value.watcher);
                    break;
                  case 'LOGICAL_DNS':
                    entry.latestUpdate.value.resolver.destroy();
                    break;
                }
              }
              entry.children = update.aggregateChildren;
              entry.latestUpdate = {
                ok: true,
                value: {
                  type: 'AGGREGATE',
                  cdsUpdate: update
                }
              }
              for (const child of update.aggregateChildren) {
                this.addCluster(child);
              }
              this.pruneOrphanClusters();
              this.maybeSendUpdate();
              break;
            case 'EDS':
              const edsServiceName = update.edsServiceName ?? clusterName;
              if (entry.latestUpdate?.ok) {
                switch (entry.latestUpdate.value.type) {
                  case 'AGGREGATE':
                    entry.children = [];
                    this.pruneOrphanClusters();
                    break;
                  case 'EDS':
                    // If the names are the same, keep the watch
                    if (entry.latestUpdate.value.edsServiceName !== edsServiceName) {
                      this.trace('EDS.cancelWatch(' + entry.latestUpdate.value.edsServiceName + '): EDS service name changed');
                      EndpointResourceType.cancelWatch(this.xdsClient, entry.latestUpdate.value.edsServiceName, entry.latestUpdate.value.watcher);
                      this.trace('EDS.startWatch(' + edsServiceName + '): EDS service name changed');
                      EndpointResourceType.startWatch(this.xdsClient, edsServiceName, entry.latestUpdate.value.watcher);
                      entry.latestUpdate.value.edsServiceName = edsServiceName;
                      entry.latestUpdate.value.latestUpdate = undefined;
                      entry.latestUpdate.value.resolutionNote = undefined;
                    }
                    entry.latestUpdate.value.cdsUpdate = update;
                    this.maybeSendUpdate();
                    return;
                  case 'LOGICAL_DNS':
                    entry.latestUpdate.value.resolver.destroy();
                    break;
                }
              }
              const edsWatcher = new Watcher<ClusterLoadAssignment__Output>({
                onResourceChanged: (endpoint: ClusterLoadAssignment__Output) => {
                  if (entry.latestUpdate?.ok && entry.latestUpdate.value.type === 'EDS') {
                    entry.latestUpdate.value.latestUpdate = getEdsResource(endpoint);
                    entry.latestUpdate.value.resolutionNote = undefined;
                    this.maybeSendUpdate();
                  }
                },
                onError: error => {
                  if (entry.latestUpdate?.ok && entry.latestUpdate.value.type === 'EDS') {
                    if (!entry.latestUpdate.value.latestUpdate) {
                      entry.latestUpdate.value.resolutionNote = `Control plane error: ${error.details}`;
                      this.maybeSendUpdate();
                    }
                  }
                },
                onResourceDoesNotExist: () => {
                  if (entry.latestUpdate?.ok && entry.latestUpdate.value.type === 'EDS') {
                    entry.latestUpdate.value.resolutionNote = 'Resource does not exist';
                    entry.latestUpdate.value.latestUpdate = undefined;
                    this.maybeSendUpdate();
                  }
                }
              });
              entry.latestUpdate = {
                ok: true,
                value: {
                  type: 'EDS',
                  cdsUpdate: update,
                  edsServiceName: edsServiceName,
                  watcher: edsWatcher
                }
              };
              this.trace('EDS.startWatch(' + edsServiceName + '): New EDS service name');
              EndpointResourceType.startWatch(this.xdsClient, edsServiceName, edsWatcher);
              this.maybeSendUpdate();
              break;
            case 'LOGICAL_DNS': {
              if (entry.latestUpdate?.ok) {
                switch (entry.latestUpdate.value.type) {
                  case 'AGGREGATE':
                    entry.children = [];
                    this.pruneOrphanClusters();
                    break;
                  case 'EDS':
                    this.trace('EDS.cancelWatch(' + entry.latestUpdate.value.edsServiceName + '): Cluster switched to DNS');
                    EndpointResourceType.cancelWatch(this.xdsClient, entry.latestUpdate.value.edsServiceName, entry.latestUpdate.value.watcher);
                    break;
                  case 'LOGICAL_DNS':
                    if (entry.latestUpdate.value.dnsHostname === update.dnsHostname) {
                      entry.latestUpdate.value.cdsUpdate = update;
                      this.maybeSendUpdate();
                      return;
                    }
                }
              }
              this.trace('Creating DNS resolver for hostname ' + update.dnsHostname!);
              const resolver = createResolver({scheme: 'dns', path: update.dnsHostname!}, endpointList => {
                if (endpointList.ok) {
                  if (entry.latestUpdate?.ok && entry.latestUpdate.value.type === 'LOGICAL_DNS') {
                    entry.latestUpdate.value.latestUpdate = getDnsResource(endpointList.value);
                    this.maybeSendUpdate();
                  }
                } else {
                  if (entry.latestUpdate?.ok && entry.latestUpdate.value.type === 'LOGICAL_DNS') {
                    if (!entry.latestUpdate.value.latestUpdate) {
                      entry.latestUpdate.value.resolutionNote = `DNS resolution error: ${endpointList.error.details}`;
                      this.maybeSendUpdate();
                    }
                  }
                }
                return true;
              }, {'grpc.service_config_disable_resolution': 1});
              entry.latestUpdate = {
                ok: true,
                value: {
                  type: 'LOGICAL_DNS',
                  cdsUpdate: update,
                  dnsHostname: update.dnsHostname!,
                  resolver: resolver
                }
              }
              resolver.updateResolution();
              this.maybeSendUpdate();
              break;
            }
          }
        },
        onError: error => {
          if (!entry.latestUpdate?.ok) {
            entry.latestUpdate = {
              ok: false,
              error: error
            };
            this.maybeSendUpdate();
          }
        },
        onResourceDoesNotExist: () => {
          if (entry.latestUpdate?.ok) {
            switch (entry.latestUpdate.value.type) {
              case 'EDS':
                this.trace('EDS.cancelWatch(' + entry.latestUpdate.value.edsServiceName + '): CDS resource does not exist');
                EndpointResourceType.cancelWatch(this.xdsClient, entry.latestUpdate.value.edsServiceName, entry.latestUpdate.value.watcher);
                break;
              case 'LOGICAL_DNS':
                entry.latestUpdate.value.resolver.destroy();
                break;
              default:
                break;
            }
          }
          entry.latestUpdate = {
            ok: false,
            error: {
              code: status.UNAVAILABLE,
              details: `Cluster resource ${clusterName} does not exist`,
              metadata: new Metadata()
            }
          };
          this.maybeSendUpdate();
        }
      }),
      children: []
    }
    this.clusterForest[clusterName] = entry;
    this.trace('CDS.startWatch(' + clusterName + '): Cluster added');
    ClusterResourceType.startWatch(this.xdsClient, clusterName, entry.watcher);
  }

  addClusterSubscription(clusterName: string) {
    this.subscribedClusters[clusterName] = (this.subscribedClusters[clusterName] ?? 0) + 1;
    this.addCluster(clusterName);
    let removeFunctionCalled = false;
    return () => {
      if (!removeFunctionCalled) {
        removeFunctionCalled = true;
        if (clusterName in this.subscribedClusters) {
          this.subscribedClusters[clusterName] -= 1;
          if (this.subscribedClusters[clusterName] <= 0) {
            delete this.subscribedClusters[clusterName];
            if (this.pruneOrphanClusters()) {
              this.maybeSendUpdate();
            }
          }
        }
      }
    };
  }

  private removeCluster(clusterName: string) {
    if (!(clusterName in this.clusterForest)) {
      return;
    }
    const entry = this.clusterForest[clusterName];
    if (entry.latestUpdate?.ok) {
      switch (entry.latestUpdate.value.type) {
        case 'EDS':
          this.trace('EDS.cancelWatch(' + entry.latestUpdate.value.edsServiceName + '): Cluster ' + clusterName + ' removed');
          EndpointResourceType.cancelWatch(this.xdsClient, entry.latestUpdate.value.edsServiceName, entry.latestUpdate.value.watcher);
          break;
        case 'LOGICAL_DNS':
          entry.latestUpdate.value.resolver.destroy();
          break;
        default:
          break;
      }
    }
    this.trace('CDS.cancelWatch(' + clusterName + '): Cluster removed');
    ClusterResourceType.cancelWatch(this.xdsClient, clusterName, entry.watcher);
    delete this.clusterForest[clusterName];
  }

  /**
   * Prune any clusters that are not descendents of any root clusters,
   * including subscribed clusters.
   * @returns True if any clusters were pruned, false otherwise
   */
  private pruneOrphanClusters(): boolean {
    const toCheck = [...this.clusterRoots, ...Object.keys(this.subscribedClusters)];
    const visited = new Set<string>();
    while(toCheck.length > 0) {
      const next = toCheck.shift()!;
      if (visited.has(next)) {
        continue;
      }
      if (next in this.clusterForest) {
        toCheck.push(...this.clusterForest[next].children);
      }
      visited.add(next);
    }
    let removedAnyClusters = false;
    for (const clusterName of Object.keys(this.clusterForest)) {
      if (!visited.has(clusterName)) {
        removedAnyClusters = true;
        this.removeCluster(clusterName);
      }
    }
    return removedAnyClusters;
  }

  private handleRouteConfig(routeConfig: RouteConfiguration__Output) {
    this.latestRouteConfiguration = routeConfig;
    const virtualHost = findVirtualHostForDomain(routeConfig.virtual_hosts, this.dataPlaneAuthority);
    if (!virtualHost) {
      this.clusterRoots = [];
      this.pruneOrphanClusters();
      this.watcher.onUpdate({
        ok: false,
        error: {
          code: status.UNAVAILABLE,
          details: `RouteConfiguration ${routeConfig.name}: No matching route found for ${this.dataPlaneAuthority}`,
          metadata: new Metadata()
        }
      });
      // Report error
      return;
    }
    const allConfigClusters = new Set<string>();
    for (const route of virtualHost.routes) {
      switch(route.route!.cluster_specifier) {
        case 'cluster_header':
          break;
        case 'cluster':
          allConfigClusters.add(route.route!.cluster!);
          break;
        case 'weighted_clusters':
          for (const clusterWeight of route.route!.weighted_clusters!.clusters) {
            allConfigClusters.add(clusterWeight.name);
          }
          break;
        default:
          // The cluster_specifier can be unset. If so, just ignore it
          break;
      }
    }
    this.clusterRoots = [...allConfigClusters];
    this.pruneOrphanClusters();
    for (const clusterName of this.clusterRoots) {
      this.addCluster(clusterName);
    }
    this.maybeSendUpdate();
  }

  updateResolution() {
    for (const clusterEntry of Object.values(this.clusterForest)) {
      if (clusterEntry.latestUpdate?.ok && clusterEntry.latestUpdate.value.type === 'LOGICAL_DNS') {
        clusterEntry.latestUpdate.value.resolver.updateResolution();
      }
    }
  }

  destroy() {
    this.trace('LDS.cancelWatch(' + this.listenerResourceName + '): destroy');
    ListenerResourceType.cancelWatch(this.xdsClient, this.listenerResourceName, this.ldsWatcher);
    if (this.latestRouteConfigName) {
      this.trace('RDS.cancelWatch(' + this.latestRouteConfigName + '): destroy');
      RouteConfigurationResourceType.cancelWatch(this.xdsClient, this.latestRouteConfigName, this.rdsWatcher);
    }
    this.clusterRoots = [];
    this.subscribedClusters = {};
    this.pruneOrphanClusters();
  }
}
