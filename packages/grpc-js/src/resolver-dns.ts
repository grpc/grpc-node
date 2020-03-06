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

import {
  Resolver,
  ResolverListener,
  registerResolver,
  registerDefaultResolver,
} from './resolver';
import * as dns from 'dns';
import * as util from 'util';
import { extractAndSelectServiceConfig, ServiceConfig } from './service-config';
import { ServiceError } from './call';
import { Status } from './constants';
import { StatusObject } from './call-stream';
import { Metadata } from './metadata';
import * as logging from './logging';
import { LogVerbosity } from './constants';
import { SubchannelAddress, TcpSubchannelAddress } from './subchannel';

const TRACER_NAME = 'dns_resolver';

function trace(text: string): void {
  logging.trace(LogVerbosity.DEBUG, TRACER_NAME, text);
}

/* These regular expressions match IP addresses with optional ports in different
 * formats. In each case, capture group 1 contains the address, and capture
 * group 2 contains the port number, if present */
/**
 * Matches 4 groups of up to 3 digits each, separated by periods, optionally
 * followed by a colon and a number.
 */
const IPV4_REGEX = /^(\d{1,3}(?:\.\d{1,3}){3})(?::(\d+))?$/;
/**
 * Matches any number of groups of up to 4 hex digits (case insensitive)
 * separated by 1 or more colons. This variant does not match a port number.
 */
const IPV6_REGEX = /^([0-9a-f]{0,4}(?::{1,2}[0-9a-f]{0,4})+)$/i;
/**
 * Matches the same as the IPv6_REGEX, surrounded by square brackets, and
 * optionally followed by a colon and a number.
 */
const IPV6_BRACKET_REGEX = /^\[([0-9a-f]{0,4}(?::{1,2}[0-9a-f]{0,4})+)\](?::(\d+))?$/i;

/**
 * Matches `[dns:][//authority/]host[:port]`, where `authority` and `host` are
 * both arbitrary sequences of dot-separated strings of alphanumeric characters
 * and `port` is a sequence of digits. Group 1 contains the hostname and group
 * 2 contains the port number if provided.
 */
const DNS_REGEX = /^(?:dns:)?(?:\/\/(?:[a-zA-Z0-9-]+\.?)+\/)?((?:[a-zA-Z0-9-]+\.?)+)(?::(\d+))?$/;

/**
 * The default TCP port to connect to if not explicitly specified in the target.
 */
const DEFAULT_PORT = '443';

/**
 * Get a promise that always resolves with either the result of the function
 * or the error if it failed.
 * @param fn
 */
function resolvePromisify<TArg, TResult, TError>(
  fn: (
    arg: TArg,
    callback: (error: TError | null, result: TResult) => void
  ) => void
): (arg: TArg) => Promise<TResult | TError> {
  return arg =>
    new Promise<TResult | TError>((resolve, reject) => {
      fn(arg, (error, result) => {
        if (error) {
          resolve(error);
        } else {
          resolve(result);
        }
      });
    });
}

const resolveTxtPromise = resolvePromisify<
  string,
  string[][],
  NodeJS.ErrnoException
>(dns.resolveTxt);
const resolve4Promise = resolvePromisify<
  string,
  string[],
  NodeJS.ErrnoException
>(dns.resolve4);
const resolve6Promise = resolvePromisify<
  string,
  string[],
  NodeJS.ErrnoException
>(dns.resolve6);

function dnsLookupPromise(hostname: string, options: dns.LookupAllOptions): Promise<dns.LookupAddress[] | NodeJS.ErrnoException> {
  return new Promise<dns.LookupAddress[] | NodeJS.ErrnoException>((resolve, reject) => {
    dns.lookup(hostname, options, (error, addresses) => {
      if (error) {
        resolve(error);
      } else {
        resolve(addresses);
      }
    });
  });
}

/**
 * Attempt to parse a target string as an IP address
 * @param target
 * @return An "IP:port" string in an array if parsing was successful, `null` otherwise
 */
function parseIP(target: string): SubchannelAddress[] | null {
  /* These three regular expressions are all mutually exclusive, so we just
   * want the first one that matches the target string, if any do. */
  const ipv4Match = IPV4_REGEX.exec(target);
  const match =
    ipv4Match || IPV6_REGEX.exec(target) || IPV6_BRACKET_REGEX.exec(target);
  if (match === null) {
    return null;
  }

  // ipv6 addresses should be bracketed
  const addr = match[1];
  let port: string;
  if (match[2]) {
    port = match[2];
  } else {
    port = DEFAULT_PORT;
  }
  return [{ host: addr, port: +port }];
}

/**
 * Merge any number of arrays into a single alternating array
 * @param arrays
 */
