// Original file: deps/envoy-api/envoy/api/v2/core/address.proto

import { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';

/**
 * CidrRange specifies an IP Address and a prefix length to construct
 * the subnet mask for a `CIDR <https://tools.ietf.org/html/rfc4632>`_ range.
 */
export interface CidrRange {
  /**
   * IPv4 or IPv6 address, e.g. ``192.0.0.0`` or ``2001:db8::``.
   */
  'address_prefix'?: (string);
  /**
   * Length of prefix, e.g. 0, 32.
   */
  'prefix_len'?: (_google_protobuf_UInt32Value);
}

/**
 * CidrRange specifies an IP Address and a prefix length to construct
 * the subnet mask for a `CIDR <https://tools.ietf.org/html/rfc4632>`_ range.
 */
export interface CidrRange__Output {
  /**
   * IPv4 or IPv6 address, e.g. ``192.0.0.0`` or ``2001:db8::``.
   */
  'address_prefix': (string);
  /**
   * Length of prefix, e.g. 0, 32.
   */
  'prefix_len'?: (_google_protobuf_UInt32Value__Output);
}
