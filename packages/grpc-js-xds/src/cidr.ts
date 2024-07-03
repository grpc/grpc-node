/*
 * Copyright 2024 gRPC authors.
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

import * as net from 'net';
import { CidrRange__Output } from './generated/envoy/config/core/v3/CidrRange';

const IPV4_COMPONENT_COUNT = 4n;
const IPV4_COMPONENT_SIZE = 8n;
const IPV4_COMPONENT_CAP = 1n << IPV4_COMPONENT_SIZE;
const IPV4_TOTAL_SIZE = IPV4_COMPONENT_COUNT * IPV4_COMPONENT_SIZE;
const IPV6_COMPONENT_SIZE = 16n;
const IPV6_COMPONENT_COUNT = 8n;
const IPV6_COMPONENT_CAP = 1n << IPV6_COMPONENT_SIZE;
const IPV6_TOTAL_SIZE = IPV6_COMPONENT_COUNT * IPV6_COMPONENT_SIZE;

export interface CidrRange {
  addressPrefix: string;
  prefixLen: number;
}

export function parseIPv4(address: string): bigint {
  return address.split('.').map(component => BigInt(component)).reduce((accumulator, current) => accumulator * IPV4_COMPONENT_CAP + current, 0n);
}

export function parseIPv6(address: string): bigint {
  /* If an IPv6 address contains two or more consecutive components with value
   * which can be collectively represented with the string '::'. For example,
   * the IPv6 adddress 0:0:0:0:0:0:0:1 can also be represented as ::1. Here we
   * expand any :: into the correct number of individual components. */
  const sections = address.split('::');
  let components: string[];
  if (sections.length === 1) {
    components = sections[0].split(':');
  } else if (sections.length === 2) {
    const beginning = sections[0].split(':').filter(value => value !== '');
    const end = sections[1].split(':').filter(value => value !== '');
    components = beginning.concat(Array(8 - beginning.length - end.length).fill('0'), end);
  } else {
    throw new Error('Invalid IPv6 address contains more than one instance of ::');
  }
  return components.map(component => BigInt('0x' + component)).reduce((accumulator, current) => accumulator * 65536n + current, 0n);
}

function parseIP(address: string): bigint {
  switch (net.isIP(address)) {
    case 4:
      return parseIPv4(address);
    case 6:
      return parseIPv6(address);
    default:
      throw new Error(`Invalid IP address ${address}`);
  }
}

export function formatIPv4(address: bigint): string {
  const reverseComponents: bigint[] = [];
  for (let i = 0; i < IPV4_COMPONENT_COUNT; i++) {
    reverseComponents.push(address % IPV4_COMPONENT_CAP);
    address = address / IPV4_COMPONENT_CAP;
  }
  return reverseComponents.reverse().map(component => component.toString(10)).join('.');
}

export function formatIPv6(address: bigint): string {
  const reverseComponents: bigint[] = [];
  for (let i = 0; i < IPV6_COMPONENT_COUNT; i++) {
    reverseComponents.push(address % IPV6_COMPONENT_CAP);
    address = address / IPV6_COMPONENT_CAP;
  }
  const components = reverseComponents.reverse();
  /* Find the longest run of consecutive 0 values in the list of components, to
   * replace it with :: in the output */
  let maxZeroRunIndex = 0;
  let maxZeroRunLength = 0;
  let inZeroRun = false;
  let currentZeroRunIndex = 0;
  let currentZeroRunLength = 0;
  for (let i = 0; i < components.length; i++) {
    if (components[i] === 0n) {
      if (inZeroRun) {
        currentZeroRunLength += 1;
      } else {
        inZeroRun = true;
        currentZeroRunIndex = i;
        currentZeroRunLength = 1;
      }
      if (currentZeroRunLength > maxZeroRunLength) {
        maxZeroRunIndex = currentZeroRunIndex;
        maxZeroRunLength = currentZeroRunLength;
      }
    } else {
      currentZeroRunLength = 0;
      inZeroRun = false;
    }
  }
  if (maxZeroRunLength >= 2) {
    const beginning = components.slice(0, maxZeroRunIndex);
    const end = components.slice(maxZeroRunIndex + maxZeroRunLength);
    return beginning.map(value => value.toString(16)).join(':') + '::' + end.map(value => value.toString(16)).join(':');
  } else {
    return components.map(value => value.toString(16)).join(':');
  }
}

function getSubnetMaskIPv4(prefixLen: number) {
  return ~((1n << (IPV4_TOTAL_SIZE - BigInt(prefixLen))) - 1n);
}

function getSubnetMaskIPv6(prefixLen: number) {
  return ~((1n << (IPV6_TOTAL_SIZE - BigInt(prefixLen))) - 1n);
}

export function firstNBitsIPv4(address: string, prefixLen: number): string {
  const addressNum = parseIPv4(address);
  const prefixMask = getSubnetMaskIPv4(prefixLen);
  return formatIPv4(addressNum & prefixMask);
}

export function firstNBitsIPv6(address: string, prefixLen: number): string {
  const addressNum = parseIPv6(address);
  const prefixMask = getSubnetMaskIPv6(prefixLen);
  return formatIPv6(addressNum & prefixMask);
}

export function normalizeCidrRange(range: CidrRange): CidrRange {
  switch (net.isIP(range.addressPrefix)) {
    case 4: {
      const prefixLen = Math.min(Math.max(range.prefixLen, 0), 32);
      return {
        addressPrefix: firstNBitsIPv4(range.addressPrefix, prefixLen),
        prefixLen: prefixLen
      };
    }
    case 6: {
      const prefixLen = Math.min(Math.max(range.prefixLen, 0), 128);
      return {
        addressPrefix: firstNBitsIPv6(range.addressPrefix, prefixLen),
        prefixLen: prefixLen
      };
    }
    default:
      throw new Error(`Invalid IP address prefix ${range.addressPrefix}`);
  }
}

export function getCidrRangeSubnetMask(range: CidrRange): bigint {
  switch (net.isIP(range.addressPrefix)) {
    case 4:
      return getSubnetMaskIPv4(range.prefixLen);
    case 6:
      return getSubnetMaskIPv6(range.prefixLen);
    default:
      throw new Error('Invalid CIDR range');
  }
}

export function inCidrRange(range: CidrRange, address: string): boolean {
  if (net.isIP(range.addressPrefix) !== net.isIP(address)) {
    return false;
  }
  return (parseIP(address) & getCidrRangeSubnetMask(range)) === parseIP(range.addressPrefix);
}

export function cidrRangeEqual(range1: CidrRange | undefined, range2: CidrRange | undefined): boolean {
  if (range1 === undefined && range2 === undefined) {
    return true;
  }
  if (range1 === undefined || range2 === undefined) {
    return false;
  }
  return range1.addressPrefix === range2.addressPrefix && range1.prefixLen === range2.prefixLen;
}

export function cidrRangeMessageToCidrRange(message: CidrRange__Output): CidrRange {
  return {
    addressPrefix: message.address_prefix,
    prefixLen: message.prefix_len?.value ?? 0
  };
}
