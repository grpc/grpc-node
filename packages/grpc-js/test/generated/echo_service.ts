import type * as grpc from '../../src/index';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { EchoMessage as _EchoMessage, EchoMessage__Output as _EchoMessage__Output } from './EchoMessage';
import type { EchoServiceClient as _EchoServiceClient, EchoServiceDefinition as _EchoServiceDefinition } from './EchoService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  EchoMessage: MessageTypeDefinition<_EchoMessage, _EchoMessage__Output>
  EchoService: SubtypeConstructor<typeof grpc.Client, _EchoServiceClient> & { service: _EchoServiceDefinition }
}

