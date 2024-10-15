/*
 * Copyright 2023 gRPC authors.
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

import { logVerbosity, experimental } from "@grpc/grpc-js";
import { EXPERIMENTAL_FAULT_INJECTION } from "../environment";
import { Listener__Output } from "../generated/envoy/config/listener/v3/Listener";
import { Any__Output } from "../generated/google/protobuf/Any";
import { DOWNSTREAM_TLS_CONTEXT_TYPE_URL, HTTP_CONNECTION_MANGER_TYPE_URL, LDS_TYPE_URL, decodeSingleResource } from "../resources";
import { XdsDecodeContext, XdsDecodeResult, XdsResourceType } from "./xds-resource-type";
import { getTopLevelFilterUrl, validateTopLevelFilter } from "../http-filter";
import { RouteConfigurationResourceType } from "./route-config-resource-type";
import { Watcher, XdsClient } from "../xds-client";
import { CidrRange, cidrRangeEqual, cidrRangeMessageToCidrRange, normalizeCidrRange } from "../cidr";
import { FilterChainMatch__Output, _envoy_config_listener_v3_FilterChainMatch_ConnectionSourceType } from "../generated/envoy/config/listener/v3/FilterChainMatch";
import { crossProduct } from "../cross-product";
import { FilterChain__Output } from "../generated/envoy/config/listener/v3/FilterChain";
import { HttpConnectionManager__Output } from "../generated/envoy/extensions/filters/network/http_connection_manager/v3/HttpConnectionManager";
import { CertificateValidationContext__Output } from "../generated/envoy/extensions/transport_sockets/tls/v3/CertificateValidationContext";

const TRACER_NAME = 'xds_client';

function trace(text: string): void {
  experimental.trace(logVerbosity.DEBUG, TRACER_NAME, text);
}

const ROUTER_FILTER_URL = 'type.googleapis.com/envoy.extensions.filters.http.router.v3.Router';

type ConnectionSourceType = keyof typeof _envoy_config_listener_v3_FilterChainMatch_ConnectionSourceType;

interface NormalizedFilterChainMatch {
  destinationPort?: number;
  prefixRange?: CidrRange;
  sourceType: ConnectionSourceType;
  sourcePrefixRange?: CidrRange;
  sourcePort?: number;
  serverName?: string;
  transportProtocol: string;
  applicationProtocol?: string;
}

function normalizedFilterChainMatchEquals(first: NormalizedFilterChainMatch, second: NormalizedFilterChainMatch) {
  return (
    first.destinationPort === second.destinationPort &&
    cidrRangeEqual(first.prefixRange, second.prefixRange) &&
    first.sourceType === second.sourceType &&
    cidrRangeEqual(first.sourcePrefixRange, second.sourcePrefixRange) &&
    first.sourcePort === second.sourcePort &&
    first.serverName === second.serverName &&
    first.transportProtocol === second.transportProtocol &&
    first.applicationProtocol === second.applicationProtocol
  );
}

function normalizeFilterChainMatch(filterChainMatch: FilterChainMatch__Output): NormalizedFilterChainMatch[] {
  const prefixRanges = filterChainMatch.prefix_ranges.map(cidrRangeMessageToCidrRange).map(normalizeCidrRange);
  const sourcePrefixRanges = filterChainMatch.source_prefix_ranges.map(cidrRangeMessageToCidrRange).map(normalizeCidrRange);
  const sourcePorts = filterChainMatch.source_ports;
  const serverNames = filterChainMatch.server_names;
  const applicationProtocols = filterChainMatch.application_protocols;
  const fieldCrossProduct = crossProduct([prefixRanges, sourcePrefixRanges, sourcePorts, serverNames, applicationProtocols] as [CidrRange[], CidrRange[], number[], string[], string[]]);
  return fieldCrossProduct.map(([prefixRange, sourcePrefixRange, sourcePort, serverName, applicationProtocol]) => ({
    destinationPort: filterChainMatch.destination_port?.value,
    prefixRange,
    sourceType: filterChainMatch.source_type,
    sourcePrefixRange,
    sourcePort,
    serverName,
    transportProtocol: filterChainMatch.transport_protocol,
    applicationProtocol: applicationProtocol
  }));
}

function validateHttpConnectionManager(httpConnectionManager: HttpConnectionManager__Output): boolean {
  if (EXPERIMENTAL_FAULT_INJECTION) {
    const filterNames = new Set<string>();
    for (const [index, httpFilter] of httpConnectionManager.http_filters.entries()) {
      if (filterNames.has(httpFilter.name)) {
        trace('LDS response validation failed: duplicate HTTP filter name ' + httpFilter.name);
        return false;
      }
      filterNames.add(httpFilter.name);
      if (!validateTopLevelFilter(httpFilter)) {
        trace('LDS response validation failed: ' + httpFilter.name + ' filter validation failed');
        return false;
      }
      /* Validate that the last filter, and only the last filter, is the
       * router filter. */
      const filterUrl = getTopLevelFilterUrl(httpFilter.typed_config!)
      if (index < httpConnectionManager.http_filters.length - 1) {
        if (filterUrl === ROUTER_FILTER_URL) {
          trace('LDS response validation failed: router filter is before end of list');
          return false;
        }
      } else {
        if (filterUrl !== ROUTER_FILTER_URL) {
          trace('LDS response validation failed: final filter is ' + filterUrl);
          return false;
        }
      }
    }
  }
  switch (httpConnectionManager.route_specifier) {
    case 'rds':
      if (!httpConnectionManager.rds?.config_source?.ads && !httpConnectionManager.rds?.config_source?.self) {
        return false;
      }
      break;
    case 'route_config':
      if (!RouteConfigurationResourceType.get().validateResource(httpConnectionManager.route_config!)) {
        return false;
      }
      break;
    default: return false;
  }
  return true;
}

