// Original file: deps/envoy-api/envoy/admin/v3/config_dump.proto

import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../google/protobuf/Any';

/**
 * The :ref:`/config_dump <operations_admin_interface_config_dump>` admin endpoint uses this wrapper
 * message to maintain and serve arbitrary configuration information from any component in Envoy.
 */
export interface ConfigDump {
  /**
   * This list is serialized and dumped in its entirety at the
   * :ref:`/config_dump <operations_admin_interface_config_dump>` endpoint.
   * 
   * The following configurations are currently supported and will be dumped in the order given
   * below:
   * 
   * * *bootstrap*: :ref:`BootstrapConfigDump <envoy_v3_api_msg_admin.v3.BootstrapConfigDump>`
   * * *clusters*: :ref:`ClustersConfigDump <envoy_v3_api_msg_admin.v3.ClustersConfigDump>`
   * * *endpoints*:  :ref:`EndpointsConfigDump <envoy_v3_api_msg_admin.v3.EndpointsConfigDump>`
   * * *listeners*: :ref:`ListenersConfigDump <envoy_v3_api_msg_admin.v3.ListenersConfigDump>`
   * * *scoped_routes*: :ref:`ScopedRoutesConfigDump <envoy_v3_api_msg_admin.v3.ScopedRoutesConfigDump>`
   * * *routes*:  :ref:`RoutesConfigDump <envoy_v3_api_msg_admin.v3.RoutesConfigDump>`
   * * *secrets*:  :ref:`SecretsConfigDump <envoy_v3_api_msg_admin.v3.SecretsConfigDump>`
   * 
   * EDS Configuration will only be dumped by using parameter `?include_eds`
   * 
   * You can filter output with the resource and mask query parameters.
   * See :ref:`/config_dump?resource={} <operations_admin_interface_config_dump_by_resource>`,
   * :ref:`/config_dump?mask={} <operations_admin_interface_config_dump_by_mask>`,
   * or :ref:`/config_dump?resource={},mask={}
   * <operations_admin_interface_config_dump_by_resource_and_mask>` for more information.
   */
  'configs'?: (_google_protobuf_Any)[];
}

/**
 * The :ref:`/config_dump <operations_admin_interface_config_dump>` admin endpoint uses this wrapper
 * message to maintain and serve arbitrary configuration information from any component in Envoy.
 */
export interface ConfigDump__Output {
  /**
   * This list is serialized and dumped in its entirety at the
   * :ref:`/config_dump <operations_admin_interface_config_dump>` endpoint.
   * 
   * The following configurations are currently supported and will be dumped in the order given
   * below:
   * 
   * * *bootstrap*: :ref:`BootstrapConfigDump <envoy_v3_api_msg_admin.v3.BootstrapConfigDump>`
   * * *clusters*: :ref:`ClustersConfigDump <envoy_v3_api_msg_admin.v3.ClustersConfigDump>`
   * * *endpoints*:  :ref:`EndpointsConfigDump <envoy_v3_api_msg_admin.v3.EndpointsConfigDump>`
   * * *listeners*: :ref:`ListenersConfigDump <envoy_v3_api_msg_admin.v3.ListenersConfigDump>`
   * * *scoped_routes*: :ref:`ScopedRoutesConfigDump <envoy_v3_api_msg_admin.v3.ScopedRoutesConfigDump>`
   * * *routes*:  :ref:`RoutesConfigDump <envoy_v3_api_msg_admin.v3.RoutesConfigDump>`
   * * *secrets*:  :ref:`SecretsConfigDump <envoy_v3_api_msg_admin.v3.SecretsConfigDump>`
   * 
   * EDS Configuration will only be dumped by using parameter `?include_eds`
   * 
   * You can filter output with the resource and mask query parameters.
   * See :ref:`/config_dump?resource={} <operations_admin_interface_config_dump_by_resource>`,
   * :ref:`/config_dump?mask={} <operations_admin_interface_config_dump_by_mask>`,
   * or :ref:`/config_dump?resource={},mask={}
   * <operations_admin_interface_config_dump_by_resource_and_mask>` for more information.
   */
  'configs': (_google_protobuf_Any__Output)[];
}
