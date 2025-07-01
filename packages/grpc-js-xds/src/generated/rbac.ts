import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';


type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  envoy: {
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
          KeyValue: MessageTypeDefinition
          KeyValueAppend: MessageTypeDefinition
          KeyValueMutation: MessageTypeDefinition
          Locality: MessageTypeDefinition
          Metadata: MessageTypeDefinition
          Node: MessageTypeDefinition
          Pipe: MessageTypeDefinition
          ProxyProtocolConfig: MessageTypeDefinition
          ProxyProtocolPassThroughTLVs: MessageTypeDefinition
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
          TypedExtensionConfig: MessageTypeDefinition
          WatchedDirectory: MessageTypeDefinition
        }
      }
      rbac: {
        v3: {
          Action: MessageTypeDefinition
          Permission: MessageTypeDefinition
          Policy: MessageTypeDefinition
          Principal: MessageTypeDefinition
          RBAC: MessageTypeDefinition
        }
      }
      route: {
        v3: {
          ClusterSpecifierPlugin: MessageTypeDefinition
          CorsPolicy: MessageTypeDefinition
          Decorator: MessageTypeDefinition
          DirectResponseAction: MessageTypeDefinition
          FilterAction: MessageTypeDefinition
          FilterConfig: MessageTypeDefinition
          HeaderMatcher: MessageTypeDefinition
          HedgePolicy: MessageTypeDefinition
          InternalRedirectPolicy: MessageTypeDefinition
          NonForwardingAction: MessageTypeDefinition
          QueryParameterMatcher: MessageTypeDefinition
          RateLimit: MessageTypeDefinition
          RedirectAction: MessageTypeDefinition
          RetryPolicy: MessageTypeDefinition
          Route: MessageTypeDefinition
          RouteAction: MessageTypeDefinition
          RouteList: MessageTypeDefinition
          RouteMatch: MessageTypeDefinition
          Tracing: MessageTypeDefinition
          VirtualCluster: MessageTypeDefinition
          VirtualHost: MessageTypeDefinition
          WeightedCluster: MessageTypeDefinition
        }
      }
    }
    extensions: {
      filters: {
        http: {
          rbac: {
            v3: {
              RBAC: MessageTypeDefinition
              RBACPerRoute: MessageTypeDefinition
            }
          }
        }
      }
    }
    type: {
      matcher: {
        v3: {
          DoubleMatcher: MessageTypeDefinition
          FilterStateMatcher: MessageTypeDefinition
          ListMatcher: MessageTypeDefinition
          ListStringMatcher: MessageTypeDefinition
          MetadataMatcher: MessageTypeDefinition
          OrMatcher: MessageTypeDefinition
          PathMatcher: MessageTypeDefinition
          RegexMatchAndSubstitute: MessageTypeDefinition
          RegexMatcher: MessageTypeDefinition
          StringMatcher: MessageTypeDefinition
          ValueMatcher: MessageTypeDefinition
        }
      }
      metadata: {
        v3: {
          MetadataKey: MessageTypeDefinition
          MetadataKind: MessageTypeDefinition
        }
      }
      tracing: {
        v3: {
          CustomTag: MessageTypeDefinition
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
      expr: {
        v1alpha1: {
          CheckedExpr: MessageTypeDefinition
          Constant: MessageTypeDefinition
          Decl: MessageTypeDefinition
          Expr: MessageTypeDefinition
          ParsedExpr: MessageTypeDefinition
          Reference: MessageTypeDefinition
          SourceInfo: MessageTypeDefinition
          SourcePosition: MessageTypeDefinition
          Type: MessageTypeDefinition
        }
      }
    }
    protobuf: {
      Any: MessageTypeDefinition
      BoolValue: MessageTypeDefinition
      BytesValue: MessageTypeDefinition
      DescriptorProto: MessageTypeDefinition
      DoubleValue: MessageTypeDefinition
      Duration: MessageTypeDefinition
      Edition: EnumTypeDefinition
      Empty: MessageTypeDefinition
      EnumDescriptorProto: MessageTypeDefinition
      EnumOptions: MessageTypeDefinition
      EnumValueDescriptorProto: MessageTypeDefinition
      EnumValueOptions: MessageTypeDefinition
      ExtensionRangeOptions: MessageTypeDefinition
      FeatureSet: MessageTypeDefinition
      FeatureSetDefaults: MessageTypeDefinition
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
      SymbolVisibility: EnumTypeDefinition
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
        TypedExtensionConfig: MessageTypeDefinition
      }
    }
    type: {
      matcher: {
        v3: {
          ListStringMatcher: MessageTypeDefinition
          Matcher: MessageTypeDefinition
          RegexMatcher: MessageTypeDefinition
          StringMatcher: MessageTypeDefinition
        }
      }
    }
  }
}

