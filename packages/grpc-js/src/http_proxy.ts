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
 *
 */

import { URL, parse } from "url";
import { log } from "./logging";
import { LogVerbosity } from "./constants";
import { parseTarget } from "./resolver-dns";
import { Socket } from "net";
import * as http from 'http';
import * as logging from './logging';
import { SubchannelAddress, TcpSubchannelAddress, isTcpSubchannelAddress, subchannelAddressToString } from "./subchannel";

const TRACER_NAME = 'proxy';

function trace(text: string): void {
  logging.trace(LogVerbosity.DEBUG, TRACER_NAME, text);
}

interface ProxyInfo {
  hostname?: string;
  port?: number;
  creds?: string;
}

function getAddressString(proxyInfo: ProxyInfo): string {
  if (proxyInfo.hostname !== undefined) {
    if (proxyInfo.port !== undefined) {
      return proxyInfo.hostname + ':' + proxyInfo.port;
    } else {
      return proxyInfo.hostname;
    }
  } else {
    return '';
  }
}

function getProxyInfo(): ProxyInfo {
  let proxyEnv: string = '';
  let envVar: string = '';
  /* Prefer using 'grpc_proxy'. Fallback on 'http_proxy' if it is not set.
   * Also prefer using 'https_proxy' with fallback on 'http_proxy'. The
   * fallback behavior can be removed if there's a demand for it.
   */
  if (process.env.grpc_proxy) {
    envVar = 'grpc_proxy';
    proxyEnv = process.env.grpc_proxy;
  } else if (process.env.https_proxy) {
    envVar = 'https_proxy';
    proxyEnv = process.env.https_proxy;
  } else if (process.env.http_proxy) {
    envVar = 'http_proxy';
    proxyEnv = process.env.http_proxy;
  } else {
    return {};
  }
  let proxyUrl: URL;
  try {
    proxyUrl = new URL(proxyEnv);
  } catch (e) {
    log(LogVerbosity.ERROR, `cannot parse value of "${envVar}" env var`);
    return {};
  }
  if (proxyUrl.protocol !== 'http:') {
    log(LogVerbosity.ERROR, `"${proxyUrl.protocol}" scheme not supported in proxy URI`);
    return {};
  }
  let userCred: string | null = null;
  if (proxyUrl.username) {
    if (proxyUrl.password) {
      log(LogVerbosity.INFO, 'userinfo found in proxy URI');
      userCred = `${proxyUrl.username}:${proxyUrl.password}`;
    } else {
      userCred = proxyUrl.username;
    }
  }
  const result: ProxyInfo = {
    hostname: proxyUrl.hostname
  };
  if (proxyUrl.port !== '') {
    result.port = Number(proxyUrl.port);
  }
  if (userCred) {
    result.creds = userCred;
  }
  trace('Proxy server ' + getAddressString(result) + ' set by environment variable ' + envVar);
  return result;
}

const PROXY_INFO = getProxyInfo();

function getNoProxyHostList(): string[] {
  /* Prefer using 'no_grpc_proxy'. Fallback on 'no_proxy' if it is not set. */
  let noProxyStr: string | undefined = process.env.no_grpc_proxy;
  let envVar: string = 'no_grpc_proxy';
  if (!noProxyStr) {
    noProxyStr = process.env.no_proxy;
    envVar = 'no_proxy';
  }
  if (noProxyStr) {
    trace('No proxy server list set by environment variable ' + envVar);
    return noProxyStr.split(',');
  } else {
    return [];
  }
}

const NO_PROXY_HOSTS = getNoProxyHostList();

export function shouldUseProxy(target: string): boolean {
  if (!PROXY_INFO.hostname) {
    return false;
  }
  let serverHost: string;
  const parsedTarget = parseTarget(target);
  if (parsedTarget) {
    serverHost = parsedTarget.host;
  } else {
    return false;
  }
  for (const host of NO_PROXY_HOSTS) {
    if (host === serverHost) {
      trace('Not using proxy for target in no_proxy list: ' + target);
      return false;
    }
  }
  return true;
}

export function getProxiedConnection(target: string, subchannelAddress: SubchannelAddress): Promise<Socket> {
  if (!(PROXY_INFO.hostname && shouldUseProxy(target) && isTcpSubchannelAddress(subchannelAddress))) {
    return Promise.reject<Socket>();
  }
  const subchannelAddressPathString = subchannelAddressToString(subchannelAddress);
  trace('Using proxy ' + getAddressString(PROXY_INFO) + ' to connect to ' + target + ' at ' + subchannelAddressPathString);
  const options: http.RequestOptions = {
    method: 'CONNECT',
    host: PROXY_INFO.hostname,
    port: PROXY_INFO.port,
    path: subchannelAddressPathString
  };
  if (PROXY_INFO.creds) {
    options.headers = {
      'Proxy-Authorization': 'Basic ' + Buffer.from(PROXY_INFO.creds).toString('base64')
    };
  }
  return new Promise<Socket>((resolve, reject) => {
    const request = http.request(options);
    request.once('connect', (res, socket, head) => {
      request.removeAllListeners();
      socket.removeAllListeners();
      if (res.statusCode === 200) {
        trace('Successfully connected to ' + subchannelAddressPathString + ' through proxy ' + getAddressString(PROXY_INFO));
        resolve(socket);
      } else {
        log(LogVerbosity.ERROR, 'Failed to connect to ' + subchannelAddressPathString + ' through proxy ' + getAddressString(PROXY_INFO) + ' with status ' + res.statusCode);
        reject();
      }
    });
    request.once('error', (err) => {
      request.removeAllListeners();
      log(LogVerbosity.ERROR, 'Failed to connect to proxy ' + getAddressString(PROXY_INFO) + ' with error ' + err.message);
      reject();
    });
    request.end();
  });
}
