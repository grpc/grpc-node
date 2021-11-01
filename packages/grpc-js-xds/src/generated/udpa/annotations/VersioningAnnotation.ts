// Original file: deps/xds/udpa/annotations/versioning.proto


export interface VersioningAnnotation {
  /**
   * Track the previous message type. E.g. this message might be
   * udpa.foo.v3alpha.Foo and it was previously udpa.bar.v2.Bar. This
   * information is consumed by UDPA via proto descriptors.
   */
  'previous_message_type'?: (string);
}

export interface VersioningAnnotation__Output {
  /**
   * Track the previous message type. E.g. this message might be
   * udpa.foo.v3alpha.Foo and it was previously udpa.bar.v2.Bar. This
   * information is consumed by UDPA via proto descriptors.
   */
  'previous_message_type': (string);
}
