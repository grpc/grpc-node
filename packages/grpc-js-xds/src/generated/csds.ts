import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { ClientStatusDiscoveryServiceClient as _envoy_service_status_v3_ClientStatusDiscoveryServiceClient, ClientStatusDiscoveryServiceDefinition as _envoy_service_status_v3_ClientStatusDiscoveryServiceDefinition } from './envoy/service/status/v3/ClientStatusDiscoveryService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  envoy: {
    admin: {
      v3: {
        ClientResourceStatus: EnumTypeDefinition
        ClustersConfigDump: MessageTypeDefinition
        EcdsConfigDump: MessageTypeDefinition
        EndpointsConfigDump: MessageTypeDefinition
        ListenersConfigDump: MessageTypeDefinition
        RoutesConfigDump: MessageTypeDefinition
        ScopedRoutesConfigDump: MessageTypeDefinition
        UpdateFailureState: MessageTypeDefinition
      }
    }
    annotations: {
    }
    config: {
      core: {
        v3: {
          Address: MessageTypeDefinition
          AsyncDataSource: MessageTypeDefinition
          BackoffStrategy: MessageTypeDefinition
          BindConfig: MessageTypeDefinition
          BuildVersion: MessageTypeDefinition
          CidrRange: MessageTypeDefinition
          ControlPlane: MessageTypeDefinition
          DataSource: MessageTypeDefinition
          EnvoyInternalAddress: MessageTypeDefinition
          Extension: MessageTypeDefinition
          ExtraSourceAddress: MessageTypeDefinition
          HeaderMap: MessageTypeDefinition
          HeaderValue: MessageTypeDefinition
          HeaderValueOption: MessageTypeDefinition
          HttpUri: MessageTypeDefinition
          Locality: MessageTypeDefinition
          Metadata: MessageTypeDefinition
          Node: MessageTypeDefinition
          Pipe: MessageTypeDefinition
          QueryParameter: MessageTypeDefinition
          RemoteDataSource: MessageTypeDefinition
          RequestMethod: EnumTypeDefinition
          RetryPolicy: MessageTypeDefinition
          RoutingPriority: EnumTypeDefinition
          RuntimeDouble: MessageTypeDefinition
          RuntimeFeatureFlag: MessageTypeDefinition
          RuntimeFractionalPercent: MessageTypeDefinition
          RuntimePercent: MessageTypeDefinition
          RuntimeUInt32: MessageTypeDefinition
          SocketAddress: MessageTypeDefinition
          SocketOption: MessageTypeDefinition
          SocketOptionsOverride: MessageTypeDefinition
          TcpKeepalive: MessageTypeDefinition
          TrafficDirection: EnumTypeDefinition
          TransportSocket: MessageTypeDefinition
          WatchedDirectory: MessageTypeDefinition
        }
      }
    }
    service: {
      status: {
        v3: {
          ClientConfig: MessageTypeDefinition
          ClientConfigStatus: EnumTypeDefinition
          /**
           * CSDS is Client Status Discovery Service. It can be used to get the status of
           * an xDS-compliant client from the management server's point of view. It can
           * also be used to get the current xDS states directly from the client.
           */
          ClientStatusDiscoveryService: SubtypeConstructor<typeof grpc.Client, _envoy_service_status_v3_ClientStatusDiscoveryServiceClient> & { service: _envoy_service_status_v3_ClientStatusDiscoveryServiceDefinition }
          ClientStatusRequest: MessageTypeDefinition
          ClientStatusResponse: MessageTypeDefinition
          ConfigStatus: EnumTypeDefinition
          PerXdsConfig: MessageTypeDefinition
        }
      }
    }
    type: {
      matcher: {
        v3: {
          DoubleMatcher: MessageTypeDefinition
          ListMatcher: MessageTypeDefinition
          ListStringMatcher: MessageTypeDefinition
          NodeMatcher: MessageTypeDefinition
          RegexMatchAndSubstitute: MessageTypeDefinition
          RegexMatcher: MessageTypeDefinition
          StringMatcher: MessageTypeDefinition
          StructMatcher: MessageTypeDefinition
          ValueMatcher: MessageTypeDefinition
        }
      }
      v3: {
        DoubleRange: MessageTypeDefinition
        FractionalPercent: MessageTypeDefinition
        Int32Range: MessageTypeDefinition
        Int64Range: MessageTypeDefinition
        Percent: MessageTypeDefinition
        SemanticVersion: MessageTypeDefinition
      }
    }
  }
  google: {
    api: {
      CustomHttpPattern: MessageTypeDefinition
      Http: MessageTypeDefinition
      HttpRule: MessageTypeDefinition
    }
    protobuf: {
      Any: MessageTypeDefinition
      BoolValue: MessageTypeDefinition
      BytesValue: MessageTypeDefinition
      DescriptorProto: MessageTypeDefinition
      DoubleValue: MessageTypeDefinition
      Duration: MessageTypeDefinition
      EnumDescriptorProto: MessageTypeDefinition
      EnumOptions: MessageTypeDefinition
      EnumValueDescriptorProto: MessageTypeDefinition
      EnumValueOptions: MessageTypeDefinition
      FieldDescriptorProto: MessageTypeDefinition
      FieldOptions: MessageTypeDefinition
      FileDescriptorProto: MessageTypeDefinition
      FileDescriptorSet: MessageTypeDefinition
      FileOptions: MessageTypeDefinition
      FloatValue: MessageTypeDefinition
      GeneratedCodeInfo: MessageTypeDefinition
      Int32Value: MessageTypeDefinition
      Int64Value: MessageTypeDefinition
      ListValue: MessageTypeDefinition
      MessageOptions: MessageTypeDefinition
      MethodDescriptorProto: MessageTypeDefinition
      MethodOptions: MessageTypeDefinition
      NullValue: EnumTypeDefinition
      OneofDescriptorProto: MessageTypeDefinition
      OneofOptions: MessageTypeDefinition
      ServiceDescriptorProto: MessageTypeDefinition
      ServiceOptions: MessageTypeDefinition
      SourceCodeInfo: MessageTypeDefinition
      StringValue: MessageTypeDefinition
      Struct: MessageTypeDefinition
      Timestamp: MessageTypeDefinition
      UInt32Value: MessageTypeDefinition
      UInt64Value: MessageTypeDefinition
      UninterpretedOption: MessageTypeDefinition
      Value: MessageTypeDefinition
    }
  }
  udpa: {
    annotations: {
      FieldMigrateAnnotation: MessageTypeDefinition
      FileMigrateAnnotation: MessageTypeDefinition
      MigrateAnnotation: MessageTypeDefinition
      PackageVersionStatus: EnumTypeDefinition
      StatusAnnotation: MessageTypeDefinition
      VersioningAnnotation: MessageTypeDefinition
    }
  }
  validate: {
    AnyRules: MessageTypeDefinition
    BoolRules: MessageTypeDefinition
    BytesRules: MessageTypeDefinition
    DoubleRules: MessageTypeDefinition
    DurationRules: MessageTypeDefinition
    EnumRules: MessageTypeDefinition
    FieldRules: MessageTypeDefinition
    Fixed32Rules: MessageTypeDefinition
    Fixed64Rules: MessageTypeDefinition
    FloatRules: MessageTypeDefinition
    Int32Rules: MessageTypeDefinition
    Int64Rules: MessageTypeDefinition
    KnownRegex: EnumTypeDefinition
    MapRules: MessageTypeDefinition
    MessageRules: MessageTypeDefinition
    RepeatedRules: MessageTypeDefinition
    SFixed32Rules: MessageTypeDefinition
    SFixed64Rules: MessageTypeDefinition
    SInt32Rules: MessageTypeDefinition
    SInt64Rules: MessageTypeDefinition
    StringRules: MessageTypeDefinition
    TimestampRules: MessageTypeDefinition
    UInt32Rules: MessageTypeDefinition
    UInt64Rules: MessageTypeDefinition
  }
  xds: {
    annotations: {
      v3: {
        FieldStatusAnnotation: MessageTypeDefinition
        FileStatusAnnotation: MessageTypeDefinition
        MessageStatusAnnotation: MessageTypeDefinition
        PackageVersionStatus: EnumTypeDefinition
        StatusAnnotation: MessageTypeDefinition
      }
    }
    core: {
      v3: {
        ContextParams: MessageTypeDefinition
      }
    }
  }
}

