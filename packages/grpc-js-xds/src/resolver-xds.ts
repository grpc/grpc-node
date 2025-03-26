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
import { status, logVerbosity, Metadata, experimental, ChannelOptions, ServiceConfig, LoadBalancingConfig, RetryPolicy } from '@grpc/grpc-js';
import Resolver = experimental.Resolver;
import GrpcUri = experimental.GrpcUri;
import ResolverListener = experimental.ResolverListener;
import uriToString = experimental.uriToString;
import registerResolver = experimental.registerResolver;
import ConfigSelector = experimental.ConfigSelector;
import { Matcher } from './matcher';
import { HashPolicy, RouteAction, SingleClusterRouteAction, WeightedCluster, WeightedClusterRouteAction } from './route-action';
import { decodeSingleResource, HTTP_CONNECTION_MANGER_TYPE_URL } from './resources';
import Duration = experimental.Duration;
import { Duration__Output } from './generated/google/protobuf/Duration';
import { createClientHttpFilter, HttpFilterConfig, parseOverrideFilterConfig, parseTopLevelFilterConfig } from './http-filter';
import { EXPERIMENTAL_FAULT_INJECTION, EXPERIMENTAL_FEDERATION, EXPERIMENTAL_RETRY, EXPERIMENTAL_RING_HASH } from './environment';
import Filter = experimental.Filter;
import FilterFactory = experimental.FilterFactory;
import { BootstrapInfo, loadBootstrapInfo, validateBootstrapConfig } from './xds-bootstrap';
import { protoDurationToDuration } from './duration';
import { loadXxhashApi } from './xxhash';
import { formatTemplateString } from './xds-bootstrap';
import { getPredicateForMatcher } from './route';
import { XdsConfig, XdsConfigWatcher, XdsDependencyManager } from './xds-dependency-manager';
import statusOrFromValue = experimental.statusOrFromValue;
import statusOrFromError = experimental.statusOrFromError;
import CHANNEL_ARGS_CONFIG_SELECTOR_KEY = experimental.CHANNEL_ARGS_CONFIG_SELECTOR_KEY;

const TRACER_NAME = 'xds_resolver';

function trace(text: string): void {
  experimental.trace(logVerbosity.DEBUG, TRACER_NAME, text);
}

function protoDurationToSecondsString(duration: Duration__Output): string {
  return `${duration.seconds + duration.nanos / 1_000_000_000}s`;
}

const DEFAULT_RETRY_BASE_INTERVAL = '0.025s'

