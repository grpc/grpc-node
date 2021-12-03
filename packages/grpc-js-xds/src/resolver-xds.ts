/*
 * Copyright 2019 gRPC authors.
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

import * as protoLoader from '@grpc/proto-loader';

import { RE2 } from 're2-wasm';

import { getSingletonXdsClient, XdsClient } from './xds-client';
import { StatusObject, status, logVerbosity, Metadata, experimental, ChannelOptions } from '@grpc/grpc-js';
import Resolver = experimental.Resolver;
import GrpcUri = experimental.GrpcUri;
import ResolverListener = experimental.ResolverListener;
import uriToString = experimental.uriToString;
import ServiceConfig = experimental.ServiceConfig;
import registerResolver = experimental.registerResolver;
import { Listener__Output } from './generated/envoy/config/listener/v3/Listener';
import { Watcher } from './xds-stream-state/xds-stream-state';
import { RouteConfiguration__Output } from './generated/envoy/config/route/v3/RouteConfiguration';
import { HttpConnectionManager__Output } from './generated/envoy/extensions/filters/network/http_connection_manager/v3/HttpConnectionManager';
import { CdsLoadBalancingConfig } from './load-balancer-cds';
import { VirtualHost__Output } from './generated/envoy/config/route/v3/VirtualHost';
import { RouteMatch__Output } from './generated/envoy/config/route/v3/RouteMatch';
import { HeaderMatcher__Output } from './generated/envoy/config/route/v3/HeaderMatcher';
import ConfigSelector = experimental.ConfigSelector;
import LoadBalancingConfig = experimental.LoadBalancingConfig;
import { XdsClusterManagerLoadBalancingConfig } from './load-balancer-xds-cluster-manager';
import { ExactValueMatcher, FullMatcher, HeaderMatcher, Matcher, PathExactValueMatcher, PathPrefixValueMatcher, PathSafeRegexValueMatcher, PrefixValueMatcher, PresentValueMatcher, RangeValueMatcher, RejectValueMatcher, SafeRegexValueMatcher, SuffixValueMatcher, ValueMatcher } from './matcher';
import { envoyFractionToFraction, Fraction } from "./fraction";
import { RouteAction, SingleClusterRouteAction, WeightedCluster, WeightedClusterRouteAction } from './route-action';
import { decodeSingleResource, HTTP_CONNECTION_MANGER_TYPE_URL_V3 } from './resources';
import Duration = experimental.Duration;
import { Duration__Output } from './generated/google/protobuf/Duration';
import { createHttpFilter, HttpFilterConfig, parseOverrideFilterConfig, parseTopLevelFilterConfig } from './http-filter';
import { EXPERIMENTAL_FAULT_INJECTION } from './environment';
import Filter = experimental.Filter;
import FilterFactory = experimental.FilterFactory;

const TRACER_NAME = 'xds_resolver';

function trace(text: string): void {
  experimental.trace(logVerbosity.DEBUG, TRACER_NAME, text);
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

function findVirtualHostForDomain(virutalHostList: VirtualHost__Output[], domain: string): VirtualHost__Output | null {
  let targetVhost: VirtualHost__Output | null = null;
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

const numberRegex = new RE2(/^-?\d+$/u);

function getPredicateForHeaderMatcher(headerMatch: HeaderMatcher__Output): Matcher {
  let valueChecker: ValueMatcher;
  switch (headerMatch.header_match_specifier) {
    case 'exact_match':
      valueChecker = new ExactValueMatcher(headerMatch.exact_match!);
      break;
    case 'safe_regex_match':
      valueChecker = new SafeRegexValueMatcher(headerMatch.safe_regex_match!.regex);
      break;
    case 'range_match':
      const start = BigInt(headerMatch.range_match!.start);
      const end = BigInt(headerMatch.range_match!.end);
      valueChecker = new RangeValueMatcher(start, end);
      break;
    case 'present_match':
      valueChecker = new PresentValueMatcher();
      break;
    case 'prefix_match':
      valueChecker = new PrefixValueMatcher(headerMatch.prefix_match!);
      break;
    case 'suffix_match':
      valueChecker = new SuffixValueMatcher(headerMatch.suffix_match!);
      break;
    default:
      valueChecker = new RejectValueMatcher();
  }
  return new HeaderMatcher(headerMatch.name, valueChecker, headerMatch.invert_match);
}

function getPredicateForMatcher(routeMatch: RouteMatch__Output): Matcher {
  let pathMatcher: ValueMatcher;
  const caseInsensitive = routeMatch.case_sensitive?.value === false;
  switch (routeMatch.path_specifier) {
    case 'prefix':
      pathMatcher = new PathPrefixValueMatcher(routeMatch.prefix!, caseInsensitive);
      break;
    case 'path':
      pathMatcher = new PathExactValueMatcher(routeMatch.path!, caseInsensitive);
      break;
    case 'safe_regex':
      pathMatcher = new PathSafeRegexValueMatcher(routeMatch.safe_regex!.regex);
      break;
    default:
      pathMatcher = new RejectValueMatcher();
  }
  const headerMatchers: Matcher[] = routeMatch.headers.map(getPredicateForHeaderMatcher);
  let runtimeFraction: Fraction | null;
  if (!routeMatch.runtime_fraction?.default_value) {
    runtimeFraction = null;
  } else {
    runtimeFraction = envoyFractionToFraction(routeMatch.runtime_fraction.default_value)
  }
  return new FullMatcher(pathMatcher, headerMatchers, runtimeFraction);
}

/**
 * Convert a Duration protobuf message object to a Duration object as used in
 * the ServiceConfig definition. The difference is that the protobuf message
 * defines seconds as a long, which is represented as a string in JavaScript,
 * and the one used in the service config defines it as a number.
 * @param duration 
 */
