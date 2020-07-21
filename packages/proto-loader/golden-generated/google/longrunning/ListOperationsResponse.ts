// Original file: deps/googleapis/google/longrunning/operations.proto

import { Operation as _google_longrunning_Operation, Operation__Output as _google_longrunning_Operation__Output } from '../../google/longrunning/Operation';

export interface ListOperationsResponse {
  'operations'?: (_google_longrunning_Operation)[];
  'next_page_token'?: (string);
}

export interface ListOperationsResponse__Output {
  'operations': (_google_longrunning_Operation__Output)[];
  'next_page_token': (string);
}
