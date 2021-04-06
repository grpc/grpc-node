import type * as grpc from '@grpc/grpc-js';
import type { ServiceDefinition, EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { LoadBalancerStatsServiceClient as _grpc_testing_LoadBalancerStatsServiceClient } from './grpc/testing/LoadBalancerStatsService';
import type { ReconnectServiceClient as _grpc_testing_ReconnectServiceClient } from './grpc/testing/ReconnectService';
import type { TestServiceClient as _grpc_testing_TestServiceClient } from './grpc/testing/TestService';
import type { UnimplementedServiceClient as _grpc_testing_UnimplementedServiceClient } from './grpc/testing/UnimplementedService';
import type { XdsUpdateClientConfigureServiceClient as _grpc_testing_XdsUpdateClientConfigureServiceClient } from './grpc/testing/XdsUpdateClientConfigureService';
import type { XdsUpdateHealthServiceClient as _grpc_testing_XdsUpdateHealthServiceClient } from './grpc/testing/XdsUpdateHealthService';

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
      LoadBalancerStatsService: SubtypeConstructor<typeof grpc.Client, _grpc_testing_LoadBalancerStatsServiceClient> & { service: ServiceDefinition }
      Payload: MessageTypeDefinition
      PayloadType: EnumTypeDefinition
      ReconnectInfo: MessageTypeDefinition
      ReconnectParams: MessageTypeDefinition
      /**
       * A service used to control reconnect server.
       */
      ReconnectService: SubtypeConstructor<typeof grpc.Client, _grpc_testing_ReconnectServiceClient> & { service: ServiceDefinition }
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
      TestService: SubtypeConstructor<typeof grpc.Client, _grpc_testing_TestServiceClient> & { service: ServiceDefinition }
      /**
       * A simple service NOT implemented at servers so clients can test for
       * that case.
       */
      UnimplementedService: SubtypeConstructor<typeof grpc.Client, _grpc_testing_UnimplementedServiceClient> & { service: ServiceDefinition }
      /**
       * A service to dynamically update the configuration of an xDS test client.
       */
      XdsUpdateClientConfigureService: SubtypeConstructor<typeof grpc.Client, _grpc_testing_XdsUpdateClientConfigureServiceClient> & { service: ServiceDefinition }
      /**
       * A service to remotely control health status of an xDS test server.
       */
      XdsUpdateHealthService: SubtypeConstructor<typeof grpc.Client, _grpc_testing_XdsUpdateHealthServiceClient> & { service: ServiceDefinition }
    }
  }
}

