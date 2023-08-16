// Original file: deps/envoy-api/envoy/config/listener/v3/listener.proto

import type { CollectionEntry as _xds_core_v3_CollectionEntry, CollectionEntry__Output as _xds_core_v3_CollectionEntry__Output } from '../../../../xds/core/v3/CollectionEntry';

/**
 * Listener list collections. Entries are ``Listener`` resources or references.
 * [#not-implemented-hide:]
 */
export interface ListenerCollection {
  'entries'?: (_xds_core_v3_CollectionEntry)[];
}

/**
 * Listener list collections. Entries are ``Listener`` resources or references.
 * [#not-implemented-hide:]
 */
export interface ListenerCollection__Output {
  'entries': (_xds_core_v3_CollectionEntry__Output)[];
}
