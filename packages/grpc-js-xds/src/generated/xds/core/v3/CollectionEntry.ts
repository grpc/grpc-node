// Original file: deps/xds/xds/core/v3/collection_entry.proto

import type { ResourceLocator as _xds_core_v3_ResourceLocator, ResourceLocator__Output as _xds_core_v3_ResourceLocator__Output } from '../../../xds/core/v3/ResourceLocator';
import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../google/protobuf/Any';

/**
 * Inlined resource entry.
 */
export interface _xds_core_v3_CollectionEntry_InlineEntry {
  /**
   * Optional name to describe the inlined resource. Resource names must
   * [a-zA-Z0-9_-\./]+ (TODO(htuch): turn this into a PGV constraint once
   * finalized, probably should be a RFC3986 pchar). This name allows
   * reference via the #entry directive in ResourceLocator.
   */
  'name'?: (string);
  /**
   * The resource's logical version. It is illegal to have the same named xDS
   * resource name at a given version with different resource payloads.
   */
  'version'?: (string);
  /**
   * The resource payload, including type URL.
   */
  'resource'?: (_google_protobuf_Any | null);
}

/**
 * Inlined resource entry.
 */
export interface _xds_core_v3_CollectionEntry_InlineEntry__Output {
  /**
   * Optional name to describe the inlined resource. Resource names must
   * [a-zA-Z0-9_-\./]+ (TODO(htuch): turn this into a PGV constraint once
   * finalized, probably should be a RFC3986 pchar). This name allows
   * reference via the #entry directive in ResourceLocator.
   */
  'name': (string);
  /**
   * The resource's logical version. It is illegal to have the same named xDS
   * resource name at a given version with different resource payloads.
   */
  'version': (string);
  /**
   * The resource payload, including type URL.
   */
  'resource': (_google_protobuf_Any__Output | null);
}

/**
 * xDS collection resource wrapper. This encapsulates a xDS resource when
 * appearing inside a list collection resource. List collection resources are
 * regular Resource messages of type:
 * 
 * message <T>Collection {
 * repeated CollectionEntry resources = 1;
 * }
 */
export interface CollectionEntry {
  /**
   * A resource locator describing how the member resource is to be located.
   */
  'locator'?: (_xds_core_v3_ResourceLocator | null);
  /**
   * The resource is inlined in the list collection.
   */
  'inline_entry'?: (_xds_core_v3_CollectionEntry_InlineEntry | null);
  'resource_specifier'?: "locator"|"inline_entry";
}

/**
 * xDS collection resource wrapper. This encapsulates a xDS resource when
 * appearing inside a list collection resource. List collection resources are
 * regular Resource messages of type:
 * 
 * message <T>Collection {
 * repeated CollectionEntry resources = 1;
 * }
 */
export interface CollectionEntry__Output {
  /**
   * A resource locator describing how the member resource is to be located.
   */
  'locator'?: (_xds_core_v3_ResourceLocator__Output | null);
  /**
   * The resource is inlined in the list collection.
   */
  'inline_entry'?: (_xds_core_v3_CollectionEntry_InlineEntry__Output | null);
  'resource_specifier': "locator"|"inline_entry";
}
