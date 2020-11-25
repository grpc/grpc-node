// Original file: deps/envoy-api/envoy/api/v2/core/base.proto

import { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from '../../../../google/protobuf/Struct';
import { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../google/protobuf/Any';

/**
 * Configuration for transport socket in :ref:`listeners <config_listeners>` and
 * :ref:`clusters <envoy_api_msg_Cluster>`. If the configuration is
 * empty, a default transport socket implementation and configuration will be
 * chosen based on the platform and existence of tls_context.
 */
export interface TransportSocket {
  /**
   * The name of the transport socket to instantiate. The name must match a supported transport
   * socket implementation.
   */
  'name'?: (string);
  'config'?: (_google_protobuf_Struct);
  'typed_config'?: (_google_protobuf_Any);
  /**
   * Implementation specific configuration which depends on the implementation being instantiated.
   * See the supported transport socket implementations for further documentation.
   */
  'config_type'?: "config"|"typed_config";
}

/**
 * Configuration for transport socket in :ref:`listeners <config_listeners>` and
 * :ref:`clusters <envoy_api_msg_Cluster>`. If the configuration is
 * empty, a default transport socket implementation and configuration will be
 * chosen based on the platform and existence of tls_context.
 */
export interface TransportSocket__Output {
  /**
   * The name of the transport socket to instantiate. The name must match a supported transport
   * socket implementation.
   */
  'name': (string);
  'config'?: (_google_protobuf_Struct__Output);
  'typed_config'?: (_google_protobuf_Any__Output);
  /**
   * Implementation specific configuration which depends on the implementation being instantiated.
   * See the supported transport socket implementations for further documentation.
   */
  'config_type': "config"|"typed_config";
}
