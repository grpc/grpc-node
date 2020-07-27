// Original file: deps/envoy-api/envoy/type/metadata/v2/metadata.proto


/**
 * Represents metadata from :ref:`the upstream cluster<envoy_api_field_Cluster.metadata>`.
 */
export interface _envoy_type_metadata_v2_MetadataKind_Cluster {
}

/**
 * Represents metadata from :ref:`the upstream cluster<envoy_api_field_Cluster.metadata>`.
 */
export interface _envoy_type_metadata_v2_MetadataKind_Cluster__Output {
}

/**
 * Represents metadata from :ref:`the upstream
 * host<envoy_api_field_endpoint.LbEndpoint.metadata>`.
 */
export interface _envoy_type_metadata_v2_MetadataKind_Host {
}

/**
 * Represents metadata from :ref:`the upstream
 * host<envoy_api_field_endpoint.LbEndpoint.metadata>`.
 */
export interface _envoy_type_metadata_v2_MetadataKind_Host__Output {
}

/**
 * Represents dynamic metadata associated with the request.
 */
export interface _envoy_type_metadata_v2_MetadataKind_Request {
}

/**
 * Represents dynamic metadata associated with the request.
 */
export interface _envoy_type_metadata_v2_MetadataKind_Request__Output {
}

/**
 * Represents metadata from :ref:`the route<envoy_api_field_route.Route.metadata>`.
 */
export interface _envoy_type_metadata_v2_MetadataKind_Route {
}

/**
 * Represents metadata from :ref:`the route<envoy_api_field_route.Route.metadata>`.
 */
export interface _envoy_type_metadata_v2_MetadataKind_Route__Output {
}

/**
 * Describes what kind of metadata.
 */
export interface MetadataKind {
  /**
   * Request kind of metadata.
   */
  'request'?: (_envoy_type_metadata_v2_MetadataKind_Request);
  /**
   * Route kind of metadata.
   */
  'route'?: (_envoy_type_metadata_v2_MetadataKind_Route);
  /**
   * Cluster kind of metadata.
   */
  'cluster'?: (_envoy_type_metadata_v2_MetadataKind_Cluster);
  /**
   * Host kind of metadata.
   */
  'host'?: (_envoy_type_metadata_v2_MetadataKind_Host);
  'kind'?: "request"|"route"|"cluster"|"host";
}

/**
 * Describes what kind of metadata.
 */
export interface MetadataKind__Output {
  /**
   * Request kind of metadata.
   */
  'request'?: (_envoy_type_metadata_v2_MetadataKind_Request__Output);
  /**
   * Route kind of metadata.
   */
  'route'?: (_envoy_type_metadata_v2_MetadataKind_Route__Output);
  /**
   * Cluster kind of metadata.
   */
  'cluster'?: (_envoy_type_metadata_v2_MetadataKind_Cluster__Output);
  /**
   * Host kind of metadata.
   */
  'host'?: (_envoy_type_metadata_v2_MetadataKind_Host__Output);
  'kind': "request"|"route"|"cluster"|"host";
}
