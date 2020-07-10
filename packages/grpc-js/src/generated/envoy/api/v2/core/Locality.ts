// Original file: deps/envoy-api/envoy/api/v2/core/base.proto


/**
 * Identifies location of where either Envoy runs or where upstream hosts run.
 */
export interface Locality {
  /**
   * Region this :ref:`zone <envoy_api_field_core.Locality.zone>` belongs to.
   */
  'region'?: (string);
  /**
   * Defines the local service zone where Envoy is running. Though optional, it
   * should be set if discovery service routing is used and the discovery
   * service exposes :ref:`zone data <envoy_api_field_endpoint.LocalityLbEndpoints.locality>`,
   * either in this message or via :option:`--service-zone`. The meaning of zone
   * is context dependent, e.g. `Availability Zone (AZ)
   * <https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html>`_
   * on AWS, `Zone <https://cloud.google.com/compute/docs/regions-zones/>`_ on
   * GCP, etc.
   */
  'zone'?: (string);
  /**
   * When used for locality of upstream hosts, this field further splits zone
   * into smaller chunks of sub-zones so they can be load balanced
   * independently.
   */
  'sub_zone'?: (string);
}

/**
 * Identifies location of where either Envoy runs or where upstream hosts run.
 */
export interface Locality__Output {
  /**
   * Region this :ref:`zone <envoy_api_field_core.Locality.zone>` belongs to.
   */
  'region': (string);
  /**
   * Defines the local service zone where Envoy is running. Though optional, it
   * should be set if discovery service routing is used and the discovery
   * service exposes :ref:`zone data <envoy_api_field_endpoint.LocalityLbEndpoints.locality>`,
   * either in this message or via :option:`--service-zone`. The meaning of zone
   * is context dependent, e.g. `Availability Zone (AZ)
   * <https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html>`_
   * on AWS, `Zone <https://cloud.google.com/compute/docs/regions-zones/>`_ on
   * GCP, etc.
   */
  'zone': (string);
  /**
   * When used for locality of upstream hosts, this field further splits zone
   * into smaller chunks of sub-zones so they can be load balanced
   * independently.
   */
  'sub_zone': (string);
}
