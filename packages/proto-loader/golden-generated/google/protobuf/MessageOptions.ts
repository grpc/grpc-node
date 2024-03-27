// Original file: null

import type { IUninterpretedOption as I_google_protobuf_UninterpretedOption, OUninterpretedOption as O_google_protobuf_UninterpretedOption } from '../../google/protobuf/UninterpretedOption';

export interface IMessageOptions {
  'messageSetWireFormat'?: (boolean);
  'noStandardDescriptorAccessor'?: (boolean);
  'deprecated'?: (boolean);
  'mapEntry'?: (boolean);
  'uninterpretedOption'?: (I_google_protobuf_UninterpretedOption)[];
}

export interface OMessageOptions {
  'messageSetWireFormat': (boolean);
  'noStandardDescriptorAccessor': (boolean);
  'deprecated': (boolean);
  'mapEntry': (boolean);
  'uninterpretedOption': (O_google_protobuf_UninterpretedOption)[];
}
