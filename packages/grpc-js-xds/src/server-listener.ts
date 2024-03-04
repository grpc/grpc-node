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

import { Listener__Output } from "./generated/envoy/config/listener/v3/Listener";
import { FilterChain__Output } from "./generated/envoy/config/listener/v3/FilterChain";
import { UInt32Value__Output } from "./generated/google/protobuf/UInt32Value";
import { CidrRange__Output } from "./generated/envoy/config/core/v3/CidrRange";

function nullableValueEquals<T>(first: T | null, second: T | null, valueEquals: (a: T, b: T) => boolean): boolean {
  if (first === null && second === null) {
    return true;
  }
  if (first === null && second === null) {
    return false;
  }
  return valueEquals(first!, second!);
}

function arrayEquals<T>(first: T[], second: T[], elementEquals: (a: T, b: T) => boolean = (a, b) => a === b): boolean {
  if (first.length !== second.length) {
    return false;
  }
  for (let i = 0; i < first.length; i++) {
    if (!elementEquals(first[i], second[i])) {
      return false;
    }
  }
  return true;
}

function uint32ValueEquals(first: UInt32Value__Output, second: UInt32Value__Output): boolean {
  return first.value === second.value;
}

function cidrRangeEquals(first: CidrRange__Output, second: CidrRange__Output): boolean {
  return first.address_prefix === second.address_prefix && nullableValueEquals(first.prefix_len, second.prefix_len, uint32ValueEquals);
}

function filterChainsEquivalent(first: FilterChain__Output, second: FilterChain__Output): boolean {
  if (first.filters.length !== second.filters.length) {
    return false;
  }
  for (let i = 0; i < first.filters.length; i++) {
    const firstFilter = first.filters[i];
    const secondFilter = second.filters[i];
    if (!firstFilter.typed_config && !secondFilter.typed_config) {
      continue;
    }
    if (!firstFilter.typed_config || !secondFilter.typed_config) {
      return false;
    }
    if (firstFilter.typed_config.type_url !== secondFilter.typed_config.type_url) {
      return false;
    }
    if (!firstFilter.typed_config.value.equals(secondFilter.typed_config.value)) {
      return false;
    }
  }
  if ((first.filter_chain_match === null) !== (second.filter_chain_match === null)) {
    return false;
  }
  if (first.filter_chain_match) {
    const firstMatch = first.filter_chain_match;
    const secondMatch = second.filter_chain_match!;
    if (firstMatch.address_suffix !== secondMatch.address_suffix) {
      return false;
    }
    if (!arrayEquals(firstMatch.application_protocols, secondMatch.application_protocols)) {
      return false;
    }
    if (!nullableValueEquals(firstMatch.destination_port, secondMatch.destination_port, uint32ValueEquals)) {
      return false;
    }
    if (!arrayEquals(firstMatch.direct_source_prefix_ranges, secondMatch.direct_source_prefix_ranges, cidrRangeEquals)) {
      return false;
    }
    if (!arrayEquals(firstMatch.prefix_ranges, secondMatch.prefix_ranges, cidrRangeEquals)) {
      return false;
    }
    if (!arrayEquals(firstMatch.server_names, secondMatch.server_names)) {
      return false;
    }
    if (!arrayEquals(firstMatch.source_ports, secondMatch.source_ports)) {
      return false;
    }
    if (!arrayEquals(firstMatch.source_prefix_ranges, secondMatch.source_prefix_ranges, cidrRangeEquals)) {
      return false;
    }
    if (firstMatch.source_type !== secondMatch.source_type) {
      return false;
    }
    if (!nullableValueEquals(firstMatch.suffix_len, secondMatch.suffix_len, uint32ValueEquals)) {
      return false;
    }
    if (firstMatch.transport_protocol !== secondMatch.transport_protocol) {
      return false;
    }
  }
  return true;
}
/**
 * Tests whether two listener resources are equivalent with respect to the
 * fields that the server uses.
 * @param first
 * @param second
 */
export function listenersEquivalent(first: Listener__Output, second: Listener__Output): boolean {
  if (first.address?.socket_address?.address !== second.address?.socket_address?.address) {
    return false;
  }
  if (first.address?.socket_address?.port_value !== second.address?.socket_address?.port_value) {
    return false;
  }
  if (!nullableValueEquals(first.default_filter_chain, second.default_filter_chain, filterChainsEquivalent)) {
    return false;
  }
  if (first.filter_chains.length !== second.filter_chains.length) {
    return false;
  }
  for (let i = 0; i < first.filter_chains.length; i++) {
    if (!filterChainsEquivalent(first.filter_chains[i], second.filter_chains[i])) {
      return false;
    }
  }
  return true;
}
