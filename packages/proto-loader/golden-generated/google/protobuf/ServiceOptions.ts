// Original file: null

import type { IUninterpretedOption as I_google_protobuf_UninterpretedOption, OUninterpretedOption as O_google_protobuf_UninterpretedOption } from '../../google/protobuf/UninterpretedOption';

export interface IServiceOptions {
  'deprecated'?: (boolean);
  'uninterpretedOption'?: (I_google_protobuf_UninterpretedOption)[];
  '.google.api.default_host'?: (string);
  '.google.api.oauth_scopes'?: (string);
}

export interface OServiceOptions {
  'deprecated': (boolean);
  'uninterpretedOption': (O_google_protobuf_UninterpretedOption)[];
  '.google.api.default_host': (string);
  '.google.api.oauth_scopes': (string);
}
