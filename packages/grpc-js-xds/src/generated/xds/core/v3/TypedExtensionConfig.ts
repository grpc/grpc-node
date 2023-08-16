// Original file: deps/xds/xds/core/v3/extension.proto

import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../google/protobuf/Any';

/**
 * Message type for extension configuration.
 */
export interface TypedExtensionConfig {
  /**
   * The name of an extension. This is not used to select the extension, instead
   * it serves the role of an opaque identifier.
   */
  'name'?: (string);
  /**
   * The typed config for the extension. The type URL will be used to identify
   * the extension. In the case that the type URL is *xds.type.v3.TypedStruct*
   * (or, for historical reasons, *udpa.type.v1.TypedStruct*), the inner type
   * URL of *TypedStruct* will be utilized. See the
   * :ref:`extension configuration overview
   * <config_overview_extension_configuration>` for further details.
   */
  'typed_config'?: (_google_protobuf_Any | null);
}

/**
 * Message type for extension configuration.
 */
export interface TypedExtensionConfig__Output {
  /**
   * The name of an extension. This is not used to select the extension, instead
   * it serves the role of an opaque identifier.
   */
  'name': (string);
  /**
   * The typed config for the extension. The type URL will be used to identify
   * the extension. In the case that the type URL is *xds.type.v3.TypedStruct*
   * (or, for historical reasons, *udpa.type.v1.TypedStruct*), the inner type
   * URL of *TypedStruct* will be utilized. See the
   * :ref:`extension configuration overview
   * <config_overview_extension_configuration>` for further details.
   */
  'typed_config': (_google_protobuf_Any__Output | null);
}
