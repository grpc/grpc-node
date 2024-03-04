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

import { ConnectionInjector, Metadata, Server, ServerCredentials, ServerInterceptingCall, ServerInterceptor, ServerOptions, StatusObject, experimental, logVerbosity, status } from "@grpc/grpc-js";
import { BootstrapInfo, formatTemplateString, loadBootstrapInfo, validateBootstrapConfig } from "./xds-bootstrap";
import * as net from "net";
import HostPort = experimental.HostPort;
import splitHostPort = experimental.splitHostPort;
import createServerCredentialsWithInterceptors = experimental.createServerCredentialsWithInterceptors;
import { Watcher, XdsClient, getSingletonXdsClient } from "./xds-client";
import { Listener__Output } from "./generated/envoy/config/listener/v3/Listener";
import { RouteConfiguration__Output } from "./generated/envoy/config/route/v3/RouteConfiguration";
import { RouteConfigurationResourceType } from "./xds-resource-type/route-config-resource-type";
import { ListenerResourceType } from "./xds-resource-type/listener-resource-type";
import { FilterChainMatch__Output, _envoy_config_listener_v3_FilterChainMatch_ConnectionSourceType } from "./generated/envoy/config/listener/v3/FilterChainMatch";
import { CidrRange, cidrRangeEqual, cidrRangeMessageToCidrRange, inCidrRange, normalizeCidrRange } from "./cidr";
import { Matcher } from "./matcher";
import { listenersEquivalent } from "./server-listener";
import { HTTP_CONNECTION_MANGER_TYPE_URL, decodeSingleResource } from "./resources";
import { FilterChain__Output } from "./generated/envoy/config/listener/v3/FilterChain";
import { getPredicateForMatcher } from "./route";
import { crossProduct } from "./cross-product";
import { findVirtualHostForDomain } from "./resolver-xds";
import { LogVerbosity } from "@grpc/grpc-js/build/src/constants";

const TRACER_NAME = 'xds_server';

function trace(text: string) {
  experimental.trace(logVerbosity.DEBUG, TRACER_NAME, text);
}

/**
 * Validates that a listening address to be bound is valid for use in the xDS
 * server: It must be in the form IP:port, and port must be non-zero.
 * @param listeningAddress
 * @returns
 */
function isValidIpPort(hostPort: HostPort): boolean {
  return hostPort !== null && (net.isIPv4(hostPort.host) || net.isIPv6(hostPort.host)) && hostPort.port !== undefined && hostPort.port > 0;
}

type ConnectionSourceType = keyof typeof _envoy_config_listener_v3_FilterChainMatch_ConnectionSourceType;

interface NormalizedFilterChainMatch {
  prefixRange?: CidrRange;
  sourceType: ConnectionSourceType;
  sourcePrefixRange?: CidrRange;
  sourcePort?: number;
}

interface RouteEntry {
  matcher: Matcher;
  isNonForwardingAction: boolean;
}

interface VirtualHostEntry {
  domains: string[];
  routes: RouteEntry[];
}

const routeErrorStatus = {
  code: status.UNAVAILABLE,
  details: 'Routing error'
};

interface ConfigParameters {
  xdsClient: XdsClient;
  createConnectionInjector: (credentials: ServerCredentials) => ConnectionInjector;
  drainGraceTimeMs: number;
  listenerResourceNameTemplate: string;
}

