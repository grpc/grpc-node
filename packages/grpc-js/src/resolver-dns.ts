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

import { Resolver, ResolverListener, registerResolver, registerDefaultResolver } from './resolver';
import * as dns from 'dns';
import * as util from 'util';
import { extractAndSelectServiceConfig, ServiceConfig } from './service-config';
import { ServiceError } from './call';
import { Status } from './constants';
import { StatusObject } from './call-stream';
import { Metadata } from './metadata';

/* These regular expressions match IP addresses with optional ports in different
 * formats. In each case, capture group 1 contains the address, and capture
 * group 2 contains the port number, if present */
/**
 * Matches 4 groups of up to 3 digits each, separated by periods, optionally
 * followed by a colon and a number.
 */
const IPv4_REGEX = /^(\d{1,3}(?:\.\d{1,3}){3})(?::(\d+))?$/;
/**
 * Matches any number of groups of up to 4 hex digits (case insensitive)
 * separated by 1 or more colons. This variant does not match a port number.
 */
const IPv6_REGEX = /^([0-9a-f]{0,4}(?::{1,2}[0-9a-f]{0,4})+)$/i;
/**
 * Matches the same as the IPv6_REGEX, surrounded by square brackets, and
 * optionally followed by a colon and a number.
 */
const IPv6_BRACKET_REGEX = /^\[([0-9a-f]{0,4}(?::{1,2}[0-9a-f]{0,4})+)\](?::(\d+))?$/i;

/**
 * Matches `[dns:][//authority/]host[:port]`, where `authority` and `host` are
 * both arbitrary sequences of alphanumeric characters and `port` is a sequence
 * of digits. Group 1 contains the hostname and group 2 contains the port
 * number if provided.
 */
const DNS_REGEX = /^(?:dns:)?(?:\/\/\w+\/)?(\w+)(?::(\d+))?$/;

/**
 * The default TCP port to connect to if not explicitly specified in the target.
 */
const DEFAULT_PORT = '443';

const resolve4Promise = util.promisify(dns.resolve4);
const resolve6Promise = util.promisify(dns.resolve6);

/**
 * Attempt to parse a target string as an IP address
 * @param target 
 * @return An "IP:port" string if parsing was successful, `null` otherwise
 */
function parseIP(target: string): string | null {
  /* These three regular expressions are all mutually exclusive, so we just
   * want the first one that matches the target string, if any do. */
  const match = IPv4_REGEX.exec(target) || IPv6_REGEX.exec(target) || IPv6_BRACKET_REGEX.exec(target);
  if (match === null) {
    return null;
  }
  const addr = match[1];
  let port: string;
  if (match[2]) {
    port = match[2];
  } else {
    port = DEFAULT_PORT;
  }
  return `${addr}:${port}`;
}

/**
 * Merge any number of arrays into a single alternating array
 * @param arrays 
 */
function mergeArrays<T>(...arrays: T[][]): T[] {
  const result: T[] = [];
  for(let i = 0; i<Math.max.apply(null, arrays.map((array)=> array.length)); i++) {
    for(let array of arrays) {
      if(i < array.length) {
        result.push(array[i]);
      }
    }
  }
  return result;
}

/**
 * Resolver implementation that handles DNS names and IP addresses.
 */
class DnsResolver implements Resolver {
  private readonly ipResult: string | null;
  private readonly dnsHostname: string | null;
  private readonly port: string | null;
  /* The promise results here contain, in order, the A record, the AAAA record,
   * and either the TXT record or an error if TXT resolution failed */
  pendingResultPromise: Promise<[string[], string[], string[][] | Error]> | null = null;
  percentage: number;
  constructor(private target: string, private listener: ResolverListener) {
    this.ipResult = parseIP(target);
    const dnsMatch = DNS_REGEX.exec(target);
    if (dnsMatch === null) {
      this.dnsHostname = null;
      this.port = null;
    } else {
      this.dnsHostname = dnsMatch[1];
      if (dnsMatch[2]) {
        this.port = dnsMatch[2];
      } else {
        this.port = DEFAULT_PORT;
      }
    }
    this.percentage = Math.random() * 100;
  }

  /**
   * If the target is an IP address, just provide that address as a result.
   * Otherwise, initiate A, AAAA, and TXT 
   */
  private startResolution() {
    if (this.ipResult !== null) {
      setImmediate(() => {
        this.listener.onSuccessfulResolution([this.ipResult!], null, null);
      });
      return;
    }
    if (this.dnsHostname !== null) {
      const hostname: string = this.dnsHostname;
      const Aresult = resolve4Promise(hostname);
      const AAAAresult = resolve6Promise(hostname);
      /* We handle the TXT query promise differently than the others because
       * the name resolution attempt as a whole is a success even if the TXT
       * lookup fails */
      const TXTresult = new Promise<string[][] | Error>((resolve, reject) => {
        dns.resolveTxt(hostname, (err, records) => {
          if (err) {
            resolve(err);
          } else {
            resolve(records);
          }
        });
      });
      this.pendingResultPromise = Promise.all([Aresult, AAAAresult, TXTresult]);
      this.pendingResultPromise.then(([Arecord, AAAArecord, TXTrecord]) => {
        this.pendingResultPromise = null;
        Arecord = Arecord.map((value) => `${value}:${this.port}`);
        AAAArecord = AAAArecord.map((value) => `[${value}]:${this.port}`);
        const allAddresses: string[] = mergeArrays(AAAArecord, Arecord);
        let serviceConfig: ServiceConfig | null = null;
        let serviceConfigError: StatusObject | null = null;
        if (TXTrecord instanceof Error) {
          serviceConfigError = {
            code: Status.UNAVAILABLE,
            details: 'TXT query failed',
            metadata: new Metadata()
          };
        } else {
          try {
            serviceConfig = extractAndSelectServiceConfig(TXTrecord, this.percentage);
          } catch (err) {
            serviceConfigError = {
              code: Status.UNAVAILABLE,
              details: 'Parsing service config failed',
              metadata: new Metadata()
            };
          }
        }
        this.listener.onSuccessfulResolution(allAddresses, serviceConfig, serviceConfigError);
      }, (err) => {
        this.pendingResultPromise = null;
        this.listener.onError({
          code: Status.UNAVAILABLE,
          details: 'Name resolution failed',
          metadata: new Metadata()
        });
        this.listener.onError(err);
      });
    }
  }

  updateResolution() {
    if (this.pendingResultPromise === null) {
      this.startResolution();
    }
  }

  /**
   * Get the default authority for the given target. For IP targets, that is
   * the IP address. For DNS targets, it is the hostname.
   * @param target 
   */
  static getDefaultAuthority(target: string): string {
    const ipMatch = IPv4_REGEX.exec(target) || IPv6_REGEX.exec(target) || IPv6_BRACKET_REGEX.exec(target);
    if (ipMatch) {
      return ipMatch[1];
    }
    const dnsMatch = DNS_REGEX.exec(target);
    if (dnsMatch) {
      return dnsMatch[1];
    }
    throw new Error(`Failed to parse target ${target}`);
  }
}

/**
 * Set up the DNS resolver class by registering it as the handler for the
 * "dns:" prefix and as the default resolver.
 */
export function setup(): void {
  registerResolver('dns:', DnsResolver);
  registerDefaultResolver(DnsResolver);
}