import * as grpc from '../index';
import { ServiceDefinition, EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import { Cluster as _envoy_api_v2_Cluster, Cluster__Output as _envoy_api_v2_Cluster__Output } from './envoy/api/v2/Cluster';
import { ClusterLoadAssignment as _envoy_api_v2_ClusterLoadAssignment, ClusterLoadAssignment__Output as _envoy_api_v2_ClusterLoadAssignment__Output } from './envoy/api/v2/ClusterLoadAssignment';
import { LoadBalancingPolicy as _envoy_api_v2_LoadBalancingPolicy, LoadBalancingPolicy__Output as _envoy_api_v2_LoadBalancingPolicy__Output } from './envoy/api/v2/LoadBalancingPolicy';
import { UpstreamBindConfig as _envoy_api_v2_UpstreamBindConfig, UpstreamBindConfig__Output as _envoy_api_v2_UpstreamBindConfig__Output } from './envoy/api/v2/UpstreamBindConfig';
import { UpstreamConnectionOptions as _envoy_api_v2_UpstreamConnectionOptions, UpstreamConnectionOptions__Output as _envoy_api_v2_UpstreamConnectionOptions__Output } from './envoy/api/v2/UpstreamConnectionOptions';
import { CertificateValidationContext as _envoy_api_v2_auth_CertificateValidationContext, CertificateValidationContext__Output as _envoy_api_v2_auth_CertificateValidationContext__Output } from './envoy/api/v2/auth/CertificateValidationContext';
import { CommonTlsContext as _envoy_api_v2_auth_CommonTlsContext, CommonTlsContext__Output as _envoy_api_v2_auth_CommonTlsContext__Output } from './envoy/api/v2/auth/CommonTlsContext';
import { DownstreamTlsContext as _envoy_api_v2_auth_DownstreamTlsContext, DownstreamTlsContext__Output as _envoy_api_v2_auth_DownstreamTlsContext__Output } from './envoy/api/v2/auth/DownstreamTlsContext';
import { GenericSecret as _envoy_api_v2_auth_GenericSecret, GenericSecret__Output as _envoy_api_v2_auth_GenericSecret__Output } from './envoy/api/v2/auth/GenericSecret';
import { PrivateKeyProvider as _envoy_api_v2_auth_PrivateKeyProvider, PrivateKeyProvider__Output as _envoy_api_v2_auth_PrivateKeyProvider__Output } from './envoy/api/v2/auth/PrivateKeyProvider';
import { SdsSecretConfig as _envoy_api_v2_auth_SdsSecretConfig, SdsSecretConfig__Output as _envoy_api_v2_auth_SdsSecretConfig__Output } from './envoy/api/v2/auth/SdsSecretConfig';
import { Secret as _envoy_api_v2_auth_Secret, Secret__Output as _envoy_api_v2_auth_Secret__Output } from './envoy/api/v2/auth/Secret';
import { TlsCertificate as _envoy_api_v2_auth_TlsCertificate, TlsCertificate__Output as _envoy_api_v2_auth_TlsCertificate__Output } from './envoy/api/v2/auth/TlsCertificate';
import { TlsParameters as _envoy_api_v2_auth_TlsParameters, TlsParameters__Output as _envoy_api_v2_auth_TlsParameters__Output } from './envoy/api/v2/auth/TlsParameters';
import { TlsSessionTicketKeys as _envoy_api_v2_auth_TlsSessionTicketKeys, TlsSessionTicketKeys__Output as _envoy_api_v2_auth_TlsSessionTicketKeys__Output } from './envoy/api/v2/auth/TlsSessionTicketKeys';
import { UpstreamTlsContext as _envoy_api_v2_auth_UpstreamTlsContext, UpstreamTlsContext__Output as _envoy_api_v2_auth_UpstreamTlsContext__Output } from './envoy/api/v2/auth/UpstreamTlsContext';
import { CircuitBreakers as _envoy_api_v2_cluster_CircuitBreakers, CircuitBreakers__Output as _envoy_api_v2_cluster_CircuitBreakers__Output } from './envoy/api/v2/cluster/CircuitBreakers';
import { Filter as _envoy_api_v2_cluster_Filter, Filter__Output as _envoy_api_v2_cluster_Filter__Output } from './envoy/api/v2/cluster/Filter';
import { OutlierDetection as _envoy_api_v2_cluster_OutlierDetection, OutlierDetection__Output as _envoy_api_v2_cluster_OutlierDetection__Output } from './envoy/api/v2/cluster/OutlierDetection';
import { Address as _envoy_api_v2_core_Address, Address__Output as _envoy_api_v2_core_Address__Output } from './envoy/api/v2/core/Address';
import { AggregatedConfigSource as _envoy_api_v2_core_AggregatedConfigSource, AggregatedConfigSource__Output as _envoy_api_v2_core_AggregatedConfigSource__Output } from './envoy/api/v2/core/AggregatedConfigSource';
import { ApiConfigSource as _envoy_api_v2_core_ApiConfigSource, ApiConfigSource__Output as _envoy_api_v2_core_ApiConfigSource__Output } from './envoy/api/v2/core/ApiConfigSource';
import { ApiVersion as _envoy_api_v2_core_ApiVersion } from './envoy/api/v2/core/ApiVersion';
import { AsyncDataSource as _envoy_api_v2_core_AsyncDataSource, AsyncDataSource__Output as _envoy_api_v2_core_AsyncDataSource__Output } from './envoy/api/v2/core/AsyncDataSource';
import { BackoffStrategy as _envoy_api_v2_core_BackoffStrategy, BackoffStrategy__Output as _envoy_api_v2_core_BackoffStrategy__Output } from './envoy/api/v2/core/BackoffStrategy';
import { BindConfig as _envoy_api_v2_core_BindConfig, BindConfig__Output as _envoy_api_v2_core_BindConfig__Output } from './envoy/api/v2/core/BindConfig';
import { BuildVersion as _envoy_api_v2_core_BuildVersion, BuildVersion__Output as _envoy_api_v2_core_BuildVersion__Output } from './envoy/api/v2/core/BuildVersion';
import { CidrRange as _envoy_api_v2_core_CidrRange, CidrRange__Output as _envoy_api_v2_core_CidrRange__Output } from './envoy/api/v2/core/CidrRange';
import { ConfigSource as _envoy_api_v2_core_ConfigSource, ConfigSource__Output as _envoy_api_v2_core_ConfigSource__Output } from './envoy/api/v2/core/ConfigSource';
import { ControlPlane as _envoy_api_v2_core_ControlPlane, ControlPlane__Output as _envoy_api_v2_core_ControlPlane__Output } from './envoy/api/v2/core/ControlPlane';
import { DataSource as _envoy_api_v2_core_DataSource, DataSource__Output as _envoy_api_v2_core_DataSource__Output } from './envoy/api/v2/core/DataSource';
import { EventServiceConfig as _envoy_api_v2_core_EventServiceConfig, EventServiceConfig__Output as _envoy_api_v2_core_EventServiceConfig__Output } from './envoy/api/v2/core/EventServiceConfig';
import { Extension as _envoy_api_v2_core_Extension, Extension__Output as _envoy_api_v2_core_Extension__Output } from './envoy/api/v2/core/Extension';
import { GrpcProtocolOptions as _envoy_api_v2_core_GrpcProtocolOptions, GrpcProtocolOptions__Output as _envoy_api_v2_core_GrpcProtocolOptions__Output } from './envoy/api/v2/core/GrpcProtocolOptions';
import { GrpcService as _envoy_api_v2_core_GrpcService, GrpcService__Output as _envoy_api_v2_core_GrpcService__Output } from './envoy/api/v2/core/GrpcService';
import { HeaderMap as _envoy_api_v2_core_HeaderMap, HeaderMap__Output as _envoy_api_v2_core_HeaderMap__Output } from './envoy/api/v2/core/HeaderMap';
import { HeaderValue as _envoy_api_v2_core_HeaderValue, HeaderValue__Output as _envoy_api_v2_core_HeaderValue__Output } from './envoy/api/v2/core/HeaderValue';
import { HeaderValueOption as _envoy_api_v2_core_HeaderValueOption, HeaderValueOption__Output as _envoy_api_v2_core_HeaderValueOption__Output } from './envoy/api/v2/core/HeaderValueOption';
import { HealthCheck as _envoy_api_v2_core_HealthCheck, HealthCheck__Output as _envoy_api_v2_core_HealthCheck__Output } from './envoy/api/v2/core/HealthCheck';
import { HealthStatus as _envoy_api_v2_core_HealthStatus } from './envoy/api/v2/core/HealthStatus';
import { Http1ProtocolOptions as _envoy_api_v2_core_Http1ProtocolOptions, Http1ProtocolOptions__Output as _envoy_api_v2_core_Http1ProtocolOptions__Output } from './envoy/api/v2/core/Http1ProtocolOptions';
import { Http2ProtocolOptions as _envoy_api_v2_core_Http2ProtocolOptions, Http2ProtocolOptions__Output as _envoy_api_v2_core_Http2ProtocolOptions__Output } from './envoy/api/v2/core/Http2ProtocolOptions';
import { HttpProtocolOptions as _envoy_api_v2_core_HttpProtocolOptions, HttpProtocolOptions__Output as _envoy_api_v2_core_HttpProtocolOptions__Output } from './envoy/api/v2/core/HttpProtocolOptions';
import { HttpUri as _envoy_api_v2_core_HttpUri, HttpUri__Output as _envoy_api_v2_core_HttpUri__Output } from './envoy/api/v2/core/HttpUri';
import { Locality as _envoy_api_v2_core_Locality, Locality__Output as _envoy_api_v2_core_Locality__Output } from './envoy/api/v2/core/Locality';
import { Metadata as _envoy_api_v2_core_Metadata, Metadata__Output as _envoy_api_v2_core_Metadata__Output } from './envoy/api/v2/core/Metadata';
import { Node as _envoy_api_v2_core_Node, Node__Output as _envoy_api_v2_core_Node__Output } from './envoy/api/v2/core/Node';
import { Pipe as _envoy_api_v2_core_Pipe, Pipe__Output as _envoy_api_v2_core_Pipe__Output } from './envoy/api/v2/core/Pipe';
import { RateLimitSettings as _envoy_api_v2_core_RateLimitSettings, RateLimitSettings__Output as _envoy_api_v2_core_RateLimitSettings__Output } from './envoy/api/v2/core/RateLimitSettings';
import { RemoteDataSource as _envoy_api_v2_core_RemoteDataSource, RemoteDataSource__Output as _envoy_api_v2_core_RemoteDataSource__Output } from './envoy/api/v2/core/RemoteDataSource';
import { RequestMethod as _envoy_api_v2_core_RequestMethod } from './envoy/api/v2/core/RequestMethod';
import { RetryPolicy as _envoy_api_v2_core_RetryPolicy, RetryPolicy__Output as _envoy_api_v2_core_RetryPolicy__Output } from './envoy/api/v2/core/RetryPolicy';
import { RoutingPriority as _envoy_api_v2_core_RoutingPriority } from './envoy/api/v2/core/RoutingPriority';
import { RuntimeDouble as _envoy_api_v2_core_RuntimeDouble, RuntimeDouble__Output as _envoy_api_v2_core_RuntimeDouble__Output } from './envoy/api/v2/core/RuntimeDouble';
import { RuntimeFeatureFlag as _envoy_api_v2_core_RuntimeFeatureFlag, RuntimeFeatureFlag__Output as _envoy_api_v2_core_RuntimeFeatureFlag__Output } from './envoy/api/v2/core/RuntimeFeatureFlag';
import { RuntimeFractionalPercent as _envoy_api_v2_core_RuntimeFractionalPercent, RuntimeFractionalPercent__Output as _envoy_api_v2_core_RuntimeFractionalPercent__Output } from './envoy/api/v2/core/RuntimeFractionalPercent';
import { RuntimeUInt32 as _envoy_api_v2_core_RuntimeUInt32, RuntimeUInt32__Output as _envoy_api_v2_core_RuntimeUInt32__Output } from './envoy/api/v2/core/RuntimeUInt32';
import { SelfConfigSource as _envoy_api_v2_core_SelfConfigSource, SelfConfigSource__Output as _envoy_api_v2_core_SelfConfigSource__Output } from './envoy/api/v2/core/SelfConfigSource';
import { SocketAddress as _envoy_api_v2_core_SocketAddress, SocketAddress__Output as _envoy_api_v2_core_SocketAddress__Output } from './envoy/api/v2/core/SocketAddress';
import { SocketOption as _envoy_api_v2_core_SocketOption, SocketOption__Output as _envoy_api_v2_core_SocketOption__Output } from './envoy/api/v2/core/SocketOption';
import { TcpKeepalive as _envoy_api_v2_core_TcpKeepalive, TcpKeepalive__Output as _envoy_api_v2_core_TcpKeepalive__Output } from './envoy/api/v2/core/TcpKeepalive';
import { TcpProtocolOptions as _envoy_api_v2_core_TcpProtocolOptions, TcpProtocolOptions__Output as _envoy_api_v2_core_TcpProtocolOptions__Output } from './envoy/api/v2/core/TcpProtocolOptions';
import { TrafficDirection as _envoy_api_v2_core_TrafficDirection } from './envoy/api/v2/core/TrafficDirection';
import { TransportSocket as _envoy_api_v2_core_TransportSocket, TransportSocket__Output as _envoy_api_v2_core_TransportSocket__Output } from './envoy/api/v2/core/TransportSocket';
import { UpstreamHttpProtocolOptions as _envoy_api_v2_core_UpstreamHttpProtocolOptions, UpstreamHttpProtocolOptions__Output as _envoy_api_v2_core_UpstreamHttpProtocolOptions__Output } from './envoy/api/v2/core/UpstreamHttpProtocolOptions';
import { Endpoint as _envoy_api_v2_endpoint_Endpoint, Endpoint__Output as _envoy_api_v2_endpoint_Endpoint__Output } from './envoy/api/v2/endpoint/Endpoint';
import { LbEndpoint as _envoy_api_v2_endpoint_LbEndpoint, LbEndpoint__Output as _envoy_api_v2_endpoint_LbEndpoint__Output } from './envoy/api/v2/endpoint/LbEndpoint';
import { LocalityLbEndpoints as _envoy_api_v2_endpoint_LocalityLbEndpoints, LocalityLbEndpoints__Output as _envoy_api_v2_endpoint_LocalityLbEndpoints__Output } from './envoy/api/v2/endpoint/LocalityLbEndpoints';
import { CodecClientType as _envoy_type_CodecClientType } from './envoy/type/CodecClientType';
import { DoubleRange as _envoy_type_DoubleRange, DoubleRange__Output as _envoy_type_DoubleRange__Output } from './envoy/type/DoubleRange';
import { FractionalPercent as _envoy_type_FractionalPercent, FractionalPercent__Output as _envoy_type_FractionalPercent__Output } from './envoy/type/FractionalPercent';
import { Int32Range as _envoy_type_Int32Range, Int32Range__Output as _envoy_type_Int32Range__Output } from './envoy/type/Int32Range';
import { Int64Range as _envoy_type_Int64Range, Int64Range__Output as _envoy_type_Int64Range__Output } from './envoy/type/Int64Range';
import { Percent as _envoy_type_Percent, Percent__Output as _envoy_type_Percent__Output } from './envoy/type/Percent';
import { SemanticVersion as _envoy_type_SemanticVersion, SemanticVersion__Output as _envoy_type_SemanticVersion__Output } from './envoy/type/SemanticVersion';
import { ListStringMatcher as _envoy_type_matcher_ListStringMatcher, ListStringMatcher__Output as _envoy_type_matcher_ListStringMatcher__Output } from './envoy/type/matcher/ListStringMatcher';
import { RegexMatchAndSubstitute as _envoy_type_matcher_RegexMatchAndSubstitute, RegexMatchAndSubstitute__Output as _envoy_type_matcher_RegexMatchAndSubstitute__Output } from './envoy/type/matcher/RegexMatchAndSubstitute';
import { RegexMatcher as _envoy_type_matcher_RegexMatcher, RegexMatcher__Output as _envoy_type_matcher_RegexMatcher__Output } from './envoy/type/matcher/RegexMatcher';
import { StringMatcher as _envoy_type_matcher_StringMatcher, StringMatcher__Output as _envoy_type_matcher_StringMatcher__Output } from './envoy/type/matcher/StringMatcher';
import { CustomHttpPattern as _google_api_CustomHttpPattern, CustomHttpPattern__Output as _google_api_CustomHttpPattern__Output } from './google/api/CustomHttpPattern';
import { Http as _google_api_Http, Http__Output as _google_api_Http__Output } from './google/api/Http';
import { HttpRule as _google_api_HttpRule, HttpRule__Output as _google_api_HttpRule__Output } from './google/api/HttpRule';
import { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from './google/protobuf/Any';
import { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from './google/protobuf/BoolValue';
import { BytesValue as _google_protobuf_BytesValue, BytesValue__Output as _google_protobuf_BytesValue__Output } from './google/protobuf/BytesValue';
import { DescriptorProto as _google_protobuf_DescriptorProto, DescriptorProto__Output as _google_protobuf_DescriptorProto__Output } from './google/protobuf/DescriptorProto';
import { DoubleValue as _google_protobuf_DoubleValue, DoubleValue__Output as _google_protobuf_DoubleValue__Output } from './google/protobuf/DoubleValue';
import { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from './google/protobuf/Duration';
import { Empty as _google_protobuf_Empty, Empty__Output as _google_protobuf_Empty__Output } from './google/protobuf/Empty';
import { EnumDescriptorProto as _google_protobuf_EnumDescriptorProto, EnumDescriptorProto__Output as _google_protobuf_EnumDescriptorProto__Output } from './google/protobuf/EnumDescriptorProto';
import { EnumOptions as _google_protobuf_EnumOptions, EnumOptions__Output as _google_protobuf_EnumOptions__Output } from './google/protobuf/EnumOptions';
import { EnumValueDescriptorProto as _google_protobuf_EnumValueDescriptorProto, EnumValueDescriptorProto__Output as _google_protobuf_EnumValueDescriptorProto__Output } from './google/protobuf/EnumValueDescriptorProto';
import { EnumValueOptions as _google_protobuf_EnumValueOptions, EnumValueOptions__Output as _google_protobuf_EnumValueOptions__Output } from './google/protobuf/EnumValueOptions';
import { FieldDescriptorProto as _google_protobuf_FieldDescriptorProto, FieldDescriptorProto__Output as _google_protobuf_FieldDescriptorProto__Output } from './google/protobuf/FieldDescriptorProto';
import { FieldOptions as _google_protobuf_FieldOptions, FieldOptions__Output as _google_protobuf_FieldOptions__Output } from './google/protobuf/FieldOptions';
import { FileDescriptorProto as _google_protobuf_FileDescriptorProto, FileDescriptorProto__Output as _google_protobuf_FileDescriptorProto__Output } from './google/protobuf/FileDescriptorProto';
import { FileDescriptorSet as _google_protobuf_FileDescriptorSet, FileDescriptorSet__Output as _google_protobuf_FileDescriptorSet__Output } from './google/protobuf/FileDescriptorSet';
import { FileOptions as _google_protobuf_FileOptions, FileOptions__Output as _google_protobuf_FileOptions__Output } from './google/protobuf/FileOptions';
import { FloatValue as _google_protobuf_FloatValue, FloatValue__Output as _google_protobuf_FloatValue__Output } from './google/protobuf/FloatValue';
import { GeneratedCodeInfo as _google_protobuf_GeneratedCodeInfo, GeneratedCodeInfo__Output as _google_protobuf_GeneratedCodeInfo__Output } from './google/protobuf/GeneratedCodeInfo';
import { Int32Value as _google_protobuf_Int32Value, Int32Value__Output as _google_protobuf_Int32Value__Output } from './google/protobuf/Int32Value';
import { Int64Value as _google_protobuf_Int64Value, Int64Value__Output as _google_protobuf_Int64Value__Output } from './google/protobuf/Int64Value';
import { ListValue as _google_protobuf_ListValue, ListValue__Output as _google_protobuf_ListValue__Output } from './google/protobuf/ListValue';
import { MessageOptions as _google_protobuf_MessageOptions, MessageOptions__Output as _google_protobuf_MessageOptions__Output } from './google/protobuf/MessageOptions';
import { MethodDescriptorProto as _google_protobuf_MethodDescriptorProto, MethodDescriptorProto__Output as _google_protobuf_MethodDescriptorProto__Output } from './google/protobuf/MethodDescriptorProto';
import { MethodOptions as _google_protobuf_MethodOptions, MethodOptions__Output as _google_protobuf_MethodOptions__Output } from './google/protobuf/MethodOptions';
import { NullValue as _google_protobuf_NullValue } from './google/protobuf/NullValue';
import { OneofDescriptorProto as _google_protobuf_OneofDescriptorProto, OneofDescriptorProto__Output as _google_protobuf_OneofDescriptorProto__Output } from './google/protobuf/OneofDescriptorProto';
import { OneofOptions as _google_protobuf_OneofOptions, OneofOptions__Output as _google_protobuf_OneofOptions__Output } from './google/protobuf/OneofOptions';
import { ServiceDescriptorProto as _google_protobuf_ServiceDescriptorProto, ServiceDescriptorProto__Output as _google_protobuf_ServiceDescriptorProto__Output } from './google/protobuf/ServiceDescriptorProto';
import { ServiceOptions as _google_protobuf_ServiceOptions, ServiceOptions__Output as _google_protobuf_ServiceOptions__Output } from './google/protobuf/ServiceOptions';
import { SourceCodeInfo as _google_protobuf_SourceCodeInfo, SourceCodeInfo__Output as _google_protobuf_SourceCodeInfo__Output } from './google/protobuf/SourceCodeInfo';
import { StringValue as _google_protobuf_StringValue, StringValue__Output as _google_protobuf_StringValue__Output } from './google/protobuf/StringValue';
import { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from './google/protobuf/Struct';
import { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from './google/protobuf/Timestamp';
import { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from './google/protobuf/UInt32Value';
import { UInt64Value as _google_protobuf_UInt64Value, UInt64Value__Output as _google_protobuf_UInt64Value__Output } from './google/protobuf/UInt64Value';
import { UninterpretedOption as _google_protobuf_UninterpretedOption, UninterpretedOption__Output as _google_protobuf_UninterpretedOption__Output } from './google/protobuf/UninterpretedOption';
import { Value as _google_protobuf_Value, Value__Output as _google_protobuf_Value__Output } from './google/protobuf/Value';
import { FieldMigrateAnnotation as _udpa_annotations_FieldMigrateAnnotation, FieldMigrateAnnotation__Output as _udpa_annotations_FieldMigrateAnnotation__Output } from './udpa/annotations/FieldMigrateAnnotation';
import { FileMigrateAnnotation as _udpa_annotations_FileMigrateAnnotation, FileMigrateAnnotation__Output as _udpa_annotations_FileMigrateAnnotation__Output } from './udpa/annotations/FileMigrateAnnotation';
import { MigrateAnnotation as _udpa_annotations_MigrateAnnotation, MigrateAnnotation__Output as _udpa_annotations_MigrateAnnotation__Output } from './udpa/annotations/MigrateAnnotation';
import { PackageVersionStatus as _udpa_annotations_PackageVersionStatus } from './udpa/annotations/PackageVersionStatus';
import { StatusAnnotation as _udpa_annotations_StatusAnnotation, StatusAnnotation__Output as _udpa_annotations_StatusAnnotation__Output } from './udpa/annotations/StatusAnnotation';
import { AnyRules as _validate_AnyRules, AnyRules__Output as _validate_AnyRules__Output } from './validate/AnyRules';
import { BoolRules as _validate_BoolRules, BoolRules__Output as _validate_BoolRules__Output } from './validate/BoolRules';
import { BytesRules as _validate_BytesRules, BytesRules__Output as _validate_BytesRules__Output } from './validate/BytesRules';
import { DoubleRules as _validate_DoubleRules, DoubleRules__Output as _validate_DoubleRules__Output } from './validate/DoubleRules';
import { DurationRules as _validate_DurationRules, DurationRules__Output as _validate_DurationRules__Output } from './validate/DurationRules';
import { EnumRules as _validate_EnumRules, EnumRules__Output as _validate_EnumRules__Output } from './validate/EnumRules';
import { FieldRules as _validate_FieldRules, FieldRules__Output as _validate_FieldRules__Output } from './validate/FieldRules';
import { Fixed32Rules as _validate_Fixed32Rules, Fixed32Rules__Output as _validate_Fixed32Rules__Output } from './validate/Fixed32Rules';
import { Fixed64Rules as _validate_Fixed64Rules, Fixed64Rules__Output as _validate_Fixed64Rules__Output } from './validate/Fixed64Rules';
import { FloatRules as _validate_FloatRules, FloatRules__Output as _validate_FloatRules__Output } from './validate/FloatRules';
import { Int32Rules as _validate_Int32Rules, Int32Rules__Output as _validate_Int32Rules__Output } from './validate/Int32Rules';
import { Int64Rules as _validate_Int64Rules, Int64Rules__Output as _validate_Int64Rules__Output } from './validate/Int64Rules';
import { KnownRegex as _validate_KnownRegex } from './validate/KnownRegex';
import { MapRules as _validate_MapRules, MapRules__Output as _validate_MapRules__Output } from './validate/MapRules';
import { MessageRules as _validate_MessageRules, MessageRules__Output as _validate_MessageRules__Output } from './validate/MessageRules';
import { RepeatedRules as _validate_RepeatedRules, RepeatedRules__Output as _validate_RepeatedRules__Output } from './validate/RepeatedRules';
import { SFixed32Rules as _validate_SFixed32Rules, SFixed32Rules__Output as _validate_SFixed32Rules__Output } from './validate/SFixed32Rules';
import { SFixed64Rules as _validate_SFixed64Rules, SFixed64Rules__Output as _validate_SFixed64Rules__Output } from './validate/SFixed64Rules';
import { SInt32Rules as _validate_SInt32Rules, SInt32Rules__Output as _validate_SInt32Rules__Output } from './validate/SInt32Rules';
import { SInt64Rules as _validate_SInt64Rules, SInt64Rules__Output as _validate_SInt64Rules__Output } from './validate/SInt64Rules';
import { StringRules as _validate_StringRules, StringRules__Output as _validate_StringRules__Output } from './validate/StringRules';
import { TimestampRules as _validate_TimestampRules, TimestampRules__Output as _validate_TimestampRules__Output } from './validate/TimestampRules';
import { UInt32Rules as _validate_UInt32Rules, UInt32Rules__Output as _validate_UInt32Rules__Output } from './validate/UInt32Rules';
import { UInt64Rules as _validate_UInt64Rules, UInt64Rules__Output as _validate_UInt64Rules__Output } from './validate/UInt64Rules';

export namespace messages {
  export namespace envoy {
    export namespace annotations {
    }
    export namespace api {
      export namespace v2 {
        export type Cluster = _envoy_api_v2_Cluster;
        export type Cluster__Output = _envoy_api_v2_Cluster__Output;
        export type ClusterLoadAssignment = _envoy_api_v2_ClusterLoadAssignment;
        export type ClusterLoadAssignment__Output = _envoy_api_v2_ClusterLoadAssignment__Output;
        export type LoadBalancingPolicy = _envoy_api_v2_LoadBalancingPolicy;
        export type LoadBalancingPolicy__Output = _envoy_api_v2_LoadBalancingPolicy__Output;
        export type UpstreamBindConfig = _envoy_api_v2_UpstreamBindConfig;
        export type UpstreamBindConfig__Output = _envoy_api_v2_UpstreamBindConfig__Output;
        export type UpstreamConnectionOptions = _envoy_api_v2_UpstreamConnectionOptions;
        export type UpstreamConnectionOptions__Output = _envoy_api_v2_UpstreamConnectionOptions__Output;
        export namespace auth {
          export type CertificateValidationContext = _envoy_api_v2_auth_CertificateValidationContext;
          export type CertificateValidationContext__Output = _envoy_api_v2_auth_CertificateValidationContext__Output;
          export type CommonTlsContext = _envoy_api_v2_auth_CommonTlsContext;
          export type CommonTlsContext__Output = _envoy_api_v2_auth_CommonTlsContext__Output;
          export type DownstreamTlsContext = _envoy_api_v2_auth_DownstreamTlsContext;
          export type DownstreamTlsContext__Output = _envoy_api_v2_auth_DownstreamTlsContext__Output;
          export type GenericSecret = _envoy_api_v2_auth_GenericSecret;
          export type GenericSecret__Output = _envoy_api_v2_auth_GenericSecret__Output;
          export type PrivateKeyProvider = _envoy_api_v2_auth_PrivateKeyProvider;
          export type PrivateKeyProvider__Output = _envoy_api_v2_auth_PrivateKeyProvider__Output;
          export type SdsSecretConfig = _envoy_api_v2_auth_SdsSecretConfig;
          export type SdsSecretConfig__Output = _envoy_api_v2_auth_SdsSecretConfig__Output;
          export type Secret = _envoy_api_v2_auth_Secret;
          export type Secret__Output = _envoy_api_v2_auth_Secret__Output;
          export type TlsCertificate = _envoy_api_v2_auth_TlsCertificate;
          export type TlsCertificate__Output = _envoy_api_v2_auth_TlsCertificate__Output;
          export type TlsParameters = _envoy_api_v2_auth_TlsParameters;
          export type TlsParameters__Output = _envoy_api_v2_auth_TlsParameters__Output;
          export type TlsSessionTicketKeys = _envoy_api_v2_auth_TlsSessionTicketKeys;
          export type TlsSessionTicketKeys__Output = _envoy_api_v2_auth_TlsSessionTicketKeys__Output;
          export type UpstreamTlsContext = _envoy_api_v2_auth_UpstreamTlsContext;
          export type UpstreamTlsContext__Output = _envoy_api_v2_auth_UpstreamTlsContext__Output;
        }
        export namespace cluster {
          export type CircuitBreakers = _envoy_api_v2_cluster_CircuitBreakers;
          export type CircuitBreakers__Output = _envoy_api_v2_cluster_CircuitBreakers__Output;
          export type Filter = _envoy_api_v2_cluster_Filter;
          export type Filter__Output = _envoy_api_v2_cluster_Filter__Output;
          export type OutlierDetection = _envoy_api_v2_cluster_OutlierDetection;
          export type OutlierDetection__Output = _envoy_api_v2_cluster_OutlierDetection__Output;
        }
        export namespace core {
          export type Address = _envoy_api_v2_core_Address;
          export type Address__Output = _envoy_api_v2_core_Address__Output;
          export type AggregatedConfigSource = _envoy_api_v2_core_AggregatedConfigSource;
          export type AggregatedConfigSource__Output = _envoy_api_v2_core_AggregatedConfigSource__Output;
          export type ApiConfigSource = _envoy_api_v2_core_ApiConfigSource;
          export type ApiConfigSource__Output = _envoy_api_v2_core_ApiConfigSource__Output;
          export type ApiVersion = _envoy_api_v2_core_ApiVersion;
          export type AsyncDataSource = _envoy_api_v2_core_AsyncDataSource;
          export type AsyncDataSource__Output = _envoy_api_v2_core_AsyncDataSource__Output;
          export type BackoffStrategy = _envoy_api_v2_core_BackoffStrategy;
          export type BackoffStrategy__Output = _envoy_api_v2_core_BackoffStrategy__Output;
          export type BindConfig = _envoy_api_v2_core_BindConfig;
          export type BindConfig__Output = _envoy_api_v2_core_BindConfig__Output;
          export type BuildVersion = _envoy_api_v2_core_BuildVersion;
          export type BuildVersion__Output = _envoy_api_v2_core_BuildVersion__Output;
          export type CidrRange = _envoy_api_v2_core_CidrRange;
          export type CidrRange__Output = _envoy_api_v2_core_CidrRange__Output;
          export type ConfigSource = _envoy_api_v2_core_ConfigSource;
          export type ConfigSource__Output = _envoy_api_v2_core_ConfigSource__Output;
          export type ControlPlane = _envoy_api_v2_core_ControlPlane;
          export type ControlPlane__Output = _envoy_api_v2_core_ControlPlane__Output;
          export type DataSource = _envoy_api_v2_core_DataSource;
          export type DataSource__Output = _envoy_api_v2_core_DataSource__Output;
          export type EventServiceConfig = _envoy_api_v2_core_EventServiceConfig;
          export type EventServiceConfig__Output = _envoy_api_v2_core_EventServiceConfig__Output;
          export type Extension = _envoy_api_v2_core_Extension;
          export type Extension__Output = _envoy_api_v2_core_Extension__Output;
          export type GrpcProtocolOptions = _envoy_api_v2_core_GrpcProtocolOptions;
          export type GrpcProtocolOptions__Output = _envoy_api_v2_core_GrpcProtocolOptions__Output;
          export type GrpcService = _envoy_api_v2_core_GrpcService;
          export type GrpcService__Output = _envoy_api_v2_core_GrpcService__Output;
          export type HeaderMap = _envoy_api_v2_core_HeaderMap;
          export type HeaderMap__Output = _envoy_api_v2_core_HeaderMap__Output;
          export type HeaderValue = _envoy_api_v2_core_HeaderValue;
          export type HeaderValue__Output = _envoy_api_v2_core_HeaderValue__Output;
          export type HeaderValueOption = _envoy_api_v2_core_HeaderValueOption;
          export type HeaderValueOption__Output = _envoy_api_v2_core_HeaderValueOption__Output;
          export type HealthCheck = _envoy_api_v2_core_HealthCheck;
          export type HealthCheck__Output = _envoy_api_v2_core_HealthCheck__Output;
          export type HealthStatus = _envoy_api_v2_core_HealthStatus;
          export type Http1ProtocolOptions = _envoy_api_v2_core_Http1ProtocolOptions;
          export type Http1ProtocolOptions__Output = _envoy_api_v2_core_Http1ProtocolOptions__Output;
          export type Http2ProtocolOptions = _envoy_api_v2_core_Http2ProtocolOptions;
          export type Http2ProtocolOptions__Output = _envoy_api_v2_core_Http2ProtocolOptions__Output;
          export type HttpProtocolOptions = _envoy_api_v2_core_HttpProtocolOptions;
          export type HttpProtocolOptions__Output = _envoy_api_v2_core_HttpProtocolOptions__Output;
          export type HttpUri = _envoy_api_v2_core_HttpUri;
          export type HttpUri__Output = _envoy_api_v2_core_HttpUri__Output;
          export type Locality = _envoy_api_v2_core_Locality;
          export type Locality__Output = _envoy_api_v2_core_Locality__Output;
          export type Metadata = _envoy_api_v2_core_Metadata;
          export type Metadata__Output = _envoy_api_v2_core_Metadata__Output;
          export type Node = _envoy_api_v2_core_Node;
          export type Node__Output = _envoy_api_v2_core_Node__Output;
          export type Pipe = _envoy_api_v2_core_Pipe;
          export type Pipe__Output = _envoy_api_v2_core_Pipe__Output;
          export type RateLimitSettings = _envoy_api_v2_core_RateLimitSettings;
          export type RateLimitSettings__Output = _envoy_api_v2_core_RateLimitSettings__Output;
          export type RemoteDataSource = _envoy_api_v2_core_RemoteDataSource;
          export type RemoteDataSource__Output = _envoy_api_v2_core_RemoteDataSource__Output;
          export type RequestMethod = _envoy_api_v2_core_RequestMethod;
          export type RetryPolicy = _envoy_api_v2_core_RetryPolicy;
          export type RetryPolicy__Output = _envoy_api_v2_core_RetryPolicy__Output;
          export type RoutingPriority = _envoy_api_v2_core_RoutingPriority;
          export type RuntimeDouble = _envoy_api_v2_core_RuntimeDouble;
          export type RuntimeDouble__Output = _envoy_api_v2_core_RuntimeDouble__Output;
          export type RuntimeFeatureFlag = _envoy_api_v2_core_RuntimeFeatureFlag;
          export type RuntimeFeatureFlag__Output = _envoy_api_v2_core_RuntimeFeatureFlag__Output;
          export type RuntimeFractionalPercent = _envoy_api_v2_core_RuntimeFractionalPercent;
          export type RuntimeFractionalPercent__Output = _envoy_api_v2_core_RuntimeFractionalPercent__Output;
          export type RuntimeUInt32 = _envoy_api_v2_core_RuntimeUInt32;
          export type RuntimeUInt32__Output = _envoy_api_v2_core_RuntimeUInt32__Output;
          export type SelfConfigSource = _envoy_api_v2_core_SelfConfigSource;
          export type SelfConfigSource__Output = _envoy_api_v2_core_SelfConfigSource__Output;
          export type SocketAddress = _envoy_api_v2_core_SocketAddress;
          export type SocketAddress__Output = _envoy_api_v2_core_SocketAddress__Output;
          export type SocketOption = _envoy_api_v2_core_SocketOption;
          export type SocketOption__Output = _envoy_api_v2_core_SocketOption__Output;
          export type TcpKeepalive = _envoy_api_v2_core_TcpKeepalive;
          export type TcpKeepalive__Output = _envoy_api_v2_core_TcpKeepalive__Output;
          export type TcpProtocolOptions = _envoy_api_v2_core_TcpProtocolOptions;
          export type TcpProtocolOptions__Output = _envoy_api_v2_core_TcpProtocolOptions__Output;
          export type TrafficDirection = _envoy_api_v2_core_TrafficDirection;
          export type TransportSocket = _envoy_api_v2_core_TransportSocket;
          export type TransportSocket__Output = _envoy_api_v2_core_TransportSocket__Output;
          export type UpstreamHttpProtocolOptions = _envoy_api_v2_core_UpstreamHttpProtocolOptions;
          export type UpstreamHttpProtocolOptions__Output = _envoy_api_v2_core_UpstreamHttpProtocolOptions__Output;
        }
        export namespace endpoint {
          export type Endpoint = _envoy_api_v2_endpoint_Endpoint;
          export type Endpoint__Output = _envoy_api_v2_endpoint_Endpoint__Output;
          export type LbEndpoint = _envoy_api_v2_endpoint_LbEndpoint;
          export type LbEndpoint__Output = _envoy_api_v2_endpoint_LbEndpoint__Output;
          export type LocalityLbEndpoints = _envoy_api_v2_endpoint_LocalityLbEndpoints;
          export type LocalityLbEndpoints__Output = _envoy_api_v2_endpoint_LocalityLbEndpoints__Output;
        }
      }
    }
    export namespace type {
      export type CodecClientType = _envoy_type_CodecClientType;
      export type DoubleRange = _envoy_type_DoubleRange;
      export type DoubleRange__Output = _envoy_type_DoubleRange__Output;
      export type FractionalPercent = _envoy_type_FractionalPercent;
      export type FractionalPercent__Output = _envoy_type_FractionalPercent__Output;
      export type Int32Range = _envoy_type_Int32Range;
      export type Int32Range__Output = _envoy_type_Int32Range__Output;
      export type Int64Range = _envoy_type_Int64Range;
      export type Int64Range__Output = _envoy_type_Int64Range__Output;
      export type Percent = _envoy_type_Percent;
      export type Percent__Output = _envoy_type_Percent__Output;
      export type SemanticVersion = _envoy_type_SemanticVersion;
      export type SemanticVersion__Output = _envoy_type_SemanticVersion__Output;
      export namespace matcher {
        export type ListStringMatcher = _envoy_type_matcher_ListStringMatcher;
        export type ListStringMatcher__Output = _envoy_type_matcher_ListStringMatcher__Output;
        export type RegexMatchAndSubstitute = _envoy_type_matcher_RegexMatchAndSubstitute;
        export type RegexMatchAndSubstitute__Output = _envoy_type_matcher_RegexMatchAndSubstitute__Output;
        export type RegexMatcher = _envoy_type_matcher_RegexMatcher;
        export type RegexMatcher__Output = _envoy_type_matcher_RegexMatcher__Output;
        export type StringMatcher = _envoy_type_matcher_StringMatcher;
        export type StringMatcher__Output = _envoy_type_matcher_StringMatcher__Output;
      }
    }
  }
  export namespace google {
    export namespace api {
      export type CustomHttpPattern = _google_api_CustomHttpPattern;
      export type CustomHttpPattern__Output = _google_api_CustomHttpPattern__Output;
      export type Http = _google_api_Http;
      export type Http__Output = _google_api_Http__Output;
      export type HttpRule = _google_api_HttpRule;
      export type HttpRule__Output = _google_api_HttpRule__Output;
    }
    export namespace protobuf {
      export type Any = _google_protobuf_Any;
      export type Any__Output = _google_protobuf_Any__Output;
      export type BoolValue = _google_protobuf_BoolValue;
      export type BoolValue__Output = _google_protobuf_BoolValue__Output;
      export type BytesValue = _google_protobuf_BytesValue;
      export type BytesValue__Output = _google_protobuf_BytesValue__Output;
      export type DescriptorProto = _google_protobuf_DescriptorProto;
      export type DescriptorProto__Output = _google_protobuf_DescriptorProto__Output;
      export type DoubleValue = _google_protobuf_DoubleValue;
      export type DoubleValue__Output = _google_protobuf_DoubleValue__Output;
      export type Duration = _google_protobuf_Duration;
      export type Duration__Output = _google_protobuf_Duration__Output;
      export type Empty = _google_protobuf_Empty;
      export type Empty__Output = _google_protobuf_Empty__Output;
      export type EnumDescriptorProto = _google_protobuf_EnumDescriptorProto;
      export type EnumDescriptorProto__Output = _google_protobuf_EnumDescriptorProto__Output;
      export type EnumOptions = _google_protobuf_EnumOptions;
      export type EnumOptions__Output = _google_protobuf_EnumOptions__Output;
      export type EnumValueDescriptorProto = _google_protobuf_EnumValueDescriptorProto;
      export type EnumValueDescriptorProto__Output = _google_protobuf_EnumValueDescriptorProto__Output;
      export type EnumValueOptions = _google_protobuf_EnumValueOptions;
      export type EnumValueOptions__Output = _google_protobuf_EnumValueOptions__Output;
      export type FieldDescriptorProto = _google_protobuf_FieldDescriptorProto;
      export type FieldDescriptorProto__Output = _google_protobuf_FieldDescriptorProto__Output;
      export type FieldOptions = _google_protobuf_FieldOptions;
      export type FieldOptions__Output = _google_protobuf_FieldOptions__Output;
      export type FileDescriptorProto = _google_protobuf_FileDescriptorProto;
      export type FileDescriptorProto__Output = _google_protobuf_FileDescriptorProto__Output;
      export type FileDescriptorSet = _google_protobuf_FileDescriptorSet;
      export type FileDescriptorSet__Output = _google_protobuf_FileDescriptorSet__Output;
      export type FileOptions = _google_protobuf_FileOptions;
      export type FileOptions__Output = _google_protobuf_FileOptions__Output;
      export type FloatValue = _google_protobuf_FloatValue;
      export type FloatValue__Output = _google_protobuf_FloatValue__Output;
      export type GeneratedCodeInfo = _google_protobuf_GeneratedCodeInfo;
      export type GeneratedCodeInfo__Output = _google_protobuf_GeneratedCodeInfo__Output;
      export type Int32Value = _google_protobuf_Int32Value;
      export type Int32Value__Output = _google_protobuf_Int32Value__Output;
      export type Int64Value = _google_protobuf_Int64Value;
      export type Int64Value__Output = _google_protobuf_Int64Value__Output;
      export type ListValue = _google_protobuf_ListValue;
      export type ListValue__Output = _google_protobuf_ListValue__Output;
      export type MessageOptions = _google_protobuf_MessageOptions;
      export type MessageOptions__Output = _google_protobuf_MessageOptions__Output;
      export type MethodDescriptorProto = _google_protobuf_MethodDescriptorProto;
      export type MethodDescriptorProto__Output = _google_protobuf_MethodDescriptorProto__Output;
      export type MethodOptions = _google_protobuf_MethodOptions;
      export type MethodOptions__Output = _google_protobuf_MethodOptions__Output;
      export type NullValue = _google_protobuf_NullValue;
      export type OneofDescriptorProto = _google_protobuf_OneofDescriptorProto;
      export type OneofDescriptorProto__Output = _google_protobuf_OneofDescriptorProto__Output;
      export type OneofOptions = _google_protobuf_OneofOptions;
      export type OneofOptions__Output = _google_protobuf_OneofOptions__Output;
      export type ServiceDescriptorProto = _google_protobuf_ServiceDescriptorProto;
      export type ServiceDescriptorProto__Output = _google_protobuf_ServiceDescriptorProto__Output;
      export type ServiceOptions = _google_protobuf_ServiceOptions;
      export type ServiceOptions__Output = _google_protobuf_ServiceOptions__Output;
      export type SourceCodeInfo = _google_protobuf_SourceCodeInfo;
      export type SourceCodeInfo__Output = _google_protobuf_SourceCodeInfo__Output;
      export type StringValue = _google_protobuf_StringValue;
      export type StringValue__Output = _google_protobuf_StringValue__Output;
      export type Struct = _google_protobuf_Struct;
      export type Struct__Output = _google_protobuf_Struct__Output;
      export type Timestamp = _google_protobuf_Timestamp;
      export type Timestamp__Output = _google_protobuf_Timestamp__Output;
      export type UInt32Value = _google_protobuf_UInt32Value;
      export type UInt32Value__Output = _google_protobuf_UInt32Value__Output;
      export type UInt64Value = _google_protobuf_UInt64Value;
      export type UInt64Value__Output = _google_protobuf_UInt64Value__Output;
      export type UninterpretedOption = _google_protobuf_UninterpretedOption;
      export type UninterpretedOption__Output = _google_protobuf_UninterpretedOption__Output;
      export type Value = _google_protobuf_Value;
      export type Value__Output = _google_protobuf_Value__Output;
    }
  }
  export namespace udpa {
    export namespace annotations {
      export type FieldMigrateAnnotation = _udpa_annotations_FieldMigrateAnnotation;
      export type FieldMigrateAnnotation__Output = _udpa_annotations_FieldMigrateAnnotation__Output;
      export type FileMigrateAnnotation = _udpa_annotations_FileMigrateAnnotation;
      export type FileMigrateAnnotation__Output = _udpa_annotations_FileMigrateAnnotation__Output;
      export type MigrateAnnotation = _udpa_annotations_MigrateAnnotation;
      export type MigrateAnnotation__Output = _udpa_annotations_MigrateAnnotation__Output;
      export type PackageVersionStatus = _udpa_annotations_PackageVersionStatus;
      export type StatusAnnotation = _udpa_annotations_StatusAnnotation;
      export type StatusAnnotation__Output = _udpa_annotations_StatusAnnotation__Output;
    }
  }
  export namespace validate {
    export type AnyRules = _validate_AnyRules;
    export type AnyRules__Output = _validate_AnyRules__Output;
    export type BoolRules = _validate_BoolRules;
    export type BoolRules__Output = _validate_BoolRules__Output;
    export type BytesRules = _validate_BytesRules;
    export type BytesRules__Output = _validate_BytesRules__Output;
    export type DoubleRules = _validate_DoubleRules;
    export type DoubleRules__Output = _validate_DoubleRules__Output;
    export type DurationRules = _validate_DurationRules;
    export type DurationRules__Output = _validate_DurationRules__Output;
    export type EnumRules = _validate_EnumRules;
    export type EnumRules__Output = _validate_EnumRules__Output;
    export type FieldRules = _validate_FieldRules;
    export type FieldRules__Output = _validate_FieldRules__Output;
    export type Fixed32Rules = _validate_Fixed32Rules;
    export type Fixed32Rules__Output = _validate_Fixed32Rules__Output;
    export type Fixed64Rules = _validate_Fixed64Rules;
    export type Fixed64Rules__Output = _validate_Fixed64Rules__Output;
    export type FloatRules = _validate_FloatRules;
    export type FloatRules__Output = _validate_FloatRules__Output;
    export type Int32Rules = _validate_Int32Rules;
    export type Int32Rules__Output = _validate_Int32Rules__Output;
    export type Int64Rules = _validate_Int64Rules;
    export type Int64Rules__Output = _validate_Int64Rules__Output;
    export type KnownRegex = _validate_KnownRegex;
    export type MapRules = _validate_MapRules;
    export type MapRules__Output = _validate_MapRules__Output;
    export type MessageRules = _validate_MessageRules;
    export type MessageRules__Output = _validate_MessageRules__Output;
    export type RepeatedRules = _validate_RepeatedRules;
    export type RepeatedRules__Output = _validate_RepeatedRules__Output;
    export type SFixed32Rules = _validate_SFixed32Rules;
    export type SFixed32Rules__Output = _validate_SFixed32Rules__Output;
    export type SFixed64Rules = _validate_SFixed64Rules;
    export type SFixed64Rules__Output = _validate_SFixed64Rules__Output;
    export type SInt32Rules = _validate_SInt32Rules;
    export type SInt32Rules__Output = _validate_SInt32Rules__Output;
    export type SInt64Rules = _validate_SInt64Rules;
    export type SInt64Rules__Output = _validate_SInt64Rules__Output;
    export type StringRules = _validate_StringRules;
    export type StringRules__Output = _validate_StringRules__Output;
    export type TimestampRules = _validate_TimestampRules;
    export type TimestampRules__Output = _validate_TimestampRules__Output;
    export type UInt32Rules = _validate_UInt32Rules;
    export type UInt32Rules__Output = _validate_UInt32Rules__Output;
    export type UInt64Rules = _validate_UInt64Rules;
    export type UInt64Rules__Output = _validate_UInt64Rules__Output;
  }
}

export namespace ClientInterfaces {
  export namespace envoy {
    export namespace annotations {
    }
    export namespace api {
      export namespace v2 {
        export namespace Cluster {
          export namespace CommonLbConfig {
            export namespace ConsistentHashingLbConfig {
            }
            export namespace LocalityWeightedLbConfig {
            }
            export namespace ZoneAwareLbConfig {
            }
          }
          export namespace CustomClusterType {
          }
          export namespace EdsClusterConfig {
          }
          export namespace LbSubsetConfig {
            export namespace LbSubsetSelector {
            }
          }
          export namespace LeastRequestLbConfig {
          }
          export namespace OriginalDstLbConfig {
          }
          export namespace RefreshRate {
          }
          export namespace RingHashLbConfig {
          }
          export namespace TransportSocketMatch {
          }
        }
        export namespace ClusterLoadAssignment {
          export namespace Policy {
            export namespace DropOverload {
            }
          }
        }
        export namespace LoadBalancingPolicy {
          export namespace Policy {
          }
        }
        export namespace UpstreamBindConfig {
        }
        export namespace UpstreamConnectionOptions {
        }
        export namespace auth {
          export namespace CertificateValidationContext {
          }
          export namespace CommonTlsContext {
            export namespace CombinedCertificateValidationContext {
            }
          }
          export namespace DownstreamTlsContext {
          }
          export namespace GenericSecret {
          }
          export namespace PrivateKeyProvider {
          }
          export namespace SdsSecretConfig {
          }
          export namespace Secret {
          }
          export namespace TlsCertificate {
          }
          export namespace TlsParameters {
          }
          export namespace TlsSessionTicketKeys {
          }
          export namespace UpstreamTlsContext {
          }
        }
        export namespace cluster {
          export namespace CircuitBreakers {
            export namespace Thresholds {
              export namespace RetryBudget {
              }
            }
          }
          export namespace Filter {
          }
          export namespace OutlierDetection {
          }
        }
        export namespace core {
          export namespace Address {
          }
          export namespace AggregatedConfigSource {
          }
          export namespace ApiConfigSource {
          }
          export namespace AsyncDataSource {
          }
          export namespace BackoffStrategy {
          }
          export namespace BindConfig {
          }
          export namespace BuildVersion {
          }
          export namespace CidrRange {
          }
          export namespace ConfigSource {
          }
          export namespace ControlPlane {
          }
          export namespace DataSource {
          }
          export namespace EventServiceConfig {
          }
          export namespace Extension {
          }
          export namespace GrpcProtocolOptions {
          }
          export namespace GrpcService {
            export namespace EnvoyGrpc {
            }
            export namespace GoogleGrpc {
              export namespace CallCredentials {
                export namespace GoogleIAMCredentials {
                }
                export namespace MetadataCredentialsFromPlugin {
                }
                export namespace ServiceAccountJWTAccessCredentials {
                }
                export namespace StsService {
                }
              }
              export namespace ChannelCredentials {
              }
              export namespace GoogleLocalCredentials {
              }
              export namespace SslCredentials {
              }
            }
          }
          export namespace HeaderMap {
          }
          export namespace HeaderValue {
          }
          export namespace HeaderValueOption {
          }
          export namespace HealthCheck {
            export namespace CustomHealthCheck {
            }
            export namespace GrpcHealthCheck {
            }
            export namespace HttpHealthCheck {
            }
            export namespace Payload {
            }
            export namespace RedisHealthCheck {
            }
            export namespace TcpHealthCheck {
            }
            export namespace TlsOptions {
            }
          }
          export namespace Http1ProtocolOptions {
            export namespace HeaderKeyFormat {
              export namespace ProperCaseWords {
              }
            }
          }
          export namespace Http2ProtocolOptions {
            export namespace SettingsParameter {
            }
          }
          export namespace HttpProtocolOptions {
          }
          export namespace HttpUri {
          }
          export namespace Locality {
          }
          export namespace Metadata {
          }
          export namespace Node {
          }
          export namespace Pipe {
          }
          export namespace RateLimitSettings {
          }
          export namespace RemoteDataSource {
          }
          export namespace RetryPolicy {
          }
          export namespace RuntimeDouble {
          }
          export namespace RuntimeFeatureFlag {
          }
          export namespace RuntimeFractionalPercent {
          }
          export namespace RuntimeUInt32 {
          }
          export namespace SelfConfigSource {
          }
          export namespace SocketAddress {
          }
          export namespace SocketOption {
          }
          export namespace TcpKeepalive {
          }
          export namespace TcpProtocolOptions {
          }
          export namespace TransportSocket {
          }
          export namespace UpstreamHttpProtocolOptions {
          }
        }
        export namespace endpoint {
          export namespace Endpoint {
            export namespace HealthCheckConfig {
            }
          }
          export namespace LbEndpoint {
          }
          export namespace LocalityLbEndpoints {
          }
        }
      }
    }
    export namespace type {
      export namespace DoubleRange {
      }
      export namespace FractionalPercent {
      }
      export namespace Int32Range {
      }
      export namespace Int64Range {
      }
      export namespace Percent {
      }
      export namespace SemanticVersion {
      }
      export namespace matcher {
        export namespace ListStringMatcher {
        }
        export namespace RegexMatchAndSubstitute {
        }
        export namespace RegexMatcher {
          export namespace GoogleRE2 {
          }
        }
        export namespace StringMatcher {
        }
      }
    }
  }
  export namespace google {
    export namespace api {
      export namespace CustomHttpPattern {
      }
      export namespace Http {
      }
      export namespace HttpRule {
      }
    }
    export namespace protobuf {
      export namespace Any {
      }
      export namespace BoolValue {
      }
      export namespace BytesValue {
      }
      export namespace DescriptorProto {
        export namespace ExtensionRange {
        }
        export namespace ReservedRange {
        }
      }
      export namespace DoubleValue {
      }
      export namespace Duration {
      }
      export namespace Empty {
      }
      export namespace EnumDescriptorProto {
      }
      export namespace EnumOptions {
      }
      export namespace EnumValueDescriptorProto {
      }
      export namespace EnumValueOptions {
      }
      export namespace FieldDescriptorProto {
      }
      export namespace FieldOptions {
      }
      export namespace FileDescriptorProto {
      }
      export namespace FileDescriptorSet {
      }
      export namespace FileOptions {
      }
      export namespace FloatValue {
      }
      export namespace GeneratedCodeInfo {
        export namespace Annotation {
        }
      }
      export namespace Int32Value {
      }
      export namespace Int64Value {
      }
      export namespace ListValue {
      }
      export namespace MessageOptions {
      }
      export namespace MethodDescriptorProto {
      }
      export namespace MethodOptions {
      }
      export namespace OneofDescriptorProto {
      }
      export namespace OneofOptions {
      }
      export namespace ServiceDescriptorProto {
      }
      export namespace ServiceOptions {
      }
      export namespace SourceCodeInfo {
        export namespace Location {
        }
      }
      export namespace StringValue {
      }
      export namespace Struct {
      }
      export namespace Timestamp {
      }
      export namespace UInt32Value {
      }
      export namespace UInt64Value {
      }
      export namespace UninterpretedOption {
        export namespace NamePart {
        }
      }
      export namespace Value {
      }
    }
  }
  export namespace udpa {
    export namespace annotations {
      export namespace FieldMigrateAnnotation {
      }
      export namespace FileMigrateAnnotation {
      }
      export namespace MigrateAnnotation {
      }
      export namespace StatusAnnotation {
      }
    }
  }
  export namespace validate {
    export namespace AnyRules {
    }
    export namespace BoolRules {
    }
    export namespace BytesRules {
    }
    export namespace DoubleRules {
    }
    export namespace DurationRules {
    }
    export namespace EnumRules {
    }
    export namespace FieldRules {
    }
    export namespace Fixed32Rules {
    }
    export namespace Fixed64Rules {
    }
    export namespace FloatRules {
    }
    export namespace Int32Rules {
    }
    export namespace Int64Rules {
    }
    export namespace MapRules {
    }
    export namespace MessageRules {
    }
    export namespace RepeatedRules {
    }
    export namespace SFixed32Rules {
    }
    export namespace SFixed64Rules {
    }
    export namespace SInt32Rules {
    }
    export namespace SInt64Rules {
    }
    export namespace StringRules {
    }
    export namespace TimestampRules {
    }
    export namespace UInt32Rules {
    }
    export namespace UInt64Rules {
    }
  }
}

type ConstructorArguments<Constructor> = Constructor extends new (...args: infer Args) => any ? Args: never;
type SubtypeConstructor<Constructor, Subtype> = {
  new(...args: ConstructorArguments<Constructor>): Subtype;
}

export interface ProtoGrpcType {
  envoy: {
    annotations: {
    }
    api: {
      v2: {
        Cluster: MessageTypeDefinition
        ClusterLoadAssignment: MessageTypeDefinition
        LoadBalancingPolicy: MessageTypeDefinition
        UpstreamBindConfig: MessageTypeDefinition
        UpstreamConnectionOptions: MessageTypeDefinition
        auth: {
          CertificateValidationContext: MessageTypeDefinition
          CommonTlsContext: MessageTypeDefinition
          DownstreamTlsContext: MessageTypeDefinition
          GenericSecret: MessageTypeDefinition
          PrivateKeyProvider: MessageTypeDefinition
          SdsSecretConfig: MessageTypeDefinition
          Secret: MessageTypeDefinition
          TlsCertificate: MessageTypeDefinition
          TlsParameters: MessageTypeDefinition
          TlsSessionTicketKeys: MessageTypeDefinition
          UpstreamTlsContext: MessageTypeDefinition
        }
        cluster: {
          CircuitBreakers: MessageTypeDefinition
          Filter: MessageTypeDefinition
          OutlierDetection: MessageTypeDefinition
        }
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
          EventServiceConfig: MessageTypeDefinition
          Extension: MessageTypeDefinition
          GrpcProtocolOptions: MessageTypeDefinition
          GrpcService: MessageTypeDefinition
          HeaderMap: MessageTypeDefinition
          HeaderValue: MessageTypeDefinition
          HeaderValueOption: MessageTypeDefinition
          HealthCheck: MessageTypeDefinition
          HealthStatus: EnumTypeDefinition
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
        endpoint: {
          Endpoint: MessageTypeDefinition
          LbEndpoint: MessageTypeDefinition
          LocalityLbEndpoints: MessageTypeDefinition
        }
      }
    }
    type: {
      CodecClientType: EnumTypeDefinition
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

export namespace ServiceHandlers {
  export namespace envoy {
    export namespace annotations {
    }
    export namespace api {
      export namespace v2 {
        export namespace Cluster {
          export namespace CommonLbConfig {
            export namespace ConsistentHashingLbConfig {
            }
            export namespace LocalityWeightedLbConfig {
            }
            export namespace ZoneAwareLbConfig {
            }
          }
          export namespace CustomClusterType {
          }
          export namespace EdsClusterConfig {
          }
          export namespace LbSubsetConfig {
            export namespace LbSubsetSelector {
            }
          }
          export namespace LeastRequestLbConfig {
          }
          export namespace OriginalDstLbConfig {
          }
          export namespace RefreshRate {
          }
          export namespace RingHashLbConfig {
          }
          export namespace TransportSocketMatch {
          }
        }
        export namespace ClusterLoadAssignment {
          export namespace Policy {
            export namespace DropOverload {
            }
          }
        }
        export namespace LoadBalancingPolicy {
          export namespace Policy {
          }
        }
        export namespace UpstreamBindConfig {
        }
        export namespace UpstreamConnectionOptions {
        }
        export namespace auth {
          export namespace CertificateValidationContext {
          }
          export namespace CommonTlsContext {
            export namespace CombinedCertificateValidationContext {
            }
          }
          export namespace DownstreamTlsContext {
          }
          export namespace GenericSecret {
          }
          export namespace PrivateKeyProvider {
          }
          export namespace SdsSecretConfig {
          }
          export namespace Secret {
          }
          export namespace TlsCertificate {
          }
          export namespace TlsParameters {
          }
          export namespace TlsSessionTicketKeys {
          }
          export namespace UpstreamTlsContext {
          }
        }
        export namespace cluster {
          export namespace CircuitBreakers {
            export namespace Thresholds {
              export namespace RetryBudget {
              }
            }
          }
          export namespace Filter {
          }
          export namespace OutlierDetection {
          }
        }
        export namespace core {
          export namespace Address {
          }
          export namespace AggregatedConfigSource {
          }
          export namespace ApiConfigSource {
          }
          export namespace AsyncDataSource {
          }
          export namespace BackoffStrategy {
          }
          export namespace BindConfig {
          }
          export namespace BuildVersion {
          }
          export namespace CidrRange {
          }
          export namespace ConfigSource {
          }
          export namespace ControlPlane {
          }
          export namespace DataSource {
          }
          export namespace EventServiceConfig {
          }
          export namespace Extension {
          }
          export namespace GrpcProtocolOptions {
          }
          export namespace GrpcService {
            export namespace EnvoyGrpc {
            }
            export namespace GoogleGrpc {
              export namespace CallCredentials {
                export namespace GoogleIAMCredentials {
                }
                export namespace MetadataCredentialsFromPlugin {
                }
                export namespace ServiceAccountJWTAccessCredentials {
                }
                export namespace StsService {
                }
              }
              export namespace ChannelCredentials {
              }
              export namespace GoogleLocalCredentials {
              }
              export namespace SslCredentials {
              }
            }
          }
          export namespace HeaderMap {
          }
          export namespace HeaderValue {
          }
          export namespace HeaderValueOption {
          }
          export namespace HealthCheck {
            export namespace CustomHealthCheck {
            }
            export namespace GrpcHealthCheck {
            }
            export namespace HttpHealthCheck {
            }
            export namespace Payload {
            }
            export namespace RedisHealthCheck {
            }
            export namespace TcpHealthCheck {
            }
            export namespace TlsOptions {
            }
          }
          export namespace Http1ProtocolOptions {
            export namespace HeaderKeyFormat {
              export namespace ProperCaseWords {
              }
            }
          }
          export namespace Http2ProtocolOptions {
            export namespace SettingsParameter {
            }
          }
          export namespace HttpProtocolOptions {
          }
          export namespace HttpUri {
          }
          export namespace Locality {
          }
          export namespace Metadata {
          }
          export namespace Node {
          }
          export namespace Pipe {
          }
          export namespace RateLimitSettings {
          }
          export namespace RemoteDataSource {
          }
          export namespace RetryPolicy {
          }
          export namespace RuntimeDouble {
          }
          export namespace RuntimeFeatureFlag {
          }
          export namespace RuntimeFractionalPercent {
          }
          export namespace RuntimeUInt32 {
          }
          export namespace SelfConfigSource {
          }
          export namespace SocketAddress {
          }
          export namespace SocketOption {
          }
          export namespace TcpKeepalive {
          }
          export namespace TcpProtocolOptions {
          }
          export namespace TransportSocket {
          }
          export namespace UpstreamHttpProtocolOptions {
          }
        }
        export namespace endpoint {
          export namespace Endpoint {
            export namespace HealthCheckConfig {
            }
          }
          export namespace LbEndpoint {
          }
          export namespace LocalityLbEndpoints {
          }
        }
      }
    }
    export namespace type {
      export namespace DoubleRange {
      }
      export namespace FractionalPercent {
      }
      export namespace Int32Range {
      }
      export namespace Int64Range {
      }
      export namespace Percent {
      }
      export namespace SemanticVersion {
      }
      export namespace matcher {
        export namespace ListStringMatcher {
        }
        export namespace RegexMatchAndSubstitute {
        }
        export namespace RegexMatcher {
          export namespace GoogleRE2 {
          }
        }
        export namespace StringMatcher {
        }
      }
    }
  }
  export namespace google {
    export namespace api {
      export namespace CustomHttpPattern {
      }
      export namespace Http {
      }
      export namespace HttpRule {
      }
    }
    export namespace protobuf {
      export namespace Any {
      }
      export namespace BoolValue {
      }
      export namespace BytesValue {
      }
      export namespace DescriptorProto {
        export namespace ExtensionRange {
        }
        export namespace ReservedRange {
        }
      }
      export namespace DoubleValue {
      }
      export namespace Duration {
      }
      export namespace Empty {
      }
      export namespace EnumDescriptorProto {
      }
      export namespace EnumOptions {
      }
      export namespace EnumValueDescriptorProto {
      }
      export namespace EnumValueOptions {
      }
      export namespace FieldDescriptorProto {
      }
      export namespace FieldOptions {
      }
      export namespace FileDescriptorProto {
      }
      export namespace FileDescriptorSet {
      }
      export namespace FileOptions {
      }
      export namespace FloatValue {
      }
      export namespace GeneratedCodeInfo {
        export namespace Annotation {
        }
      }
      export namespace Int32Value {
      }
      export namespace Int64Value {
      }
      export namespace ListValue {
      }
      export namespace MessageOptions {
      }
      export namespace MethodDescriptorProto {
      }
      export namespace MethodOptions {
      }
      export namespace OneofDescriptorProto {
      }
      export namespace OneofOptions {
      }
      export namespace ServiceDescriptorProto {
      }
      export namespace ServiceOptions {
      }
      export namespace SourceCodeInfo {
        export namespace Location {
        }
      }
      export namespace StringValue {
      }
      export namespace Struct {
      }
      export namespace Timestamp {
      }
      export namespace UInt32Value {
      }
      export namespace UInt64Value {
      }
      export namespace UninterpretedOption {
        export namespace NamePart {
        }
      }
      export namespace Value {
      }
    }
  }
  export namespace udpa {
    export namespace annotations {
      export namespace FieldMigrateAnnotation {
      }
      export namespace FileMigrateAnnotation {
      }
      export namespace MigrateAnnotation {
      }
      export namespace StatusAnnotation {
      }
    }
  }
  export namespace validate {
    export namespace AnyRules {
    }
    export namespace BoolRules {
    }
    export namespace BytesRules {
    }
    export namespace DoubleRules {
    }
    export namespace DurationRules {
    }
    export namespace EnumRules {
    }
    export namespace FieldRules {
    }
    export namespace Fixed32Rules {
    }
    export namespace Fixed64Rules {
    }
    export namespace FloatRules {
    }
    export namespace Int32Rules {
    }
    export namespace Int64Rules {
    }
    export namespace MapRules {
    }
    export namespace MessageRules {
    }
    export namespace RepeatedRules {
    }
    export namespace SFixed32Rules {
    }
    export namespace SFixed64Rules {
    }
    export namespace SInt32Rules {
    }
    export namespace SInt64Rules {
    }
    export namespace StringRules {
    }
    export namespace TimestampRules {
    }
    export namespace UInt32Rules {
    }
    export namespace UInt64Rules {
    }
  }
}
