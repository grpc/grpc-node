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

import { getSingletonXdsClient, Watcher, XdsClient } from './xds-client';
import { StatusObject, status, logVerbosity, Metadata, experimental, ChannelOptions, ServiceConfig, LoadBalancingConfig, RetryPolicy } from '@grpc/grpc-js';
import Resolver = experimental.Resolver;
import GrpcUri = experimental.GrpcUri;
import ResolverListener = experimental.ResolverListener;
import uriToString = experimental.uriToString;
import registerResolver = experimental.registerResolver;
import { Listener__Output } from './generated/envoy/config/listener/v3/Listener';
import { RouteConfiguration__Output } from './generated/envoy/config/route/v3/RouteConfiguration';
import { HttpConnectionManager__Output } from './generated/envoy/extensions/filters/network/http_connection_manager/v3/HttpConnectionManager';
import { VirtualHost__Output } from './generated/envoy/config/route/v3/VirtualHost';
import { RouteMatch__Output } from './generated/envoy/config/route/v3/RouteMatch';
import { HeaderMatcher__Output } from './generated/envoy/config/route/v3/HeaderMatcher';
import ConfigSelector = experimental.ConfigSelector;
import { ContainsValueMatcher, ExactValueMatcher, FullMatcher, HeaderMatcher, Matcher, PathExactValueMatcher, PathPrefixValueMatcher, PathSafeRegexValueMatcher, PrefixValueMatcher, PresentValueMatcher, RangeValueMatcher, RejectValueMatcher, SafeRegexValueMatcher, SuffixValueMatcher, ValueMatcher } from './matcher';
import { envoyFractionToFraction, Fraction } from "./fraction";
import { HashPolicy, RouteAction, SingleClusterRouteAction, WeightedCluster, WeightedClusterRouteAction } from './route-action';
import { decodeSingleResource, HTTP_CONNECTION_MANGER_TYPE_URL } from './resources';
import Duration = experimental.Duration;
import { Duration__Output } from './generated/google/protobuf/Duration';
import { createHttpFilter, HttpFilterConfig, parseOverrideFilterConfig, parseTopLevelFilterConfig } from './http-filter';
import { EXPERIMENTAL_FAULT_INJECTION, EXPERIMENTAL_FEDERATION, EXPERIMENTAL_RETRY, EXPERIMENTAL_RING_HASH } from './environment';
import Filter = experimental.Filter;
import FilterFactory = experimental.FilterFactory;
import { BootstrapInfo, loadBootstrapInfo, validateBootstrapConfig } from './xds-bootstrap';
import { ListenerResourceType } from './xds-resource-type/listener-resource-type';
import { RouteConfigurationResourceType } from './xds-resource-type/route-config-resource-type';
import { protoDurationToDuration } from './duration';
import { loadXxhashApi } from './xxhash';

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
      valueChecker = new ExactValueMatcher(headerMatch.exact_match!, false);
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
      valueChecker = new PrefixValueMatcher(headerMatch.prefix_match!, false);
      break;
    case 'suffix_match':
      valueChecker = new SuffixValueMatcher(headerMatch.suffix_match!, false);
      break;
    case 'string_match':
      const stringMatch = headerMatch.string_match!
      switch (stringMatch.match_pattern) {
        case 'exact':
          valueChecker = new ExactValueMatcher(stringMatch.exact!, stringMatch.ignore_case);
          break;
        case 'safe_regex':
          valueChecker = new SafeRegexValueMatcher(stringMatch.safe_regex!.regex);
          break;
        case 'prefix':
          valueChecker = new PrefixValueMatcher(stringMatch.prefix!, stringMatch.ignore_case);
          break;
        case 'suffix':
          valueChecker = new SuffixValueMatcher(stringMatch.suffix!, stringMatch.ignore_case);
          break;
        case 'contains':
          valueChecker = new ContainsValueMatcher(stringMatch.contains!, stringMatch.ignore_case);
          break;
      }
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

function protoDurationToSecondsString(duration: Duration__Output): string {
  return `${duration.seconds + duration.nanos / 1_000_000_000}s`;
}

const DEFAULT_RETRY_BASE_INTERVAL = '0.025s'

function getDefaultRetryMaxInterval(baseInterval: string): string {
  return `${Number.parseFloat(baseInterval.substring(0, baseInterval.length - 1)) * 10}s`;
}