class FilterChainEntry {
  private matchers: NormalizedFilterChainMatch[];
  private rdsName: string | null = null;
  private routeConfigWatcher: Watcher<RouteConfiguration__Output>;
  private rdsError: string | null = null;
  private virtualHosts: VirtualHostEntry[] | null = null;
  private connectionInjector: ConnectionInjector;
  private hasRouteConfigErrors = false;
  constructor(private configParameters: ConfigParameters, filterChain: FilterChain__Output, credentials: ServerCredentials, onRouteConfigPopulated: () => void) {
    this.matchers = normalizeFilterChainMatch(filterChain.filter_chain_match);
    const httpConnectionManager = decodeSingleResource(HTTP_CONNECTION_MANGER_TYPE_URL, filterChain.filters[0].typed_config!.value);
    trace('Populating FilterChainEntry from HttpConncectionManager ' + JSON.stringify(httpConnectionManager, undefined, 2));
    this.routeConfigWatcher = new Watcher<RouteConfiguration__Output>({
      onResourceChanged: (resource: RouteConfiguration__Output) => {
        if (this.rdsError) {
          experimental.log(logVerbosity.ERROR, 'Retrieved previously missing RouteConfiguration resource ' + this.rdsName);
        }
        this.rdsError = null;
        this.handleRouteConfigurationResource(resource);
        onRouteConfigPopulated();
      },
      onResourceDoesNotExist: () => {
        this.virtualHosts = null;
        this.rdsError = `Resource does not exist`;
        this.logConfigurationError(this.rdsError);
        onRouteConfigPopulated();
      },
      onError: (status: StatusObject) => {
        if (!this.virtualHosts) {
          this.rdsError = `Error retrieving resource: ${status.details}`;
          this.logConfigurationError(this.rdsError);
        }
        onRouteConfigPopulated();
      }
    });
    if (httpConnectionManager.route_config) {
      this.handleRouteConfigurationResource(httpConnectionManager.route_config);
      process.nextTick(onRouteConfigPopulated);
    } else if (httpConnectionManager.rds) {
      this.rdsName = httpConnectionManager.rds.route_config_name;
      RouteConfigurationResourceType.startWatch(this.configParameters.xdsClient, this.rdsName, this.routeConfigWatcher);
    }
    const interceptor: ServerInterceptor = (methodDescriptor, call) => {
      return new ServerInterceptingCall(call, {
        start: (next) => {
          next({
            onReceiveMetadata: (metadata, next) => {
              if (!this.virtualHosts) {
                call.sendStatus(routeErrorStatus);
                return;
              }
              const virtualHost = findVirtualHostForDomain(this.virtualHosts, call.getHost());
              if (!virtualHost) {
                call.sendStatus(routeErrorStatus);
                return;
              }
              for (const route of virtualHost.routes) {
                if (route.matcher.apply(methodDescriptor.path, metadata)) {
                  if (route.isNonForwardingAction) {
                    next(metadata);
                  } else {
                    call.sendStatus(routeErrorStatus);
                  }
                  return;
                }
              }
              call.sendStatus(routeErrorStatus);
            }
          });
        }
      });
    }
    const interceptingCredentials = createServerCredentialsWithInterceptors(credentials, [interceptor]);
    this.connectionInjector = configParameters.createConnectionInjector(interceptingCredentials);
  }

  private handleRouteConfigurationResource(routeConfig: RouteConfiguration__Output) {
    let hasRouteConfigErrors = false;
    this.virtualHosts = [];
    for (const virtualHost of routeConfig.virtual_hosts) {
      const virtualHostEntry: VirtualHostEntry = {
        domains: virtualHost.domains,
        routes: []
      };
      for (const route of virtualHost.routes) {
        const routeEntry: RouteEntry = {
          matcher: getPredicateForMatcher(route.match!),
          isNonForwardingAction: route.action === 'non_forwarding_action'
        };
        if (!routeEntry.isNonForwardingAction) {
          hasRouteConfigErrors = true;
          this.logConfigurationError('For domains matching [' + virtualHostEntry.domains + '] requests will be rejected for routes matching ' + routeEntry.matcher.toString());
        }
        virtualHostEntry.routes.push(routeEntry);
      }
      this.virtualHosts.push(virtualHostEntry);
    }
    if (this.hasRouteConfigErrors && !hasRouteConfigErrors) {
      experimental.log(logVerbosity.ERROR, 'Routes will no longer reject requests for RouteConfiguration ' + this.rdsName);
    }
    this.hasRouteConfigErrors = hasRouteConfigErrors;
  }

  private logConfigurationError(text: string) {
    experimental.log(logVerbosity.ERROR, 'RouteConfiguration error (' + this.rdsName + '): ' + text);
  }

  getMatchers(): NormalizedFilterChainMatch[] {
    return this.matchers;
  }

  isPopulated(): boolean {
    return !!(this.virtualHosts || this.rdsError);
  }

  handleConnection(socket: net.Socket) {
    this.connectionInjector.injectConnection(socket);
  }

  shutdown() {
    this.connectionInjector.drain(this.configParameters.drainGraceTimeMs);
    this.connectionInjector.destroy();
    if (this.rdsName) {
      RouteConfigurationResourceType.cancelWatch(this.configParameters.xdsClient, this.rdsName, this.routeConfigWatcher);
    }
  }

  drain(graceTimeMs: number) {
    this.connectionInjector.drain(graceTimeMs);
  }
}

class ListenerConfig {
  private filterChainEntries: FilterChainEntry[];
  private defaultFilterChain: FilterChainEntry | null = null;
  private reportedReadyToUse = false;

