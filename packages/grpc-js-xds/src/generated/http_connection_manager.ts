import type * as grpc from '@grpc/grpc-js';
import type { ServiceDefinition, EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';


type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  envoy: {
    annotations: {
    }
    api: {
      v2: {
        RouteConfiguration: MessageTypeDefinition
        ScopedRouteConfiguration: MessageTypeDefinition
        Vhds: MessageTypeDefinition
        core: {
          Address: MessageTypeDefinition
          AggregatedConfigSource: MessageTypeDefinition
          ApiConfigSource: MessageTypeDefinition
          ApiVersion: EnumTypeDefinition
          AsyncDataSource: MessageTypeDefinition
          BackoffStrategy: MessageTypeDefinition
          BindConfig: MessageTypeDefinition
          BuildVersion: MessageTypeDefinition
          CidrRange: MessageTypeDefinition
          ConfigSource: MessageTypeDefinition
          ControlPlane: MessageTypeDefinition
          DataSource: MessageTypeDefinition
          Extension: MessageTypeDefinition
          GrpcProtocolOptions: MessageTypeDefinition
          GrpcService: MessageTypeDefinition
          HeaderMap: MessageTypeDefinition
          HeaderValue: MessageTypeDefinition
          HeaderValueOption: MessageTypeDefinition
          Http1ProtocolOptions: MessageTypeDefinition
          Http2ProtocolOptions: MessageTypeDefinition
          HttpProtocolOptions: MessageTypeDefinition
          HttpUri: MessageTypeDefinition
          Locality: MessageTypeDefinition
          Metadata: MessageTypeDefinition
          Node: MessageTypeDefinition
          Pipe: MessageTypeDefinition
          RateLimitSettings: MessageTypeDefinition
          RemoteDataSource: MessageTypeDefinition
          RequestMethod: EnumTypeDefinition
          RetryPolicy: MessageTypeDefinition
          RoutingPriority: EnumTypeDefinition
          RuntimeDouble: MessageTypeDefinition
          RuntimeFeatureFlag: MessageTypeDefinition
          RuntimeFractionalPercent: MessageTypeDefinition
          RuntimeUInt32: MessageTypeDefinition
          SelfConfigSource: MessageTypeDefinition
          SocketAddress: MessageTypeDefinition
          SocketOption: MessageTypeDefinition
          TcpKeepalive: MessageTypeDefinition
          TcpProtocolOptions: MessageTypeDefinition
          TrafficDirection: EnumTypeDefinition
          TransportSocket: MessageTypeDefinition
          UpstreamHttpProtocolOptions: MessageTypeDefinition
        }
        route: {
          CorsPolicy: MessageTypeDefinition
          Decorator: MessageTypeDefinition
          DirectResponseAction: MessageTypeDefinition
          FilterAction: MessageTypeDefinition
          HeaderMatcher: MessageTypeDefinition
          HedgePolicy: MessageTypeDefinition
          QueryParameterMatcher: MessageTypeDefinition
          RateLimit: MessageTypeDefinition
          RedirectAction: MessageTypeDefinition
          RetryPolicy: MessageTypeDefinition
          Route: MessageTypeDefinition
          RouteAction: MessageTypeDefinition
          RouteMatch: MessageTypeDefinition
          Tracing: MessageTypeDefinition
          VirtualCluster: MessageTypeDefinition
          VirtualHost: MessageTypeDefinition
          WeightedCluster: MessageTypeDefinition
        }
      }
    }
    config: {
      filter: {
        accesslog: {
          v2: {
            AccessLog: MessageTypeDefinition
            AccessLogFilter: MessageTypeDefinition
            AndFilter: MessageTypeDefinition
            ComparisonFilter: MessageTypeDefinition
            DurationFilter: MessageTypeDefinition
            ExtensionFilter: MessageTypeDefinition
            GrpcStatusFilter: MessageTypeDefinition
            HeaderFilter: MessageTypeDefinition
            NotHealthCheckFilter: MessageTypeDefinition
            OrFilter: MessageTypeDefinition
            ResponseFlagFilter: MessageTypeDefinition
            RuntimeFilter: MessageTypeDefinition
            StatusCodeFilter: MessageTypeDefinition
            TraceableFilter: MessageTypeDefinition
          }
        }
        network: {
          http_connection_manager: {
            v2: {
              HttpConnectionManager: MessageTypeDefinition
              HttpFilter: MessageTypeDefinition
              Rds: MessageTypeDefinition
              RequestIDExtension: MessageTypeDefinition
              ScopedRds: MessageTypeDefinition
              ScopedRouteConfigurationsList: MessageTypeDefinition
              ScopedRoutes: MessageTypeDefinition
            }
          }
        }
      }
      trace: {
        v2: {
          Tracing: MessageTypeDefinition
        }
      }
    }
    type: {
      DoubleRange: MessageTypeDefinition
      FractionalPercent: MessageTypeDefinition
      Int32Range: MessageTypeDefinition
      Int64Range: MessageTypeDefinition
      Percent: MessageTypeDefinition
      SemanticVersion: MessageTypeDefinition
      matcher: {
        ListStringMatcher: MessageTypeDefinition
        RegexMatchAndSubstitute: MessageTypeDefinition
        RegexMatcher: MessageTypeDefinition
        StringMatcher: MessageTypeDefinition
      }
      metadata: {
        v2: {
          MetadataKey: MessageTypeDefinition
          MetadataKind: MessageTypeDefinition
        }
      }
      tracing: {
        v2: {
          CustomTag: MessageTypeDefinition
        }
      }
    }
  }
  google: {
    protobuf: {
      Any: MessageTypeDefinition
      BoolValue: MessageTypeDefinition
      BytesValue: MessageTypeDefinition
      DescriptorProto: MessageTypeDefinition
      DoubleValue: MessageTypeDefinition
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
}

