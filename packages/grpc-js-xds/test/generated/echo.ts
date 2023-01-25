import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { EchoTest1ServiceClient as _grpc_testing_EchoTest1ServiceClient, EchoTest1ServiceDefinition as _grpc_testing_EchoTest1ServiceDefinition } from './grpc/testing/EchoTest1Service';
import type { EchoTest2ServiceClient as _grpc_testing_EchoTest2ServiceClient, EchoTest2ServiceDefinition as _grpc_testing_EchoTest2ServiceDefinition } from './grpc/testing/EchoTest2Service';
import type { EchoTestServiceClient as _grpc_testing_EchoTestServiceClient, EchoTestServiceDefinition as _grpc_testing_EchoTestServiceDefinition } from './grpc/testing/EchoTestService';
import type { NoRpcServiceClient as _grpc_testing_NoRpcServiceClient, NoRpcServiceDefinition as _grpc_testing_NoRpcServiceDefinition } from './grpc/testing/NoRpcService';
import type { UnimplementedEchoServiceClient as _grpc_testing_UnimplementedEchoServiceClient, UnimplementedEchoServiceDefinition as _grpc_testing_UnimplementedEchoServiceDefinition } from './grpc/testing/UnimplementedEchoService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  grpc: {
    testing: {
      DebugInfo: MessageTypeDefinition
      EchoRequest: MessageTypeDefinition
      EchoResponse: MessageTypeDefinition
      EchoTest1Service: SubtypeConstructor<typeof grpc.Client, _grpc_testing_EchoTest1ServiceClient> & { service: _grpc_testing_EchoTest1ServiceDefinition }
      EchoTest2Service: SubtypeConstructor<typeof grpc.Client, _grpc_testing_EchoTest2ServiceClient> & { service: _grpc_testing_EchoTest2ServiceDefinition }
      EchoTestService: SubtypeConstructor<typeof grpc.Client, _grpc_testing_EchoTestServiceClient> & { service: _grpc_testing_EchoTestServiceDefinition }
      ErrorStatus: MessageTypeDefinition
      /**
       * A service without any rpc defined to test coverage.
       */
      NoRpcService: SubtypeConstructor<typeof grpc.Client, _grpc_testing_NoRpcServiceClient> & { service: _grpc_testing_NoRpcServiceDefinition }
      RequestParams: MessageTypeDefinition
      ResponseParams: MessageTypeDefinition
      SimpleRequest: MessageTypeDefinition
      SimpleResponse: MessageTypeDefinition
      StringValue: MessageTypeDefinition
      UnimplementedEchoService: SubtypeConstructor<typeof grpc.Client, _grpc_testing_UnimplementedEchoServiceClient> & { service: _grpc_testing_UnimplementedEchoServiceDefinition }
    }
  }
  xds: {
    data: {
      orca: {
        v3: {
          OrcaLoadReport: MessageTypeDefinition
        }
      }
    }
  }
}

