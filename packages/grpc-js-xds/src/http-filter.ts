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
import { experimental } from '@grpc/grpc-js';
import { Any__Output } from './generated/google/protobuf/Any';
import Filter = experimental.Filter;
import FilterFactory = experimental.FilterFactory;
import { TypedStruct__Output } from './generated/udpa/type/v1/TypedStruct';
import { FilterConfig__Output } from './generated/envoy/config/route/v3/FilterConfig';
import { HttpFilter__Output } from './generated/envoy/extensions/filters/network/http_connection_manager/v3/HttpFilter';

const TYPED_STRUCT_URL = 'type.googleapis.com/udpa.type.v1.TypedStruct';
const TYPED_STRUCT_NAME = 'udpa.type.v1.TypedStruct';

const FILTER_CONFIG_URL = 'type.googleapis.com/envoy.config.route.v3.FilterConfig';
const FILTER_CONFIG_NAME = 'envoy.config.route.v3.FilterConfig';

const resourceRoot = loadProtosWithOptionsSync([
  'udpa/type/v1/typed_struct.proto',
  'envoy/config/route/v3/route_components.proto'], {
    keepCase: true,
    includeDirs: [
      // Paths are relative to src/build
      __dirname + '/../../deps/udpa/',
      __dirname + '/../../deps/envoy-api/'
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
  FILTER_REGISTRY.set(typeName, entry);
}

const toObjectOptions = {
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
}

function parseAnyMessage<MessageType>(message: Any__Output): MessageType | null {
  const messageType = resourceRoot.lookup(message.type_url);
  if (messageType) {
    const decodedMessage = (messageType as any).decode(message.value);
    return decodedMessage.$type.toObject(decodedMessage, toObjectOptions) as MessageType;
  } else {
    return null;
  }
}

function getTopLevelFilterUrl(encodedConfig: Any__Output): string {
  let typeUrl: string;
  if (encodedConfig.type_url === TYPED_STRUCT_URL) {
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
    return false;
  }
  const encodedConfig = httpFilter.typed_config;
  let typeUrl: string;
  try {
    typeUrl = getTopLevelFilterUrl(encodedConfig);
  } catch (e) {
    return false;
  }
  const registryEntry = FILTER_REGISTRY.get(typeUrl);
  if (registryEntry) {
    const parsedConfig = registryEntry.parseTopLevelFilterConfig(encodedConfig);
    return parsedConfig !== null;
  } else {
    if (httpFilter.is_optional) {
      return true;
    } else {
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
        return false;
      }
    } else {
      return false;
    }
  } else {
    realConfig = encodedConfig;
  }
  if (realConfig.type_url === TYPED_STRUCT_URL) {
    const typedStruct = parseAnyMessage<TypedStruct__Output>(encodedConfig);
    if (typedStruct) {
      typeUrl = typedStruct.type_url;
    } else {
      return false;
    }
  } else {
    typeUrl = realConfig.type_url;
  }
  const registryEntry = FILTER_REGISTRY.get(typeUrl);
  if (registryEntry) {
    const parsedConfig = registryEntry.parseOverrideFilterConfig(encodedConfig);
    return parsedConfig !== null;
  } else {
    if (isOptional) {
      return true;
    } else {
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
  if (realConfig.type_url === TYPED_STRUCT_URL) {
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