// Original file: deps/envoy-api/envoy/api/v2/discovery.proto

import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../google/protobuf/Any';

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
   */
  'name'?: (string);
  /**
   * The aliases are a list of other names that this resource can go by.
   */
  'aliases'?: (string)[];
}

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
   */
  'name': (string);
  /**
   * The aliases are a list of other names that this resource can go by.
   */
  'aliases': (string)[];
}
