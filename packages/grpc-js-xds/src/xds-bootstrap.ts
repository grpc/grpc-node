/*
 * Copyright 2020 gRPC authors.
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

import * as fs from 'fs';
import { EXPERIMENTAL_FEDERATION } from './environment';
import { Struct } from './generated/google/protobuf/Struct';
import { Value } from './generated/google/protobuf/Value';

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Locality {
  region?: string;
  zone?: string;
  sub_zone?: string;
}

export interface Node {
  id: string,
  locality: Locality;
  cluster?: string;
  metadata?: Struct;
}

export interface ChannelCredsConfig {
  type: string;
  config?: object;
}

export interface XdsServerConfig {
  server_uri: string;
  channel_creds: ChannelCredsConfig[];
  server_features: string[];
}

export interface Authority {
  clientListenerResourceNameTemplate: string;
  xdsServers?: XdsServerConfig[];
}

export interface BootstrapInfo {
  xdsServers: XdsServerConfig[];
  node: Node;
  authorities: {[authorityName: string]: Authority};
  clientDefaultListenerResourceNameTemplate: string;
}

const KNOWN_SERVER_FEATURES = ['ignore_resource_deletion'];

export function serverConfigEqual(config1: XdsServerConfig, config2: XdsServerConfig): boolean {
  if (config1.server_uri !== config2.server_uri) {
    return false;
  }
  for (const feature of KNOWN_SERVER_FEATURES) {
    if ((feature in config1.server_features) !== (feature in config2.server_features)) {
      return false;
    }
  }
  if (config1.channel_creds.length !== config2.channel_creds.length) {
    return false;
  }
  for (const [index, creds1] of config1.channel_creds.entries()) {
    const creds2 = config2.channel_creds[index];
    if (creds1.type !== creds2.type) {
      return false;
    }
    if (JSON.stringify(creds1) !== JSON.stringify(creds2)) {
      return false;
    }
  }
  return true;
}

function validateChannelCredsConfig(obj: any): ChannelCredsConfig {
  if (!('type' in obj)) {
    throw new Error('type field missing in xds_servers.channel_creds element');
  }
  if (typeof obj.type !== 'string') {
    throw new Error(
      `xds_servers.channel_creds.type field: expected string, got ${typeof obj.type}`
    );
  }
  if ('config' in obj && obj.config !== undefined) {
    if (typeof obj.config !== 'object' || obj.config === null) {
      throw new Error(
        'xds_servers.channel_creds config field must be an object if provided'
      );
    }
  }
  return {
    type: obj.type,
    config: obj.config,
  };
}

const SUPPORTED_CHANNEL_CREDS_TYPES = [
  'google_default',
  'insecure'
];

export function validateXdsServerConfig(obj: any): XdsServerConfig {
  if (!(typeof obj === 'object' && obj !== null)) {
    throw new Error('xDS server config must be an object');
  }
  if (!('server_uri' in obj)) {
    throw new Error('server_uri field missing in xds_servers element');
  }
  if (typeof obj.server_uri !== 'string') {
    throw new Error(
      `xds_servers.server_uri field: expected string, got ${typeof obj.server_uri}`
    );
  }
  if (!('channel_creds' in obj)) {
    throw new Error('channel_creds missing in xds_servers element');
  }
  if (!Array.isArray(obj.channel_creds)) {
    throw new Error(
      `xds_servers.channel_creds field: expected array, got ${typeof obj.channel_creds}`
    );
  }
  let foundSupported = false;
  for (const cred of obj.channel_creds) {
    if (SUPPORTED_CHANNEL_CREDS_TYPES.includes(cred.type)) {
      foundSupported = true;
    }
  }
  if (!foundSupported) {
    throw new Error(
      `xds_servers.channel_creds field: must contain at least one entry with a type in [${SUPPORTED_CHANNEL_CREDS_TYPES}]`
    );
  }
  if ('server_features' in obj) {
    if (!Array.isArray(obj.server_features)) {
      throw new Error(
        `xds_servers.server_features field: expected array, got ${typeof obj.server_features}`
      );
    }
    for (const feature of obj.server_features) {
      if (typeof feature !== 'string') {
        `xds_servers.server_features field element: expected string, got ${typeof feature}`
      }
    }
  }
  return {
    server_uri: obj.server_uri,
    channel_creds: obj.channel_creds.map(validateChannelCredsConfig),
    server_features: obj.server_features ?? []
  };
}

function validateValue(obj: any): Value {
  if (Array.isArray(obj)) {
    return {
      kind: 'listValue',
      listValue: {
        values: obj.map((value) => validateValue(value)),
      },
    };
  } else {
    switch (typeof obj) {
      case 'boolean':
        return {
          kind: 'boolValue',
          boolValue: obj,
        };
      case 'number':
        return {
          kind: 'numberValue',
          numberValue: obj,
        };
      case 'string':
        return {
          kind: 'stringValue',
          stringValue: obj,
        };
      case 'object':
        if (obj === null) {
          return {
            kind: 'nullValue',
            nullValue: 'NULL_VALUE',
          };
        } else {
          return {
            kind: 'structValue',
            structValue: getStructFromJson(obj),
          };
        }
      default:
        throw new Error(`Could not handle struct value of type ${typeof obj}`);
    }
  }
}

function getStructFromJson(obj: any): Struct {
  if (typeof obj !== 'object' || obj === null) {
    throw new Error('Invalid JSON object for Struct field');
  }
  const fields: { [key: string]: Value } = {};
  for (const [fieldName, value] of Object.entries(obj)) {
    fields[fieldName] = validateValue(value);
  }
  return {
    fields,
  };
}

/**
 * Validate that the input obj is a valid Node proto message. Only checks the
 * fields we expect to see: id, cluster, locality, and metadata.
 * @param obj
 */
