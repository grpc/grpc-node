import type * as grpc from '../../src/index';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { TestServiceClient as _TestServiceClient, TestServiceDefinition as _TestServiceDefinition } from './TestService';

type SubtypeConstructor<Subtype extends grpc.ServiceClient> = {
  new (address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ChannelOptions>): Subtype;
} & grpc.ServiceClientConstructor;

export interface ProtoGrpcType extends grpc.GrpcObject {
  Request: MessageTypeDefinition
  Response: MessageTypeDefinition
  TestService: SubtypeConstructor<_TestServiceClient> & { service: _TestServiceDefinition }
}