function validateFilterChain(context: XdsDecodeContext, filterChain: FilterChain__Output): boolean {
  if (filterChain.filters.length !== 1) {
    return false;
  }
  if (filterChain.filters[0].typed_config?.type_url !== HTTP_CONNECTION_MANGER_TYPE_URL) {
    return false;
  }
  const httpConnectionManager = decodeSingleResource(HTTP_CONNECTION_MANGER_TYPE_URL, filterChain.filters[0].typed_config.value);
  if (!validateHttpConnectionManager(httpConnectionManager)) {
    return false;
  }
  if (filterChain.transport_socket) {
    const transportSocket = filterChain.transport_socket;
    if (transportSocket.name !== 'envoy.transport_sockets.tls') {
      trace('Wrong transportSocket.name');
      return false;
    }
    if (!transportSocket.typed_config) {
      trace('No typed_config');
      return false;
    }
    if (transportSocket.typed_config?.type_url !== DOWNSTREAM_TLS_CONTEXT_TYPE_URL) {
      trace(`Wrong typed_config type_url: ${transportSocket.typed_config?.type_url}`);
      return false;
    }
    const downstreamTlsContext = decodeSingleResource(DOWNSTREAM_TLS_CONTEXT_TYPE_URL, transportSocket.typed_config.value);
    if (!downstreamTlsContext.common_tls_context) {
      trace('No common_tls_context');
      return false;
    }
    const commonTlsContext = downstreamTlsContext.common_tls_context;
    if (!commonTlsContext.tls_certificate_provider_instance) {
      trace('No tls_certificate_provider_instance');
      return false;
    }
    if (!(commonTlsContext.tls_certificate_provider_instance.instance_name in context.bootstrap.certificateProviders)) {
      trace('Unmatched tls_certificate_provider_instance instance_name');
      return false;
    }
    let validationContext: CertificateValidationContext__Output | null;
    switch (commonTlsContext.validation_context_type) {
      case 'validation_context_sds_secret_config':
        trace('Unexpected validation_context_sds_secret_config')
        return false;
      case 'validation_context':
        if (!commonTlsContext.validation_context) {
          trace('Missing validation_context');
          return false;
        }
        validationContext = commonTlsContext.validation_context;
        break;
      case 'combined_validation_context':
        if (!commonTlsContext.combined_validation_context) {
          trace('Missing combined_validation_context')
          return false;
        }
        validationContext = commonTlsContext.combined_validation_context.default_validation_context;
        break;
      default:
        return false;
    }
    if (validationContext?.ca_certificate_provider_instance && !(validationContext.ca_certificate_provider_instance.instance_name in context.bootstrap.certificateProviders)) {
      trace('Unmatched validationContext instance_name');
      return false;
    }
    if (downstreamTlsContext.require_client_certificate && !validationContext) {
      trace('require_client_certificate set without validationContext');
      return false;
    }
    if (commonTlsContext.tls_params) {
      trace('tls_params set');
      return false;
    }
    if (commonTlsContext.custom_handshaker) {
      trace('custom_handshaker set');
      return false;
    }
    if (downstreamTlsContext.require_sni?.value) {
      trace('require_sni set');
      return false;
    }
    if (downstreamTlsContext.ocsp_staple_policy !== 'LENIENT_STAPLING') {
      trace('Unexpected ocsp_staple_policy');
      return false;
    }
  }
  return true;
}

