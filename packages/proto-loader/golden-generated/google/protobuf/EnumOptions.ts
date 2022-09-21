// Original file: null

import type { IUninterpretedOption as I_google_protobuf_UninterpretedOption, OUninterpretedOption as O_google_protobuf_UninterpretedOption } from '../../google/protobuf/UninterpretedOption';

export interface IEnumOptions {
  'allowAlias'?: (boolean);
  'deprecated'?: (boolean);
  'uninterpretedOption'?: (I_google_protobuf_UninterpretedOption)[];
}

export interface OEnumOptions {
  'allowAlias': (boolean);
  'deprecated': (boolean);
  'uninterpretedOption': (O_google_protobuf_UninterpretedOption)[];
}
