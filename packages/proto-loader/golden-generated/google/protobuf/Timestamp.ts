// Original file: null

import type { Long } from '@grpc/proto-loader';

export interface ITimestamp {
  'seconds'?: (number | string | Long | bigint);
  'nanos'?: (number);
}

export interface OTimestamp {
  'seconds': (string);
  'nanos': (number);
}
