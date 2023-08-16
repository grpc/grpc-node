// Original file: deps/envoy-api/envoy/config/core/v3/base.proto

import type { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from '../../../../google/protobuf/Struct';
import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../google/protobuf/Any';

/**
 * Metadata provides additional inputs to filters based on matched listeners,
 * filter chains, routes and endpoints. It is structured as a map, usually from
 * filter name (in reverse DNS format) to metadata specific to the filter. Metadata
 * key-values for a filter are merged as connection and request handling occurs,
 * with later values for the same key overriding earlier values.
 * 
 * An example use of metadata is providing additional values to
 * http_connection_manager in the envoy.http_connection_manager.access_log
 * namespace.
 * 
 * Another example use of metadata is to per service config info in cluster metadata, which may get
 * consumed by multiple filters.
 * 
 * For load balancing, Metadata provides a means to subset cluster endpoints.
 * Endpoints have a Metadata object associated and routes contain a Metadata
 * object to match against. There are some well defined metadata used today for
 * this purpose:
 * 
 * * ``{"envoy.lb": {"canary": <bool> }}`` This indicates the canary status of an
 * endpoint and is also used during header processing
 * (x-envoy-upstream-canary) and for stats purposes.
 * [#next-major-version: move to type/metadata/v2]
 */
export interface Metadata {
  /**
   * Key is the reverse DNS filter name, e.g. com.acme.widget. The ``envoy.*``
   * namespace is reserved for Envoy's built-in filters.
   * If both ``filter_metadata`` and
   * :ref:`typed_filter_metadata <envoy_v3_api_field_config.core.v3.Metadata.typed_filter_metadata>`
   * fields are present in the metadata with same keys,
   * only ``typed_filter_metadata`` field will be parsed.
   */
  'filter_metadata'?: ({[key: string]: _google_protobuf_Struct});
  /**
   * Key is the reverse DNS filter name, e.g. com.acme.widget. The ``envoy.*``
   * namespace is reserved for Envoy's built-in filters.
   * The value is encoded as google.protobuf.Any.
   * If both :ref:`filter_metadata <envoy_v3_api_field_config.core.v3.Metadata.filter_metadata>`
   * and ``typed_filter_metadata`` fields are present in the metadata with same keys,
   * only ``typed_filter_metadata`` field will be parsed.
   */
  'typed_filter_metadata'?: ({[key: string]: _google_protobuf_Any});
}

/**
 * Metadata provides additional inputs to filters based on matched listeners,
 * filter chains, routes and endpoints. It is structured as a map, usually from
 * filter name (in reverse DNS format) to metadata specific to the filter. Metadata
 * key-values for a filter are merged as connection and request handling occurs,
 * with later values for the same key overriding earlier values.
 * 
 * An example use of metadata is providing additional values to
 * http_connection_manager in the envoy.http_connection_manager.access_log
 * namespace.
 * 
 * Another example use of metadata is to per service config info in cluster metadata, which may get
 * consumed by multiple filters.
 * 
 * For load balancing, Metadata provides a means to subset cluster endpoints.
 * Endpoints have a Metadata object associated and routes contain a Metadata
 * object to match against. There are some well defined metadata used today for
 * this purpose:
 * 
 * * ``{"envoy.lb": {"canary": <bool> }}`` This indicates the canary status of an
 * endpoint and is also used during header processing
 * (x-envoy-upstream-canary) and for stats purposes.
 * [#next-major-version: move to type/metadata/v2]
 */
export interface Metadata__Output {
  /**
   * Key is the reverse DNS filter name, e.g. com.acme.widget. The ``envoy.*``
   * namespace is reserved for Envoy's built-in filters.
   * If both ``filter_metadata`` and
   * :ref:`typed_filter_metadata <envoy_v3_api_field_config.core.v3.Metadata.typed_filter_metadata>`
   * fields are present in the metadata with same keys,
   * only ``typed_filter_metadata`` field will be parsed.
   */
  'filter_metadata': ({[key: string]: _google_protobuf_Struct__Output});
  /**
   * Key is the reverse DNS filter name, e.g. com.acme.widget. The ``envoy.*``
   * namespace is reserved for Envoy's built-in filters.
   * The value is encoded as google.protobuf.Any.
   * If both :ref:`filter_metadata <envoy_v3_api_field_config.core.v3.Metadata.filter_metadata>`
   * and ``typed_filter_metadata`` fields are present in the metadata with same keys,
   * only ``typed_filter_metadata`` field will be parsed.
   */
  'typed_filter_metadata': ({[key: string]: _google_protobuf_Any__Output});
}