  constructor(private configParameters: ConfigParameters, private resource: Listener__Output, credentials: ServerCredentials, private onReadyToUse: () => void) {
    trace('Populating ListenerConfig from listener ' + resource.name);
    this.filterChainEntries = [];
    for (const filterChain of resource.filter_chains) {
      this.filterChainEntries.push(new FilterChainEntry(configParameters, filterChain, credentials, () => this.maybeReportReadyToUse()));
    }
    if (resource.default_filter_chain) {
      this.defaultFilterChain = new FilterChainEntry(configParameters, resource.default_filter_chain, credentials, () => this.maybeReportReadyToUse());
    }
  }

  private maybeReportReadyToUse() {
    if (this.reportedReadyToUse) {
      return;
    }
    for (const entry of this.filterChainEntries) {
      if (!entry.isPopulated()) {
        return;
      }
    }
    if (this.defaultFilterChain && !this.defaultFilterChain.isPopulated()) {
      return;
    }
    this.reportedReadyToUse = true;
    this.onReadyToUse();
  }

  isEquivalentResource(listener: Listener__Output): boolean {
    return listenersEquivalent(listener, this.resource);
  }

  handleConnection(socket: net.Socket) {
    const matchingFilter = selectMostSpecificallyMatchingFilter(this.filterChainEntries, socket) ?? this.defaultFilterChain;
    if (!matchingFilter) {
      socket.destroy();
      return;
    }
    matchingFilter.handleConnection(socket);
  }

  shutdown() {
    for (const entry of this.filterChainEntries) {
      entry.shutdown();
    }
    this.defaultFilterChain?.shutdown();
  }

  drain(graceTimeMs: number) {
    this.filterChainEntries.forEach(entry => entry.drain(graceTimeMs));
    this.defaultFilterChain?.drain(graceTimeMs);
  }
}

interface ServingStatusListener {
  (servingStatus: StatusObject): void;
}

class BoundPortEntry {
  private listenerWatcher: Watcher<Listener__Output>;
  private servingStatus: StatusObject;
  private tcpServer: net.Server;
  private currentConfig: ListenerConfig | null = null;
  private pendingConfig: ListenerConfig | null = null;
  private servingStatusListeners: Set<ServingStatusListener> = new Set();

  constructor(private configParameters: ConfigParameters, private boundAddress: string, private credentials: ServerCredentials) {
    this.listenerWatcher = new Watcher<Listener__Output>({
      onResourceChanged: (resource: Listener__Output) => {
        trace('Received listener resource ' + resource.name);
        this.handleListenerResource(resource);
      },
      onResourceDoesNotExist: () => {
        this.currentConfig?.shutdown();
        this.currentConfig = null;
        this.pendingConfig?.shutdown();
        this.pendingConfig = null;

      },
      onError: (status: StatusObject) => {
        if (!this.currentConfig && !this.pendingConfig) {
          this.updateServingStatus(status);
        }
      }
    });
    this.tcpServer = new net.Server(socket => {
      if (this.currentConfig && this.servingStatus.code === status.OK) {
        this.currentConfig.handleConnection(socket);
      } else {
        socket.destroy();
      }
    });
    this.servingStatus = {
      code: status.UNAVAILABLE,
      details: 'Not yet serving',
      metadata: new Metadata()
    };
    const resourceName = formatTemplateString(configParameters.listenerResourceNameTemplate, boundAddress);
    trace('Watching for listener resource ' + resourceName);
    ListenerResourceType.startWatch(configParameters.xdsClient, resourceName, this.listenerWatcher);
  }

  private updateServingStatus(status: StatusObject) {
    this.servingStatus = status;
    this.servingStatusListeners.forEach(listener => listener(status));
  }

