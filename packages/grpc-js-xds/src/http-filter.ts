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
import { experimental, logVerbosity } from '@grpc/grpc-js';
import { Any__Output } from './generated/google/protobuf/Any';
import Filter = experimental.Filter;
import FilterFactory = experimental.FilterFactory;
import { TypedStruct__Output as TypedStruct__Output } from './generated/xds/type/v3/TypedStruct';
import { FilterConfig__Output } from './generated/envoy/config/route/v3/FilterConfig';
import { HttpFilter__Output } from './generated/envoy/extensions/filters/network/http_connection_manager/v3/HttpFilter';

const TRACER_NAME = 'http_filter';

function trace(text: string): void {
  experimental.trace(logVerbosity.DEBUG, TRACER_NAME, text);
}

const TYPED_STRUCT_UDPA_URL = 'type.googleapis.com/udpa.type.v1.TypedStruct';
const TYPED_STRUCT_UDPA_NAME = 'udpa.type.v1.TypedStruct';
const TYPED_STRUCT_XDS_URL = 'type.googleapis.com/xds.type.v3.TypedStruct';
const TYPED_STRUCT_XDS_NAME = 'xds.type.v3.TypedStruct';

const FILTER_CONFIG_URL = 'type.googleapis.com/envoy.config.route.v3.FilterConfig';
const FILTER_CONFIG_NAME = 'envoy.config.route.v3.FilterConfig';

const resourceRoot = loadProtosWithOptionsSync([
  'udpa/type/v1/typed_struct.proto',
  'xds/type/v3/typed_struct.proto',
  'envoy/config/route/v3/route_components.proto'], {
    keepCase: true,
    includeDirs: [
      // Paths are relative to src/build
      __dirname + '/../../deps/xds/',
      __dirname + '/../../deps/envoy-api/',
      __dirname + '/../../deps/protoc-gen-validate/'
    ],
  }
);

export interface HttpFilterConfig {
  typeUrl: string;
  config: any;
}

export interface HttpFilterFactoryConstructor<FilterType extends Filter> {
  new(config: HttpFilterConfig, overrideConfig?: HttpFilterConfig): FilterFactory<FilterType>;
}

export interface HttpFilterRegistryEntry {
  parseTopLevelFilterConfig(encodedConfig: Any__Output): HttpFilterConfig | null;
  parseOverrideFilterConfig(encodedConfig: Any__Output): HttpFilterConfig | null;
  httpFilterConstructor: HttpFilterFactoryConstructor<Filter>;
}

const FILTER_REGISTRY = new Map<string, HttpFilterRegistryEntry>();

export function registerHttpFilter(typeName: string, entry: HttpFilterRegistryEntry) {
  trace('Registered filter with type URL ' + typeName);
  FILTER_REGISTRY.set(typeName, entry);
}

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

export function getTopLevelFilterUrl(encodedConfig: Any__Output): string {
  let typeUrl: string;
  if (encodedConfig.type_url === TYPED_STRUCT_UDPA_URL || encodedConfig.type_url === TYPED_STRUCT_XDS_URL) {
    const typedStruct = parseAnyMessage<TypedStruct__Output>(encodedConfig)
    if (typedStruct) {
      return typedStruct.type_url;
    } else {
      throw new Error('Failed to parse TypedStruct');
    }
  } else {
    return encodedConfig.type_url;
  }
}

export function validateTopLevelFilter(httpFilter: HttpFilter__Output): boolean {
  if (!httpFilter.typed_config) {
    trace(httpFilter.name + ' validation failed: typed_config unset');
    return false;
  }
  const encodedConfig = httpFilter.typed_config;
  let typeUrl: string;
  try {
    typeUrl = getTopLevelFilterUrl(encodedConfig);
  } catch (e) {
    trace(httpFilter.name + ' validation failed with error ' + (e as Error).message);
    return false;
  }
  const registryEntry = FILTER_REGISTRY.get(typeUrl);
  if (registryEntry) {
    const parsedConfig = registryEntry.parseTopLevelFilterConfig(encodedConfig);
    if (parsedConfig === null) {
      trace(httpFilter.name + ' validation failed: config parsing failed');
    }
    return parsedConfig !== null;
  } else {
    if (httpFilter.is_optional) {
      return true;
    } else {
      trace(httpFilter.name + ' validation failed: filter is not optional and registry does not contain type URL ' + typeUrl);
      return false;
    }
  }
}

