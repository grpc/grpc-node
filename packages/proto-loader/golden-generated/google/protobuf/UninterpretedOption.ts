// Original file: null

import type { Long } from '@grpc/proto-loader';

export interface I_google_protobuf_UninterpretedOption_NamePart {
  'namePart'?: (string);
  'isExtension'?: (boolean);
}

export interface O_google_protobuf_UninterpretedOption_NamePart {
  'namePart': (string);
  'isExtension': (boolean);
}

export interface IUninterpretedOption {
  'name'?: (I_google_protobuf_UninterpretedOption_NamePart)[];
  'identifierValue'?: (string);
  'positiveIntValue'?: (number | string | Long);
  'negativeIntValue'?: (number | string | Long);
  'doubleValue'?: (number | string);
  'stringValue'?: (Buffer | Uint8Array | string);
  'aggregateValue'?: (string);
}

export interface OUninterpretedOption {
  'name': (O_google_protobuf_UninterpretedOption_NamePart)[];
  'identifierValue': (string);
  'positiveIntValue': (string);
  'negativeIntValue': (string);
  'doubleValue': (number | string);
  'stringValue': (Buffer);
  'aggregateValue': (string);
}
