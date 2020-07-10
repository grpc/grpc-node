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
        /**
         * Configuration for a single upstream cluster.
         * [#next-free-field: 48]
         */
        export type Cluster = _envoy_api_v2_Cluster;
        /**
         * Configuration for a single upstream cluster.
         * [#next-free-field: 48]
         */
        export type Cluster__Output = _envoy_api_v2_Cluster__Output;
        /**
         * Each route from RDS will map to a single cluster or traffic split across
         * clusters using weights expressed in the RDS WeightedCluster.
         * 
         * With EDS, each cluster is treated independently from a LB perspective, with
         * LB taking place between the Localities within a cluster and at a finer
         * granularity between the hosts within a locality. The percentage of traffic
         * for each endpoint is determined by both its load_balancing_weight, and the
         * load_balancing_weight of its locality. First, a locality will be selected,
         * then an endpoint within that locality will be chose based on its weight.
         * [#next-free-field: 6]
         */
        export type ClusterLoadAssignment = _envoy_api_v2_ClusterLoadAssignment;
        /**
         * Each route from RDS will map to a single cluster or traffic split across
         * clusters using weights expressed in the RDS WeightedCluster.
         * 
         * With EDS, each cluster is treated independently from a LB perspective, with
         * LB taking place between the Localities within a cluster and at a finer
         * granularity between the hosts within a locality. The percentage of traffic
         * for each endpoint is determined by both its load_balancing_weight, and the
         * load_balancing_weight of its locality. First, a locality will be selected,
         * then an endpoint within that locality will be chose based on its weight.
         * [#next-free-field: 6]
         */
        export type ClusterLoadAssignment__Output = _envoy_api_v2_ClusterLoadAssignment__Output;
        /**
         * [#not-implemented-hide:] Extensible load balancing policy configuration.
         * 
         * Every LB policy defined via this mechanism will be identified via a unique name using reverse
         * DNS notation. If the policy needs configuration parameters, it must define a message for its
         * own configuration, which will be stored in the config field. The name of the policy will tell
         * clients which type of message they should expect to see in the config field.
         * 
         * Note that there are cases where it is useful to be able to independently select LB policies
         * for choosing a locality and for choosing an endpoint within that locality. For example, a
         * given deployment may always use the same policy to choose the locality, but for choosing the
         * endpoint within the locality, some clusters may use weighted-round-robin, while others may
         * use some sort of session-based balancing.
         * 
         * This can be accomplished via hierarchical LB policies, where the parent LB policy creates a
         * child LB policy for each locality. For each request, the parent chooses the locality and then
         * delegates to the child policy for that locality to choose the endpoint within the locality.
         * 
         * To facilitate this, the config message for the top-level LB policy may include a field of
         * type LoadBalancingPolicy that specifies the child policy.
         */
        export type LoadBalancingPolicy = _envoy_api_v2_LoadBalancingPolicy;
        /**
         * [#not-implemented-hide:] Extensible load balancing policy configuration.
         * 
         * Every LB policy defined via this mechanism will be identified via a unique name using reverse
         * DNS notation. If the policy needs configuration parameters, it must define a message for its
         * own configuration, which will be stored in the config field. The name of the policy will tell
         * clients which type of message they should expect to see in the config field.
         * 
         * Note that there are cases where it is useful to be able to independently select LB policies
         * for choosing a locality and for choosing an endpoint within that locality. For example, a
         * given deployment may always use the same policy to choose the locality, but for choosing the
         * endpoint within the locality, some clusters may use weighted-round-robin, while others may
         * use some sort of session-based balancing.
         * 
         * This can be accomplished via hierarchical LB policies, where the parent LB policy creates a
         * child LB policy for each locality. For each request, the parent chooses the locality and then
         * delegates to the child policy for that locality to choose the endpoint within the locality.
         * 
         * To facilitate this, the config message for the top-level LB policy may include a field of
         * type LoadBalancingPolicy that specifies the child policy.
         */
        export type LoadBalancingPolicy__Output = _envoy_api_v2_LoadBalancingPolicy__Output;
        /**
         * An extensible structure containing the address Envoy should bind to when
         * establishing upstream connections.
         */
        export type UpstreamBindConfig = _envoy_api_v2_UpstreamBindConfig;
        /**
         * An extensible structure containing the address Envoy should bind to when
         * establishing upstream connections.
         */
        export type UpstreamBindConfig__Output = _envoy_api_v2_UpstreamBindConfig__Output;
        export type UpstreamConnectionOptions = _envoy_api_v2_UpstreamConnectionOptions;
        export type UpstreamConnectionOptions__Output = _envoy_api_v2_UpstreamConnectionOptions__Output;
        export namespace auth {
          /**
           * [#next-free-field: 11]
           */
          export type CertificateValidationContext = _envoy_api_v2_auth_CertificateValidationContext;
          /**
           * [#next-free-field: 11]
           */
          export type CertificateValidationContext__Output = _envoy_api_v2_auth_CertificateValidationContext__Output;
          /**
           * TLS context shared by both client and server TLS contexts.
           * [#next-free-field: 9]
           */
          export type CommonTlsContext = _envoy_api_v2_auth_CommonTlsContext;
          /**
           * TLS context shared by both client and server TLS contexts.
           * [#next-free-field: 9]
           */
          export type CommonTlsContext__Output = _envoy_api_v2_auth_CommonTlsContext__Output;
          /**
           * [#next-free-field: 8]
           */
          export type DownstreamTlsContext = _envoy_api_v2_auth_DownstreamTlsContext;
          /**
           * [#next-free-field: 8]
           */
          export type DownstreamTlsContext__Output = _envoy_api_v2_auth_DownstreamTlsContext__Output;
          export type GenericSecret = _envoy_api_v2_auth_GenericSecret;
          export type GenericSecret__Output = _envoy_api_v2_auth_GenericSecret__Output;
          /**
           * BoringSSL private key method configuration. The private key methods are used for external
           * (potentially asynchronous) signing and decryption operations. Some use cases for private key
           * methods would be TPM support and TLS acceleration.
           */
          export type PrivateKeyProvider = _envoy_api_v2_auth_PrivateKeyProvider;
          /**
           * BoringSSL private key method configuration. The private key methods are used for external
           * (potentially asynchronous) signing and decryption operations. Some use cases for private key
           * methods would be TPM support and TLS acceleration.
           */
          export type PrivateKeyProvider__Output = _envoy_api_v2_auth_PrivateKeyProvider__Output;
          export type SdsSecretConfig = _envoy_api_v2_auth_SdsSecretConfig;
          export type SdsSecretConfig__Output = _envoy_api_v2_auth_SdsSecretConfig__Output;
          /**
           * [#next-free-field: 6]
           */
          export type Secret = _envoy_api_v2_auth_Secret;
          /**
           * [#next-free-field: 6]
           */
          export type Secret__Output = _envoy_api_v2_auth_Secret__Output;
          /**
           * [#next-free-field: 7]
           */
          export type TlsCertificate = _envoy_api_v2_auth_TlsCertificate;
          /**
           * [#next-free-field: 7]
           */
          export type TlsCertificate__Output = _envoy_api_v2_auth_TlsCertificate__Output;
          export type TlsParameters = _envoy_api_v2_auth_TlsParameters;
          export type TlsParameters__Output = _envoy_api_v2_auth_TlsParameters__Output;
          export type TlsSessionTicketKeys = _envoy_api_v2_auth_TlsSessionTicketKeys;
          export type TlsSessionTicketKeys__Output = _envoy_api_v2_auth_TlsSessionTicketKeys__Output;
          export type UpstreamTlsContext = _envoy_api_v2_auth_UpstreamTlsContext;
          export type UpstreamTlsContext__Output = _envoy_api_v2_auth_UpstreamTlsContext__Output;
        }
        export namespace cluster {
          /**
           * :ref:`Circuit breaking<arch_overview_circuit_break>` settings can be
           * specified individually for each defined priority.
           */
          export type CircuitBreakers = _envoy_api_v2_cluster_CircuitBreakers;
          /**
           * :ref:`Circuit breaking<arch_overview_circuit_break>` settings can be
           * specified individually for each defined priority.
           */
          export type CircuitBreakers__Output = _envoy_api_v2_cluster_CircuitBreakers__Output;
          export type Filter = _envoy_api_v2_cluster_Filter;
          export type Filter__Output = _envoy_api_v2_cluster_Filter__Output;
          /**
           * See the :ref:`architecture overview <arch_overview_outlier_detection>` for
           * more information on outlier detection.
           * [#next-free-field: 21]
           */
          export type OutlierDetection = _envoy_api_v2_cluster_OutlierDetection;
          /**
           * See the :ref:`architecture overview <arch_overview_outlier_detection>` for
           * more information on outlier detection.
           * [#next-free-field: 21]
           */
          export type OutlierDetection__Output = _envoy_api_v2_cluster_OutlierDetection__Output;
        }
        export namespace core {
          /**
           * Addresses specify either a logical or physical address and port, which are
           * used to tell Envoy where to bind/listen, connect to upstream and find
           * management servers.
           */
          export type Address = _envoy_api_v2_core_Address;
          /**
           * Addresses specify either a logical or physical address and port, which are
           * used to tell Envoy where to bind/listen, connect to upstream and find
           * management servers.
           */
          export type Address__Output = _envoy_api_v2_core_Address__Output;
          /**
           * Aggregated Discovery Service (ADS) options. This is currently empty, but when
           * set in :ref:`ConfigSource <envoy_api_msg_core.ConfigSource>` can be used to
           * specify that ADS is to be used.
           */
          export type AggregatedConfigSource = _envoy_api_v2_core_AggregatedConfigSource;
          /**
           * Aggregated Discovery Service (ADS) options. This is currently empty, but when
           * set in :ref:`ConfigSource <envoy_api_msg_core.ConfigSource>` can be used to
           * specify that ADS is to be used.
           */
          export type AggregatedConfigSource__Output = _envoy_api_v2_core_AggregatedConfigSource__Output;
          /**
           * API configuration source. This identifies the API type and cluster that Envoy
           * will use to fetch an xDS API.
           * [#next-free-field: 9]
           */
          export type ApiConfigSource = _envoy_api_v2_core_ApiConfigSource;
          /**
           * API configuration source. This identifies the API type and cluster that Envoy
           * will use to fetch an xDS API.
           * [#next-free-field: 9]
           */
          export type ApiConfigSource__Output = _envoy_api_v2_core_ApiConfigSource__Output;
          /**
           * xDS API version. This is used to describe both resource and transport
           * protocol versions (in distinct configuration fields).
           */
          export type ApiVersion = _envoy_api_v2_core_ApiVersion;
          /**
           * Async data source which support async data fetch.
           */
          export type AsyncDataSource = _envoy_api_v2_core_AsyncDataSource;
          /**
           * Async data source which support async data fetch.
           */
          export type AsyncDataSource__Output = _envoy_api_v2_core_AsyncDataSource__Output;
          /**
           * Configuration defining a jittered exponential back off strategy.
           */
          export type BackoffStrategy = _envoy_api_v2_core_BackoffStrategy;
          /**
           * Configuration defining a jittered exponential back off strategy.
           */
          export type BackoffStrategy__Output = _envoy_api_v2_core_BackoffStrategy__Output;
          export type BindConfig = _envoy_api_v2_core_BindConfig;
          export type BindConfig__Output = _envoy_api_v2_core_BindConfig__Output;
          /**
           * BuildVersion combines SemVer version of extension with free-form build information
           * (i.e. 'alpha', 'private-build') as a set of strings.
           */
          export type BuildVersion = _envoy_api_v2_core_BuildVersion;
          /**
           * BuildVersion combines SemVer version of extension with free-form build information
           * (i.e. 'alpha', 'private-build') as a set of strings.
           */
          export type BuildVersion__Output = _envoy_api_v2_core_BuildVersion__Output;
          /**
           * CidrRange specifies an IP Address and a prefix length to construct
           * the subnet mask for a `CIDR <https://tools.ietf.org/html/rfc4632>`_ range.
           */
          export type CidrRange = _envoy_api_v2_core_CidrRange;
          /**
           * CidrRange specifies an IP Address and a prefix length to construct
           * the subnet mask for a `CIDR <https://tools.ietf.org/html/rfc4632>`_ range.
           */
          export type CidrRange__Output = _envoy_api_v2_core_CidrRange__Output;
          /**
           * Configuration for :ref:`listeners <config_listeners>`, :ref:`clusters
           * <config_cluster_manager>`, :ref:`routes
           * <envoy_api_msg_RouteConfiguration>`, :ref:`endpoints
           * <arch_overview_service_discovery>` etc. may either be sourced from the
           * filesystem or from an xDS API source. Filesystem configs are watched with
           * inotify for updates.
           * [#next-free-field: 7]
           */
          export type ConfigSource = _envoy_api_v2_core_ConfigSource;
          /**
           * Configuration for :ref:`listeners <config_listeners>`, :ref:`clusters
           * <config_cluster_manager>`, :ref:`routes
           * <envoy_api_msg_RouteConfiguration>`, :ref:`endpoints
           * <arch_overview_service_discovery>` etc. may either be sourced from the
           * filesystem or from an xDS API source. Filesystem configs are watched with
           * inotify for updates.
           * [#next-free-field: 7]
           */
          export type ConfigSource__Output = _envoy_api_v2_core_ConfigSource__Output;
          /**
           * Identifies a specific ControlPlane instance that Envoy is connected to.
           */
          export type ControlPlane = _envoy_api_v2_core_ControlPlane;
          /**
           * Identifies a specific ControlPlane instance that Envoy is connected to.
           */
          export type ControlPlane__Output = _envoy_api_v2_core_ControlPlane__Output;
          /**
           * Data source consisting of either a file or an inline value.
           */
          export type DataSource = _envoy_api_v2_core_DataSource;
          /**
           * Data source consisting of either a file or an inline value.
           */
          export type DataSource__Output = _envoy_api_v2_core_DataSource__Output;
          /**
           * [#not-implemented-hide:]
           * Configuration of the event reporting service endpoint.
           */
          export type EventServiceConfig = _envoy_api_v2_core_EventServiceConfig;
          /**
           * [#not-implemented-hide:]
           * Configuration of the event reporting service endpoint.
           */
          export type EventServiceConfig__Output = _envoy_api_v2_core_EventServiceConfig__Output;
          /**
           * Version and identification for an Envoy extension.
           * [#next-free-field: 6]
           */
          export type Extension = _envoy_api_v2_core_Extension;
          /**
           * Version and identification for an Envoy extension.
           * [#next-free-field: 6]
           */
          export type Extension__Output = _envoy_api_v2_core_Extension__Output;
          /**
           * [#not-implemented-hide:]
           */
          export type GrpcProtocolOptions = _envoy_api_v2_core_GrpcProtocolOptions;
          /**
           * [#not-implemented-hide:]
           */
          export type GrpcProtocolOptions__Output = _envoy_api_v2_core_GrpcProtocolOptions__Output;
          /**
           * gRPC service configuration. This is used by :ref:`ApiConfigSource
           * <envoy_api_msg_core.ApiConfigSource>` and filter configurations.
           * [#next-free-field: 6]
           */
          export type GrpcService = _envoy_api_v2_core_GrpcService;
          /**
           * gRPC service configuration. This is used by :ref:`ApiConfigSource
           * <envoy_api_msg_core.ApiConfigSource>` and filter configurations.
           * [#next-free-field: 6]
           */
          export type GrpcService__Output = _envoy_api_v2_core_GrpcService__Output;
          /**
           * Wrapper for a set of headers.
           */
          export type HeaderMap = _envoy_api_v2_core_HeaderMap;
          /**
           * Wrapper for a set of headers.
           */
          export type HeaderMap__Output = _envoy_api_v2_core_HeaderMap__Output;
          /**
           * Header name/value pair.
           */
          export type HeaderValue = _envoy_api_v2_core_HeaderValue;
          /**
           * Header name/value pair.
           */
          export type HeaderValue__Output = _envoy_api_v2_core_HeaderValue__Output;
          /**
           * Header name/value pair plus option to control append behavior.
           */
          export type HeaderValueOption = _envoy_api_v2_core_HeaderValueOption;
          /**
           * Header name/value pair plus option to control append behavior.
           */
          export type HeaderValueOption__Output = _envoy_api_v2_core_HeaderValueOption__Output;
          /**
           * [#next-free-field: 23]
           */
          export type HealthCheck = _envoy_api_v2_core_HealthCheck;
          /**
           * [#next-free-field: 23]
           */
          export type HealthCheck__Output = _envoy_api_v2_core_HealthCheck__Output;
          /**
           * Endpoint health status.
           */
          export type HealthStatus = _envoy_api_v2_core_HealthStatus;
          /**
           * [#next-free-field: 6]
           */
          export type Http1ProtocolOptions = _envoy_api_v2_core_Http1ProtocolOptions;
          /**
           * [#next-free-field: 6]
           */
          export type Http1ProtocolOptions__Output = _envoy_api_v2_core_Http1ProtocolOptions__Output;
          /**
           * [#next-free-field: 14]
           */
          export type Http2ProtocolOptions = _envoy_api_v2_core_Http2ProtocolOptions;
          /**
           * [#next-free-field: 14]
           */
          export type Http2ProtocolOptions__Output = _envoy_api_v2_core_Http2ProtocolOptions__Output;
          /**
           * [#next-free-field: 6]
           */
          export type HttpProtocolOptions = _envoy_api_v2_core_HttpProtocolOptions;
          /**
           * [#next-free-field: 6]
           */
          export type HttpProtocolOptions__Output = _envoy_api_v2_core_HttpProtocolOptions__Output;
          /**
           * Envoy external URI descriptor
           */
          export type HttpUri = _envoy_api_v2_core_HttpUri;
          /**
           * Envoy external URI descriptor
           */
          export type HttpUri__Output = _envoy_api_v2_core_HttpUri__Output;
          /**
           * Identifies location of where either Envoy runs or where upstream hosts run.
           */
          export type Locality = _envoy_api_v2_core_Locality;
          /**
           * Identifies location of where either Envoy runs or where upstream hosts run.
           */
          export type Locality__Output = _envoy_api_v2_core_Locality__Output;
          /**
           * Metadata provides additional inputs to filters based on matched listeners,
           * filter chains, routes and endpoints. It is structured as a map, usually from
           * filter name (in reverse DNS format) to metadata specific to the filter. Metadata
           * key-values for a filter are merged as connection and request handling occurs,
           * with later values for the same key overriding earlier values.
           * 
           * An example use of metadata is providing additional values to
           * http_connection_manager in the envoy.http_connection_manager.access_log
           * namespace.
           * 
           * Another example use of metadata is to per service config info in cluster metadata, which may get
           * consumed by multiple filters.
           * 
           * For load balancing, Metadata provides a means to subset cluster endpoints.
           * Endpoints have a Metadata object associated and routes contain a Metadata
           * object to match against. There are some well defined metadata used today for
           * this purpose:
           * 
           * * ``{"envoy.lb": {"canary": <bool> }}`` This indicates the canary status of an
           * endpoint and is also used during header processing
           * (x-envoy-upstream-canary) and for stats purposes.
           * [#next-major-version: move to type/metadata/v2]
           */
          export type Metadata = _envoy_api_v2_core_Metadata;
          /**
           * Metadata provides additional inputs to filters based on matched listeners,
           * filter chains, routes and endpoints. It is structured as a map, usually from
           * filter name (in reverse DNS format) to metadata specific to the filter. Metadata
           * key-values for a filter are merged as connection and request handling occurs,
           * with later values for the same key overriding earlier values.
           * 
           * An example use of metadata is providing additional values to
           * http_connection_manager in the envoy.http_connection_manager.access_log
           * namespace.
           * 
           * Another example use of metadata is to per service config info in cluster metadata, which may get
           * consumed by multiple filters.
           * 
           * For load balancing, Metadata provides a means to subset cluster endpoints.
           * Endpoints have a Metadata object associated and routes contain a Metadata
           * object to match against. There are some well defined metadata used today for
           * this purpose:
           * 
           * * ``{"envoy.lb": {"canary": <bool> }}`` This indicates the canary status of an
           * endpoint and is also used during header processing
           * (x-envoy-upstream-canary) and for stats purposes.
           * [#next-major-version: move to type/metadata/v2]
           */
          export type Metadata__Output = _envoy_api_v2_core_Metadata__Output;
          /**
           * Identifies a specific Envoy instance. The node identifier is presented to the
           * management server, which may use this identifier to distinguish per Envoy
           * configuration for serving.
           * [#next-free-field: 12]
           */
          export type Node = _envoy_api_v2_core_Node;
          /**
           * Identifies a specific Envoy instance. The node identifier is presented to the
           * management server, which may use this identifier to distinguish per Envoy
           * configuration for serving.
           * [#next-free-field: 12]
           */
          export type Node__Output = _envoy_api_v2_core_Node__Output;
          export type Pipe = _envoy_api_v2_core_Pipe;
          export type Pipe__Output = _envoy_api_v2_core_Pipe__Output;
          /**
           * Rate Limit settings to be applied for discovery requests made by Envoy.
           */
          export type RateLimitSettings = _envoy_api_v2_core_RateLimitSettings;
          /**
           * Rate Limit settings to be applied for discovery requests made by Envoy.
           */
          export type RateLimitSettings__Output = _envoy_api_v2_core_RateLimitSettings__Output;
          /**
           * The message specifies how to fetch data from remote and how to verify it.
           */
          export type RemoteDataSource = _envoy_api_v2_core_RemoteDataSource;
          /**
           * The message specifies how to fetch data from remote and how to verify it.
           */
          export type RemoteDataSource__Output = _envoy_api_v2_core_RemoteDataSource__Output;
          /**
           * HTTP request method.
           */
          export type RequestMethod = _envoy_api_v2_core_RequestMethod;
          /**
           * The message specifies the retry policy of remote data source when fetching fails.
           */
          export type RetryPolicy = _envoy_api_v2_core_RetryPolicy;
          /**
           * The message specifies the retry policy of remote data source when fetching fails.
           */
          export type RetryPolicy__Output = _envoy_api_v2_core_RetryPolicy__Output;
          /**
           * Envoy supports :ref:`upstream priority routing
           * <arch_overview_http_routing_priority>` both at the route and the virtual
           * cluster level. The current priority implementation uses different connection
           * pool and circuit breaking settings for each priority level. This means that
           * even for HTTP/2 requests, two physical connections will be used to an
           * upstream host. In the future Envoy will likely support true HTTP/2 priority
           * over a single upstream connection.
           */
          export type RoutingPriority = _envoy_api_v2_core_RoutingPriority;
          /**
           * Runtime derived double with a default when not specified.
           */
          export type RuntimeDouble = _envoy_api_v2_core_RuntimeDouble;
          /**
           * Runtime derived double with a default when not specified.
           */
          export type RuntimeDouble__Output = _envoy_api_v2_core_RuntimeDouble__Output;
          /**
           * Runtime derived bool with a default when not specified.
           */
          export type RuntimeFeatureFlag = _envoy_api_v2_core_RuntimeFeatureFlag;
          /**
           * Runtime derived bool with a default when not specified.
           */
          export type RuntimeFeatureFlag__Output = _envoy_api_v2_core_RuntimeFeatureFlag__Output;
          /**
           * Runtime derived FractionalPercent with defaults for when the numerator or denominator is not
           * specified via a runtime key.
           * 
           * .. note::
           * 
           * Parsing of the runtime key's data is implemented such that it may be represented as a
           * :ref:`FractionalPercent <envoy_api_msg_type.FractionalPercent>` proto represented as JSON/YAML
           * and may also be represented as an integer with the assumption that the value is an integral
           * percentage out of 100. For instance, a runtime key lookup returning the value "42" would parse
           * as a `FractionalPercent` whose numerator is 42 and denominator is HUNDRED.
           */
          export type RuntimeFractionalPercent = _envoy_api_v2_core_RuntimeFractionalPercent;
          /**
           * Runtime derived FractionalPercent with defaults for when the numerator or denominator is not
           * specified via a runtime key.
           * 
           * .. note::
           * 
           * Parsing of the runtime key's data is implemented such that it may be represented as a
           * :ref:`FractionalPercent <envoy_api_msg_type.FractionalPercent>` proto represented as JSON/YAML
           * and may also be represented as an integer with the assumption that the value is an integral
           * percentage out of 100. For instance, a runtime key lookup returning the value "42" would parse
           * as a `FractionalPercent` whose numerator is 42 and denominator is HUNDRED.
           */
          export type RuntimeFractionalPercent__Output = _envoy_api_v2_core_RuntimeFractionalPercent__Output;
          /**
           * Runtime derived uint32 with a default when not specified.
           */
          export type RuntimeUInt32 = _envoy_api_v2_core_RuntimeUInt32;
          /**
           * Runtime derived uint32 with a default when not specified.
           */
          export type RuntimeUInt32__Output = _envoy_api_v2_core_RuntimeUInt32__Output;
          /**
           * [#not-implemented-hide:]
           * Self-referencing config source options. This is currently empty, but when
           * set in :ref:`ConfigSource <envoy_api_msg_core.ConfigSource>` can be used to
           * specify that other data can be obtained from the same server.
           */
          export type SelfConfigSource = _envoy_api_v2_core_SelfConfigSource;
          /**
           * [#not-implemented-hide:]
           * Self-referencing config source options. This is currently empty, but when
           * set in :ref:`ConfigSource <envoy_api_msg_core.ConfigSource>` can be used to
           * specify that other data can be obtained from the same server.
           */
          export type SelfConfigSource__Output = _envoy_api_v2_core_SelfConfigSource__Output;
          /**
           * [#next-free-field: 7]
           */
          export type SocketAddress = _envoy_api_v2_core_SocketAddress;
          /**
           * [#next-free-field: 7]
           */
          export type SocketAddress__Output = _envoy_api_v2_core_SocketAddress__Output;
          /**
           * Generic socket option message. This would be used to set socket options that
           * might not exist in upstream kernels or precompiled Envoy binaries.
           * [#next-free-field: 7]
           */
          export type SocketOption = _envoy_api_v2_core_SocketOption;
          /**
           * Generic socket option message. This would be used to set socket options that
           * might not exist in upstream kernels or precompiled Envoy binaries.
           * [#next-free-field: 7]
           */
          export type SocketOption__Output = _envoy_api_v2_core_SocketOption__Output;
          export type TcpKeepalive = _envoy_api_v2_core_TcpKeepalive;
          export type TcpKeepalive__Output = _envoy_api_v2_core_TcpKeepalive__Output;
          /**
           * [#not-implemented-hide:]
           */
          export type TcpProtocolOptions = _envoy_api_v2_core_TcpProtocolOptions;
          /**
           * [#not-implemented-hide:]
           */
          export type TcpProtocolOptions__Output = _envoy_api_v2_core_TcpProtocolOptions__Output;
          /**
           * Identifies the direction of the traffic relative to the local Envoy.
           */
          export type TrafficDirection = _envoy_api_v2_core_TrafficDirection;
          /**
           * Configuration for transport socket in :ref:`listeners <config_listeners>` and
           * :ref:`clusters <envoy_api_msg_Cluster>`. If the configuration is
           * empty, a default transport socket implementation and configuration will be
           * chosen based on the platform and existence of tls_context.
           */
          export type TransportSocket = _envoy_api_v2_core_TransportSocket;
          /**
           * Configuration for transport socket in :ref:`listeners <config_listeners>` and
           * :ref:`clusters <envoy_api_msg_Cluster>`. If the configuration is
           * empty, a default transport socket implementation and configuration will be
           * chosen based on the platform and existence of tls_context.
           */
          export type TransportSocket__Output = _envoy_api_v2_core_TransportSocket__Output;
          export type UpstreamHttpProtocolOptions = _envoy_api_v2_core_UpstreamHttpProtocolOptions;
          export type UpstreamHttpProtocolOptions__Output = _envoy_api_v2_core_UpstreamHttpProtocolOptions__Output;
        }
        export namespace endpoint {
          /**
           * Upstream host identifier.
           */
          export type Endpoint = _envoy_api_v2_endpoint_Endpoint;
          /**
           * Upstream host identifier.
           */
          export type Endpoint__Output = _envoy_api_v2_endpoint_Endpoint__Output;
          /**
           * An Endpoint that Envoy can route traffic to.
           * [#next-free-field: 6]
           */
          export type LbEndpoint = _envoy_api_v2_endpoint_LbEndpoint;
          /**
           * An Endpoint that Envoy can route traffic to.
           * [#next-free-field: 6]
           */
          export type LbEndpoint__Output = _envoy_api_v2_endpoint_LbEndpoint__Output;
          /**
           * A group of endpoints belonging to a Locality.
           * One can have multiple LocalityLbEndpoints for a locality, but this is
           * generally only done if the different groups need to have different load
           * balancing weights or different priorities.
           * [#next-free-field: 7]
           */
          export type LocalityLbEndpoints = _envoy_api_v2_endpoint_LocalityLbEndpoints;
          /**
           * A group of endpoints belonging to a Locality.
           * One can have multiple LocalityLbEndpoints for a locality, but this is
           * generally only done if the different groups need to have different load
           * balancing weights or different priorities.
           * [#next-free-field: 7]
           */
          export type LocalityLbEndpoints__Output = _envoy_api_v2_endpoint_LocalityLbEndpoints__Output;
        }
      }
    }
    export namespace type {
      export type CodecClientType = _envoy_type_CodecClientType;
      /**
       * Specifies the double start and end of the range using half-open interval semantics [start,
       * end).
       */
      export type DoubleRange = _envoy_type_DoubleRange;
      /**
       * Specifies the double start and end of the range using half-open interval semantics [start,
       * end).
       */
      export type DoubleRange__Output = _envoy_type_DoubleRange__Output;
      /**
       * A fractional percentage is used in cases in which for performance reasons performing floating
       * point to integer conversions during randomness calculations is undesirable. The message includes
       * both a numerator and denominator that together determine the final fractional value.
       * 
       * * **Example**: 1/100 = 1%.
       * * **Example**: 3/10000 = 0.03%.
       */
      export type FractionalPercent = _envoy_type_FractionalPercent;
      /**
       * A fractional percentage is used in cases in which for performance reasons performing floating
       * point to integer conversions during randomness calculations is undesirable. The message includes
       * both a numerator and denominator that together determine the final fractional value.
       * 
       * * **Example**: 1/100 = 1%.
       * * **Example**: 3/10000 = 0.03%.
       */
      export type FractionalPercent__Output = _envoy_type_FractionalPercent__Output;
      /**
       * Specifies the int32 start and end of the range using half-open interval semantics [start,
       * end).
       */
      export type Int32Range = _envoy_type_Int32Range;
      /**
       * Specifies the int32 start and end of the range using half-open interval semantics [start,
       * end).
       */
      export type Int32Range__Output = _envoy_type_Int32Range__Output;
      /**
       * Specifies the int64 start and end of the range using half-open interval semantics [start,
       * end).
       */
      export type Int64Range = _envoy_type_Int64Range;
      /**
       * Specifies the int64 start and end of the range using half-open interval semantics [start,
       * end).
       */
      export type Int64Range__Output = _envoy_type_Int64Range__Output;
      /**
       * Identifies a percentage, in the range [0.0, 100.0].
       */
      export type Percent = _envoy_type_Percent;
      /**
       * Identifies a percentage, in the range [0.0, 100.0].
       */
      export type Percent__Output = _envoy_type_Percent__Output;
      /**
       * Envoy uses SemVer (https://semver.org/). Major/minor versions indicate
       * expected behaviors and APIs, the patch version field is used only
       * for security fixes and can be generally ignored.
       */
      export type SemanticVersion = _envoy_type_SemanticVersion;
      /**
       * Envoy uses SemVer (https://semver.org/). Major/minor versions indicate
       * expected behaviors and APIs, the patch version field is used only
       * for security fixes and can be generally ignored.
       */
      export type SemanticVersion__Output = _envoy_type_SemanticVersion__Output;
      export namespace matcher {
        /**
         * Specifies a list of ways to match a string.
         */
        export type ListStringMatcher = _envoy_type_matcher_ListStringMatcher;
        /**
         * Specifies a list of ways to match a string.
         */
        export type ListStringMatcher__Output = _envoy_type_matcher_ListStringMatcher__Output;
        /**
         * Describes how to match a string and then produce a new string using a regular
         * expression and a substitution string.
         */
        export type RegexMatchAndSubstitute = _envoy_type_matcher_RegexMatchAndSubstitute;
        /**
         * Describes how to match a string and then produce a new string using a regular
         * expression and a substitution string.
         */
        export type RegexMatchAndSubstitute__Output = _envoy_type_matcher_RegexMatchAndSubstitute__Output;
        /**
         * A regex matcher designed for safety when used with untrusted input.
         */
        export type RegexMatcher = _envoy_type_matcher_RegexMatcher;
        /**
         * A regex matcher designed for safety when used with untrusted input.
         */
        export type RegexMatcher__Output = _envoy_type_matcher_RegexMatcher__Output;
        /**
         * Specifies the way to match a string.
         * [#next-free-field: 7]
         */
        export type StringMatcher = _envoy_type_matcher_StringMatcher;
        /**
         * Specifies the way to match a string.
         * [#next-free-field: 7]
         */
        export type StringMatcher__Output = _envoy_type_matcher_StringMatcher__Output;
      }
    }
  }
  export namespace google {
    export namespace api {
      /**
       * A custom pattern is used for defining custom HTTP verb.
       */
      export type CustomHttpPattern = _google_api_CustomHttpPattern;
      /**
       * A custom pattern is used for defining custom HTTP verb.
       */
      export type CustomHttpPattern__Output = _google_api_CustomHttpPattern__Output;
      /**
       * Defines the HTTP configuration for an API service. It contains a list of
       * [HttpRule][google.api.HttpRule], each specifying the mapping of an RPC method
       * to one or more HTTP REST API methods.
       */
      export type Http = _google_api_Http;
      /**
       * Defines the HTTP configuration for an API service. It contains a list of
       * [HttpRule][google.api.HttpRule], each specifying the mapping of an RPC method
       * to one or more HTTP REST API methods.
       */
      export type Http__Output = _google_api_Http__Output;
      /**
       * # gRPC Transcoding
       * 
       * gRPC Transcoding is a feature for mapping between a gRPC method and one or
       * more HTTP REST endpoints. It allows developers to build a single API service
       * that supports both gRPC APIs and REST APIs. Many systems, including [Google
       * APIs](https://github.com/googleapis/googleapis),
       * [Cloud Endpoints](https://cloud.google.com/endpoints), [gRPC
       * Gateway](https://github.com/grpc-ecosystem/grpc-gateway),
       * and [Envoy](https://github.com/envoyproxy/envoy) proxy support this feature
       * and use it for large scale production services.
       * 
       * `HttpRule` defines the schema of the gRPC/REST mapping. The mapping specifies
       * how different portions of the gRPC request message are mapped to the URL
       * path, URL query parameters, and HTTP request body. It also controls how the
       * gRPC response message is mapped to the HTTP response body. `HttpRule` is
       * typically specified as an `google.api.http` annotation on the gRPC method.
       * 
       * Each mapping specifies a URL path template and an HTTP method. The path
       * template may refer to one or more fields in the gRPC request message, as long
       * as each field is a non-repeated field with a primitive (non-message) type.
       * The path template controls how fields of the request message are mapped to
       * the URL path.
       * 
       * Example:
       * 
       * service Messaging {
       * rpc GetMessage(GetMessageRequest) returns (Message) {
       * option (google.api.http) = {
       * get: "/v1/{name=messages/*}"
       * };
       * }
       * }
       * message GetMessageRequest {
       * string name = 1; // Mapped to URL path.
       * }
       * message Message {
       * string text = 1; // The resource content.
       * }
       * 
       * This enables an HTTP REST to gRPC mapping as below:
       * 
       * HTTP | gRPC
       * -----|-----
       * `GET /v1/messages/123456`  | `GetMessage(name: "messages/123456")`
       * 
       * Any fields in the request message which are not bound by the path template
       * automatically become HTTP query parameters if there is no HTTP request body.
       * For example:
       * 
       * service Messaging {
       * rpc GetMessage(GetMessageRequest) returns (Message) {
       * option (google.api.http) = {
       * get:"/v1/messages/{message_id}"
       * };
       * }
       * }
       * message GetMessageRequest {
       * message SubMessage {
       * string subfield = 1;
       * }
       * string message_id = 1; // Mapped to URL path.
       * int64 revision = 2;    // Mapped to URL query parameter `revision`.
       * SubMessage sub = 3;    // Mapped to URL query parameter `sub.subfield`.
       * }
       * 
       * This enables a HTTP JSON to RPC mapping as below:
       * 
       * HTTP | gRPC
       * -----|-----
       * `GET /v1/messages/123456?revision=2&sub.subfield=foo` |
       * `GetMessage(message_id: "123456" revision: 2 sub: SubMessage(subfield:
       * "foo"))`
       * 
       * Note that fields which are mapped to URL query parameters must have a
       * primitive type or a repeated primitive type or a non-repeated message type.
       * In the case of a repeated type, the parameter can be repeated in the URL
       * as `...?param=A&param=B`. In the case of a message type, each field of the
       * message is mapped to a separate parameter, such as
       * `...?foo.a=A&foo.b=B&foo.c=C`.
       * 
       * For HTTP methods that allow a request body, the `body` field
       * specifies the mapping. Consider a REST update method on the
       * message resource collection:
       * 
       * service Messaging {
       * rpc UpdateMessage(UpdateMessageRequest) returns (Message) {
       * option (google.api.http) = {
       * patch: "/v1/messages/{message_id}"
       * body: "message"
       * };
       * }
       * }
       * message UpdateMessageRequest {
       * string message_id = 1; // mapped to the URL
       * Message message = 2;   // mapped to the body
       * }
       * 
       * The following HTTP JSON to RPC mapping is enabled, where the
       * representation of the JSON in the request body is determined by
       * protos JSON encoding:
       * 
       * HTTP | gRPC
       * -----|-----
       * `PATCH /v1/messages/123456 { "text": "Hi!" }` | `UpdateMessage(message_id:
       * "123456" message { text: "Hi!" })`
       * 
       * The special name `*` can be used in the body mapping to define that
       * every field not bound by the path template should be mapped to the
       * request body.  This enables the following alternative definition of
       * the update method:
       * 
       * service Messaging {
       * rpc UpdateMessage(Message) returns (Message) {
       * option (google.api.http) = {
       * patch: "/v1/messages/{message_id}"
       * body: "*"
       * };
       * }
       * }
       * message Message {
       * string message_id = 1;
       * string text = 2;
       * }
       * 
       * 
       * The following HTTP JSON to RPC mapping is enabled:
       * 
       * HTTP | gRPC
       * -----|-----
       * `PATCH /v1/messages/123456 { "text": "Hi!" }` | `UpdateMessage(message_id:
       * "123456" text: "Hi!")`
       * 
       * Note that when using `*` in the body mapping, it is not possible to
       * have HTTP parameters, as all fields not bound by the path end in
       * the body. This makes this option more rarely used in practice when
       * defining REST APIs. The common usage of `*` is in custom methods
       * which don't use the URL at all for transferring data.
       * 
       * It is possible to define multiple HTTP methods for one RPC by using
       * the `additional_bindings` option. Example:
       * 
       * service Messaging {
       * rpc GetMessage(GetMessageRequest) returns (Message) {
       * option (google.api.http) = {
       * get: "/v1/messages/{message_id}"
       * additional_bindings {
       * get: "/v1/users/{user_id}/messages/{message_id}"
       * }
       * };
       * }
       * }
       * message GetMessageRequest {
       * string message_id = 1;
       * string user_id = 2;
       * }
       * 
       * This enables the following two alternative HTTP JSON to RPC mappings:
       * 
       * HTTP | gRPC
       * -----|-----
       * `GET /v1/messages/123456` | `GetMessage(message_id: "123456")`
       * `GET /v1/users/me/messages/123456` | `GetMessage(user_id: "me" message_id:
       * "123456")`
       * 
       * ## Rules for HTTP mapping
       * 
       * 1. Leaf request fields (recursive expansion nested messages in the request
       * message) are classified into three categories:
       * - Fields referred by the path template. They are passed via the URL path.
       * - Fields referred by the [HttpRule.body][google.api.HttpRule.body]. They are passed via the HTTP
       * request body.
       * - All other fields are passed via the URL query parameters, and the
       * parameter name is the field path in the request message. A repeated
       * field can be represented as multiple query parameters under the same
       * name.
       * 2. If [HttpRule.body][google.api.HttpRule.body] is "*", there is no URL query parameter, all fields
       * are passed via URL path and HTTP request body.
       * 3. If [HttpRule.body][google.api.HttpRule.body] is omitted, there is no HTTP request body, all
       * fields are passed via URL path and URL query parameters.
       * 
       * ### Path template syntax
       * 
       * Template = "/" Segments [ Verb ] ;
       * Segments = Segment { "/" Segment } ;
       * Segment  = "*" | "**" | LITERAL | Variable ;
       * Variable = "{" FieldPath [ "=" Segments ] "}" ;
       * FieldPath = IDENT { "." IDENT } ;
       * Verb     = ":" LITERAL ;
       * 
       * The syntax `*` matches a single URL path segment. The syntax `**` matches
       * zero or more URL path segments, which must be the last part of the URL path
       * except the `Verb`.
       * 
       * The syntax `Variable` matches part of the URL path as specified by its
       * template. A variable template must not contain other variables. If a variable
       * matches a single path segment, its template may be omitted, e.g. `{var}`
       * is equivalent to `{var=*}`.
       * 
       * The syntax `LITERAL` matches literal text in the URL path. If the `LITERAL`
       * contains any reserved character, such characters should be percent-encoded
       * before the matching.
       * 
       * If a variable contains exactly one path segment, such as `"{var}"` or
       * `"{var=*}"`, when such a variable is expanded into a URL path on the client
       * side, all characters except `[-_.~0-9a-zA-Z]` are percent-encoded. The
       * server side does the reverse decoding. Such variables show up in the
       * [Discovery
       * Document](https://developers.google.com/discovery/v1/reference/apis) as
       * `{var}`.
       * 
       * If a variable contains multiple path segments, such as `"{var=foo/*}"`
       * or `"{var=**}"`, when such a variable is expanded into a URL path on the
       * client side, all characters except `[-_.~/0-9a-zA-Z]` are percent-encoded.
       * The server side does the reverse decoding, except "%2F" and "%2f" are left
       * unchanged. Such variables show up in the
       * [Discovery
       * Document](https://developers.google.com/discovery/v1/reference/apis) as
       * `{+var}`.
       * 
       * ## Using gRPC API Service Configuration
       * 
       * gRPC API Service Configuration (service config) is a configuration language
       * for configuring a gRPC service to become a user-facing product. The
       * service config is simply the YAML representation of the `google.api.Service`
       * proto message.
       * 
       * As an alternative to annotating your proto file, you can configure gRPC
       * transcoding in your service config YAML files. You do this by specifying a
       * `HttpRule` that maps the gRPC method to a REST endpoint, achieving the same
       * effect as the proto annotation. This can be particularly useful if you
       * have a proto that is reused in multiple services. Note that any transcoding
       * specified in the service config will override any matching transcoding
       * configuration in the proto.
       * 
       * Example:
       * 
       * http:
       * rules:
       * # Selects a gRPC method and applies HttpRule to it.
       * - selector: example.v1.Messaging.GetMessage
       * get: /v1/messages/{message_id}/{sub.subfield}
       * 
       * ## Special notes
       * 
       * When gRPC Transcoding is used to map a gRPC to JSON REST endpoints, the
       * proto to JSON conversion must follow the [proto3
       * specification](https://developers.google.com/protocol-buffers/docs/proto3#json).
       * 
       * While the single segment variable follows the semantics of
       * [RFC 6570](https://tools.ietf.org/html/rfc6570) Section 3.2.2 Simple String
       * Expansion, the multi segment variable **does not** follow RFC 6570 Section
       * 3.2.3 Reserved Expansion. The reason is that the Reserved Expansion
       * does not expand special characters like `?` and `#`, which would lead
       * to invalid URLs. As the result, gRPC Transcoding uses a custom encoding
       * for multi segment variables.
       * 
       * The path variables **must not** refer to any repeated or mapped field,
       * because client libraries are not capable of handling such variable expansion.
       * 
       * The path variables **must not** capture the leading "/" character. The reason
       * is that the most common use case "{var}" does not capture the leading "/"
       * character. For consistency, all path variables must share the same behavior.
       * 
       * Repeated message fields must not be mapped to URL query parameters, because
       * no client library can support such complicated mapping.
       * 
       * If an API needs to use a JSON array for request or response body, it can map
       * the request or response body to a repeated field. However, some gRPC
       * Transcoding implementations may not support this feature.
       */
      export type HttpRule = _google_api_HttpRule;
      /**
       * # gRPC Transcoding
       * 
       * gRPC Transcoding is a feature for mapping between a gRPC method and one or
       * more HTTP REST endpoints. It allows developers to build a single API service
       * that supports both gRPC APIs and REST APIs. Many systems, including [Google
       * APIs](https://github.com/googleapis/googleapis),
       * [Cloud Endpoints](https://cloud.google.com/endpoints), [gRPC
       * Gateway](https://github.com/grpc-ecosystem/grpc-gateway),
       * and [Envoy](https://github.com/envoyproxy/envoy) proxy support this feature
       * and use it for large scale production services.
       * 
       * `HttpRule` defines the schema of the gRPC/REST mapping. The mapping specifies
       * how different portions of the gRPC request message are mapped to the URL
       * path, URL query parameters, and HTTP request body. It also controls how the
       * gRPC response message is mapped to the HTTP response body. `HttpRule` is
       * typically specified as an `google.api.http` annotation on the gRPC method.
       * 
       * Each mapping specifies a URL path template and an HTTP method. The path
       * template may refer to one or more fields in the gRPC request message, as long
       * as each field is a non-repeated field with a primitive (non-message) type.
       * The path template controls how fields of the request message are mapped to
       * the URL path.
       * 
       * Example:
       * 
       * service Messaging {
       * rpc GetMessage(GetMessageRequest) returns (Message) {
       * option (google.api.http) = {
       * get: "/v1/{name=messages/*}"
       * };
       * }
       * }
       * message GetMessageRequest {
       * string name = 1; // Mapped to URL path.
       * }
       * message Message {
       * string text = 1; // The resource content.
       * }
       * 
       * This enables an HTTP REST to gRPC mapping as below:
       * 
       * HTTP | gRPC
       * -----|-----
       * `GET /v1/messages/123456`  | `GetMessage(name: "messages/123456")`
       * 
       * Any fields in the request message which are not bound by the path template
       * automatically become HTTP query parameters if there is no HTTP request body.
       * For example:
       * 
       * service Messaging {
       * rpc GetMessage(GetMessageRequest) returns (Message) {
       * option (google.api.http) = {
       * get:"/v1/messages/{message_id}"
       * };
       * }
       * }
       * message GetMessageRequest {
       * message SubMessage {
       * string subfield = 1;
       * }
       * string message_id = 1; // Mapped to URL path.
       * int64 revision = 2;    // Mapped to URL query parameter `revision`.
       * SubMessage sub = 3;    // Mapped to URL query parameter `sub.subfield`.
       * }
       * 
       * This enables a HTTP JSON to RPC mapping as below:
       * 
       * HTTP | gRPC
       * -----|-----
       * `GET /v1/messages/123456?revision=2&sub.subfield=foo` |
       * `GetMessage(message_id: "123456" revision: 2 sub: SubMessage(subfield:
       * "foo"))`
       * 
       * Note that fields which are mapped to URL query parameters must have a
       * primitive type or a repeated primitive type or a non-repeated message type.
       * In the case of a repeated type, the parameter can be repeated in the URL
       * as `...?param=A&param=B`. In the case of a message type, each field of the
       * message is mapped to a separate parameter, such as
       * `...?foo.a=A&foo.b=B&foo.c=C`.
       * 
       * For HTTP methods that allow a request body, the `body` field
       * specifies the mapping. Consider a REST update method on the
       * message resource collection:
       * 
       * service Messaging {
       * rpc UpdateMessage(UpdateMessageRequest) returns (Message) {
       * option (google.api.http) = {
       * patch: "/v1/messages/{message_id}"
       * body: "message"
       * };
       * }
       * }
       * message UpdateMessageRequest {
       * string message_id = 1; // mapped to the URL
       * Message message = 2;   // mapped to the body
       * }
       * 
       * The following HTTP JSON to RPC mapping is enabled, where the
       * representation of the JSON in the request body is determined by
       * protos JSON encoding:
       * 
       * HTTP | gRPC
       * -----|-----
       * `PATCH /v1/messages/123456 { "text": "Hi!" }` | `UpdateMessage(message_id:
       * "123456" message { text: "Hi!" })`
       * 
       * The special name `*` can be used in the body mapping to define that
       * every field not bound by the path template should be mapped to the
       * request body.  This enables the following alternative definition of
       * the update method:
       * 
       * service Messaging {
       * rpc UpdateMessage(Message) returns (Message) {
       * option (google.api.http) = {
       * patch: "/v1/messages/{message_id}"
       * body: "*"
       * };
       * }
       * }
       * message Message {
       * string message_id = 1;
       * string text = 2;
       * }
       * 
       * 
       * The following HTTP JSON to RPC mapping is enabled:
       * 
       * HTTP | gRPC
       * -----|-----
       * `PATCH /v1/messages/123456 { "text": "Hi!" }` | `UpdateMessage(message_id:
       * "123456" text: "Hi!")`
       * 
       * Note that when using `*` in the body mapping, it is not possible to
       * have HTTP parameters, as all fields not bound by the path end in
       * the body. This makes this option more rarely used in practice when
       * defining REST APIs. The common usage of `*` is in custom methods
       * which don't use the URL at all for transferring data.
       * 
       * It is possible to define multiple HTTP methods for one RPC by using
       * the `additional_bindings` option. Example:
       * 
       * service Messaging {
       * rpc GetMessage(GetMessageRequest) returns (Message) {
       * option (google.api.http) = {
       * get: "/v1/messages/{message_id}"
       * additional_bindings {
       * get: "/v1/users/{user_id}/messages/{message_id}"
       * }
       * };
       * }
       * }
       * message GetMessageRequest {
       * string message_id = 1;
       * string user_id = 2;
       * }
       * 
       * This enables the following two alternative HTTP JSON to RPC mappings:
       * 
       * HTTP | gRPC
       * -----|-----
       * `GET /v1/messages/123456` | `GetMessage(message_id: "123456")`
       * `GET /v1/users/me/messages/123456` | `GetMessage(user_id: "me" message_id:
       * "123456")`
       * 
       * ## Rules for HTTP mapping
       * 
       * 1. Leaf request fields (recursive expansion nested messages in the request
       * message) are classified into three categories:
       * - Fields referred by the path template. They are passed via the URL path.
       * - Fields referred by the [HttpRule.body][google.api.HttpRule.body]. They are passed via the HTTP
       * request body.
       * - All other fields are passed via the URL query parameters, and the
       * parameter name is the field path in the request message. A repeated
       * field can be represented as multiple query parameters under the same
       * name.
       * 2. If [HttpRule.body][google.api.HttpRule.body] is "*", there is no URL query parameter, all fields
       * are passed via URL path and HTTP request body.
       * 3. If [HttpRule.body][google.api.HttpRule.body] is omitted, there is no HTTP request body, all
       * fields are passed via URL path and URL query parameters.
       * 
       * ### Path template syntax
       * 
       * Template = "/" Segments [ Verb ] ;
       * Segments = Segment { "/" Segment } ;
       * Segment  = "*" | "**" | LITERAL | Variable ;
       * Variable = "{" FieldPath [ "=" Segments ] "}" ;
       * FieldPath = IDENT { "." IDENT } ;
       * Verb     = ":" LITERAL ;
       * 
       * The syntax `*` matches a single URL path segment. The syntax `**` matches
       * zero or more URL path segments, which must be the last part of the URL path
       * except the `Verb`.
       * 
       * The syntax `Variable` matches part of the URL path as specified by its
       * template. A variable template must not contain other variables. If a variable
       * matches a single path segment, its template may be omitted, e.g. `{var}`
       * is equivalent to `{var=*}`.
       * 
       * The syntax `LITERAL` matches literal text in the URL path. If the `LITERAL`
       * contains any reserved character, such characters should be percent-encoded
       * before the matching.
       * 
       * If a variable contains exactly one path segment, such as `"{var}"` or
       * `"{var=*}"`, when such a variable is expanded into a URL path on the client
       * side, all characters except `[-_.~0-9a-zA-Z]` are percent-encoded. The
       * server side does the reverse decoding. Such variables show up in the
       * [Discovery
       * Document](https://developers.google.com/discovery/v1/reference/apis) as
       * `{var}`.
       * 
       * If a variable contains multiple path segments, such as `"{var=foo/*}"`
       * or `"{var=**}"`, when such a variable is expanded into a URL path on the
       * client side, all characters except `[-_.~/0-9a-zA-Z]` are percent-encoded.
       * The server side does the reverse decoding, except "%2F" and "%2f" are left
       * unchanged. Such variables show up in the
       * [Discovery
       * Document](https://developers.google.com/discovery/v1/reference/apis) as
       * `{+var}`.
       * 
       * ## Using gRPC API Service Configuration
       * 
       * gRPC API Service Configuration (service config) is a configuration language
       * for configuring a gRPC service to become a user-facing product. The
       * service config is simply the YAML representation of the `google.api.Service`
       * proto message.
       * 
       * As an alternative to annotating your proto file, you can configure gRPC
       * transcoding in your service config YAML files. You do this by specifying a
       * `HttpRule` that maps the gRPC method to a REST endpoint, achieving the same
       * effect as the proto annotation. This can be particularly useful if you
       * have a proto that is reused in multiple services. Note that any transcoding
       * specified in the service config will override any matching transcoding
       * configuration in the proto.
       * 
       * Example:
       * 
       * http:
       * rules:
       * # Selects a gRPC method and applies HttpRule to it.
       * - selector: example.v1.Messaging.GetMessage
       * get: /v1/messages/{message_id}/{sub.subfield}
       * 
       * ## Special notes
       * 
       * When gRPC Transcoding is used to map a gRPC to JSON REST endpoints, the
       * proto to JSON conversion must follow the [proto3
       * specification](https://developers.google.com/protocol-buffers/docs/proto3#json).
       * 
       * While the single segment variable follows the semantics of
       * [RFC 6570](https://tools.ietf.org/html/rfc6570) Section 3.2.2 Simple String
       * Expansion, the multi segment variable **does not** follow RFC 6570 Section
       * 3.2.3 Reserved Expansion. The reason is that the Reserved Expansion
       * does not expand special characters like `?` and `#`, which would lead
       * to invalid URLs. As the result, gRPC Transcoding uses a custom encoding
       * for multi segment variables.
       * 
       * The path variables **must not** refer to any repeated or mapped field,
       * because client libraries are not capable of handling such variable expansion.
       * 
       * The path variables **must not** capture the leading "/" character. The reason
       * is that the most common use case "{var}" does not capture the leading "/"
       * character. For consistency, all path variables must share the same behavior.
       * 
       * Repeated message fields must not be mapped to URL query parameters, because
       * no client library can support such complicated mapping.
       * 
       * If an API needs to use a JSON array for request or response body, it can map
       * the request or response body to a repeated field. However, some gRPC
       * Transcoding implementations may not support this feature.
       */
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
    /**
     * AnyRules describe constraints applied exclusively to the
     * `google.protobuf.Any` well-known type
     */
    export type AnyRules = _validate_AnyRules;
    /**
     * AnyRules describe constraints applied exclusively to the
     * `google.protobuf.Any` well-known type
     */
    export type AnyRules__Output = _validate_AnyRules__Output;
    /**
     * BoolRules describes the constraints applied to `bool` values
     */
    export type BoolRules = _validate_BoolRules;
    /**
     * BoolRules describes the constraints applied to `bool` values
     */
    export type BoolRules__Output = _validate_BoolRules__Output;
    /**
     * BytesRules describe the constraints applied to `bytes` values
     */
    export type BytesRules = _validate_BytesRules;
    /**
     * BytesRules describe the constraints applied to `bytes` values
     */
    export type BytesRules__Output = _validate_BytesRules__Output;
    /**
     * DoubleRules describes the constraints applied to `double` values
     */
    export type DoubleRules = _validate_DoubleRules;
    /**
     * DoubleRules describes the constraints applied to `double` values
     */
    export type DoubleRules__Output = _validate_DoubleRules__Output;
    /**
     * DurationRules describe the constraints applied exclusively to the
     * `google.protobuf.Duration` well-known type
     */
    export type DurationRules = _validate_DurationRules;
    /**
     * DurationRules describe the constraints applied exclusively to the
     * `google.protobuf.Duration` well-known type
     */
    export type DurationRules__Output = _validate_DurationRules__Output;
    /**
     * EnumRules describe the constraints applied to enum values
     */
    export type EnumRules = _validate_EnumRules;
    /**
     * EnumRules describe the constraints applied to enum values
     */
    export type EnumRules__Output = _validate_EnumRules__Output;
    /**
     * FieldRules encapsulates the rules for each type of field. Depending on the
     * field, the correct set should be used to ensure proper validations.
     */
    export type FieldRules = _validate_FieldRules;
    /**
     * FieldRules encapsulates the rules for each type of field. Depending on the
     * field, the correct set should be used to ensure proper validations.
     */
    export type FieldRules__Output = _validate_FieldRules__Output;
    /**
     * Fixed32Rules describes the constraints applied to `fixed32` values
     */
    export type Fixed32Rules = _validate_Fixed32Rules;
    /**
     * Fixed32Rules describes the constraints applied to `fixed32` values
     */
    export type Fixed32Rules__Output = _validate_Fixed32Rules__Output;
    /**
     * Fixed64Rules describes the constraints applied to `fixed64` values
     */
    export type Fixed64Rules = _validate_Fixed64Rules;
    /**
     * Fixed64Rules describes the constraints applied to `fixed64` values
     */
    export type Fixed64Rules__Output = _validate_Fixed64Rules__Output;
    /**
     * FloatRules describes the constraints applied to `float` values
     */
    export type FloatRules = _validate_FloatRules;
    /**
     * FloatRules describes the constraints applied to `float` values
     */
    export type FloatRules__Output = _validate_FloatRules__Output;
    /**
     * Int32Rules describes the constraints applied to `int32` values
     */
    export type Int32Rules = _validate_Int32Rules;
    /**
     * Int32Rules describes the constraints applied to `int32` values
     */
    export type Int32Rules__Output = _validate_Int32Rules__Output;
    /**
     * Int64Rules describes the constraints applied to `int64` values
     */
    export type Int64Rules = _validate_Int64Rules;
    /**
     * Int64Rules describes the constraints applied to `int64` values
     */
    export type Int64Rules__Output = _validate_Int64Rules__Output;
    /**
     * WellKnownRegex contain some well-known patterns.
     */
    export type KnownRegex = _validate_KnownRegex;
    /**
     * MapRules describe the constraints applied to `map` values
     */
    export type MapRules = _validate_MapRules;
    /**
     * MapRules describe the constraints applied to `map` values
     */
    export type MapRules__Output = _validate_MapRules__Output;
    /**
     * MessageRules describe the constraints applied to embedded message values.
     * For message-type fields, validation is performed recursively.
     */
    export type MessageRules = _validate_MessageRules;
    /**
     * MessageRules describe the constraints applied to embedded message values.
     * For message-type fields, validation is performed recursively.
     */
    export type MessageRules__Output = _validate_MessageRules__Output;
    /**
     * RepeatedRules describe the constraints applied to `repeated` values
     */
    export type RepeatedRules = _validate_RepeatedRules;
    /**
     * RepeatedRules describe the constraints applied to `repeated` values
     */
    export type RepeatedRules__Output = _validate_RepeatedRules__Output;
    /**
     * SFixed32Rules describes the constraints applied to `sfixed32` values
     */
    export type SFixed32Rules = _validate_SFixed32Rules;
    /**
     * SFixed32Rules describes the constraints applied to `sfixed32` values
     */
    export type SFixed32Rules__Output = _validate_SFixed32Rules__Output;
    /**
     * SFixed64Rules describes the constraints applied to `sfixed64` values
     */
    export type SFixed64Rules = _validate_SFixed64Rules;
    /**
     * SFixed64Rules describes the constraints applied to `sfixed64` values
     */
    export type SFixed64Rules__Output = _validate_SFixed64Rules__Output;
    /**
     * SInt32Rules describes the constraints applied to `sint32` values
     */
    export type SInt32Rules = _validate_SInt32Rules;
    /**
     * SInt32Rules describes the constraints applied to `sint32` values
     */
    export type SInt32Rules__Output = _validate_SInt32Rules__Output;
    /**
     * SInt64Rules describes the constraints applied to `sint64` values
     */
    export type SInt64Rules = _validate_SInt64Rules;
    /**
     * SInt64Rules describes the constraints applied to `sint64` values
     */
    export type SInt64Rules__Output = _validate_SInt64Rules__Output;
    /**
     * StringRules describe the constraints applied to `string` values
     */
    export type StringRules = _validate_StringRules;
    /**
     * StringRules describe the constraints applied to `string` values
     */
    export type StringRules__Output = _validate_StringRules__Output;
    /**
     * TimestampRules describe the constraints applied exclusively to the
     * `google.protobuf.Timestamp` well-known type
     */
    export type TimestampRules = _validate_TimestampRules;
    /**
     * TimestampRules describe the constraints applied exclusively to the
     * `google.protobuf.Timestamp` well-known type
     */
    export type TimestampRules__Output = _validate_TimestampRules__Output;
    /**
     * UInt32Rules describes the constraints applied to `uint32` values
     */
    export type UInt32Rules = _validate_UInt32Rules;
    /**
     * UInt32Rules describes the constraints applied to `uint32` values
     */
    export type UInt32Rules__Output = _validate_UInt32Rules__Output;
    /**
     * UInt64Rules describes the constraints applied to `uint64` values
     */
    export type UInt64Rules = _validate_UInt64Rules;
    /**
     * UInt64Rules describes the constraints applied to `uint64` values
     */
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