export class ListenerResourceType extends XdsResourceType {
  private static singleton: ListenerResourceType = new ListenerResourceType();
  private constructor() {
    super();
  }

  static get() {
    return ListenerResourceType.singleton;
  }
  getTypeUrl(): string {
    return 'envoy.config.listener.v3.Listener';
  }

  private validateResource(context: XdsDecodeContext, message: Listener__Output): Listener__Output | null {
    if (
      !(
        message.api_listener?.api_listener &&
        message.api_listener.api_listener.type_url === HTTP_CONNECTION_MANGER_TYPE_URL
      )
    ) {
      return null;
    }
    const httpConnectionManager = decodeSingleResource(HTTP_CONNECTION_MANGER_TYPE_URL, message.api_listener!.api_listener.value);
    if (!validateHttpConnectionManager(httpConnectionManager)) {
      return null;
    }
    if (message.listener_filters.length > 0) {
      return null;
    }
    if (message.use_original_dst?.value === true) {
      return null;
    }
    const seenMatches: NormalizedFilterChainMatch[] = [];
    for (const filterChain of message.filter_chains) {
      if (filterChain.filter_chain_match) {
        const normalizedMatches = normalizeFilterChainMatch(filterChain.filter_chain_match);
        for (const match of normalizedMatches) {
          if (seenMatches.some(prevMatch => normalizedFilterChainMatchEquals(match, prevMatch))) {
            return null;
          }
          seenMatches.push(match);
        }
      }
      if (!validateFilterChain(context, filterChain)) {
        return null;
      }
    }
    if (message.default_filter_chain && !validateFilterChain(context, message.default_filter_chain)) {
      return null;
    }
    return message;
  }

  decode(context: XdsDecodeContext, resource: Any__Output): XdsDecodeResult {
    if (resource.type_url !== LDS_TYPE_URL) {
      throw new Error(
        `ADS Error: Invalid resource type ${resource.type_url}, expected ${LDS_TYPE_URL}`
      );
    }
    const message = decodeSingleResource(LDS_TYPE_URL, resource.value);
    trace('Decoded raw resource of type ' + LDS_TYPE_URL + ': ' + JSON.stringify(message, (key, value) => (value && value.type === 'Buffer' && Array.isArray(value.data)) ? (value.data as Number[]).map(n => n.toString(16)).join('') : value, 2));
    const validatedMessage = this.validateResource(context, message);
    if (validatedMessage) {
      return {
        name: validatedMessage.name,
        value: validatedMessage
      };
    } else {
      return {
        name: message.name,
        error: 'Listener message validation failed'
      };
    }
  }

  allResourcesRequiredInSotW(): boolean {
    return true;
  }

  static startWatch(client: XdsClient, name: string, watcher: Watcher<Listener__Output>) {
    client.watchResource(ListenerResourceType.get(), name, watcher);
  }

  static cancelWatch(client: XdsClient, name: string, watcher: Watcher<Listener__Output>) {
    client.cancelResourceWatch(ListenerResourceType.get(), name, watcher);
  }
}