export function validateOverrideFilter(encodedConfig: Any__Output): boolean {
  let typeUrl: string;
  let realConfig: Any__Output;
  let isOptional = false;
  if (encodedConfig.type_url === FILTER_CONFIG_URL) {
    const filterConfig = parseAnyMessage<FilterConfig__Output>(encodedConfig);
    if (filterConfig) {
      isOptional = filterConfig.is_optional;
      if (filterConfig.config) {
        realConfig = filterConfig.config;
      } else {
        trace('Override filter validation failed: FilterConfig config field is empty');
        return false;
      }
    } else {
      trace('Override filter validation failed: failed to parse FilterConfig message');
      return false;
    }
  } else {
    realConfig = encodedConfig;
  }
  if (realConfig.type_url === TYPED_STRUCT_UDPA_URL || realConfig.type_url === TYPED_STRUCT_XDS_URL) {
    const typedStruct = parseAnyMessage<TypedStruct__Output>(encodedConfig);
    if (typedStruct) {
      typeUrl = typedStruct.type_url;
    } else {
      trace('Override filter validation failed: failed to parse TypedStruct message');
      return false;
    }
  } else {
    typeUrl = realConfig.type_url;
  }
  const registryEntry = FILTER_REGISTRY.get(typeUrl);
  if (registryEntry) {
    const parsedConfig = registryEntry.parseOverrideFilterConfig(encodedConfig);
    if (parsedConfig === null) {
      trace('Override filter validation failed: config parsing failed. Type URL: ' + typeUrl);
    }
    return parsedConfig !== null;
  } else {
    if (isOptional) {
      return true;
    } else {
      trace('Override filter validation failed: filter is not optional and registry does not contain type URL ' + typeUrl);
      return false;
    }
  }
}

export function parseTopLevelFilterConfig(encodedConfig: Any__Output) {
  let typeUrl: string;
  try {
    typeUrl = getTopLevelFilterUrl(encodedConfig);
  } catch (e) {
    return null;
  }
  const registryEntry = FILTER_REGISTRY.get(typeUrl);
  if (registryEntry) {
    return registryEntry.parseTopLevelFilterConfig(encodedConfig);
  } else {
    // Filter type URL not found in registry
    return null;
  }
}

export function parseOverrideFilterConfig(encodedConfig: Any__Output) {
  let typeUrl: string;
  let realConfig: Any__Output;
  if (encodedConfig.type_url === FILTER_CONFIG_URL) {
    const filterConfig = parseAnyMessage<FilterConfig__Output>(encodedConfig);
    if (filterConfig) {
      if (filterConfig.config) {
        realConfig = filterConfig.config;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } else {
    realConfig = encodedConfig;
  }
  if (realConfig.type_url === TYPED_STRUCT_UDPA_URL || realConfig.type_url === TYPED_STRUCT_XDS_URL) {
    const typedStruct = parseAnyMessage<TypedStruct__Output>(encodedConfig);
    if (typedStruct) {
      typeUrl = typedStruct.type_url;
    } else {
      return null;
    }
  } else {
    typeUrl = realConfig.type_url;
  }
  const registryEntry = FILTER_REGISTRY.get(typeUrl);
  if (registryEntry) {
    return registryEntry.parseOverrideFilterConfig(encodedConfig);
  } else {
    return null;
  }
}

export function createHttpFilter(config: HttpFilterConfig, overrideConfig?: HttpFilterConfig): FilterFactory<Filter> | null {
  const registryEntry = FILTER_REGISTRY.get(config.typeUrl);
  if (registryEntry) {
    return new registryEntry.httpFilterConstructor(config, overrideConfig);
  } else {
    return null;
  }
}