function protoDurationToDuration(duration: Duration__Output): Duration {
  return {
    seconds: Number.parseInt(duration.seconds),
    nanos: duration.nanos
  }
}

class XdsResolver implements Resolver {
  private hasReportedSuccess = false;

  private ldsWatcher: Watcher<Listener__Output>;
  private rdsWatcher: Watcher<RouteConfiguration__Output>
  private isLdsWatcherActive = false;
  /**
   * The latest route config name from an LDS response. The RDS watcher is
   * actively watching that name if and only if this is not null.
   */
  private latestRouteConfigName: string | null = null;

  private latestRouteConfig: RouteConfiguration__Output | null = null;
  private latestRouteConfigIsV2 = false;

  private clusterRefcounts = new Map<string, {inLastConfig: boolean, refCount: number}>();

  private latestDefaultTimeout: Duration | undefined = undefined;

  private ldsHttpFilterConfigs: {name: string, config: HttpFilterConfig}[] = [];

  constructor(
    private target: GrpcUri,
    private listener: ResolverListener,
    private channelOptions: ChannelOptions
  ) {
    this.ldsWatcher = {
      onValidUpdate: (update: Listener__Output, isV2: boolean) => {
        const httpConnectionManager = decodeSingleResource(HTTP_CONNECTION_MANGER_TYPE_URL_V3, update.api_listener!.api_listener!.value);
        const defaultTimeout = httpConnectionManager.common_http_protocol_options?.idle_timeout;
        if (defaultTimeout === null || defaultTimeout === undefined) {
          this.latestDefaultTimeout = undefined;
        } else {
          this.latestDefaultTimeout = protoDurationToDuration(defaultTimeout);
        }
        if (!isV2 && EXPERIMENTAL_FAULT_INJECTION) {
          this.ldsHttpFilterConfigs = [];
          for (const filter of httpConnectionManager.http_filters) {
            // typed_config must be set here, or validation would have failed
            const filterConfig = parseTopLevelFilterConfig(filter.typed_config!);
            if (filterConfig) {
              this.ldsHttpFilterConfigs.push({name: filter.name, config: filterConfig});
            }
          }
        }
        switch (httpConnectionManager.route_specifier) {
          case 'rds': {
            const routeConfigName = httpConnectionManager.rds!.route_config_name;
            if (this.latestRouteConfigName !== routeConfigName) {
              if (this.latestRouteConfigName !== null) {
                getSingletonXdsClient().removeRouteWatcher(this.latestRouteConfigName, this.rdsWatcher);
              }
              getSingletonXdsClient().addRouteWatcher(httpConnectionManager.rds!.route_config_name, this.rdsWatcher);
              this.latestRouteConfigName = routeConfigName;
            }
            break;
          }
          case 'route_config':
            if (this.latestRouteConfigName) {
              getSingletonXdsClient().removeRouteWatcher(this.latestRouteConfigName, this.rdsWatcher);
            }
            this.handleRouteConfig(httpConnectionManager.route_config!, isV2);
            break;
          default:
            // This is prevented by the validation rules
        }
      },
      onTransientError: (error: StatusObject) => {
        /* A transient error only needs to bubble up as a failure if we have
         * not already provided a ServiceConfig for the upper layer to use */
        if (!this.hasReportedSuccess) {
          trace('Resolution error for target ' + uriToString(this.target) + ' due to xDS client transient error ' + error.details);
          this.reportResolutionError(error.details);
        }
      },
      onResourceDoesNotExist: () => {
        trace('Resolution error for target ' + uriToString(this.target) + ': LDS resource does not exist');
        this.reportResolutionError(`Listener ${this.target} does not exist`);
      }
    };
    this.rdsWatcher = {
      onValidUpdate: (update: RouteConfiguration__Output, isV2: boolean) => {
        this.handleRouteConfig(update, isV2);
      },
      onTransientError: (error: StatusObject) => {
        /* A transient error only needs to bubble up as a failure if we have
         * not already provided a ServiceConfig for the upper layer to use */
        if (!this.hasReportedSuccess) {
          trace('Resolution error for target ' + uriToString(this.target) + ' due to xDS client transient error ' + error.details);
          this.reportResolutionError(error.details);
        }
      },
      onResourceDoesNotExist: () => {
        trace('Resolution error for target ' + uriToString(this.target) + ' and route config ' + this.latestRouteConfigName + ': RDS resource does not exist');
        this.reportResolutionError(`Route config ${this.latestRouteConfigName} does not exist`);
      }
    }
  }