  private handleListenerResource(listener: Listener__Output) {
    trace('handleListenerResource(' + listener.name + ')');
    if (!listener.address?.socket_address) {
      const errorText = `No socket_address set in Listener resource for port ${this.boundAddress}`;
      trace('Error handling listener resource: ' + errorText);
      this.updateServingStatus({
        code: status.UNAVAILABLE,
        details: errorText,
        metadata: new Metadata()
      });
      return;
    }
    const listeningAddress = splitHostPort(this.boundAddress);
    if (!listeningAddress) {
      const errorText = `Could not parse bound address ${this.boundAddress}`;
      trace('Error handling listener resource: ' + errorText);
      this.updateServingStatus({
        code: status.UNAVAILABLE,
        details: errorText,
        metadata: new Metadata()
      });
      return;
    }
    if (!(listener.address.socket_address.address === listeningAddress.host && listener.address.socket_address.port_value === listeningAddress.port)) {
      const errorText = `socket_address mismatch for port ${this.boundAddress}: got '${listener.address.socket_address.address}:${listener.address.socket_address.port_value}'`;
      trace('Error handling listener resource: ' + errorText);
      this.updateServingStatus({
        code: status.UNAVAILABLE,
        details: errorText,
        metadata: new Metadata()
      });
      return;
    }
    if (this.currentConfig?.isEquivalentResource(listener)) {
      trace('Listener resource equivalent to current resource');
      this.pendingConfig?.shutdown();
      this.pendingConfig = null;
      return;
    }
    if (this.pendingConfig?.isEquivalentResource(listener)) {
      trace('Listener resource equivalent to pending resource');
      return;
    }
    this.pendingConfig?.shutdown();
    this.pendingConfig = new ListenerConfig(this.configParameters, listener, this.credentials, () => this.startUsingPendingConfig());
  }

  private maybeStartServing() {
    if (this.currentConfig && this.tcpServer.listening) {
      this.updateServingStatus({
        code: status.OK,
        details: '',
        metadata: new Metadata()
      });
    }
  }

  private startUsingPendingConfig() {
    this.currentConfig?.shutdown();
    this.currentConfig = this.pendingConfig;
    this.pendingConfig = null;
    if (!this.tcpServer.listening) {
      const listeningAddress = splitHostPort(this.boundAddress);
      if (listeningAddress) {
        this.tcpServer.listen(listeningAddress?.port, () => {
          this.maybeStartServing();
        })
      }
    }
    this.maybeStartServing();
  }

  addServingStatusListener(listener: ServingStatusListener) {
    this.servingStatusListeners.add(listener);
  }

  removeServingStatusListener(listener: ServingStatusListener) {
    this.servingStatusListeners.delete(listener);
  }

  drain(graceTimeMs: number) {
    this.currentConfig?.drain(graceTimeMs);
  }

  unbind() {
    this.currentConfig?.shutdown();
    this.pendingConfig?.shutdown();
    this.tcpServer.close();
    const resourceName = formatTemplateString(this.configParameters.listenerResourceNameTemplate, this.boundAddress);
    ListenerResourceType.cancelWatch(this.configParameters.xdsClient, resourceName, this.listenerWatcher);
  }
}

function normalizeFilterChainMatch(filterChainMatch: FilterChainMatch__Output | null): NormalizedFilterChainMatch[] {
  if (!filterChainMatch) {
    return [];
  }
  if (filterChainMatch.destination_port) {
    return [];
  }
  if (filterChainMatch.server_names.length > 0) {
    return [];
  }
  if (filterChainMatch.transport_protocol !== 'raw_buffer') {
    return [];
  }
  if (filterChainMatch.application_protocols.length > 0) {
    return [];
  }
  const normalizedPrefixRanges = filterChainMatch.prefix_ranges.map(cidrRangeMessageToCidrRange).map(normalizeCidrRange);
  const normalizedSourcePrefixRanges = filterChainMatch.source_prefix_ranges.map(cidrRangeMessageToCidrRange).map(normalizeCidrRange);
  const fieldCrossProduct = crossProduct([normalizedPrefixRanges, normalizedSourcePrefixRanges, filterChainMatch.source_ports] as [CidrRange[], CidrRange[], number[]]);
  return fieldCrossProduct.map(([prefixRange, sourcePrefixRange, sourcePort]) => ({prefixRange, sourceType: filterChainMatch.source_type, sourcePrefixRange, sourcePort}));
}

function isSameIpOrLoopback(remoteAddress: string, localAddress: string): boolean {
  return remoteAddress === '127.0.0.1' || remoteAddress === '::1' || remoteAddress === localAddress;
}

interface MatchFieldEvaluator<MatcherType, FieldType> {
  isMatch: (matcher: MatcherType, field: FieldType) => boolean;
  matcherEqual: (matcher1: MatcherType, matcher2: MatcherType) => boolean;
  /**
   * Returns true if matcher1 is more specific than matcher2.
   *
   * Note: this comparison will only make sense if the field value in
   * consideration matches both matchers.
   * @param matcher1
   * @param matcher2
   * @returns
   */
  isMoreSpecific: (matcher1: MatcherType, matcher2: MatcherType) => boolean;
}

