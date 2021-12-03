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
        BootstrapConfigDump: MessageTypeDefinition
        ClientResourceStatus: EnumTypeDefinition
        ClustersConfigDump: MessageTypeDefinition
        ConfigDump: MessageTypeDefinition
        EndpointsConfigDump: MessageTypeDefinition
        ListenersConfigDump: MessageTypeDefinition
        RoutesConfigDump: MessageTypeDefinition
        ScopedRoutesConfigDump: MessageTypeDefinition
        SecretsConfigDump: MessageTypeDefinition
        UpdateFailureState: MessageTypeDefinition
      }
    }
    annotations: {
    }
    config: {
      accesslog: {
        v3: {
          AccessLog: MessageTypeDefinition
          AccessLogFilter: MessageTypeDefinition
          AndFilter: MessageTypeDefinition
          ComparisonFilter: MessageTypeDefinition
          DurationFilter: MessageTypeDefinition
          ExtensionFilter: MessageTypeDefinition
          GrpcStatusFilter: MessageTypeDefinition
          HeaderFilter: MessageTypeDefinition
          MetadataFilter: MessageTypeDefinition
          NotHealthCheckFilter: MessageTypeDefinition
          OrFilter: MessageTypeDefinition
          ResponseFlagFilter: MessageTypeDefinition
          RuntimeFilter: MessageTypeDefinition
          StatusCodeFilter: MessageTypeDefinition
          TraceableFilter: MessageTypeDefinition
        }
      }
      bootstrap: {
        v3: {
          Admin: MessageTypeDefinition
          Bootstrap: MessageTypeDefinition
          ClusterManager: MessageTypeDefinition
          CustomInlineHeader: MessageTypeDefinition
          FatalAction: MessageTypeDefinition
          LayeredRuntime: MessageTypeDefinition
          Runtime: MessageTypeDefinition
          RuntimeLayer: MessageTypeDefinition
          Watchdog: MessageTypeDefinition
          Watchdogs: MessageTypeDefinition
        }
      }
      cluster: {
        v3: {
          CircuitBreakers: MessageTypeDefinition
          Cluster: MessageTypeDefinition
          ClusterCollection: MessageTypeDefinition
          Filter: MessageTypeDefinition
          LoadBalancingPolicy: MessageTypeDefinition
          OutlierDetection: MessageTypeDefinition
          TrackClusterStats: MessageTypeDefinition
          UpstreamBindConfig: MessageTypeDefinition
          UpstreamConnectionOptions: MessageTypeDefinition
        }
      }
      core: {
        v3: {
          Address: MessageTypeDefinition
          AggregatedConfigSource: MessageTypeDefinition
          AlternateProtocolsCacheOptions: MessageTypeDefinition
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
          DnsResolutionConfig: MessageTypeDefinition
          DnsResolverOptions: MessageTypeDefinition
          EnvoyInternalAddress: MessageTypeDefinition
          EventServiceConfig: MessageTypeDefinition
          Extension: MessageTypeDefinition
          ExtensionConfigSource: MessageTypeDefinition
          GrpcProtocolOptions: MessageTypeDefinition
          GrpcService: MessageTypeDefinition
          HeaderMap: MessageTypeDefinition
          HeaderValue: MessageTypeDefinition
          HeaderValueOption: MessageTypeDefinition
          HealthCheck: MessageTypeDefinition
          HealthStatus: EnumTypeDefinition
          Http1ProtocolOptions: MessageTypeDefinition
          Http2ProtocolOptions: MessageTypeDefinition
          Http3ProtocolOptions: MessageTypeDefinition
          HttpProtocolOptions: MessageTypeDefinition
          HttpUri: MessageTypeDefinition
          KeepaliveSettings: MessageTypeDefinition
          Locality: MessageTypeDefinition
          Metadata: MessageTypeDefinition
          Node: MessageTypeDefinition
          Pipe: MessageTypeDefinition
          ProxyProtocolConfig: MessageTypeDefinition
          QueryParameter: MessageTypeDefinition
          QuicProtocolOptions: MessageTypeDefinition
          RateLimitSettings: MessageTypeDefinition
          RemoteDataSource: MessageTypeDefinition
          RequestMethod: EnumTypeDefinition
          RetryPolicy: MessageTypeDefinition
          RoutingPriority: EnumTypeDefinition
          RuntimeDouble: MessageTypeDefinition
          RuntimeFeatureFlag: MessageTypeDefinition
          RuntimeFractionalPercent: MessageTypeDefinition
          RuntimePercent: MessageTypeDefinition
          RuntimeUInt32: MessageTypeDefinition
          SchemeHeaderTransformation: MessageTypeDefinition
          SelfConfigSource: MessageTypeDefinition
          SocketAddress: MessageTypeDefinition
          SocketOption: MessageTypeDefinition
          TcpKeepalive: MessageTypeDefinition
          TcpProtocolOptions: MessageTypeDefinition
          TrafficDirection: EnumTypeDefinition
          TransportSocket: MessageTypeDefinition
          TypedExtensionConfig: MessageTypeDefinition
          UdpSocketConfig: MessageTypeDefinition
          UpstreamHttpProtocolOptions: MessageTypeDefinition
          WatchedDirectory: MessageTypeDefinition
        }
      }
      endpoint: {
        v3: {
          ClusterLoadAssignment: MessageTypeDefinition
          Endpoint: MessageTypeDefinition
          LbEndpoint: MessageTypeDefinition
          LedsClusterLocalityConfig: MessageTypeDefinition
          LocalityLbEndpoints: MessageTypeDefinition
        }
      }
      listener: {
        v3: {
          ActiveRawUdpListenerConfig: MessageTypeDefinition
          ApiListener: MessageTypeDefinition
          Filter: MessageTypeDefinition
          FilterChain: MessageTypeDefinition
          FilterChainMatch: MessageTypeDefinition
          Listener: MessageTypeDefinition
          ListenerCollection: MessageTypeDefinition
          ListenerFilter: MessageTypeDefinition
          ListenerFilterChainMatchPredicate: MessageTypeDefinition
          QuicProtocolOptions: MessageTypeDefinition
          UdpListenerConfig: MessageTypeDefinition
        }
      }
      metrics: {
        v3: {
          DogStatsdSink: MessageTypeDefinition
          HistogramBucketSettings: MessageTypeDefinition
          HystrixSink: MessageTypeDefinition
          StatsConfig: MessageTypeDefinition
          StatsMatcher: MessageTypeDefinition
          StatsSink: MessageTypeDefinition
          StatsdSink: MessageTypeDefinition
          TagSpecifier: MessageTypeDefinition
        }
      }
      overload: {
        v3: {
          BufferFactoryConfig: MessageTypeDefinition
          OverloadAction: MessageTypeDefinition
          OverloadManager: MessageTypeDefinition
          ResourceMonitor: MessageTypeDefinition
          ScaleTimersOverloadActionConfig: MessageTypeDefinition
          ScaledTrigger: MessageTypeDefinition
          ThresholdTrigger: MessageTypeDefinition
          Trigger: MessageTypeDefinition
        }
      }
      route: {
        v3: {
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
          RouteMatch: MessageTypeDefinition
          Tracing: MessageTypeDefinition
          VirtualCluster: MessageTypeDefinition
          VirtualHost: MessageTypeDefinition
          WeightedCluster: MessageTypeDefinition
        }
      }
      trace: {
        v3: {
          Tracing: MessageTypeDefinition
        }
      }
    }
    extensions: {
      transport_sockets: {
        tls: {
          v3: {
            CertificateProviderPluginInstance: MessageTypeDefinition
            CertificateValidationContext: MessageTypeDefinition
            GenericSecret: MessageTypeDefinition
            PrivateKeyProvider: MessageTypeDefinition
            SdsSecretConfig: MessageTypeDefinition
            Secret: MessageTypeDefinition
            TlsCertificate: MessageTypeDefinition
            TlsParameters: MessageTypeDefinition
            TlsSessionTicketKeys: MessageTypeDefinition
          }
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
          MetadataMatcher: MessageTypeDefinition
          NodeMatcher: MessageTypeDefinition
          RegexMatchAndSubstitute: MessageTypeDefinition
          RegexMatcher: MessageTypeDefinition
          StringMatcher: MessageTypeDefinition
          StructMatcher: MessageTypeDefinition
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
        CodecClientType: EnumTypeDefinition
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
      FieldSecurityAnnotation: MessageTypeDefinition
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
        Authority: MessageTypeDefinition
        CollectionEntry: MessageTypeDefinition
        ContextParams: MessageTypeDefinition
        ResourceLocator: MessageTypeDefinition
      }
    }
  }
}

