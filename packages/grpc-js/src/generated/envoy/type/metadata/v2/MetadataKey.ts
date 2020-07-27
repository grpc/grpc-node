// Original file: deps/envoy-api/envoy/type/metadata/v2/metadata.proto


/**
 * Specifies the segment in a path to retrieve value from Metadata.
 * Currently it is only supported to specify the key, i.e. field name, as one segment of a path.
 */
export interface _envoy_type_metadata_v2_MetadataKey_PathSegment {
  /**
   * If specified, use the key to retrieve the value in a Struct.
   */
  'key'?: (string);
  'segment'?: "key";
}

/**
 * Specifies the segment in a path to retrieve value from Metadata.
 * Currently it is only supported to specify the key, i.e. field name, as one segment of a path.
 */
export interface _envoy_type_metadata_v2_MetadataKey_PathSegment__Output {
  /**
   * If specified, use the key to retrieve the value in a Struct.
   */
  'key'?: (string);
  'segment': "key";
}

/**
 * MetadataKey provides a general interface using `key` and `path` to retrieve value from
 * :ref:`Metadata <envoy_api_msg_core.Metadata>`.
 * 
 * For example, for the following Metadata:
 * 
 * .. code-block:: yaml
 * 
 * filter_metadata:
 * envoy.xxx:
 * prop:
 * foo: bar
 * xyz:
 * hello: envoy
 * 
 * The following MetadataKey will retrieve a string value "bar" from the Metadata.
 * 
 * .. code-block:: yaml
 * 
 * key: envoy.xxx
 * path:
 * - key: prop
 * - key: foo
 */
export interface MetadataKey {
  /**
   * The key name of Metadata to retrieve the Struct from the metadata.
   * Typically, it represents a builtin subsystem or custom extension.
   */
  'key'?: (string);
  /**
   * The path to retrieve the Value from the Struct. It can be a prefix or a full path,
   * e.g. ``[prop, xyz]`` for a struct or ``[prop, foo]`` for a string in the example,
   * which depends on the particular scenario.
   * 
   * Note: Due to that only the key type segment is supported, the path can not specify a list
   * unless the list is the last segment.
   */
  'path'?: (_envoy_type_metadata_v2_MetadataKey_PathSegment)[];
}

/**
 * MetadataKey provides a general interface using `key` and `path` to retrieve value from
 * :ref:`Metadata <envoy_api_msg_core.Metadata>`.
 * 
 * For example, for the following Metadata:
 * 
 * .. code-block:: yaml
 * 
 * filter_metadata:
 * envoy.xxx:
 * prop:
 * foo: bar
 * xyz:
 * hello: envoy
 * 
 * The following MetadataKey will retrieve a string value "bar" from the Metadata.
 * 
 * .. code-block:: yaml
 * 
 * key: envoy.xxx
 * path:
 * - key: prop
 * - key: foo
 */
export interface MetadataKey__Output {
  /**
   * The key name of Metadata to retrieve the Struct from the metadata.
   * Typically, it represents a builtin subsystem or custom extension.
   */
  'key': (string);
  /**
   * The path to retrieve the Value from the Struct. It can be a prefix or a full path,
   * e.g. ``[prop, xyz]`` for a struct or ``[prop, foo]`` for a string in the example,
   * which depends on the particular scenario.
   * 
   * Note: Due to that only the key type segment is supported, the path can not specify a list
   * unless the list is the last segment.
   */
  'path': (_envoy_type_metadata_v2_MetadataKey_PathSegment__Output)[];
}
