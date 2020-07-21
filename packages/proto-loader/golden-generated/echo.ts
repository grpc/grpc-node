import * as grpc from '@grpc/grpc-js';
import { ServiceDefinition, EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import { OperationsClient as _google_longrunning_OperationsClient } from './google/longrunning/Operations';
import { EchoClient as _google_showcase_v1beta1_EchoClient } from './google/showcase/v1beta1/Echo';

type ConstructorArguments<Constructor> = Constructor extends new (...args: infer Args) => any ? Args: never;
type SubtypeConstructor<Constructor, Subtype> = {
  new(...args: ConstructorArguments<Constructor>): Subtype;
}

export interface ProtoGrpcType {
  google: {
    api: {
      CustomHttpPattern: MessageTypeDefinition
      FieldBehavior: EnumTypeDefinition
      Http: MessageTypeDefinition
      HttpRule: MessageTypeDefinition
    }
    longrunning: {
      CancelOperationRequest: MessageTypeDefinition
      DeleteOperationRequest: MessageTypeDefinition
      GetOperationRequest: MessageTypeDefinition
      ListOperationsRequest: MessageTypeDefinition
      ListOperationsResponse: MessageTypeDefinition
      Operation: MessageTypeDefinition
      OperationInfo: MessageTypeDefinition
      Operations: SubtypeConstructor<typeof grpc.Client, _google_longrunning_OperationsClient> & { service: ServiceDefinition }
      WaitOperationRequest: MessageTypeDefinition
    }
    protobuf: {
      Any: MessageTypeDefinition
      DescriptorProto: MessageTypeDefinition
      Duration: MessageTypeDefinition
      Empty: MessageTypeDefinition
      EnumDescriptorProto: MessageTypeDefinition
      EnumOptions: MessageTypeDefinition
      EnumValueDescriptorProto: MessageTypeDefinition
      EnumValueOptions: MessageTypeDefinition
      FieldDescriptorProto: MessageTypeDefinition
      FieldOptions: MessageTypeDefinition
      FileDescriptorProto: MessageTypeDefinition
      FileDescriptorSet: MessageTypeDefinition
      FileOptions: MessageTypeDefinition
      GeneratedCodeInfo: MessageTypeDefinition
      MessageOptions: MessageTypeDefinition
      MethodDescriptorProto: MessageTypeDefinition
      MethodOptions: MessageTypeDefinition
      OneofDescriptorProto: MessageTypeDefinition
      OneofOptions: MessageTypeDefinition
      ServiceDescriptorProto: MessageTypeDefinition
      ServiceOptions: MessageTypeDefinition
      SourceCodeInfo: MessageTypeDefinition
      Timestamp: MessageTypeDefinition
      UninterpretedOption: MessageTypeDefinition
    }
    rpc: {
      Status: MessageTypeDefinition
    }
    showcase: {
      v1beta1: {
        BlockRequest: MessageTypeDefinition
        BlockResponse: MessageTypeDefinition
        Echo: SubtypeConstructor<typeof grpc.Client, _google_showcase_v1beta1_EchoClient> & { service: ServiceDefinition }
        EchoRequest: MessageTypeDefinition
        EchoResponse: MessageTypeDefinition
        ExpandRequest: MessageTypeDefinition
        PagedExpandRequest: MessageTypeDefinition
        PagedExpandResponse: MessageTypeDefinition
        Severity: EnumTypeDefinition
        WaitMetadata: MessageTypeDefinition
        WaitRequest: MessageTypeDefinition
        WaitResponse: MessageTypeDefinition
      }
    }
  }
}

