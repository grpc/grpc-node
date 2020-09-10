import * as grpc from '../../src';
import { ServiceDefinition, EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import { LoadBalancerStatsServiceClient as _grpc_testing_LoadBalancerStatsServiceClient } from './grpc/testing/LoadBalancerStatsService';
import { ReconnectServiceClient as _grpc_testing_ReconnectServiceClient } from './grpc/testing/ReconnectService';
import { TestServiceClient as _grpc_testing_TestServiceClient } from './grpc/testing/TestService';
import { UnimplementedServiceClient as _grpc_testing_UnimplementedServiceClient } from './grpc/testing/UnimplementedService';
import { XdsUpdateHealthServiceClient as _grpc_testing_XdsUpdateHealthServiceClient } from './grpc/testing/XdsUpdateHealthService';

type ConstructorArguments<Constructor> = Constructor extends new (...args: infer Args) => any ? Args: never;
type SubtypeConstructor<Constructor, Subtype> = {
  new(...args: ConstructorArguments<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  grpc: {
    testing: {
      BoolValue: MessageTypeDefinition
      EchoStatus: MessageTypeDefinition
      Empty: MessageTypeDefinition
      GrpclbRouteType: EnumTypeDefinition
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
       * A service to remotely control health status of an xDS test server.
       */
      XdsUpdateHealthService: SubtypeConstructor<typeof grpc.Client, _grpc_testing_XdsUpdateHealthServiceClient> & { service: ServiceDefinition }
    }
  }
}

