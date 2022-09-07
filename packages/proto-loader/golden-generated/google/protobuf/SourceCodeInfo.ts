// Original file: null


export interface I_google_protobuf_SourceCodeInfo_Location {
  'path'?: (number)[];
  'span'?: (number)[];
  'leadingComments'?: (string);
  'trailingComments'?: (string);
  'leadingDetachedComments'?: (string)[];
}

export interface O_google_protobuf_SourceCodeInfo_Location {
  'path': (number)[];
  'span': (number)[];
  'leadingComments': (string);
  'trailingComments': (string);
  'leadingDetachedComments': (string)[];
}

export interface ISourceCodeInfo {
  'location'?: (I_google_protobuf_SourceCodeInfo_Location)[];
}

export interface OSourceCodeInfo {
  'location': (O_google_protobuf_SourceCodeInfo_Location)[];
}