function validateNode(obj: any): Node {
  const result: Node = {
    id: '',
    locality: {}
  };
  if (!('id' in obj)) {
    throw new Error('id field missing in node element');
  }
  if (typeof obj.id !== 'string') {
    throw new Error(`node.id field: expected string, got ${typeof obj.id}`);
  }
  result.id = obj.id;
  if (!('locality' in obj)) {
    throw new Error('locality field missing in node element');
  }
  result.locality = {};
  if ('region' in obj.locality) {
    if (typeof obj.locality.region !== 'string') {
      throw new Error(
        `node.locality.region field: expected string, got ${typeof obj.locality
          .region}`
      );
    }
    result.locality.region = obj.locality.region;
  }
  if ('zone' in obj.locality) {
    if (typeof obj.locality.zone !== 'string') {
      throw new Error(
        `node.locality.zone field: expected string, got ${typeof obj.locality
          .zone}`
      );
    }
    result.locality.zone = obj.locality.zone;
  }
  if ('sub_zone' in obj.locality) {
    if (typeof obj.locality.sub_zone !== 'string') {
      throw new Error(
        `node.locality.sub_zone field: expected string, got ${typeof obj
          .locality.sub_zone}`
      );
    }
    result.locality.sub_zone = obj.locality.sub_zone;
  }
  if ('cluster' in obj) {
    if (typeof obj.cluster !== 'string') {
      throw new Error(
        `node.cluster field: expected string, got ${typeof obj.cluster}`
      );
    }
    result.cluster = obj.cluster;
  }
  if ('metadata' in obj) {
    result.metadata = getStructFromJson(obj.metadata);
  }
  return result;
}

function validateAuthority(obj: any, authorityName: string): Authority {
  if ('client_listener_resource_name_template' in obj) {
    if (typeof obj.client_listener_resource_name_template !== 'string') {
      throw new Error(`authorities[${authorityName}].client_listener_resource_name_template: expected string, got ${typeof obj.client_listener_resource_name_template}`);
    }
    if (!obj.client_listener_resource_name_template.startsWith(`xdstp://${authorityName}/`)) {
      throw new Error(`authorities[${authorityName}].client_listener_resource_name_template must start with "xdstp://${authorityName}/"`);
    }
  }
  return {
    clientListenerResourceNameTemplate: obj.client_listener_resource_name_template ?? `xdstp://${authorityName}/envoy.config.listener.v3.Listener/%s`,
    xdsServers: obj.xds_servers?.map(validateXdsServerConfig)
  };
}

