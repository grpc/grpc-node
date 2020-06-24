// Original file: null

import { AnyExtension } from '@grpc/proto-loader';

export type Any = AnyExtension | {
  type_url: string;
  value: Buffer | Uint8Array | string;
}

export type Any__Output = AnyExtension | {
  type_url: string;
  value: Buffer;
}
