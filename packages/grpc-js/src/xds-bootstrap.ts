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
import * as adsTypes from './generated/ads';

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ChannelCredsConfig {
  type: string;
  config?: object;
}

export interface XdsServerConfig {
  serverUri: string;
  channelCreds: ChannelCredsConfig[];
}

export interface BootstrapInfo {
  xdsServers: XdsServerConfig[];
  node: adsTypes.messages.envoy.api.v2.core.Node;
}

function validateChannelCredsConfig(obj: any): ChannelCredsConfig {
  if (!('type' in obj)) {
    throw new Error('type field missing in xds_servers.channel_creds element');
  }
  if (typeof obj.type !== 'string') {
    throw new Error(`xds_servers.channel_creds.type field: expected string, got ${typeof obj.type}`);
  }
  if ('config' in obj) {
    if (typeof obj.config !== 'object' || obj.config === null) {
      throw new Error('xds_servers.channel_creds config field must be an object if provided');
    }
  }
  return {
    type: obj.type,
    config: obj.config
  }
}

function validateXdsServerConfig(obj: any): XdsServerConfig {
  if (!('server_uri' in obj)) {
    throw new Error('server_uri field missing in xds_servers element');
  }
  if (typeof obj.server_uri !== 'string') {
    throw new Error(`xds_servers.server_uri field: expected string, got ${typeof obj.server_uri}`);
  }
  if (!('channel_creds' in obj)) {
    throw new Error('channel_creds missing in xds_servers element');
  }
  if (!Array.isArray(obj.channel_creds)) {
    throw new Error(`xds_servers.channel_creds field: expected array, got ${typeof obj.channel_creds}`);
  }
  if (obj.channel_creds.length === 0) {
    throw new Error('xds_servers.channel_creds field: at least one entry is required');
  }
  return {
    serverUri: obj.server_uri,
    channelCreds: obj.channel_creds.map(validateChannelCredsConfig)
  };
}

function validateNode(obj: any): adsTypes.messages.envoy.api.v2.core.Node {
  throw new Error('Not implemented');
}

function validateBootstrapFile(obj: any): BootstrapInfo {
  return {
    xdsServers: obj.xds_servers.map(validateXdsServerConfig),
    node: validateNode(obj.node)
  }
}

let loadedBootstrapInfo: Promise<BootstrapInfo> | null = null;
 
export async function loadBootstrapInfo(): Promise<BootstrapInfo> {
  if (loadedBootstrapInfo !== null) {
    return loadedBootstrapInfo;
  }
  const bootstrapPath = process.env.GRPC_XDS_BOOTSTRAP;
  if (bootstrapPath === undefined) {
    return Promise.reject(new Error('GRPC_XDS_BOOTSTRAP environment variable needs to be set to the path to the bootstrap file to use xDS'));
  }
  loadedBootstrapInfo = new Promise((resolve, reject) => {
    fs.readFile(bootstrapPath, { encoding: 'utf8'}, (err, data) => {
      if (err) {
        reject(new Error(`Failed to read xDS bootstrap file from path ${bootstrapPath} with error ${err.message}`));
      }
      try {
        const parsedFile = JSON.parse(data);
        resolve(validateBootstrapFile(parsedFile));
      } catch (e) {
        reject(new Error(`Failed to parse xDS bootstrap file at path ${bootstrapPath} with error ${e.message}`));
      }
    });
  });
  return loadedBootstrapInfo;
}