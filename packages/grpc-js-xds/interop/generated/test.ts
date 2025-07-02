import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { BoolValue as _grpc_testing_BoolValue, BoolValue__Output as _grpc_testing_BoolValue__Output } from './grpc/testing/BoolValue';
import type { ClientConfigureRequest as _grpc_testing_ClientConfigureRequest, ClientConfigureRequest__Output as _grpc_testing_ClientConfigureRequest__Output } from './grpc/testing/ClientConfigureRequest';
import type { ClientConfigureResponse as _grpc_testing_ClientConfigureResponse, ClientConfigureResponse__Output as _grpc_testing_ClientConfigureResponse__Output } from './grpc/testing/ClientConfigureResponse';
import type { EchoStatus as _grpc_testing_EchoStatus, EchoStatus__Output as _grpc_testing_EchoStatus__Output } from './grpc/testing/EchoStatus';
import type { Empty as _grpc_testing_Empty, Empty__Output as _grpc_testing_Empty__Output } from './grpc/testing/Empty';
import type { LoadBalancerAccumulatedStatsRequest as _grpc_testing_LoadBalancerAccumulatedStatsRequest, LoadBalancerAccumulatedStatsRequest__Output as _grpc_testing_LoadBalancerAccumulatedStatsRequest__Output } from './grpc/testing/LoadBalancerAccumulatedStatsRequest';
import type { LoadBalancerAccumulatedStatsResponse as _grpc_testing_LoadBalancerAccumulatedStatsResponse, LoadBalancerAccumulatedStatsResponse__Output as _grpc_testing_LoadBalancerAccumulatedStatsResponse__Output } from './grpc/testing/LoadBalancerAccumulatedStatsResponse';
import type { LoadBalancerStatsRequest as _grpc_testing_LoadBalancerStatsRequest, LoadBalancerStatsRequest__Output as _grpc_testing_LoadBalancerStatsRequest__Output } from './grpc/testing/LoadBalancerStatsRequest';
import type { LoadBalancerStatsResponse as _grpc_testing_LoadBalancerStatsResponse, LoadBalancerStatsResponse__Output as _grpc_testing_LoadBalancerStatsResponse__Output } from './grpc/testing/LoadBalancerStatsResponse';
import type { LoadBalancerStatsServiceClient as _grpc_testing_LoadBalancerStatsServiceClient, LoadBalancerStatsServiceDefinition as _grpc_testing_LoadBalancerStatsServiceDefinition } from './grpc/testing/LoadBalancerStatsService';
import type { Payload as _grpc_testing_Payload, Payload__Output as _grpc_testing_Payload__Output } from './grpc/testing/Payload';
import type { ReconnectInfo as _grpc_testing_ReconnectInfo, ReconnectInfo__Output as _grpc_testing_ReconnectInfo__Output } from './grpc/testing/ReconnectInfo';
import type { ReconnectParams as _grpc_testing_ReconnectParams, ReconnectParams__Output as _grpc_testing_ReconnectParams__Output } from './grpc/testing/ReconnectParams';
import type { ReconnectServiceClient as _grpc_testing_ReconnectServiceClient, ReconnectServiceDefinition as _grpc_testing_ReconnectServiceDefinition } from './grpc/testing/ReconnectService';
import type { ResponseParameters as _grpc_testing_ResponseParameters, ResponseParameters__Output as _grpc_testing_ResponseParameters__Output } from './grpc/testing/ResponseParameters';
import type { SimpleRequest as _grpc_testing_SimpleRequest, SimpleRequest__Output as _grpc_testing_SimpleRequest__Output } from './grpc/testing/SimpleRequest';
import type { SimpleResponse as _grpc_testing_SimpleResponse, SimpleResponse__Output as _grpc_testing_SimpleResponse__Output } from './grpc/testing/SimpleResponse';
import type { StreamingInputCallRequest as _grpc_testing_StreamingInputCallRequest, StreamingInputCallRequest__Output as _grpc_testing_StreamingInputCallRequest__Output } from './grpc/testing/StreamingInputCallRequest';
import type { StreamingInputCallResponse as _grpc_testing_StreamingInputCallResponse, StreamingInputCallResponse__Output as _grpc_testing_StreamingInputCallResponse__Output } from './grpc/testing/StreamingInputCallResponse';
import type { StreamingOutputCallRequest as _grpc_testing_StreamingOutputCallRequest, StreamingOutputCallRequest__Output as _grpc_testing_StreamingOutputCallRequest__Output } from './grpc/testing/StreamingOutputCallRequest';
import type { StreamingOutputCallResponse as _grpc_testing_StreamingOutputCallResponse, StreamingOutputCallResponse__Output as _grpc_testing_StreamingOutputCallResponse__Output } from './grpc/testing/StreamingOutputCallResponse';
import type { TestServiceClient as _grpc_testing_TestServiceClient, TestServiceDefinition as _grpc_testing_TestServiceDefinition } from './grpc/testing/TestService';
import type { UnimplementedServiceClient as _grpc_testing_UnimplementedServiceClient, UnimplementedServiceDefinition as _grpc_testing_UnimplementedServiceDefinition } from './grpc/testing/UnimplementedService';
import type { XdsUpdateClientConfigureServiceClient as _grpc_testing_XdsUpdateClientConfigureServiceClient, XdsUpdateClientConfigureServiceDefinition as _grpc_testing_XdsUpdateClientConfigureServiceDefinition } from './grpc/testing/XdsUpdateClientConfigureService';
import type { XdsUpdateHealthServiceClient as _grpc_testing_XdsUpdateHealthServiceClient, XdsUpdateHealthServiceDefinition as _grpc_testing_XdsUpdateHealthServiceDefinition } from './grpc/testing/XdsUpdateHealthService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  grpc: {
    testing: {
      BoolValue: MessageTypeDefinition<_grpc_testing_BoolValue, _grpc_testing_BoolValue__Output>
      ClientConfigureRequest: MessageTypeDefinition<_grpc_testing_ClientConfigureRequest, _grpc_testing_ClientConfigureRequest__Output>
      ClientConfigureResponse: MessageTypeDefinition<_grpc_testing_ClientConfigureResponse, _grpc_testing_ClientConfigureResponse__Output>
      EchoStatus: MessageTypeDefinition<_grpc_testing_EchoStatus, _grpc_testing_EchoStatus__Output>
      Empty: MessageTypeDefinition<_grpc_testing_Empty, _grpc_testing_Empty__Output>
      GrpclbRouteType: EnumTypeDefinition
      LoadBalancerAccumulatedStatsRequest: MessageTypeDefinition<_grpc_testing_LoadBalancerAccumulatedStatsRequest, _grpc_testing_LoadBalancerAccumulatedStatsRequest__Output>
      LoadBalancerAccumulatedStatsResponse: MessageTypeDefinition<_grpc_testing_LoadBalancerAccumulatedStatsResponse, _grpc_testing_LoadBalancerAccumulatedStatsResponse__Output>
      LoadBalancerStatsRequest: MessageTypeDefinition<_grpc_testing_LoadBalancerStatsRequest, _grpc_testing_LoadBalancerStatsRequest__Output>
      LoadBalancerStatsResponse: MessageTypeDefinition<_grpc_testing_LoadBalancerStatsResponse, _grpc_testing_LoadBalancerStatsResponse__Output>
      /**
       * A service used to obtain stats for verifying LB behavior.
       */
      LoadBalancerStatsService: SubtypeConstructor<typeof grpc.Client, _grpc_testing_LoadBalancerStatsServiceClient> & { service: _grpc_testing_LoadBalancerStatsServiceDefinition }
      Payload: MessageTypeDefinition<_grpc_testing_Payload, _grpc_testing_Payload__Output>
      PayloadType: EnumTypeDefinition
      ReconnectInfo: MessageTypeDefinition<_grpc_testing_ReconnectInfo, _grpc_testing_ReconnectInfo__Output>
      ReconnectParams: MessageTypeDefinition<_grpc_testing_ReconnectParams, _grpc_testing_ReconnectParams__Output>
      /**
       * A service used to control reconnect server.
       */
      ReconnectService: SubtypeConstructor<typeof grpc.Client, _grpc_testing_ReconnectServiceClient> & { service: _grpc_testing_ReconnectServiceDefinition }
      ResponseParameters: MessageTypeDefinition<_grpc_testing_ResponseParameters, _grpc_testing_ResponseParameters__Output>
      SimpleRequest: MessageTypeDefinition<_grpc_testing_SimpleRequest, _grpc_testing_SimpleRequest__Output>
      SimpleResponse: MessageTypeDefinition<_grpc_testing_SimpleResponse, _grpc_testing_SimpleResponse__Output>
      StreamingInputCallRequest: MessageTypeDefinition<_grpc_testing_StreamingInputCallRequest, _grpc_testing_StreamingInputCallRequest__Output>
      StreamingInputCallResponse: MessageTypeDefinition<_grpc_testing_StreamingInputCallResponse, _grpc_testing_StreamingInputCallResponse__Output>
      StreamingOutputCallRequest: MessageTypeDefinition<_grpc_testing_StreamingOutputCallRequest, _grpc_testing_StreamingOutputCallRequest__Output>
      StreamingOutputCallResponse: MessageTypeDefinition<_grpc_testing_StreamingOutputCallResponse, _grpc_testing_StreamingOutputCallResponse__Output>
      /**
       * A simple service to test the various types of RPCs and experiment with
       * performance with various types of payload.
       */
      TestService: SubtypeConstructor<typeof grpc.Client, _grpc_testing_TestServiceClient> & { service: _grpc_testing_TestServiceDefinition }
      /**
       * A simple service NOT implemented at servers so clients can test for
       * that case.
       */
      UnimplementedService: SubtypeConstructor<typeof grpc.Client, _grpc_testing_UnimplementedServiceClient> & { service: _grpc_testing_UnimplementedServiceDefinition }
      /**
       * A service to dynamically update the configuration of an xDS test client.
       */
      XdsUpdateClientConfigureService: SubtypeConstructor<typeof grpc.Client, _grpc_testing_XdsUpdateClientConfigureServiceClient> & { service: _grpc_testing_XdsUpdateClientConfigureServiceDefinition }
      /**
       * A service to remotely control health status of an xDS test server.
       */
      XdsUpdateHealthService: SubtypeConstructor<typeof grpc.Client, _grpc_testing_XdsUpdateHealthServiceClient> & { service: _grpc_testing_XdsUpdateHealthServiceDefinition }
    }
  }
}