function validateAuthoritiesMap(obj: any): {[authorityName: string]: Authority} {
  if (!obj) {
    return {};
  }
  const result: {[authorityName: string]: Authority} = {};
  for (const [name, authority] of Object.entries(obj)) {
    result[name] = validateAuthority(authority, name);
  }
  return result;
}

export function validateBootstrapConfig(obj: any): BootstrapInfo {
  const xdsServers = obj.xds_servers.map(validateXdsServerConfig);
  const node = validateNode(obj.node);
  if (EXPERIMENTAL_FEDERATION) {
    if ('client_default_listener_resource_name_template' in obj) {
      if (typeof obj.client_default_listener_resource_name_template !== 'string') {
        throw new Error(`client_default_listener_resource_name_template: expected string, got ${typeof obj.client_default_listener_resource_name_template}`);
      }
    }
    return {
      xdsServers: xdsServers,
      node: node,
      authorities: validateAuthoritiesMap(obj.authorities),
      clientDefaultListenerResourceNameTemplate: obj.client_default_listener_resource_name_template ?? '%s'
    };
  } else {
    return {
      xdsServers: xdsServers,
      node: node,
      authorities: {},
      clientDefaultListenerResourceNameTemplate: '%s'
    };
  }
}

let loadedBootstrapInfo: BootstrapInfo | null = null;

/**
 * Load the bootstrap information from the location determined by the
 * GRPC_XDS_BOOTSTRAP environment variable, or if that is unset, from the
 * GRPC_XDS_BOOTSTRAP_CONFIG environment variable. The value is cached, so any
 * calls after the first will just return the cached value.
 * @returns
 */
export function loadBootstrapInfo(): BootstrapInfo {
  if (loadedBootstrapInfo !== null) {
    return loadedBootstrapInfo;
  }

  /**
   * If GRPC_XDS_BOOTSTRAP exists
   *  then use its value as the name of the bootstrap file.
   *
   * If the file is missing or the contents of the file are malformed,
   *  return an error.
   */
  const bootstrapPath = process.env.GRPC_XDS_BOOTSTRAP;
  if (bootstrapPath) {
    let rawBootstrap: string;
    try {
      rawBootstrap = fs.readFileSync(bootstrapPath, { encoding: 'utf8'});
    } catch (e) {
      throw new Error(`Failed to read xDS bootstrap file from path ${bootstrapPath} with error ${(e as Error).message}`);
    }
    try {
      const parsedFile = JSON.parse(rawBootstrap);
      loadedBootstrapInfo = validateBootstrapConfig(parsedFile);
      return loadedBootstrapInfo;
    } catch (e) {
      throw new Error(`Failed to parse xDS bootstrap file at path ${bootstrapPath} with error ${(e as Error).message}`)
    }
  }

  /**
   * Else, if GRPC_XDS_BOOTSTRAP_CONFIG exists
   *  then use its value as the bootstrap config.
   *
   * If the value is malformed, return an error.
   *
   * See: https://github.com/grpc/grpc-node/issues/1868
   */
  const bootstrapConfig = process.env.GRPC_XDS_BOOTSTRAP_CONFIG;
  if (bootstrapConfig) {
    try {
      const parsedConfig = JSON.parse(bootstrapConfig);
      loadedBootstrapInfo = validateBootstrapConfig(parsedConfig);
    } catch (e) {
      throw new Error(
        `Failed to parse xDS bootstrap config from environment variable GRPC_XDS_BOOTSTRAP_CONFIG with error ${(e as Error).message}`
      );
    }

    return loadedBootstrapInfo;
  }


  throw new Error(
    'The GRPC_XDS_BOOTSTRAP or GRPC_XDS_BOOTSTRAP_CONFIG environment variables need to be set to the path to the bootstrap file to use xDS'
  );
}
