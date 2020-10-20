// Original file: deps/envoy-api/envoy/api/v2/core/http_uri.proto

import { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../../google/protobuf/Duration';

/**
 * Envoy external URI descriptor
 */
export interface HttpUri {
  /**
   * The HTTP server URI. It should be a full FQDN with protocol, host and path.
   * 
   * Example:
   * 
   * .. code-block:: yaml
   * 
   * uri: https://www.googleapis.com/oauth2/v1/certs
   */
  'uri'?: (string);
  /**
   * A cluster is created in the Envoy "cluster_manager" config
   * section. This field specifies the cluster name.
   * 
   * Example:
   * 
   * .. code-block:: yaml
   * 
   * cluster: jwks_cluster
   */
  'cluster'?: (string);
  /**
   * Sets the maximum duration in milliseconds that a response can take to arrive upon request.
   */
  'timeout'?: (_google_protobuf_Duration);
  /**
   * Specify how `uri` is to be fetched. Today, this requires an explicit
   * cluster, but in the future we may support dynamic cluster creation or
   * inline DNS resolution. See `issue
   * <https://github.com/envoyproxy/envoy/issues/1606>`_.
   */
  'http_upstream_type'?: "cluster";
}

/**
 * Envoy external URI descriptor
 */
export interface HttpUri__Output {
  /**
   * The HTTP server URI. It should be a full FQDN with protocol, host and path.
   * 
   * Example:
   * 
   * .. code-block:: yaml
   * 
   * uri: https://www.googleapis.com/oauth2/v1/certs
   */
  'uri': (string);
  /**
   * A cluster is created in the Envoy "cluster_manager" config
   * section. This field specifies the cluster name.
   * 
   * Example:
   * 
   * .. code-block:: yaml
   * 
   * cluster: jwks_cluster
   */
  'cluster'?: (string);
  /**
   * Sets the maximum duration in milliseconds that a response can take to arrive upon request.
   */
  'timeout'?: (_google_protobuf_Duration__Output);
  /**
   * Specify how `uri` is to be fetched. Today, this requires an explicit
   * cluster, but in the future we may support dynamic cluster creation or
   * inline DNS resolution. See `issue
   * <https://github.com/envoyproxy/envoy/issues/1606>`_.
   */
  'http_upstream_type': "cluster";
}
