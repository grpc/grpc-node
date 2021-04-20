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
import { Listener__Output } from './generated/envoy/api/v2/Listener';
import { Watcher } from './xds-stream-state/xds-stream-state';
import { RouteConfiguration__Output } from './generated/envoy/api/v2/RouteConfiguration';
import { HttpConnectionManager__Output } from './generated/envoy/config/filter/network/http_connection_manager/v2/HttpConnectionManager';
import { CdsLoadBalancingConfig } from './load-balancer-cds';
import { VirtualHost__Output } from './generated/envoy/api/v2/route/VirtualHost';
import { RouteMatch__Output } from './generated/envoy/api/v2/route/RouteMatch';
import { HeaderMatcher__Output } from './generated/envoy/api/v2/route/HeaderMatcher';
import ConfigSelector = experimental.ConfigSelector;
import LoadBalancingConfig = experimental.LoadBalancingConfig;
import { XdsClusterManagerLoadBalancingConfig } from './load-balancer-xds-cluster-manager';
import { ExactValueMatcher, Fraction, FullMatcher, HeaderMatcher, Matcher, PathExactValueMatcher, PathPrefixValueMatcher, PathSafeRegexValueMatcher, PrefixValueMatcher, PresentValueMatcher, RangeValueMatcher, RejectValueMatcher, SafeRegexValueMatcher, SuffixValueMatcher, ValueMatcher } from './matcher';
import { RouteAction, SingleClusterRouteAction, WeightedCluster, WeightedClusterRouteAction } from './route-action';
import { LogVerbosity } from '@grpc/grpc-js/build/src/constants';

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

const RUNTIME_FRACTION_DENOMINATOR_VALUES = {
  HUNDRED: 100,
  TEN_THOUSAND: 10_000,
  MILLION: 1_000_000
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
      pathMatcher = new PathSafeRegexValueMatcher(routeMatch.safe_regex!.regex, caseInsensitive);
      break;
    default:
      pathMatcher = new RejectValueMatcher();
  }
  const headerMatchers: Matcher[] = routeMatch.headers.map(getPredicateForHeaderMatcher);
  let runtimeFraction: Fraction | null;
  if (!routeMatch.runtime_fraction?.default_value) {
    runtimeFraction = null;
  } else {
    runtimeFraction = {
      numerator: routeMatch.runtime_fraction.default_value.numerator,
      denominator: RUNTIME_FRACTION_DENOMINATOR_VALUES[routeMatch.runtime_fraction.default_value.denominator]
    };
  }
  return new FullMatcher(pathMatcher, headerMatchers, runtimeFraction);
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

  private clusterRefcounts = new Map<string, {inLastConfig: boolean, refCount: number}>();

  constructor(
    private target: GrpcUri,
    private listener: ResolverListener,
    private channelOptions: ChannelOptions
  ) {
    this.ldsWatcher = {
      onValidUpdate: (update: Listener__Output) => {
        const httpConnectionManager = update.api_listener!
            .api_listener as protoLoader.AnyExtension &
            HttpConnectionManager__Output;
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
            this.handleRouteConfig(httpConnectionManager.route_config!);
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
      onValidUpdate: (update: RouteConfiguration__Output) => {
        this.handleRouteConfig(update);
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
        this.handleRouteConfig(this.latestRouteConfig!);
      }
    }
  }

  private handleRouteConfig(routeConfig: RouteConfiguration__Output) {
    this.latestRouteConfig = routeConfig;
    const virtualHost = findVirtualHostForDomain(routeConfig.virtual_hosts, this.target.path);
    if (virtualHost === null) {
      this.reportResolutionError('No matching route found');
      return;
    }
    trace('Received virtual host config ' + JSON.stringify(virtualHost, undefined, 2));
    const allConfigClusters = new Set<string>();
    const matchList: {matcher: Matcher, action: RouteAction}[] = [];
    for (const route of virtualHost.routes) {
      let routeAction: RouteAction;
      switch (route.route!.cluster_specifier) {
        case 'cluster_header':
          continue;
        case 'cluster':{
          const cluster = route.route!.cluster!;
          allConfigClusters.add(cluster);
          routeAction = new SingleClusterRouteAction(cluster);
          break;
        }
        case 'weighted_clusters': {
          const weightedClusters: WeightedCluster[] = [];
          for (const clusterWeight of route.route!.weighted_clusters!.clusters) {
            allConfigClusters.add(clusterWeight.name);
            weightedClusters.push({name: clusterWeight.name, weight: clusterWeight.weight?.value ?? 0});
          }
          routeAction = new WeightedClusterRouteAction(weightedClusters, route.route!.weighted_clusters!.total_weight?.value ?? 100);
        }
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
          const clusterName = action.getCluster();
          this.refCluster(clusterName);
          const onCommitted = () => {
            this.unrefCluster(clusterName);
          }
          return {
            methodConfig: {name: []},
            onCommitted: onCommitted,
            pickInformation: {cluster: clusterName},
            status: status.OK
          };
        }
      }
      return {
        methodConfig: {name: []},
        // cluster won't be used here, but it's set because of some TypeScript weirdness
        pickInformation: {cluster: ''},
        status: status.UNAVAILABLE
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
