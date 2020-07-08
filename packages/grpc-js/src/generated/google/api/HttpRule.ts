// Original file: node_modules/protobufjs/google/api/http.proto

import { CustomHttpPattern as _google_api_CustomHttpPattern, CustomHttpPattern__Output as _google_api_CustomHttpPattern__Output } from '../../google/api/CustomHttpPattern';
import { HttpRule as _google_api_HttpRule, HttpRule__Output as _google_api_HttpRule__Output } from '../../google/api/HttpRule';

export interface HttpRule {
  'get'?: (string);
  'put'?: (string);
  'post'?: (string);
  'delete'?: (string);
  'patch'?: (string);
  'custom'?: (_google_api_CustomHttpPattern);
  'selector'?: (string);
  'body'?: (string);
  'additional_bindings'?: (_google_api_HttpRule)[];
  'pattern'?: "get"|"put"|"post"|"delete"|"patch"|"custom";
}

export interface HttpRule__Output {
  'get'?: (string);
  'put'?: (string);
  'post'?: (string);
  'delete'?: (string);
  'patch'?: (string);
  'custom'?: (_google_api_CustomHttpPattern__Output);
  'selector': (string);
  'body': (string);
  'additional_bindings': (_google_api_HttpRule__Output)[];
  'pattern': "get"|"put"|"post"|"delete"|"patch"|"custom";
}