type FieldType<MatcherType> = MatcherType extends CidrRange ? (string | undefined) : MatcherType extends (ConnectionSourceType) ? {localAddress: string, remoteAddress?: (string | undefined)} : MatcherType extends number ? number | undefined : never;

function cidrRangeMatch(range: CidrRange | undefined, address: string | undefined): boolean {
  return !range || (!!address && inCidrRange(range, address));
}

function cidrRangeMoreSpecific(range1: CidrRange | undefined, range2: CidrRange | undefined): boolean {
  if (!range2) {
    return !!range1;
  }
  return !!range1 && range1.prefixLen > range2.prefixLen;
}

function sourceTypeMatch(sourceType: ConnectionSourceType, addresses: {localAddress: string, remoteAddress?: (string | undefined)}): boolean {
  switch (sourceType) {
    case "ANY":
      return true;
    case "SAME_IP_OR_LOOPBACK":
      return !!addresses.remoteAddress && isSameIpOrLoopback(addresses.remoteAddress, addresses.localAddress);
    case "EXTERNAL":
      return !!addresses.remoteAddress && !isSameIpOrLoopback(addresses.remoteAddress, addresses.localAddress);
  }
}

const cidrRangeEvaluator: MatchFieldEvaluator<CidrRange | undefined, string | undefined> = {
  isMatch: cidrRangeMatch,
  matcherEqual: cidrRangeEqual,
  isMoreSpecific: cidrRangeMoreSpecific
};

const sourceTypeEvaluator: MatchFieldEvaluator<ConnectionSourceType, {localAddress: string, remoteAddress?: (string | undefined)}> = {
  isMatch: sourceTypeMatch,
  matcherEqual: (matcher1, matcher2) => matcher1 === matcher2,
  isMoreSpecific: (matcher1, matcher2) => matcher1 !== 'ANY' && matcher2 === 'ANY'
};

const portEvaluator: MatchFieldEvaluator<number | undefined, number | undefined> = {
  isMatch: (matcher, actual) => matcher === undefined || matcher === actual,
  matcherEqual: (matcher1, matcher2) => matcher1 === matcher2,
  isMoreSpecific: (matcher1, matcher2) => matcher1 !== undefined && matcher2 === undefined
}

function selectMostSpecificMatcherForField<FieldName extends keyof NormalizedFilterChainMatch>(fieldName: FieldName, evaluator: MatchFieldEvaluator<NormalizedFilterChainMatch[FieldName], FieldType<NormalizedFilterChainMatch[FieldName]>>, matchers: NormalizedFilterChainMatch[], fieldValue: FieldType<NormalizedFilterChainMatch[FieldName]>): NormalizedFilterChainMatch[] {
  let filteredCandidates: NormalizedFilterChainMatch[] = [];
  for (const candidate of matchers) {
    const fieldMatcher = candidate[fieldName];
    if (!evaluator.isMatch(fieldMatcher, fieldValue)) {
      continue;
    }
    if (filteredCandidates.length === 0) {
      filteredCandidates.push(candidate);
    } else if (evaluator.matcherEqual(fieldMatcher, filteredCandidates[0][fieldName])) {
      filteredCandidates.push(candidate);
    } else if (evaluator.isMoreSpecific(fieldMatcher, filteredCandidates[0][fieldName])) {
      filteredCandidates = [candidate];
    }
  }
  return filteredCandidates;
}

function selectMostSpecificallyMatchingFilter(filterChains: FilterChainEntry[], socket: net.Socket): FilterChainEntry | null {
  let matcherMap: Map<NormalizedFilterChainMatch, FilterChainEntry> = new Map(filterChains.map(chain => chain.getMatchers().map(matcher => ([matcher, chain] as [NormalizedFilterChainMatch, FilterChainEntry]))).flat());
  let matcherCandidates = Array.from(matcherMap.keys());
  matcherCandidates = selectMostSpecificMatcherForField('prefixRange', cidrRangeEvaluator, matcherCandidates, socket.localAddress);
  matcherCandidates = selectMostSpecificMatcherForField('sourceType', sourceTypeEvaluator, matcherCandidates, socket);
  matcherCandidates = selectMostSpecificMatcherForField('sourcePrefixRange', cidrRangeEvaluator, matcherCandidates, socket.remoteAddress);
  matcherCandidates = selectMostSpecificMatcherForField('sourcePort', portEvaluator, matcherCandidates, socket.remotePort);
  if (matcherCandidates.length === 1) {
    return matcherMap.get(matcherCandidates[0])!
  } else if (matcherCandidates.length === 0) {
    return null;
  } else {
    throw new Error('Duplicate matcher found for incoming connection');
  }
}