function mergeArrays<T>(...arrays: T[][]): T[] {
  const result: T[] = [];
  for (
    let i = 0;
    i <
    Math.max.apply(
      null,
      arrays.map(array => array.length)
    );
    i++
  ) {
    for (const array of arrays) {
      if (i < array.length) {
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
  private readonly ipResult: SubchannelAddress[] | null;
  private readonly dnsHostname: string | null;
  private readonly port: string | null;
  /* The promise results here contain, in order, the A record, the AAAA record,
   * and either the TXT record or an error if TXT resolution failed */
  private pendingResultPromise: Promise<
    [dns.LookupAddress[] | NodeJS.ErrnoException, dns.LookupAddress[] | NodeJS.ErrnoException, string[] | NodeJS.ErrnoException, string[] | NodeJS.ErrnoException, string[][] | NodeJS.ErrnoException]
  > | null = null;
  private percentage: number;
  private defaultResolutionError: StatusObject;
  constructor(private target: string, private listener: ResolverListener) {
    trace('Resolver constructed for target ' + target);
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

    this.defaultResolutionError = {
      code: Status.UNAVAILABLE,
      details: `Name resolution failed for target ${this.target}`,
      metadata: new Metadata(),
    };
  }

  /**
   * If the target is an IP address, just provide that address as a result.
   * Otherwise, initiate A, AAAA, and TXT
   */
  private startResolution() {
    if (this.ipResult !== null) {
      trace('Returning IP address for target ' + this.target);
      setImmediate(() => {
        this.listener.onSuccessfulResolution(this.ipResult!, null, null);
      });
      return;
    }
    if (this.dnsHostname !== null) {
      const hostname: string = this.dnsHostname;
      /* We use both dns.lookup and dns.resolve{4,6} to maximize our chances of
       * actually getting records, to account for the fact that resolve can't
       * resolve localhost in some environments
       * (https://github.com/nodejs/help/issues/2163) and that lookup sometimes
       * fails to get AAAA records on MacOS in some environments. The result is
       * a little more lenient than the original design: here, if either method
       * resolves any IPv4 or IPv6 addresses, we consider the whole resolution
       * operation a success */
      const lookup4Result = dnsLookupPromise(hostname, {all: true, family: 4});
      const lookup6Result = dnsLookupPromise(hostname, {all: true, family: 6});
      const resolve4Result = resolve4Promise(hostname);
      const resolve6Result = resolve6Promise(hostname);
      const txtResult = resolveTxtPromise(hostname);
      this.pendingResultPromise = Promise.all([lookup4Result, lookup6Result, resolve4Result, resolve6Result, txtResult]);
      this.pendingResultPromise.then(
        ([ip4LookupAddresses, ip6LookupAddresses, ip44ResolveAddresses, ip6ResolveAddresses, txtRecord]) => {
          this.pendingResultPromise = null;
          let ip4Addresses: string[];
          if (Array.isArray(ip4LookupAddresses)) {
            ip4Addresses = ip4LookupAddresses.map(addr => addr.address);
          } else {
            if (Array.isArray(ip44ResolveAddresses)) {
              ip4Addresses = ip44ResolveAddresses;
            } else {
              ip4Addresses = [];
            }
          }
          let ip6Addresses: string[];
          if (Array.isArray(ip6LookupAddresses)) {
            ip6Addresses = ip6LookupAddresses.map(addr => addr.address);
          } else {
            if (Array.isArray(ip6ResolveAddresses)) {
              ip6Addresses = ip6ResolveAddresses;
            } else {
              ip6Addresses = [];
            }
          }
          const allAddresses: TcpSubchannelAddress[] = mergeArrays(
            ip4Addresses,
            ip6Addresses
          ).map(addr => ({ host: addr, port: +this.port! }));
          const allAddressesString: string =
            '[' +
            allAddresses.map(addr => addr.host + ':' + addr.port).join(',') +
            ']';
          trace(
            'Resolved addresses for target ' +
              this.target +
              ': ' +
              allAddressesString
          );
          if (allAddresses.length === 0) {
            this.listener.onError(this.defaultResolutionError);
            return;
          }
          let serviceConfig: ServiceConfig | null = null;
          let serviceConfigError: StatusObject | null = null;
          if (txtRecord instanceof Error) {
            serviceConfigError = {
              code: Status.UNAVAILABLE,
              details: 'TXT query failed',
              metadata: new Metadata(),
            };
          } else {
            try {
              serviceConfig = extractAndSelectServiceConfig(
                txtRecord,
                this.percentage
              );
            } catch (err) {
              serviceConfigError = {
                code: Status.UNAVAILABLE,
                details: 'Parsing service config failed',
                metadata: new Metadata(),
              };
            }
          }
          this.listener.onSuccessfulResolution(
            allAddresses,
            serviceConfig,
            serviceConfigError
          );
        },
        err => {
          trace(
            'Resolution error for target ' +
              this.target +
              ': ' +
              (err as Error).message
          );
          this.pendingResultPromise = null;
          this.listener.onError(this.defaultResolutionError);
        }
      );
    }
  }

  updateResolution() {
    trace('Resolution update requested for target ' + this.target);
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
    const ipMatch =
      IPV4_REGEX.exec(target) ||
      IPV6_REGEX.exec(target) ||
      IPV6_BRACKET_REGEX.exec(target);
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

export interface dnsUrl {
  host: string;
  port?: string;
}

export function parseTarget(target: string): dnsUrl | null {
  const match = IPV4_REGEX.exec(target) ?? IPV6_REGEX.exec(target) ?? IPV6_BRACKET_REGEX.exec(target) ?? DNS_REGEX.exec(target)
  if (match) {
    return {
      host: match[1],
      port: match[2] ?? undefined
    };
  } else {
    return null;
  }
}