  private refCluster(clusterName: string) {
    const refCount = this.clusterRefcounts.get(clusterName);
    if (refCount) {
      refCount.refCount += 1;
    }
  }

  private unrefCluster(clusterName: string) {
    const refCount = this.clusterRefcounts.get(clusterName);
    if (refCount) {
      refCount.refCount -= 1;
      if (!refCount.inLastConfig && refCount.refCount === 0) {
        this.clusterRefcounts.delete(clusterName);
        this.handleRouteConfig(this.latestRouteConfig!, this.latestRouteConfigIsV2);
      }
    }
  }

  private handleRouteConfig(routeConfig: RouteConfiguration__Output, isV2: boolean) {
    this.latestRouteConfig = routeConfig;
    this.latestRouteConfigIsV2 = isV2;
    const virtualHost = findVirtualHostForDomain(routeConfig.virtual_hosts, this.target.path);
    if (virtualHost === null) {
      this.reportResolutionError('No matching route found');
      return;
    }
    const virtualHostHttpFilterOverrides = new Map<string, HttpFilterConfig>();
    if (!isV2 && EXPERIMENTAL_FAULT_INJECTION) {
      for (const [name, filter] of Object.entries(virtualHost.typed_per_filter_config ?? {})) {
        const parsedConfig = parseOverrideFilterConfig(filter);
        if (parsedConfig) {
          virtualHostHttpFilterOverrides.set(name, parsedConfig);
        }
      }
    }
    trace('Received virtual host config ' + JSON.stringify(virtualHost, undefined, 2));
    const allConfigClusters = new Set<string>();
    const matchList: {matcher: Matcher, action: RouteAction}[] = [];
    for (const route of virtualHost.routes) {
      let routeAction: RouteAction;
      let timeout: Duration | undefined;
      /* For field prioritization see
       * https://github.com/grpc/proposal/blob/master/A31-xds-timeout-support-and-config-selector.md#supported-fields
       */
      if (route.route?.max_stream_duration?.grpc_timeout_header_max) {
        timeout = protoDurationToDuration(route.route.max_stream_duration.grpc_timeout_header_max);
      } else if (route.route?.max_stream_duration?.max_stream_duration) {
        timeout = protoDurationToDuration(route.route.max_stream_duration.max_stream_duration);
      } else {
        timeout = this.latestDefaultTimeout;
      }
      // "A value of 0 indicates the application's deadline is used without modification."
      if (timeout?.seconds === 0 && timeout.nanos === 0) {
        timeout = undefined;
      }
      const routeHttpFilterOverrides = new Map<string, HttpFilterConfig>();
      if (!isV2 && EXPERIMENTAL_FAULT_INJECTION) {
        for (const [name, filter] of Object.entries(route.typed_per_filter_config ?? {})) {
          const parsedConfig = parseOverrideFilterConfig(filter);
          if (parsedConfig) {
            routeHttpFilterOverrides.set(name, parsedConfig);
          }
        }
      }
      switch (route.route!.cluster_specifier) {
        case 'cluster_header':
          continue;
        case 'cluster':{
          const cluster = route.route!.cluster!;
          allConfigClusters.add(cluster);
          const extraFilterFactories: FilterFactory<Filter>[] = [];
          if (!isV2 && EXPERIMENTAL_FAULT_INJECTION) {
            for (const filterConfig of this.ldsHttpFilterConfigs) {
              if (routeHttpFilterOverrides.has(filterConfig.name)) {
                const filter = createHttpFilter(filterConfig.config, routeHttpFilterOverrides.get(filterConfig.name)!);
                if (filter) {
                  extraFilterFactories.push(filter);
                }
              } else if (virtualHostHttpFilterOverrides.has(filterConfig.name)) {
                const filter = createHttpFilter(filterConfig.config, virtualHostHttpFilterOverrides.get(filterConfig.name)!);
                if (filter) {
                  extraFilterFactories.push(filter);
                }
              } else {
                const filter = createHttpFilter(filterConfig.config);
                if (filter) {
                  extraFilterFactories.push(filter);
                }
              }
            }
          }
          routeAction = new SingleClusterRouteAction(cluster, timeout, extraFilterFactories);
          break;
        }
        case 'weighted_clusters': {
          const weightedClusters: WeightedCluster[] = [];
          for (const clusterWeight of route.route!.weighted_clusters!.clusters) {
            allConfigClusters.add(clusterWeight.name);
            const extraFilterFactories: FilterFactory<Filter>[] = [];
            const clusterHttpFilterOverrides = new Map<string, HttpFilterConfig>();
            if (!isV2 && EXPERIMENTAL_FAULT_INJECTION) {
              for (const [name, filter] of Object.entries(clusterWeight.typed_per_filter_config ?? {})) {
                const parsedConfig = parseOverrideFilterConfig(filter);
                if (parsedConfig) {
                  clusterHttpFilterOverrides.set(name, parsedConfig);
                }
              }
              for (const filterConfig of this.ldsHttpFilterConfigs) {
                if (clusterHttpFilterOverrides.has(filterConfig.name)) {
                  const filter = createHttpFilter(filterConfig.config, clusterHttpFilterOverrides.get(filterConfig.name)!);
                  if (filter) {
                    extraFilterFactories.push(filter);
                  }
                } else if (routeHttpFilterOverrides.has(filterConfig.name)) {
                  const filter = createHttpFilter(filterConfig.config, routeHttpFilterOverrides.get(filterConfig.name)!);
                  if (filter) {
                    extraFilterFactories.push(filter);
                  }
                } else if (virtualHostHttpFilterOverrides.has(filterConfig.name)) {
                  const filter = createHttpFilter(filterConfig.config, virtualHostHttpFilterOverrides.get(filterConfig.name)!);
                  if (filter) {
                    extraFilterFactories.push(filter);
                  }
                } else {
                  const filter = createHttpFilter(filterConfig.config);
                  if (filter) {
                    extraFilterFactories.push(filter);
                  }
                }
              }
            }
            weightedClusters.push({name: clusterWeight.name, weight: clusterWeight.weight?.value ?? 0, dynamicFilterFactories: extraFilterFactories});
          }
          routeAction = new WeightedClusterRouteAction(weightedClusters, route.route!.weighted_clusters!.total_weight?.value ?? 100, timeout);
          break;
        }
        default:
          /* The validation logic should prevent us from reaching this point.
           * This is just for the type checker. */
          continue;
      }
      const routeMatcher = getPredicateForMatcher(route.match!);
      matchList.push({matcher: routeMatcher, action: routeAction});
    }
    /* Mark clusters that are not in this route config, and remove ones with
      * no references */
    for (const [name, refCount] of Array.from(this.clusterRefcounts.entries())) {
      if (!allConfigClusters.has(name)) {
        refCount.inLastConfig = false;
        if (refCount.refCount === 0) {
          this.clusterRefcounts.delete(name);
        }
      }
    }
    // Add any new clusters from this route config
    for (const name of allConfigClusters) {
      if (this.clusterRefcounts.has(name)) {
        this.clusterRefcounts.get(name)!.inLastConfig = true;
      } else {
        this.clusterRefcounts.set(name, {inLastConfig: true, refCount: 0});
      }
    }
    const configSelector: ConfigSelector = (methodName, metadata) => {
      for (const {matcher, action} of matchList) {
        if (matcher.apply(methodName, metadata)) {
          const clusterResult = action.getCluster();
          this.refCluster(clusterResult.name);
          const onCommitted = () => {
            this.unrefCluster(clusterResult.name);
          }
          return {
            methodConfig: {name: [], timeout: action.getTimeout()},
            onCommitted: onCommitted,
            pickInformation: {cluster: clusterResult.name},
            status: status.OK,
            dynamicFilterFactories: clusterResult.dynamicFilterFactories
          };
        }
      }
      return {
        methodConfig: {name: []},
        // cluster won't be used here, but it's set because of some TypeScript weirdness
        pickInformation: {cluster: ''},
        status: status.UNAVAILABLE,
        dynamicFilterFactories: []
      };
    };
    trace('Created ConfigSelector with configuration:');
    for (const {matcher, action} of matchList) {
      trace(matcher.toString());
      trace('=> ' + action.toString());
    }
    const clusterConfigMap = new Map<string, {child_policy: LoadBalancingConfig[]}>();
    for (const clusterName of this.clusterRefcounts.keys()) {
      clusterConfigMap.set(clusterName, {child_policy: [new CdsLoadBalancingConfig(clusterName)]});
    }
    const lbPolicyConfig = new XdsClusterManagerLoadBalancingConfig(clusterConfigMap);
    const serviceConfig: ServiceConfig = {
      methodConfig: [],
      loadBalancingConfig: [lbPolicyConfig]
    }
    this.listener.onSuccessfulResolution([], serviceConfig, null, configSelector, {});
  }

  private reportResolutionError(reason: string) {
    this.listener.onError({
      code: status.UNAVAILABLE,
      details: `xDS name resolution failed for target ${uriToString(
        this.target
      )}: ${reason}`,
      metadata: new Metadata(),
    });
  }

  updateResolution(): void {
    // Wait until updateResolution is called once to start the xDS requests
    if (!this.isLdsWatcherActive) {
      trace('Starting resolution for target ' + uriToString(this.target));
      getSingletonXdsClient().addListenerWatcher(this.target.path, this.ldsWatcher);
      this.isLdsWatcherActive = true;
    }
  }

  destroy() {
    getSingletonXdsClient().removeListenerWatcher(this.target.path, this.ldsWatcher);
    if (this.latestRouteConfigName) {
      getSingletonXdsClient().removeRouteWatcher(this.latestRouteConfigName, this.rdsWatcher);
    }
  }

  static getDefaultAuthority(target: GrpcUri) {
    return target.path;
  }
}

export function setup() {
  registerResolver('xds', XdsResolver);
}
