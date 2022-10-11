// Original file: null

import type { AnyExtension } from '@grpc/proto-loader';

export type IAny = AnyExtension | {
  type_url: string;
  value: Buffer | Uint8Array | string;
}

export type OAny = AnyExtension | {
  type_url: string;
  value: Buffer;
}
