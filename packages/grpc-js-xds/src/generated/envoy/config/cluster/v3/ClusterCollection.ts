// Original file: deps/envoy-api/envoy/config/cluster/v3/cluster.proto

import type { CollectionEntry as _xds_core_v3_CollectionEntry, CollectionEntry__Output as _xds_core_v3_CollectionEntry__Output } from '../../../../xds/core/v3/CollectionEntry';

/**
 * Cluster list collections. Entries are ``Cluster`` resources or references.
 * [#not-implemented-hide:]
 */
export interface ClusterCollection {
  'entries'?: (_xds_core_v3_CollectionEntry | null);
}

/**
 * Cluster list collections. Entries are ``Cluster`` resources or references.
 * [#not-implemented-hide:]
 */
export interface ClusterCollection__Output {
  'entries': (_xds_core_v3_CollectionEntry__Output | null);
}
