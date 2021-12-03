// Original file: deps/envoy-api/envoy/type/metadata/v3/metadata.proto


/**
 * Represents metadata from :ref:`the upstream cluster<envoy_v3_api_field_config.cluster.v3.Cluster.metadata>`.
 */
export interface _envoy_type_metadata_v3_MetadataKind_Cluster {
}

/**
 * Represents metadata from :ref:`the upstream cluster<envoy_v3_api_field_config.cluster.v3.Cluster.metadata>`.
 */
export interface _envoy_type_metadata_v3_MetadataKind_Cluster__Output {
}

/**
 * Represents metadata from :ref:`the upstream
 * host<envoy_v3_api_field_config.endpoint.v3.LbEndpoint.metadata>`.
 */
export interface _envoy_type_metadata_v3_MetadataKind_Host {
}

/**
 * Represents metadata from :ref:`the upstream
 * host<envoy_v3_api_field_config.endpoint.v3.LbEndpoint.metadata>`.
 */
export interface _envoy_type_metadata_v3_MetadataKind_Host__Output {
}

/**
 * Represents dynamic metadata associated with the request.
 */
export interface _envoy_type_metadata_v3_MetadataKind_Request {
}

/**
 * Represents dynamic metadata associated with the request.
 */
export interface _envoy_type_metadata_v3_MetadataKind_Request__Output {
}

/**
 * Represents metadata from :ref:`the route<envoy_v3_api_field_config.route.v3.Route.metadata>`.
 */
export interface _envoy_type_metadata_v3_MetadataKind_Route {
}

/**
 * Represents metadata from :ref:`the route<envoy_v3_api_field_config.route.v3.Route.metadata>`.
 */
export interface _envoy_type_metadata_v3_MetadataKind_Route__Output {
}

/**
 * Describes what kind of metadata.
 */
export interface MetadataKind {
  /**
   * Request kind of metadata.
   */
  'request'?: (_envoy_type_metadata_v3_MetadataKind_Request | null);
  /**
   * Route kind of metadata.
   */
  'route'?: (_envoy_type_metadata_v3_MetadataKind_Route | null);
  /**
   * Cluster kind of metadata.
   */
  'cluster'?: (_envoy_type_metadata_v3_MetadataKind_Cluster | null);
  /**
   * Host kind of metadata.
   */
  'host'?: (_envoy_type_metadata_v3_MetadataKind_Host | null);
  'kind'?: "request"|"route"|"cluster"|"host";
}

/**
 * Describes what kind of metadata.
 */
export interface MetadataKind__Output {
  /**
   * Request kind of metadata.
   */
  'request'?: (_envoy_type_metadata_v3_MetadataKind_Request__Output | null);
  /**
   * Route kind of metadata.
   */
  'route'?: (_envoy_type_metadata_v3_MetadataKind_Route__Output | null);
  /**
   * Cluster kind of metadata.
   */
  'cluster'?: (_envoy_type_metadata_v3_MetadataKind_Cluster__Output | null);
  /**
   * Host kind of metadata.
   */
  'host'?: (_envoy_type_metadata_v3_MetadataKind_Host__Output | null);
  'kind': "request"|"route"|"cluster"|"host";
}
