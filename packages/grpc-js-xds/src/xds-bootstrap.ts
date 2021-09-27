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
  serverUri: string;
  channelCreds: ChannelCredsConfig[];
  serverFeatures: string[];
}

export interface BootstrapInfo {
  xdsServers: XdsServerConfig[];
  node: Node;
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
  if ('config' in obj) {
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

function validateXdsServerConfig(obj: any): XdsServerConfig {
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
  if (obj.channel_creds.length === 0) {
    throw new Error(
      'xds_servers.channel_creds field: at least one entry is required'
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
    serverUri: obj.server_uri,
    channelCreds: obj.channel_creds.map(validateChannelCredsConfig),
    serverFeatures: obj.server_features
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

function validateBootstrapFile(obj: any): BootstrapInfo {
  return {
    xdsServers: obj.xds_servers.map(validateXdsServerConfig),
    node: validateNode(obj.node),
  };
}

let loadedBootstrapInfo: Promise<BootstrapInfo> | null = null;

export async function loadBootstrapInfo(): Promise<BootstrapInfo> {
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
    loadedBootstrapInfo = new Promise((resolve, reject) => {
      fs.readFile(bootstrapPath, { encoding: 'utf8' }, (err, data) => {
        if (err) {
          reject(
            new Error(
              `Failed to read xDS bootstrap file from path ${bootstrapPath} with error ${err.message}`
            )
          );
        }
        try {
          const parsedFile = JSON.parse(data);
          resolve(validateBootstrapFile(parsedFile));
        } catch (e) {
          reject(
            new Error(
              `Failed to parse xDS bootstrap file at path ${bootstrapPath} with error ${e.message}`
            )
          );
        }
      });
    });
    return loadedBootstrapInfo;
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
      const loadedBootstrapInfoValue = validateBootstrapFile(parsedConfig);
      loadedBootstrapInfo = Promise.resolve(loadedBootstrapInfoValue);
    } catch (e) {
      throw new Error(
        `Failed to parse xDS bootstrap config from environment variable GRPC_XDS_BOOTSTRAP_CONFIG with error ${e.message}`
      );
    }

    return loadedBootstrapInfo;
  }

  return Promise.reject(
    new Error(
      'The GRPC_XDS_BOOTSTRAP or GRPC_XDS_BOOTSTRAP_CONFIG environment variables need to be set to the path to the bootstrap file to use xDS'
    )
  );
}
