/*
 * Copyright 2021 gRPC authors.
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

// This is a non-public, unstable API, but it's very convenient
import { loadProtosWithOptionsSync } from '@grpc/proto-loader/build/src/util';
import { experimental, logVerbosity, ServerInterceptingCall, ServerInterceptor, ServerListener, status } from '@grpc/grpc-js';
import { Any__Output } from '../generated/google/protobuf/Any';
import { HttpFilterConfig, registerHttpFilter } from '../http-filter';
import { RbacPolicyGroup, UnifiedInfo as UnifiedRbacInfo } from '../rbac';
import { RBAC__Output } from '../generated/envoy/extensions/filters/http/rbac/v3/RBAC';
import { RBACPerRoute__Output } from '../generated/envoy/extensions/filters/http/rbac/v3/RBACPerRoute';
import { parseConfig as parseRbacConfig } from '../rbac';
import { EXPERIMENTAL_RBAC } from '../environment';

const TRACER_NAME = 'rbac_filter';

function trace(text: string): void {
  experimental.trace(logVerbosity.DEBUG, TRACER_NAME, text);
}

const resourceRoot = loadProtosWithOptionsSync([
  'envoy/extensions/filters/http/rbac/v3/rbac.proto'], {
    keepCase: true,
    includeDirs: [
      // Paths are relative to src/build/http-filter
      __dirname + '/../../../deps/xds/',
      __dirname + '/../../../deps/envoy-api/',
      __dirname + '/../../../deps/protoc-gen-validate/',
      __dirname + '/../../../deps/googleapis/'
    ],
  }
);

const RBAC_FILTER_URL = 'type.googleapis.com/envoy.extensions.filters.http.rbac.v3.RBAC';
const RBAC_FILTER_OVERRIDE_URL ='type.googleapis.com/envoy.extensions.filters.http.rbac.v3.RBACPerRoute';

const toObjectOptions = {
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
}

function parseAnyMessage<MessageType>(message: Any__Output): MessageType | null {
  const typeName = message.type_url.substring(message.type_url.lastIndexOf('/') + 1);
  const messageType = resourceRoot.lookup(typeName);
  if (messageType) {
    const decodedMessage = (messageType as any).decode(message.value);
    return decodedMessage.$type.toObject(decodedMessage, toObjectOptions) as MessageType;
  } else {
    return null;
  }
}

interface RbacFilterConfig extends HttpFilterConfig {
  typeUrl: 'type.googleapis.com/envoy.extensions.filters.http.rbac.v3.RBAC';
  config: RbacPolicyGroup;
}

function parseTopLevelRbacConfig(encodedConfig: Any__Output): RbacFilterConfig | null {
  if (encodedConfig.type_url !== RBAC_FILTER_URL) {
    trace('Config parsing failed: unexpected type URL: ' + encodedConfig.type_url);
    return null;
  }
  const parsedMessage = parseAnyMessage<RBAC__Output>(encodedConfig);
  if (parsedMessage === null) {
    trace('Config parsing failed: failed to parse RBAC message');
    return null;
  }
  trace('Parsing RBAC message ' + JSON.stringify(parsedMessage, undefined, 2));
  if (!parsedMessage.rules) {
    trace('Config parsing failed: no rules found');
    return null;
  }
  try {
    return {
      typeUrl: RBAC_FILTER_URL,
      config: parseRbacConfig(parsedMessage.rules)
    };
  } catch (e) {
    trace('Config parsing failed: ' + (e as Error).message);
    return null;
  }
}

function parseOverrideRbacConfig(encodedConfig: Any__Output): RbacFilterConfig | null {
  if (encodedConfig.type_url !== RBAC_FILTER_OVERRIDE_URL) {
    trace('Config parsing failed: unexpected type URL: ' + encodedConfig.type_url);
    return null;
  }
  const parsedMessage = parseAnyMessage<RBACPerRoute__Output>(encodedConfig);
  if (parsedMessage === null) {
    trace('Config parsing failed: failed to parse RBACPerRoute message');
    return null;
  }
  trace('Parsing RBAC message ' + JSON.stringify(parsedMessage, undefined, 2));
  if (!parsedMessage.rbac?.rules) {
    trace('Config parsing failed: no rules found');
    return null;
  }
  try {
    return {
      typeUrl: RBAC_FILTER_URL,
      config: parseRbacConfig(parsedMessage.rbac.rules)
    };
  } catch (e) {
    trace('Config parsing failed: ' + (e as Error).message);
    return null;
  }
}

function createRbacServerFilter(config: HttpFilterConfig, overrideConfigMap: Map<string, HttpFilterConfig>): ServerInterceptor {
  return function rbacServerFilter(methodDescriptor, call): ServerInterceptingCall {
    const listener: ServerListener = {
      onReceiveMetadata: (metadata, next) => {
        let activeConfig = config;
        const routeName = metadata.get('grpc-route')[0];
        if (routeName) {
          const overrideConfig = overrideConfigMap.get(routeName as string);
          if (overrideConfig) {
            activeConfig = overrideConfig;
          }
        }
        const rbacMetadata = metadata.clone();
        rbacMetadata.set(':method', 'POST');
        rbacMetadata.set(':authority', call.getHost());
        rbacMetadata.set(':path', methodDescriptor.path);
        const connectionInfo = call.getConnectionInfo();
        const authContext = call.getAuthContext();
        const info: UnifiedRbacInfo = {
          destinationIp: connectionInfo.localAddress!,
          destinationPort: connectionInfo.localPort!,
          sourceIp: connectionInfo.remoteAddress!,
          headers: rbacMetadata,
          tls: authContext.transportSecurityType !== undefined,
          peerCertificate: authContext.sslPeerCertificate ?? null,
          urlPath: methodDescriptor.path
        };
        if ((activeConfig as RbacFilterConfig).config.apply(info)) {
          next(metadata);
        } else {
          call.sendStatus({code: status.PERMISSION_DENIED, details: 'Unauthorized RPC rejected'});
        }
      }
    };
    return new ServerInterceptingCall(call, {
      start: next => {
        next(listener);
      }
    });
  }
}

export function setup() {
  if (EXPERIMENTAL_RBAC) {
    registerHttpFilter(RBAC_FILTER_URL, {
      parseTopLevelFilterConfig: parseTopLevelRbacConfig,
      parseOverrideFilterConfig: parseOverrideRbacConfig,
      createServerFilter: createRbacServerFilter
    });
  }
}
