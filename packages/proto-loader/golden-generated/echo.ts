import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { ICustomHttpPattern as I_google_api_CustomHttpPattern, OCustomHttpPattern as O_google_api_CustomHttpPattern } from './google/api/CustomHttpPattern';
import type { IHttp as I_google_api_Http, OHttp as O_google_api_Http } from './google/api/Http';
import type { IHttpRule as I_google_api_HttpRule, OHttpRule as O_google_api_HttpRule } from './google/api/HttpRule';
import type { ICancelOperationRequest as I_google_longrunning_CancelOperationRequest, OCancelOperationRequest as O_google_longrunning_CancelOperationRequest } from './google/longrunning/CancelOperationRequest';
import type { IDeleteOperationRequest as I_google_longrunning_DeleteOperationRequest, ODeleteOperationRequest as O_google_longrunning_DeleteOperationRequest } from './google/longrunning/DeleteOperationRequest';
import type { IGetOperationRequest as I_google_longrunning_GetOperationRequest, OGetOperationRequest as O_google_longrunning_GetOperationRequest } from './google/longrunning/GetOperationRequest';
import type { IListOperationsRequest as I_google_longrunning_ListOperationsRequest, OListOperationsRequest as O_google_longrunning_ListOperationsRequest } from './google/longrunning/ListOperationsRequest';
import type { IListOperationsResponse as I_google_longrunning_ListOperationsResponse, OListOperationsResponse as O_google_longrunning_ListOperationsResponse } from './google/longrunning/ListOperationsResponse';
import type { IOperation as I_google_longrunning_Operation, OOperation as O_google_longrunning_Operation } from './google/longrunning/Operation';
import type { IOperationInfo as I_google_longrunning_OperationInfo, OOperationInfo as O_google_longrunning_OperationInfo } from './google/longrunning/OperationInfo';
import type { OperationsClient as _google_longrunning_OperationsClient, OperationsDefinition as _google_longrunning_OperationsDefinition } from './google/longrunning/Operations';
import type { IWaitOperationRequest as I_google_longrunning_WaitOperationRequest, OWaitOperationRequest as O_google_longrunning_WaitOperationRequest } from './google/longrunning/WaitOperationRequest';
import type { IAny as I_google_protobuf_Any, OAny as O_google_protobuf_Any } from './google/protobuf/Any';
import type { IDescriptorProto as I_google_protobuf_DescriptorProto, ODescriptorProto as O_google_protobuf_DescriptorProto } from './google/protobuf/DescriptorProto';
import type { IDuration as I_google_protobuf_Duration, ODuration as O_google_protobuf_Duration } from './google/protobuf/Duration';
import type { IEmpty as I_google_protobuf_Empty, OEmpty as O_google_protobuf_Empty } from './google/protobuf/Empty';
import type { IEnumDescriptorProto as I_google_protobuf_EnumDescriptorProto, OEnumDescriptorProto as O_google_protobuf_EnumDescriptorProto } from './google/protobuf/EnumDescriptorProto';
import type { IEnumOptions as I_google_protobuf_EnumOptions, OEnumOptions as O_google_protobuf_EnumOptions } from './google/protobuf/EnumOptions';
import type { IEnumValueDescriptorProto as I_google_protobuf_EnumValueDescriptorProto, OEnumValueDescriptorProto as O_google_protobuf_EnumValueDescriptorProto } from './google/protobuf/EnumValueDescriptorProto';
import type { IEnumValueOptions as I_google_protobuf_EnumValueOptions, OEnumValueOptions as O_google_protobuf_EnumValueOptions } from './google/protobuf/EnumValueOptions';
import type { IExtensionRangeOptions as I_google_protobuf_ExtensionRangeOptions, OExtensionRangeOptions as O_google_protobuf_ExtensionRangeOptions } from './google/protobuf/ExtensionRangeOptions';
import type { IFeatureSet as I_google_protobuf_FeatureSet, OFeatureSet as O_google_protobuf_FeatureSet } from './google/protobuf/FeatureSet';
import type { IFeatureSetDefaults as I_google_protobuf_FeatureSetDefaults, OFeatureSetDefaults as O_google_protobuf_FeatureSetDefaults } from './google/protobuf/FeatureSetDefaults';
import type { IFieldDescriptorProto as I_google_protobuf_FieldDescriptorProto, OFieldDescriptorProto as O_google_protobuf_FieldDescriptorProto } from './google/protobuf/FieldDescriptorProto';
import type { IFieldOptions as I_google_protobuf_FieldOptions, OFieldOptions as O_google_protobuf_FieldOptions } from './google/protobuf/FieldOptions';
import type { IFileDescriptorProto as I_google_protobuf_FileDescriptorProto, OFileDescriptorProto as O_google_protobuf_FileDescriptorProto } from './google/protobuf/FileDescriptorProto';
import type { IFileDescriptorSet as I_google_protobuf_FileDescriptorSet, OFileDescriptorSet as O_google_protobuf_FileDescriptorSet } from './google/protobuf/FileDescriptorSet';
import type { IFileOptions as I_google_protobuf_FileOptions, OFileOptions as O_google_protobuf_FileOptions } from './google/protobuf/FileOptions';
import type { IGeneratedCodeInfo as I_google_protobuf_GeneratedCodeInfo, OGeneratedCodeInfo as O_google_protobuf_GeneratedCodeInfo } from './google/protobuf/GeneratedCodeInfo';
import type { IMessageOptions as I_google_protobuf_MessageOptions, OMessageOptions as O_google_protobuf_MessageOptions } from './google/protobuf/MessageOptions';
import type { IMethodDescriptorProto as I_google_protobuf_MethodDescriptorProto, OMethodDescriptorProto as O_google_protobuf_MethodDescriptorProto } from './google/protobuf/MethodDescriptorProto';
import type { IMethodOptions as I_google_protobuf_MethodOptions, OMethodOptions as O_google_protobuf_MethodOptions } from './google/protobuf/MethodOptions';
import type { IOneofDescriptorProto as I_google_protobuf_OneofDescriptorProto, OOneofDescriptorProto as O_google_protobuf_OneofDescriptorProto } from './google/protobuf/OneofDescriptorProto';
import type { IOneofOptions as I_google_protobuf_OneofOptions, OOneofOptions as O_google_protobuf_OneofOptions } from './google/protobuf/OneofOptions';
import type { IServiceDescriptorProto as I_google_protobuf_ServiceDescriptorProto, OServiceDescriptorProto as O_google_protobuf_ServiceDescriptorProto } from './google/protobuf/ServiceDescriptorProto';
import type { IServiceOptions as I_google_protobuf_ServiceOptions, OServiceOptions as O_google_protobuf_ServiceOptions } from './google/protobuf/ServiceOptions';
import type { ISourceCodeInfo as I_google_protobuf_SourceCodeInfo, OSourceCodeInfo as O_google_protobuf_SourceCodeInfo } from './google/protobuf/SourceCodeInfo';
import type { ITimestamp as I_google_protobuf_Timestamp, OTimestamp as O_google_protobuf_Timestamp } from './google/protobuf/Timestamp';
import type { IUninterpretedOption as I_google_protobuf_UninterpretedOption, OUninterpretedOption as O_google_protobuf_UninterpretedOption } from './google/protobuf/UninterpretedOption';
import type { IStatus as I_google_rpc_Status, OStatus as O_google_rpc_Status } from './google/rpc/Status';
import type { IBlockRequest as I_google_showcase_v1beta1_BlockRequest, OBlockRequest as O_google_showcase_v1beta1_BlockRequest } from './google/showcase/v1beta1/BlockRequest';
import type { IBlockResponse as I_google_showcase_v1beta1_BlockResponse, OBlockResponse as O_google_showcase_v1beta1_BlockResponse } from './google/showcase/v1beta1/BlockResponse';
import type { EchoClient as _google_showcase_v1beta1_EchoClient, EchoDefinition as _google_showcase_v1beta1_EchoDefinition } from './google/showcase/v1beta1/Echo';
import type { IEchoRequest as I_google_showcase_v1beta1_EchoRequest, OEchoRequest as O_google_showcase_v1beta1_EchoRequest } from './google/showcase/v1beta1/EchoRequest';
import type { IEchoResponse as I_google_showcase_v1beta1_EchoResponse, OEchoResponse as O_google_showcase_v1beta1_EchoResponse } from './google/showcase/v1beta1/EchoResponse';
import type { IExpandRequest as I_google_showcase_v1beta1_ExpandRequest, OExpandRequest as O_google_showcase_v1beta1_ExpandRequest } from './google/showcase/v1beta1/ExpandRequest';
import type { IPagedExpandRequest as I_google_showcase_v1beta1_PagedExpandRequest, OPagedExpandRequest as O_google_showcase_v1beta1_PagedExpandRequest } from './google/showcase/v1beta1/PagedExpandRequest';
import type { IPagedExpandResponse as I_google_showcase_v1beta1_PagedExpandResponse, OPagedExpandResponse as O_google_showcase_v1beta1_PagedExpandResponse } from './google/showcase/v1beta1/PagedExpandResponse';
import type { IWaitMetadata as I_google_showcase_v1beta1_WaitMetadata, OWaitMetadata as O_google_showcase_v1beta1_WaitMetadata } from './google/showcase/v1beta1/WaitMetadata';
import type { IWaitRequest as I_google_showcase_v1beta1_WaitRequest, OWaitRequest as O_google_showcase_v1beta1_WaitRequest } from './google/showcase/v1beta1/WaitRequest';
import type { IWaitResponse as I_google_showcase_v1beta1_WaitResponse, OWaitResponse as O_google_showcase_v1beta1_WaitResponse } from './google/showcase/v1beta1/WaitResponse';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  google: {
    api: {
      CustomHttpPattern: MessageTypeDefinition<I_google_api_CustomHttpPattern, O_google_api_CustomHttpPattern>
      FieldBehavior: EnumTypeDefinition
      Http: MessageTypeDefinition<I_google_api_Http, O_google_api_Http>
      HttpRule: MessageTypeDefinition<I_google_api_HttpRule, O_google_api_HttpRule>
    }
    longrunning: {
      CancelOperationRequest: MessageTypeDefinition<I_google_longrunning_CancelOperationRequest, O_google_longrunning_CancelOperationRequest>
      DeleteOperationRequest: MessageTypeDefinition<I_google_longrunning_DeleteOperationRequest, O_google_longrunning_DeleteOperationRequest>
      GetOperationRequest: MessageTypeDefinition<I_google_longrunning_GetOperationRequest, O_google_longrunning_GetOperationRequest>
      ListOperationsRequest: MessageTypeDefinition<I_google_longrunning_ListOperationsRequest, O_google_longrunning_ListOperationsRequest>
      ListOperationsResponse: MessageTypeDefinition<I_google_longrunning_ListOperationsResponse, O_google_longrunning_ListOperationsResponse>
      Operation: MessageTypeDefinition<I_google_longrunning_Operation, O_google_longrunning_Operation>
      OperationInfo: MessageTypeDefinition<I_google_longrunning_OperationInfo, O_google_longrunning_OperationInfo>
      /**
       * Manages long-running operations with an API service.
       * 
       * When an API method normally takes long time to complete, it can be designed
       * to return [Operation][google.longrunning.Operation] to the client, and the client can use this
       * interface to receive the real response asynchronously by polling the
       * operation resource, or pass the operation resource to another API (such as
       * Google Cloud Pub/Sub API) to receive the response.  Any API service that
       * returns long-running operations should implement the `Operations` interface
       * so developers can have a consistent client experience.
       */
      Operations: SubtypeConstructor<typeof grpc.Client, _google_longrunning_OperationsClient> & { service: _google_longrunning_OperationsDefinition }
      WaitOperationRequest: MessageTypeDefinition<I_google_longrunning_WaitOperationRequest, O_google_longrunning_WaitOperationRequest>
    }
    protobuf: {
      Any: MessageTypeDefinition<I_google_protobuf_Any, O_google_protobuf_Any>
      DescriptorProto: MessageTypeDefinition<I_google_protobuf_DescriptorProto, O_google_protobuf_DescriptorProto>
      Duration: MessageTypeDefinition<I_google_protobuf_Duration, O_google_protobuf_Duration>
      Edition: EnumTypeDefinition
      Empty: MessageTypeDefinition<I_google_protobuf_Empty, O_google_protobuf_Empty>
      EnumDescriptorProto: MessageTypeDefinition<I_google_protobuf_EnumDescriptorProto, O_google_protobuf_EnumDescriptorProto>
      EnumOptions: MessageTypeDefinition<I_google_protobuf_EnumOptions, O_google_protobuf_EnumOptions>
      EnumValueDescriptorProto: MessageTypeDefinition<I_google_protobuf_EnumValueDescriptorProto, O_google_protobuf_EnumValueDescriptorProto>
      EnumValueOptions: MessageTypeDefinition<I_google_protobuf_EnumValueOptions, O_google_protobuf_EnumValueOptions>
      ExtensionRangeOptions: MessageTypeDefinition<I_google_protobuf_ExtensionRangeOptions, O_google_protobuf_ExtensionRangeOptions>
      FeatureSet: MessageTypeDefinition<I_google_protobuf_FeatureSet, O_google_protobuf_FeatureSet>
      FeatureSetDefaults: MessageTypeDefinition<I_google_protobuf_FeatureSetDefaults, O_google_protobuf_FeatureSetDefaults>
      FieldDescriptorProto: MessageTypeDefinition<I_google_protobuf_FieldDescriptorProto, O_google_protobuf_FieldDescriptorProto>
      FieldOptions: MessageTypeDefinition<I_google_protobuf_FieldOptions, O_google_protobuf_FieldOptions>
      FileDescriptorProto: MessageTypeDefinition<I_google_protobuf_FileDescriptorProto, O_google_protobuf_FileDescriptorProto>
      FileDescriptorSet: MessageTypeDefinition<I_google_protobuf_FileDescriptorSet, O_google_protobuf_FileDescriptorSet>
      FileOptions: MessageTypeDefinition<I_google_protobuf_FileOptions, O_google_protobuf_FileOptions>
      GeneratedCodeInfo: MessageTypeDefinition<I_google_protobuf_GeneratedCodeInfo, O_google_protobuf_GeneratedCodeInfo>
      MessageOptions: MessageTypeDefinition<I_google_protobuf_MessageOptions, O_google_protobuf_MessageOptions>
      MethodDescriptorProto: MessageTypeDefinition<I_google_protobuf_MethodDescriptorProto, O_google_protobuf_MethodDescriptorProto>
      MethodOptions: MessageTypeDefinition<I_google_protobuf_MethodOptions, O_google_protobuf_MethodOptions>
      OneofDescriptorProto: MessageTypeDefinition<I_google_protobuf_OneofDescriptorProto, O_google_protobuf_OneofDescriptorProto>
      OneofOptions: MessageTypeDefinition<I_google_protobuf_OneofOptions, O_google_protobuf_OneofOptions>
      ServiceDescriptorProto: MessageTypeDefinition<I_google_protobuf_ServiceDescriptorProto, O_google_protobuf_ServiceDescriptorProto>
      ServiceOptions: MessageTypeDefinition<I_google_protobuf_ServiceOptions, O_google_protobuf_ServiceOptions>
      SourceCodeInfo: MessageTypeDefinition<I_google_protobuf_SourceCodeInfo, O_google_protobuf_SourceCodeInfo>
      SymbolVisibility: EnumTypeDefinition
      Timestamp: MessageTypeDefinition<I_google_protobuf_Timestamp, O_google_protobuf_Timestamp>
      UninterpretedOption: MessageTypeDefinition<I_google_protobuf_UninterpretedOption, O_google_protobuf_UninterpretedOption>
    }
    rpc: {
      Status: MessageTypeDefinition<I_google_rpc_Status, O_google_rpc_Status>
    }
    showcase: {
      v1beta1: {
        BlockRequest: MessageTypeDefinition<I_google_showcase_v1beta1_BlockRequest, O_google_showcase_v1beta1_BlockRequest>
        BlockResponse: MessageTypeDefinition<I_google_showcase_v1beta1_BlockResponse, O_google_showcase_v1beta1_BlockResponse>
        /**
         * This service is used showcase the four main types of rpcs - unary, server
         * side streaming, client side streaming, and bidirectional streaming. This
         * service also exposes methods that explicitly implement server delay, and
         * paginated calls. Set the 'showcase-trailer' metadata key on any method
         * to have the values echoed in the response trailers.
         */
        Echo: SubtypeConstructor<typeof grpc.Client, _google_showcase_v1beta1_EchoClient> & { service: _google_showcase_v1beta1_EchoDefinition }
        EchoRequest: MessageTypeDefinition<I_google_showcase_v1beta1_EchoRequest, O_google_showcase_v1beta1_EchoRequest>
        EchoResponse: MessageTypeDefinition<I_google_showcase_v1beta1_EchoResponse, O_google_showcase_v1beta1_EchoResponse>
        ExpandRequest: MessageTypeDefinition<I_google_showcase_v1beta1_ExpandRequest, O_google_showcase_v1beta1_ExpandRequest>
        PagedExpandRequest: MessageTypeDefinition<I_google_showcase_v1beta1_PagedExpandRequest, O_google_showcase_v1beta1_PagedExpandRequest>
        PagedExpandResponse: MessageTypeDefinition<I_google_showcase_v1beta1_PagedExpandResponse, O_google_showcase_v1beta1_PagedExpandResponse>
        Severity: EnumTypeDefinition
        WaitMetadata: MessageTypeDefinition<I_google_showcase_v1beta1_WaitMetadata, O_google_showcase_v1beta1_WaitMetadata>
        WaitRequest: MessageTypeDefinition<I_google_showcase_v1beta1_WaitRequest, O_google_showcase_v1beta1_WaitRequest>
        WaitResponse: MessageTypeDefinition<I_google_showcase_v1beta1_WaitResponse, O_google_showcase_v1beta1_WaitResponse>
      }
    }
  }
}

