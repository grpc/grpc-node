// Original file: node_modules/protobufjs/google/protobuf/descriptor.proto


export interface _google_protobuf_SourceCodeInfo_Location {
  'path'?: (number)[];
  'span'?: (number)[];
  'leading_comments'?: (string);
  'trailing_comments'?: (string);
  'leading_detached_comments'?: (string)[];
}

export interface _google_protobuf_SourceCodeInfo_Location__Output {
  'path': (number)[];
  'span': (number)[];
  'leading_comments': (string);
  'trailing_comments': (string);
  'leading_detached_comments': (string)[];
}

export interface SourceCodeInfo {
  'location'?: (_google_protobuf_SourceCodeInfo_Location)[];
}

export interface SourceCodeInfo__Output {
  'location': (_google_protobuf_SourceCodeInfo_Location__Output)[];
}
