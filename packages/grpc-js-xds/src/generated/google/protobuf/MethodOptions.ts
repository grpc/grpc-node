// Original file: null

import type { UninterpretedOption as _google_protobuf_UninterpretedOption, UninterpretedOption__Output as _google_protobuf_UninterpretedOption__Output } from '../../google/protobuf/UninterpretedOption';
import type { HttpRule as _google_api_HttpRule, HttpRule__Output as _google_api_HttpRule__Output } from '../../google/api/HttpRule';

export interface MethodOptions {
  'deprecated'?: (boolean);
  'uninterpretedOption'?: (_google_protobuf_UninterpretedOption)[];
  '.google.api.http'?: (_google_api_HttpRule | null);
}

export interface MethodOptions__Output {
  'deprecated': (boolean);
  'uninterpretedOption': (_google_protobuf_UninterpretedOption__Output)[];
  '.google.api.http': (_google_api_HttpRule__Output | null);
}
