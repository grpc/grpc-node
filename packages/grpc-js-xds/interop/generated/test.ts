import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { LoadBalancerStatsServiceClient as _grpc_testing_LoadBalancerStatsServiceClient, LoadBalancerStatsServiceDefinition as _grpc_testing_LoadBalancerStatsServiceDefinition } from './grpc/testing/LoadBalancerStatsService';
import type { ReconnectServiceClient as _grpc_testing_ReconnectServiceClient, ReconnectServiceDefinition as _grpc_testing_ReconnectServiceDefinition } from './grpc/testing/ReconnectService';
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
      BoolValue: MessageTypeDefinition
      ClientConfigureRequest: MessageTypeDefinition
      ClientConfigureResponse: MessageTypeDefinition
      EchoStatus: MessageTypeDefinition
      Empty: MessageTypeDefinition
      GrpclbRouteType: EnumTypeDefinition
      LoadBalancerAccumulatedStatsRequest: MessageTypeDefinition
      LoadBalancerAccumulatedStatsResponse: MessageTypeDefinition
      LoadBalancerStatsRequest: MessageTypeDefinition
      LoadBalancerStatsResponse: MessageTypeDefinition
      /**
       * A service used to obtain stats for verifying LB behavior.
       */
      LoadBalancerStatsService: SubtypeConstructor<typeof grpc.Client, _grpc_testing_LoadBalancerStatsServiceClient> & { service: _grpc_testing_LoadBalancerStatsServiceDefinition }
      Payload: MessageTypeDefinition
      PayloadType: EnumTypeDefinition
      ReconnectInfo: MessageTypeDefinition
      ReconnectParams: MessageTypeDefinition
      /**
       * A service used to control reconnect server.
       */
      ReconnectService: SubtypeConstructor<typeof grpc.Client, _grpc_testing_ReconnectServiceClient> & { service: _grpc_testing_ReconnectServiceDefinition }
      ResponseParameters: MessageTypeDefinition
      SimpleRequest: MessageTypeDefinition
      SimpleResponse: MessageTypeDefinition
      StreamingInputCallRequest: MessageTypeDefinition
      StreamingInputCallResponse: MessageTypeDefinition
      StreamingOutputCallRequest: MessageTypeDefinition
      StreamingOutputCallResponse: MessageTypeDefinition
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

