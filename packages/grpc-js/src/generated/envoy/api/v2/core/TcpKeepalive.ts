// Original file: deps/envoy-api/envoy/api/v2/core/address.proto

import { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';

export interface TcpKeepalive {
  /**
   * Maximum number of keepalive probes to send without response before deciding
   * the connection is dead. Default is to use the OS level configuration (unless
   * overridden, Linux defaults to 9.)
   */
  'keepalive_probes'?: (_google_protobuf_UInt32Value);
  /**
   * The number of seconds a connection needs to be idle before keep-alive probes
   * start being sent. Default is to use the OS level configuration (unless
   * overridden, Linux defaults to 7200s (i.e., 2 hours.)
   */
  'keepalive_time'?: (_google_protobuf_UInt32Value);
  /**
   * The number of seconds between keep-alive probes. Default is to use the OS
   * level configuration (unless overridden, Linux defaults to 75s.)
   */
  'keepalive_interval'?: (_google_protobuf_UInt32Value);
}

export interface TcpKeepalive__Output {
  /**
   * Maximum number of keepalive probes to send without response before deciding
   * the connection is dead. Default is to use the OS level configuration (unless
   * overridden, Linux defaults to 9.)
   */
  'keepalive_probes'?: (_google_protobuf_UInt32Value__Output);
  /**
   * The number of seconds a connection needs to be idle before keep-alive probes
   * start being sent. Default is to use the OS level configuration (unless
   * overridden, Linux defaults to 7200s (i.e., 2 hours.)
   */
  'keepalive_time'?: (_google_protobuf_UInt32Value__Output);
  /**
   * The number of seconds between keep-alive probes. Default is to use the OS
   * level configuration (unless overridden, Linux defaults to 75s.)
   */
  'keepalive_interval'?: (_google_protobuf_UInt32Value__Output);
}