/**
 * Encode a text string as a valid path of a URI, as specified in RFC-3986 section 3.3
 * @param uriPath A value representing an unencoded URI path
 * @returns
 */
function encodeURIPath(uriPath: string): string {
  return uriPath.replace(/[^A-Za-z0-9._~!$&^()*+,;=/-]/g, substring => encodeURIComponent(substring));
}

function formatTemplateString(templateString: string, value: string): string {
  if (templateString.startsWith('xdstp:')) {
    return templateString.replace(/%s/g, encodeURIPath(value));
  } else {
    return templateString.replace(/%s/g, value);
  }
}

export function getListenerResourceName(bootstrapConfig: BootstrapInfo, target: GrpcUri): string {
  if (target.authority && target.authority !== '') {
    if (target.authority in bootstrapConfig.authorities) {
      return formatTemplateString(bootstrapConfig.authorities[target.authority].clientListenerResourceNameTemplate, target.path);
    } else {
      throw new Error(`Authority ${target.authority} not found in bootstrap file`);
    }
  } else {
    return formatTemplateString(bootstrapConfig.clientDefaultListenerResourceNameTemplate, target.path);
  }
}

const BOOTSTRAP_CONFIG_KEY = 'grpc.TEST_ONLY_DO_NOT_USE_IN_PROD.xds_bootstrap_config';

const RETRY_CODES: {[key: string]: status} = {
  'cancelled': status.CANCELLED,
  'deadline-exceeded': status.DEADLINE_EXCEEDED,
  'internal': status.INTERNAL,
  'resource-exhausted': status.RESOURCE_EXHAUSTED,
  'unavailable': status.UNAVAILABLE
};

class XdsResolver implements Resolver {
  private hasReportedSuccess = false;

  private ldsWatcher: Watcher<Listener__Output>;
  private rdsWatcher: Watcher<RouteConfiguration__Output>
  private isLdsWatcherActive = false;
  private listenerResourceName: string | null = null;
  /**
   * The latest route config name from an LDS response. The RDS watcher is
   * actively watching that name if and only if this is not null.
   */
  private latestRouteConfigName: string | null = null;

  private latestRouteConfig: RouteConfiguration__Output | null = null;

  private clusterRefcounts = new Map<string, {inLastConfig: boolean, refCount: number}>();

  private latestDefaultTimeout: Duration | undefined = undefined;

  private ldsHttpFilterConfigs: {name: string, config: HttpFilterConfig}[] = [];

  private bootstrapInfo: BootstrapInfo | null = null;

  private xdsClient: XdsClient;

