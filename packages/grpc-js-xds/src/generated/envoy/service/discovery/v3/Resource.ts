// Original file: deps/envoy-api/envoy/service/discovery/v3/discovery.proto

import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../google/protobuf/Any';
import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../../google/protobuf/Duration';
import type { ResourceName as _envoy_service_discovery_v3_ResourceName, ResourceName__Output as _envoy_service_discovery_v3_ResourceName__Output } from '../../../../envoy/service/discovery/v3/ResourceName';
import type { Metadata as _envoy_config_core_v3_Metadata, Metadata__Output as _envoy_config_core_v3_Metadata__Output } from '../../../../envoy/config/core/v3/Metadata';

/**
 * Cache control properties for the resource.
 * [#not-implemented-hide:]
 */
export interface _envoy_service_discovery_v3_Resource_CacheControl {
  /**
   * If true, xDS proxies may not cache this resource.
   * Note that this does not apply to clients other than xDS proxies, which must cache resources
   * for their own use, regardless of the value of this field.
   */
  'do_not_cache'?: (boolean);
}

/**
 * Cache control properties for the resource.
 * [#not-implemented-hide:]
 */
export interface _envoy_service_discovery_v3_Resource_CacheControl__Output {
  /**
   * If true, xDS proxies may not cache this resource.
   * Note that this does not apply to clients other than xDS proxies, which must cache resources
   * for their own use, regardless of the value of this field.
   */
  'do_not_cache': (boolean);
}

/**
 * [#next-free-field: 10]
 */
export interface Resource {
  /**
   * The resource level version. It allows xDS to track the state of individual
   * resources.
   */
  'version'?: (string);
  /**
   * The resource being tracked.
   */
  'resource'?: (_google_protobuf_Any | null);
  /**
   * The resource's name, to distinguish it from others of the same type of resource.
   * Only one of ``name`` or ``resource_name`` may be set.
   */
  'name'?: (string);
  /**
   * The aliases are a list of other names that this resource can go by.
   */
  'aliases'?: (string)[];
  /**
   * Time-to-live value for the resource. For each resource, a timer is started. The timer is
   * reset each time the resource is received with a new TTL. If the resource is received with
   * no TTL set, the timer is removed for the resource. Upon expiration of the timer, the
   * configuration for the resource will be removed.
   * 
   * The TTL can be refreshed or changed by sending a response that doesn't change the resource
   * version. In this case the resource field does not need to be populated, which allows for
   * light-weight "heartbeat" updates to keep a resource with a TTL alive.
   * 
   * The TTL feature is meant to support configurations that should be removed in the event of
   * a management server failure. For example, the feature may be used for fault injection
   * testing where the fault injection should be terminated in the event that Envoy loses contact
   * with the management server.
   */
  'ttl'?: (_google_protobuf_Duration | null);
  /**
   * Cache control properties for the resource.
   * [#not-implemented-hide:]
   */
  'cache_control'?: (_envoy_service_discovery_v3_Resource_CacheControl | null);
  /**
   * Alternative to the ``name`` field, to be used when the server supports
   * multiple variants of the named resource that are differentiated by
   * dynamic parameter constraints.
   * Only one of ``name`` or ``resource_name`` may be set.
   */
  'resource_name'?: (_envoy_service_discovery_v3_ResourceName | null);
  /**
   * The Metadata field can be used to provide additional information for the resource.
   * E.g. the trace data for debugging.
   */
  'metadata'?: (_envoy_config_core_v3_Metadata | null);
}

/**
 * [#next-free-field: 10]
 */
export interface Resource__Output {
  /**
   * The resource level version. It allows xDS to track the state of individual
   * resources.
   */
  'version': (string);
  /**
   * The resource being tracked.
   */
  'resource': (_google_protobuf_Any__Output | null);
  /**
   * The resource's name, to distinguish it from others of the same type of resource.
   * Only one of ``name`` or ``resource_name`` may be set.
   */
  'name': (string);
  /**
   * The aliases are a list of other names that this resource can go by.
   */
  'aliases': (string)[];
  /**
   * Time-to-live value for the resource. For each resource, a timer is started. The timer is
   * reset each time the resource is received with a new TTL. If the resource is received with
   * no TTL set, the timer is removed for the resource. Upon expiration of the timer, the
   * configuration for the resource will be removed.
   * 
   * The TTL can be refreshed or changed by sending a response that doesn't change the resource
   * version. In this case the resource field does not need to be populated, which allows for
   * light-weight "heartbeat" updates to keep a resource with a TTL alive.
   * 
   * The TTL feature is meant to support configurations that should be removed in the event of
   * a management server failure. For example, the feature may be used for fault injection
   * testing where the fault injection should be terminated in the event that Envoy loses contact
   * with the management server.
   */
  'ttl': (_google_protobuf_Duration__Output | null);
  /**
   * Cache control properties for the resource.
   * [#not-implemented-hide:]
   */
  'cache_control': (_envoy_service_discovery_v3_Resource_CacheControl__Output | null);
  /**
   * Alternative to the ``name`` field, to be used when the server supports
   * multiple variants of the named resource that are differentiated by
   * dynamic parameter constraints.
   * Only one of ``name`` or ``resource_name`` may be set.
   */
  'resource_name': (_envoy_service_discovery_v3_ResourceName__Output | null);
  /**
   * The Metadata field can be used to provide additional information for the resource.
   * E.g. the trace data for debugging.
   */
  'metadata': (_envoy_config_core_v3_Metadata__Output | null);
}
