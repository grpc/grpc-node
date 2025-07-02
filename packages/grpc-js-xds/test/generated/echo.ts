import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { DebugInfo as _grpc_testing_DebugInfo, DebugInfo__Output as _grpc_testing_DebugInfo__Output } from './grpc/testing/DebugInfo';
import type { EchoRequest as _grpc_testing_EchoRequest, EchoRequest__Output as _grpc_testing_EchoRequest__Output } from './grpc/testing/EchoRequest';
import type { EchoResponse as _grpc_testing_EchoResponse, EchoResponse__Output as _grpc_testing_EchoResponse__Output } from './grpc/testing/EchoResponse';
import type { EchoTest1ServiceClient as _grpc_testing_EchoTest1ServiceClient, EchoTest1ServiceDefinition as _grpc_testing_EchoTest1ServiceDefinition } from './grpc/testing/EchoTest1Service';
import type { EchoTest2ServiceClient as _grpc_testing_EchoTest2ServiceClient, EchoTest2ServiceDefinition as _grpc_testing_EchoTest2ServiceDefinition } from './grpc/testing/EchoTest2Service';
import type { EchoTestServiceClient as _grpc_testing_EchoTestServiceClient, EchoTestServiceDefinition as _grpc_testing_EchoTestServiceDefinition } from './grpc/testing/EchoTestService';
import type { ErrorStatus as _grpc_testing_ErrorStatus, ErrorStatus__Output as _grpc_testing_ErrorStatus__Output } from './grpc/testing/ErrorStatus';
import type { NoRpcServiceClient as _grpc_testing_NoRpcServiceClient, NoRpcServiceDefinition as _grpc_testing_NoRpcServiceDefinition } from './grpc/testing/NoRpcService';
import type { RequestParams as _grpc_testing_RequestParams, RequestParams__Output as _grpc_testing_RequestParams__Output } from './grpc/testing/RequestParams';
import type { ResponseParams as _grpc_testing_ResponseParams, ResponseParams__Output as _grpc_testing_ResponseParams__Output } from './grpc/testing/ResponseParams';
import type { SimpleRequest as _grpc_testing_SimpleRequest, SimpleRequest__Output as _grpc_testing_SimpleRequest__Output } from './grpc/testing/SimpleRequest';
import type { SimpleResponse as _grpc_testing_SimpleResponse, SimpleResponse__Output as _grpc_testing_SimpleResponse__Output } from './grpc/testing/SimpleResponse';
import type { StringValue as _grpc_testing_StringValue, StringValue__Output as _grpc_testing_StringValue__Output } from './grpc/testing/StringValue';
import type { UnimplementedEchoServiceClient as _grpc_testing_UnimplementedEchoServiceClient, UnimplementedEchoServiceDefinition as _grpc_testing_UnimplementedEchoServiceDefinition } from './grpc/testing/UnimplementedEchoService';
import type { OrcaLoadReport as _xds_data_orca_v3_OrcaLoadReport, OrcaLoadReport__Output as _xds_data_orca_v3_OrcaLoadReport__Output } from './xds/data/orca/v3/OrcaLoadReport';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  grpc: {
    testing: {
      DebugInfo: MessageTypeDefinition<_grpc_testing_DebugInfo, _grpc_testing_DebugInfo__Output>
      EchoRequest: MessageTypeDefinition<_grpc_testing_EchoRequest, _grpc_testing_EchoRequest__Output>
      EchoResponse: MessageTypeDefinition<_grpc_testing_EchoResponse, _grpc_testing_EchoResponse__Output>
      EchoTest1Service: SubtypeConstructor<typeof grpc.Client, _grpc_testing_EchoTest1ServiceClient> & { service: _grpc_testing_EchoTest1ServiceDefinition }
      EchoTest2Service: SubtypeConstructor<typeof grpc.Client, _grpc_testing_EchoTest2ServiceClient> & { service: _grpc_testing_EchoTest2ServiceDefinition }
      EchoTestService: SubtypeConstructor<typeof grpc.Client, _grpc_testing_EchoTestServiceClient> & { service: _grpc_testing_EchoTestServiceDefinition }
      ErrorStatus: MessageTypeDefinition<_grpc_testing_ErrorStatus, _grpc_testing_ErrorStatus__Output>
      /**
       * A service without any rpc defined to test coverage.
       */
      NoRpcService: SubtypeConstructor<typeof grpc.Client, _grpc_testing_NoRpcServiceClient> & { service: _grpc_testing_NoRpcServiceDefinition }
      RequestParams: MessageTypeDefinition<_grpc_testing_RequestParams, _grpc_testing_RequestParams__Output>
      ResponseParams: MessageTypeDefinition<_grpc_testing_ResponseParams, _grpc_testing_ResponseParams__Output>
      SimpleRequest: MessageTypeDefinition<_grpc_testing_SimpleRequest, _grpc_testing_SimpleRequest__Output>
      SimpleResponse: MessageTypeDefinition<_grpc_testing_SimpleResponse, _grpc_testing_SimpleResponse__Output>
      StringValue: MessageTypeDefinition<_grpc_testing_StringValue, _grpc_testing_StringValue__Output>
      UnimplementedEchoService: SubtypeConstructor<typeof grpc.Client, _grpc_testing_UnimplementedEchoServiceClient> & { service: _grpc_testing_UnimplementedEchoServiceDefinition }
    }
  }
  xds: {
    data: {
      orca: {
        v3: {
          OrcaLoadReport: MessageTypeDefinition<_xds_data_orca_v3_OrcaLoadReport, _xds_data_orca_v3_OrcaLoadReport__Output>
        }
      }
    }
  }
}