  constructor(
    private target: GrpcUri,
    private listener: ResolverListener,
    private channelOptions: ChannelOptions
  ) {
    if (channelOptions[BOOTSTRAP_CONFIG_KEY]) {
      const parsedConfig = JSON.parse(channelOptions[BOOTSTRAP_CONFIG_KEY]);
      this.bootstrapInfo = validateBootstrapConfig(parsedConfig);
      this.xdsClient = new XdsClient(this.bootstrapInfo);
    } else {
      this.xdsClient = getSingletonXdsClient();
    }
    this.ldsWatcher = new Watcher<Listener__Output>({
      onResourceChanged: (update: Listener__Output) => {
        const httpConnectionManager = decodeSingleResource(HTTP_CONNECTION_MANGER_TYPE_URL, update.api_listener!.api_listener!.value);
        const defaultTimeout = httpConnectionManager.common_http_protocol_options?.idle_timeout;
        if (defaultTimeout === null || defaultTimeout === undefined) {
          this.latestDefaultTimeout = undefined;
        } else {
          this.latestDefaultTimeout = protoDurationToDuration(defaultTimeout);
        }
        if (EXPERIMENTAL_FAULT_INJECTION) {
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
                RouteConfigurationResourceType.cancelWatch(this.xdsClient, this.latestRouteConfigName, this.rdsWatcher);
              }
              RouteConfigurationResourceType.startWatch(this.xdsClient, routeConfigName, this.rdsWatcher);
              this.latestRouteConfigName = routeConfigName;
            }
            break;
          }
          case 'route_config':
            if (this.latestRouteConfigName) {
              RouteConfigurationResourceType.cancelWatch(this.xdsClient, this.latestRouteConfigName, this.rdsWatcher);
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
        if (!this.hasReportedSuccess) {
          trace('Resolution error for target ' + uriToString(this.target) + ' due to xDS client transient error ' + error.details);
          this.reportResolutionError(error.details);
        }
      },
      onResourceDoesNotExist: () => {
        trace('Resolution error for target ' + uriToString(this.target) + ': LDS resource does not exist');
        this.reportResolutionError(`Listener ${this.target} does not exist`);
      }
    });
    this.rdsWatcher = new Watcher<RouteConfiguration__Output>({
      onResourceChanged: (update: RouteConfiguration__Output) => {
        this.handleRouteConfig(update);
      },
      onError: (error: StatusObject) => {
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
    });
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

  private async handleRouteConfig(routeConfig: RouteConfiguration__Output) {
    /* We need to load the xxhash API before this function finishes, because
     * it is invoked in the config selector, which can be called immediately
     * after this function returns. */
    await loadXxhashApi();
    this.latestRouteConfig = routeConfig;
    /* Select the virtual host using the default authority override if it
     * exists, and the channel target otherwise. */
    const hostDomain = this.channelOptions['grpc.default_authority'] ?? this.target.path;
    const virtualHost = findVirtualHostForDomain(routeConfig.virtual_hosts, hostDomain);
    if (virtualHost === null) {
      this.reportResolutionError('No matching route found for ' + hostDomain);
      return;
    }
    const virtualHostHttpFilterOverrides = new Map<string, HttpFilterConfig>();
    if (EXPERIMENTAL_FAULT_INJECTION) {
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
      if (EXPERIMENTAL_FAULT_INJECTION) {
        for (const [name, filter] of Object.entries(route.typed_per_filter_config ?? {})) {
          const parsedConfig = parseOverrideFilterConfig(filter);
          if (parsedConfig) {
            routeHttpFilterOverrides.set(name, parsedConfig);
          }
        }
      }
      let retryPolicy: RetryPolicy | undefined = undefined;
      if (EXPERIMENTAL_RETRY) {
        const retryConfig = route.route!.retry_policy ?? virtualHost.retry_policy;
        if (retryConfig) {
          const retryableStatusCodes = [];
          for (const code of retryConfig.retry_on.split(',')) {
            if (RETRY_CODES[code]) {
              retryableStatusCodes.push(RETRY_CODES[code]);
            }
          }
          if (retryableStatusCodes.length > 0) {
            const baseInterval = retryConfig.retry_back_off?.base_interval ?
              protoDurationToSecondsString(retryConfig.retry_back_off.base_interval) :
              DEFAULT_RETRY_BASE_INTERVAL;
            const maxInterval = retryConfig.retry_back_off?.max_interval ?
              protoDurationToSecondsString(retryConfig.retry_back_off.max_interval) :
              getDefaultRetryMaxInterval(baseInterval);
            retryPolicy = {
              backoffMultiplier: 2,
              initialBackoff: baseInterval,
              maxBackoff: maxInterval,
              maxAttempts: (retryConfig.num_retries?.value ?? 1) + 1,
              retryableStatusCodes: retryableStatusCodes
            };
          }
        }
      }
      const hashPolicies: HashPolicy[] = [];
      if (EXPERIMENTAL_RING_HASH) {
        for (const routeHashPolicy of route.route!.hash_policy) {
          if (routeHashPolicy.policy_specifier === 'header') {
            const headerPolicy = routeHashPolicy.header!;
            hashPolicies.push({
              type: 'HEADER',
              terminal: routeHashPolicy.terminal,
              headerName: headerPolicy.header_name,
              regex: headerPolicy.regex_rewrite?.pattern ? new RE2(headerPolicy.regex_rewrite.pattern.regex, 'ug') : undefined,
              regexSubstitution: headerPolicy.regex_rewrite?.substitution
            });
          } else if (routeHashPolicy.policy_specifier === 'filter_state' && routeHashPolicy.filter_state!.key === 'io.grpc.channel_id') {
            hashPolicies.push({
              type: 'CHANNEL_ID',
              terminal: routeHashPolicy.terminal
            });
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
          if (EXPERIMENTAL_FAULT_INJECTION) {
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
          routeAction = new SingleClusterRouteAction(cluster, {name: [], timeout: timeout, retryPolicy: retryPolicy}, extraFilterFactories, hashPolicies);
          break;
        }
        case 'weighted_clusters': {
          const weightedClusters: WeightedCluster[] = [];
          for (const clusterWeight of route.route!.weighted_clusters!.clusters) {
            allConfigClusters.add(clusterWeight.name);
            const extraFilterFactories: FilterFactory<Filter>[] = [];
            const clusterHttpFilterOverrides = new Map<string, HttpFilterConfig>();
            if (EXPERIMENTAL_FAULT_INJECTION) {
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
          routeAction = new WeightedClusterRouteAction(weightedClusters, route.route!.weighted_clusters!.total_weight?.value ?? 100, {name: [], timeout: timeout, retryPolicy: retryPolicy}, hashPolicies);
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
    const configSelector: ConfigSelector = (methodName, metadata, channelId) => {
      for (const {matcher, action} of matchList) {
        if (matcher.apply(methodName, metadata)) {
          const clusterResult = action.getCluster();
          this.refCluster(clusterResult.name);
          const onCommitted = () => {
            this.unrefCluster(clusterResult.name);
          }
          let hash: string;
          if (EXPERIMENTAL_RING_HASH) {
            hash = `${action.getHash(metadata, channelId)}`;
          } else {
            hash = '';
          }
          return {
            methodConfig: clusterResult.methodConfig,
            onCommitted: onCommitted,
            pickInformation: {cluster: clusterResult.name, hash: hash},
            status: status.OK,
            dynamicFilterFactories: clusterResult.dynamicFilterFactories
          };
        }
      }
      return {
        methodConfig: {name: []},
        // These fields won't be used here, but they're set because of some TypeScript weirdness
        pickInformation: {cluster: '', hash: ''},
        status: status.UNAVAILABLE,
        dynamicFilterFactories: []
      };
    };
    trace('Created ConfigSelector with configuration:');
    for (const {matcher, action} of matchList) {
      trace(matcher.toString());
      trace('=> ' + action.toString());
    }
    const clusterConfigMap: {[key: string]: {child_policy: LoadBalancingConfig[]}} = {};
    for (const clusterName of this.clusterRefcounts.keys()) {
      clusterConfigMap[clusterName] = {child_policy: [{cds: {cluster: clusterName}}]};
    }
    const lbPolicyConfig = {xds_cluster_manager: {children: clusterConfigMap}};
    const serviceConfig: ServiceConfig = {
      methodConfig: [],
      loadBalancingConfig: [lbPolicyConfig]
    }
    this.listener.onSuccessfulResolution([], serviceConfig, null, configSelector, {xdsClient: this.xdsClient});
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

  private startResolution(): void {
    if (!this.isLdsWatcherActive) {
      trace('Starting resolution for target ' + uriToString(this.target));
      try {
        this.listenerResourceName = getListenerResourceName(this.bootstrapInfo!, this.target);
        trace('Resolving target ' + uriToString(this.target) + ' with Listener resource name ' + this.listenerResourceName);
        ListenerResourceType.startWatch(this.xdsClient, this.listenerResourceName, this.ldsWatcher);
        this.isLdsWatcherActive = true;

      } catch (e) {
        this.reportResolutionError((e as Error).message);
      }
    }
  }

  updateResolution(): void {
    if (EXPERIMENTAL_FEDERATION) {
      if (this.bootstrapInfo) {
        this.startResolution();
      } else {
        try {
          this.bootstrapInfo = loadBootstrapInfo();
        } catch (e) {
          this.reportResolutionError((e as Error).message);
        }
        this.startResolution();
      }
    } else {
      if (!this.isLdsWatcherActive) {
        trace('Starting resolution for target ' + uriToString(this.target));
        ListenerResourceType.startWatch(this.xdsClient, this.target.path, this.ldsWatcher);
        this.listenerResourceName = this.target.path;
        this.isLdsWatcherActive = true;
      }
    }
  }

  destroy() {
    if (this.listenerResourceName) {
      ListenerResourceType.cancelWatch(this.xdsClient, this.listenerResourceName, this.ldsWatcher);
      this.isLdsWatcherActive = false;
    }
    if (this.latestRouteConfigName) {
      RouteConfigurationResourceType.cancelWatch(this.xdsClient, this.latestRouteConfigName, this.rdsWatcher);
      this.latestRouteConfigName = null;
    }
  }

  static getDefaultAuthority(target: GrpcUri) {
    return target.path;
  }
}

export function setup() {
  registerResolver('xds', XdsResolver);
}