function getDefaultRetryMaxInterval(baseInterval: string): string {
  return `${Number.parseFloat(baseInterval.substring(0, baseInterval.length - 1)) * 10}s`;
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

export const XDS_CONFIG_KEY = `${experimental.SUBCHANNEL_ARGS_EXCLUDE_KEY_PREFIX}.xds_config`;
export const XDS_CLIENT_KEY = 'grpc.internal.xds_client';

/**
 * Tracks a dynamic subscription to a cluster that is currently or previously
 * referenced in a RouteConfiguration.
 */
class ClusterRef {
  private refCount = 0;
  constructor(private unsubscribe: () => void) {}

  ref() {
    this.refCount += 1;
  }

  unref() {
    this.refCount -= 1;
    if (this.refCount <= 0) {
      this.unsubscribe();
    }
  }

  hasRef() {
    return this.refCount > 0;
  }
}

class XdsResolver implements Resolver {

  private listenerResourceName: string | null = null;

  private bootstrapInfo: BootstrapInfo | null = null;

  private xdsClient: XdsClient;

  private xdsConfigWatcher: XdsConfigWatcher;
  private xdsDependencyManager: XdsDependencyManager | null = null;
  private clusterRefs: Map<string, ClusterRef> = new Map();

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
    this.xdsConfigWatcher = {
      onUpdate: maybeXdsConfig => {
        if (maybeXdsConfig.ok) {
          this.handleXdsConfig(maybeXdsConfig.value);
        } else {
          this.listener(statusOrFromValue([]), {}, null, `Resolution error for target ${uriToString(this.target)}: ${maybeXdsConfig.error.details}`);
        }
      }
    }
  }

  private pruneUnusedClusters() {
    for (const [cluster, clusterRef] of this.clusterRefs) {
      if (!clusterRef.hasRef()) {
        this.clusterRefs.delete(cluster);
      }
    }
  }

  private async handleXdsConfig(xdsConfig: XdsConfig) {
    /* We need to load the xxhash API before this function finishes, because
     * it is invoked in the config selector, which can be called immediately
     * after this function returns. */
    await loadXxhashApi();
    this.pruneUnusedClusters();
    const httpConnectionManager = decodeSingleResource(HTTP_CONNECTION_MANGER_TYPE_URL, xdsConfig.listener.api_listener!.api_listener!.value);
    const configDefaultTimeout = httpConnectionManager.common_http_protocol_options?.idle_timeout;
    let defaultTimeout: Duration | undefined = undefined;
    if (configDefaultTimeout === null || configDefaultTimeout === undefined) {
      defaultTimeout = undefined;
    } else {
      defaultTimeout = protoDurationToDuration(configDefaultTimeout);
    }
    const ldsHttpFilterConfigs: {name: string, config: HttpFilterConfig}[] = [];
    if (EXPERIMENTAL_FAULT_INJECTION) {
      for (const filter of httpConnectionManager.http_filters) {
        // typed_config must be set here, or validation would have failed
        const filterConfig = parseTopLevelFilterConfig(filter.typed_config!, true);
        if (filterConfig) {
          ldsHttpFilterConfigs.push({name: filter.name, config: filterConfig});
        }
      }
    }
    const virtualHost = xdsConfig.virtualHost;
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
        timeout = defaultTimeout;
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
            for (const filterConfig of ldsHttpFilterConfigs) {
              if (routeHttpFilterOverrides.has(filterConfig.name)) {
                const filter = createClientHttpFilter(filterConfig.config, routeHttpFilterOverrides.get(filterConfig.name)!);
                if (filter) {
                  extraFilterFactories.push(filter);
                }
              } else if (virtualHostHttpFilterOverrides.has(filterConfig.name)) {
                const filter = createClientHttpFilter(filterConfig.config, virtualHostHttpFilterOverrides.get(filterConfig.name)!);
                if (filter) {
                  extraFilterFactories.push(filter);
                }
              } else {
                const filter = createClientHttpFilter(filterConfig.config);
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
              for (const filterConfig of ldsHttpFilterConfigs) {
                if (clusterHttpFilterOverrides.has(filterConfig.name)) {
                  const filter = createClientHttpFilter(filterConfig.config, clusterHttpFilterOverrides.get(filterConfig.name)!);
                  if (filter) {
                    extraFilterFactories.push(filter);
                  }
                } else if (routeHttpFilterOverrides.has(filterConfig.name)) {
                  const filter = createClientHttpFilter(filterConfig.config, routeHttpFilterOverrides.get(filterConfig.name)!);
                  if (filter) {
                    extraFilterFactories.push(filter);
                  }
                } else if (virtualHostHttpFilterOverrides.has(filterConfig.name)) {
                  const filter = createClientHttpFilter(filterConfig.config, virtualHostHttpFilterOverrides.get(filterConfig.name)!);
                  if (filter) {
                    extraFilterFactories.push(filter);
                  }
                } else {
                  const filter = createClientHttpFilter(filterConfig.config);
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
    for (const cluster of allConfigClusters) {
      let clusterRef = this.clusterRefs.get(cluster);
      if (!clusterRef) {
        clusterRef = new ClusterRef(this.xdsDependencyManager!.addClusterSubscription(cluster));
        this.clusterRefs.set(cluster, clusterRef);
      }
      clusterRef.ref();
    }
    const configSelector: ConfigSelector = {
      invoke: (methodName, metadata, channelId) => {
        for (const {matcher, action} of matchList) {
          if (matcher.apply(methodName, metadata)) {
            const clusterResult = action.getCluster();
            const clusterRef = this.clusterRefs.get(clusterResult.name)!;
            clusterRef.ref();
            const onCommitted = () => {
              clusterRef.unref();
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
      },
      unref: () => {
        for (const cluster of allConfigClusters) {
          this.clusterRefs.get(cluster)?.unref();
        }
      }
    }
    trace('Created ConfigSelector with configuration:');
    for (const {matcher, action} of matchList) {
      trace(matcher.toString());
      trace('=> ' + action.toString());
    }
    const clusterConfigMap: {[key: string]: {child_policy: LoadBalancingConfig[]}} = {};
    for (const clusterName of this.clusterRefs.keys()) {
      clusterConfigMap[clusterName] = {child_policy: [{cds: {cluster: clusterName}}]};
    }
    const lbPolicyConfig = {xds_cluster_manager: {children: clusterConfigMap}};
    const serviceConfig: ServiceConfig = {
      methodConfig: [],
      loadBalancingConfig: [lbPolicyConfig]
    }
    this.listener(statusOrFromValue([]), {
      [XDS_CLIENT_KEY]: this.xdsClient,
      [XDS_CONFIG_KEY]: xdsConfig,
      [CHANNEL_ARGS_CONFIG_SELECTOR_KEY]: configSelector
    }, statusOrFromValue(serviceConfig), '');
  }

  private reportResolutionError(reason: string) {
    this.listener(statusOrFromError({
      code: status.UNAVAILABLE,
      details: `xDS name resolution failed for target ${uriToString(
        this.target
      )}: ${reason}`
    }), {}, null, '');
  }

  private startResolution(): void {
    if (!this.xdsDependencyManager) {
      trace('Starting resolution for target ' + uriToString(this.target));
      try {
        const listenerResourceName = getListenerResourceName(this.bootstrapInfo!, this.target);
        trace('Resolving target ' + uriToString(this.target) + ' with Listener resource name ' + this.listenerResourceName);
        const hostDomain = this.channelOptions['grpc.default_authority'] ?? this.target.path;
        this.xdsDependencyManager = new XdsDependencyManager(this.xdsClient, listenerResourceName, hostDomain, this.xdsConfigWatcher);
      } catch (e) {
        this.reportResolutionError((e as Error).message);
        return;
      }
    }
    this.xdsDependencyManager.updateResolution();
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
      if (!this.xdsDependencyManager) {
        trace('Starting resolution for target ' + uriToString(this.target));
        const hostDomain = this.channelOptions['grpc.default_authority'] ?? this.target.path;
        this.xdsDependencyManager = new XdsDependencyManager(this.xdsClient, this.target.path, hostDomain, this.xdsConfigWatcher);
      }
      this.xdsDependencyManager.updateResolution();
    }
  }

  destroy() {
    if (this.xdsDependencyManager) {
      this.xdsDependencyManager.destroy();
      this.xdsDependencyManager = null;
    }
  }

  static getDefaultAuthority(target: GrpcUri) {
    return target.path;
  }
}

export function setup() {
  registerResolver('xds', XdsResolver);
}
