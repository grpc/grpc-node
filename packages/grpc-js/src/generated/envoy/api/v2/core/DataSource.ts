// Original file: deps/envoy-api/envoy/api/v2/core/base.proto


export interface DataSource {
  'filename'?: (string);
  'inline_bytes'?: (Buffer | Uint8Array | string);
  'inline_string'?: (string);
  'specifier'?: "filename"|"inline_bytes"|"inline_string";
}

export interface DataSource__Output {
  'filename'?: (string);
  'inline_bytes'?: (Buffer);
  'inline_string'?: (string);
  'specifier': "filename"|"inline_bytes"|"inline_string";
}
