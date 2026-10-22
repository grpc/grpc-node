// Original file: null

import type { Long } from '@grpc/proto-loader';

export interface IDuration {
  'seconds'?: (number | string | Long | bigint);
  'nanos'?: (number);
}

export interface ODuration {
  'seconds': (string);
  'nanos': (number);
}