const BOOTSTRAP_CONFIG_KEY = 'grpc.TEST_ONLY_DO_NOT_USE_IN_PROD.xds_bootstrap_config';

// Default drain grace time of 10 minutes
const DEFAULT_DRAIN_GRACE_TIME_MS = 10 * 60 * 1000;

export interface XdsServerOptions extends ServerOptions {
  drainGraceTimeMs?: number;
}

export class XdsServer extends Server {
  private listenerResourceNameTemplate: string;
  private boundPortMap: Map<string, BoundPortEntry> = new Map();
  private xdsClient: XdsClient;
  private drainGraceTimeMs: number;
  constructor(options?: XdsServerOptions) {
    super(options);
    let bootstrapConfig: BootstrapInfo;
    if (options?.[BOOTSTRAP_CONFIG_KEY]) {
      const parsedConfig = JSON.parse(options[BOOTSTRAP_CONFIG_KEY]);
      bootstrapConfig = validateBootstrapConfig(parsedConfig);
      this.xdsClient = new XdsClient(bootstrapConfig);
    } else {
      bootstrapConfig = loadBootstrapInfo();
      this.xdsClient = getSingletonXdsClient();
    }
    if (!bootstrapConfig.serverListenerResourceNameTemplate) {
      throw new Error('Bootstrap file missing required field server_listener_resource_name_template');
    }
    this.listenerResourceNameTemplate = bootstrapConfig.serverListenerResourceNameTemplate;
    this.drainGraceTimeMs = options?.drainGraceTimeMs ?? DEFAULT_DRAIN_GRACE_TIME_MS;
  }

  /**
   * Bind a port using configuration retrieved from the xDS control plane.
   * @param port Port to bind in the format [IP address]:[port number] (e.g. 0.0.0.0:443)
   * @param creds Server credentials object to bind
   * @param callback
   */
  override bindAsync(port: string, creds: ServerCredentials, callback: (error: Error | null, port: number) => void): void {
    // Validate port string has the form IP:port
    const hostPort = splitHostPort(port);
    if (!hostPort || !isValidIpPort(hostPort)) {
      throw new Error(`Listening port string must have the format IP:port with non-zero port, got ${port}`);
    }
    const configParameters: ConfigParameters = {
      createConnectionInjector: (credentials) => this.createConnectionInjector(credentials),
      drainGraceTimeMs: this.drainGraceTimeMs,
      listenerResourceNameTemplate: this.listenerResourceNameTemplate,
      xdsClient: this.xdsClient
    };
    const portEntry = new BoundPortEntry(configParameters, port, creds);
    const servingStatusListener: ServingStatusListener = statusObject => {
      if (statusObject.code === status.OK) {
        callback(null, hostPort.port!);
        portEntry.removeServingStatusListener(servingStatusListener);
      }
    }
    portEntry.addServingStatusListener(servingStatusListener);
    this.boundPortMap.set(port, portEntry);
  }

  override drain(port: string, graceTimeMs: number): void {
    const boundPort = this.boundPortMap.get(port);
    boundPort?.drain(graceTimeMs);
  }

  override unbind(port: string): void {
    const boundPort = this.boundPortMap.get(port);
    if (!boundPort) {
      return;
    }
    boundPort.unbind();
    this.boundPortMap.delete(port);
  }

  override tryShutdown(callback: (error?: Error) => void): void {
    for (const portEntry of this.boundPortMap.values()) {
      portEntry.unbind();
    }
    this.boundPortMap.clear();
    super.tryShutdown(callback);
  }

  override forceShutdown(): void {
    for (const portEntry of this.boundPortMap.values()) {
      portEntry.unbind();
    }
    this.boundPortMap.clear();
    super.forceShutdown();
  }

  addServingStateListener(port: string, listener: ServingStatusListener) {
    const portEntry = this.boundPortMap.get(port);
    if (portEntry) {
      portEntry.addServingStatusListener(listener);
    }
  }

  removeServingStateListener(port: string, listener: ServingStatusListener) {
    const portEntry = this.boundPortMap.get(port);
    if (portEntry) {
      portEntry.removeServingStatusListener(listener);
    }
  }
}
