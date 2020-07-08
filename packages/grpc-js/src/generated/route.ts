import * as grpc from '../index';
import { ServiceDefinition, EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import { RouteConfiguration as _envoy_api_v2_RouteConfiguration, RouteConfiguration__Output as _envoy_api_v2_RouteConfiguration__Output } from './envoy/api/v2/RouteConfiguration';
import { Vhds as _envoy_api_v2_Vhds, Vhds__Output as _envoy_api_v2_Vhds__Output } from './envoy/api/v2/Vhds';
import { RoutingPriority as _envoy_api_v2_core_RoutingPriority } from './envoy/api/v2/core/RoutingPriority';
import { RequestMethod as _envoy_api_v2_core_RequestMethod } from './envoy/api/v2/core/RequestMethod';
import { TrafficDirection as _envoy_api_v2_core_TrafficDirection } from './envoy/api/v2/core/TrafficDirection';
import { Locality as _envoy_api_v2_core_Locality, Locality__Output as _envoy_api_v2_core_Locality__Output } from './envoy/api/v2/core/Locality';
import { BuildVersion as _envoy_api_v2_core_BuildVersion, BuildVersion__Output as _envoy_api_v2_core_BuildVersion__Output } from './envoy/api/v2/core/BuildVersion';
import { Extension as _envoy_api_v2_core_Extension, Extension__Output as _envoy_api_v2_core_Extension__Output } from './envoy/api/v2/core/Extension';
import { Node as _envoy_api_v2_core_Node, Node__Output as _envoy_api_v2_core_Node__Output } from './envoy/api/v2/core/Node';
import { Metadata as _envoy_api_v2_core_Metadata, Metadata__Output as _envoy_api_v2_core_Metadata__Output } from './envoy/api/v2/core/Metadata';
import { RuntimeUInt32 as _envoy_api_v2_core_RuntimeUInt32, RuntimeUInt32__Output as _envoy_api_v2_core_RuntimeUInt32__Output } from './envoy/api/v2/core/RuntimeUInt32';
import { RuntimeDouble as _envoy_api_v2_core_RuntimeDouble, RuntimeDouble__Output as _envoy_api_v2_core_RuntimeDouble__Output } from './envoy/api/v2/core/RuntimeDouble';
import { RuntimeFeatureFlag as _envoy_api_v2_core_RuntimeFeatureFlag, RuntimeFeatureFlag__Output as _envoy_api_v2_core_RuntimeFeatureFlag__Output } from './envoy/api/v2/core/RuntimeFeatureFlag';
import { HeaderValue as _envoy_api_v2_core_HeaderValue, HeaderValue__Output as _envoy_api_v2_core_HeaderValue__Output } from './envoy/api/v2/core/HeaderValue';
import { HeaderValueOption as _envoy_api_v2_core_HeaderValueOption, HeaderValueOption__Output as _envoy_api_v2_core_HeaderValueOption__Output } from './envoy/api/v2/core/HeaderValueOption';
import { HeaderMap as _envoy_api_v2_core_HeaderMap, HeaderMap__Output as _envoy_api_v2_core_HeaderMap__Output } from './envoy/api/v2/core/HeaderMap';
import { DataSource as _envoy_api_v2_core_DataSource, DataSource__Output as _envoy_api_v2_core_DataSource__Output } from './envoy/api/v2/core/DataSource';
import { RetryPolicy as _envoy_api_v2_core_RetryPolicy, RetryPolicy__Output as _envoy_api_v2_core_RetryPolicy__Output } from './envoy/api/v2/core/RetryPolicy';
import { RemoteDataSource as _envoy_api_v2_core_RemoteDataSource, RemoteDataSource__Output as _envoy_api_v2_core_RemoteDataSource__Output } from './envoy/api/v2/core/RemoteDataSource';
import { AsyncDataSource as _envoy_api_v2_core_AsyncDataSource, AsyncDataSource__Output as _envoy_api_v2_core_AsyncDataSource__Output } from './envoy/api/v2/core/AsyncDataSource';
import { TransportSocket as _envoy_api_v2_core_TransportSocket, TransportSocket__Output as _envoy_api_v2_core_TransportSocket__Output } from './envoy/api/v2/core/TransportSocket';
import { RuntimeFractionalPercent as _envoy_api_v2_core_RuntimeFractionalPercent, RuntimeFractionalPercent__Output as _envoy_api_v2_core_RuntimeFractionalPercent__Output } from './envoy/api/v2/core/RuntimeFractionalPercent';
import { ControlPlane as _envoy_api_v2_core_ControlPlane, ControlPlane__Output as _envoy_api_v2_core_ControlPlane__Output } from './envoy/api/v2/core/ControlPlane';
import { ApiVersion as _envoy_api_v2_core_ApiVersion } from './envoy/api/v2/core/ApiVersion';
import { ApiConfigSource as _envoy_api_v2_core_ApiConfigSource, ApiConfigSource__Output as _envoy_api_v2_core_ApiConfigSource__Output } from './envoy/api/v2/core/ApiConfigSource';
import { AggregatedConfigSource as _envoy_api_v2_core_AggregatedConfigSource, AggregatedConfigSource__Output as _envoy_api_v2_core_AggregatedConfigSource__Output } from './envoy/api/v2/core/AggregatedConfigSource';
import { SelfConfigSource as _envoy_api_v2_core_SelfConfigSource, SelfConfigSource__Output as _envoy_api_v2_core_SelfConfigSource__Output } from './envoy/api/v2/core/SelfConfigSource';
import { RateLimitSettings as _envoy_api_v2_core_RateLimitSettings, RateLimitSettings__Output as _envoy_api_v2_core_RateLimitSettings__Output } from './envoy/api/v2/core/RateLimitSettings';
import { ConfigSource as _envoy_api_v2_core_ConfigSource, ConfigSource__Output as _envoy_api_v2_core_ConfigSource__Output } from './envoy/api/v2/core/ConfigSource';
import { BackoffStrategy as _envoy_api_v2_core_BackoffStrategy, BackoffStrategy__Output as _envoy_api_v2_core_BackoffStrategy__Output } from './envoy/api/v2/core/BackoffStrategy';
import { Pipe as _envoy_api_v2_core_Pipe, Pipe__Output as _envoy_api_v2_core_Pipe__Output } from './envoy/api/v2/core/Pipe';
import { SocketAddress as _envoy_api_v2_core_SocketAddress, SocketAddress__Output as _envoy_api_v2_core_SocketAddress__Output } from './envoy/api/v2/core/SocketAddress';
import { TcpKeepalive as _envoy_api_v2_core_TcpKeepalive, TcpKeepalive__Output as _envoy_api_v2_core_TcpKeepalive__Output } from './envoy/api/v2/core/TcpKeepalive';
import { BindConfig as _envoy_api_v2_core_BindConfig, BindConfig__Output as _envoy_api_v2_core_BindConfig__Output } from './envoy/api/v2/core/BindConfig';
import { Address as _envoy_api_v2_core_Address, Address__Output as _envoy_api_v2_core_Address__Output } from './envoy/api/v2/core/Address';
import { CidrRange as _envoy_api_v2_core_CidrRange, CidrRange__Output as _envoy_api_v2_core_CidrRange__Output } from './envoy/api/v2/core/CidrRange';
import { HttpUri as _envoy_api_v2_core_HttpUri, HttpUri__Output as _envoy_api_v2_core_HttpUri__Output } from './envoy/api/v2/core/HttpUri';
import { GrpcService as _envoy_api_v2_core_GrpcService, GrpcService__Output as _envoy_api_v2_core_GrpcService__Output } from './envoy/api/v2/core/GrpcService';
import { SocketOption as _envoy_api_v2_core_SocketOption, SocketOption__Output as _envoy_api_v2_core_SocketOption__Output } from './envoy/api/v2/core/SocketOption';
import { VirtualHost as _envoy_api_v2_route_VirtualHost, VirtualHost__Output as _envoy_api_v2_route_VirtualHost__Output } from './envoy/api/v2/route/VirtualHost';
import { FilterAction as _envoy_api_v2_route_FilterAction, FilterAction__Output as _envoy_api_v2_route_FilterAction__Output } from './envoy/api/v2/route/FilterAction';
import { Route as _envoy_api_v2_route_Route, Route__Output as _envoy_api_v2_route_Route__Output } from './envoy/api/v2/route/Route';
import { WeightedCluster as _envoy_api_v2_route_WeightedCluster, WeightedCluster__Output as _envoy_api_v2_route_WeightedCluster__Output } from './envoy/api/v2/route/WeightedCluster';
import { RouteMatch as _envoy_api_v2_route_RouteMatch, RouteMatch__Output as _envoy_api_v2_route_RouteMatch__Output } from './envoy/api/v2/route/RouteMatch';
import { CorsPolicy as _envoy_api_v2_route_CorsPolicy, CorsPolicy__Output as _envoy_api_v2_route_CorsPolicy__Output } from './envoy/api/v2/route/CorsPolicy';
import { RouteAction as _envoy_api_v2_route_RouteAction, RouteAction__Output as _envoy_api_v2_route_RouteAction__Output } from './envoy/api/v2/route/RouteAction';
import { RetryPolicy as _envoy_api_v2_route_RetryPolicy, RetryPolicy__Output as _envoy_api_v2_route_RetryPolicy__Output } from './envoy/api/v2/route/RetryPolicy';
import { HedgePolicy as _envoy_api_v2_route_HedgePolicy, HedgePolicy__Output as _envoy_api_v2_route_HedgePolicy__Output } from './envoy/api/v2/route/HedgePolicy';
import { RedirectAction as _envoy_api_v2_route_RedirectAction, RedirectAction__Output as _envoy_api_v2_route_RedirectAction__Output } from './envoy/api/v2/route/RedirectAction';
import { DirectResponseAction as _envoy_api_v2_route_DirectResponseAction, DirectResponseAction__Output as _envoy_api_v2_route_DirectResponseAction__Output } from './envoy/api/v2/route/DirectResponseAction';
import { Decorator as _envoy_api_v2_route_Decorator, Decorator__Output as _envoy_api_v2_route_Decorator__Output } from './envoy/api/v2/route/Decorator';
import { Tracing as _envoy_api_v2_route_Tracing, Tracing__Output as _envoy_api_v2_route_Tracing__Output } from './envoy/api/v2/route/Tracing';
import { VirtualCluster as _envoy_api_v2_route_VirtualCluster, VirtualCluster__Output as _envoy_api_v2_route_VirtualCluster__Output } from './envoy/api/v2/route/VirtualCluster';
import { RateLimit as _envoy_api_v2_route_RateLimit, RateLimit__Output as _envoy_api_v2_route_RateLimit__Output } from './envoy/api/v2/route/RateLimit';
import { HeaderMatcher as _envoy_api_v2_route_HeaderMatcher, HeaderMatcher__Output as _envoy_api_v2_route_HeaderMatcher__Output } from './envoy/api/v2/route/HeaderMatcher';
import { QueryParameterMatcher as _envoy_api_v2_route_QueryParameterMatcher, QueryParameterMatcher__Output as _envoy_api_v2_route_QueryParameterMatcher__Output } from './envoy/api/v2/route/QueryParameterMatcher';
import { Percent as _envoy_type_Percent, Percent__Output as _envoy_type_Percent__Output } from './envoy/type/Percent';
import { FractionalPercent as _envoy_type_FractionalPercent, FractionalPercent__Output as _envoy_type_FractionalPercent__Output } from './envoy/type/FractionalPercent';
import { SemanticVersion as _envoy_type_SemanticVersion, SemanticVersion__Output as _envoy_type_SemanticVersion__Output } from './envoy/type/SemanticVersion';
import { RegexMatcher as _envoy_type_matcher_RegexMatcher, RegexMatcher__Output as _envoy_type_matcher_RegexMatcher__Output } from './envoy/type/matcher/RegexMatcher';
import { RegexMatchAndSubstitute as _envoy_type_matcher_RegexMatchAndSubstitute, RegexMatchAndSubstitute__Output as _envoy_type_matcher_RegexMatchAndSubstitute__Output } from './envoy/type/matcher/RegexMatchAndSubstitute';
import { StringMatcher as _envoy_type_matcher_StringMatcher, StringMatcher__Output as _envoy_type_matcher_StringMatcher__Output } from './envoy/type/matcher/StringMatcher';
import { ListStringMatcher as _envoy_type_matcher_ListStringMatcher, ListStringMatcher__Output as _envoy_type_matcher_ListStringMatcher__Output } from './envoy/type/matcher/ListStringMatcher';
import { Int64Range as _envoy_type_Int64Range, Int64Range__Output as _envoy_type_Int64Range__Output } from './envoy/type/Int64Range';
import { Int32Range as _envoy_type_Int32Range, Int32Range__Output as _envoy_type_Int32Range__Output } from './envoy/type/Int32Range';
import { DoubleRange as _envoy_type_DoubleRange, DoubleRange__Output as _envoy_type_DoubleRange__Output } from './envoy/type/DoubleRange';
import { CustomTag as _envoy_type_tracing_v2_CustomTag, CustomTag__Output as _envoy_type_tracing_v2_CustomTag__Output } from './envoy/type/tracing/v2/CustomTag';
import { MetadataKey as _envoy_type_metadata_v2_MetadataKey, MetadataKey__Output as _envoy_type_metadata_v2_MetadataKey__Output } from './envoy/type/metadata/v2/MetadataKey';
import { MetadataKind as _envoy_type_metadata_v2_MetadataKind, MetadataKind__Output as _envoy_type_metadata_v2_MetadataKind__Output } from './envoy/type/metadata/v2/MetadataKind';
import { PackageVersionStatus as _udpa_annotations_PackageVersionStatus } from './udpa/annotations/PackageVersionStatus';
import { StatusAnnotation as _udpa_annotations_StatusAnnotation, StatusAnnotation__Output as _udpa_annotations_StatusAnnotation__Output } from './udpa/annotations/StatusAnnotation';
import { MigrateAnnotation as _udpa_annotations_MigrateAnnotation, MigrateAnnotation__Output as _udpa_annotations_MigrateAnnotation__Output } from './udpa/annotations/MigrateAnnotation';
import { FieldMigrateAnnotation as _udpa_annotations_FieldMigrateAnnotation, FieldMigrateAnnotation__Output as _udpa_annotations_FieldMigrateAnnotation__Output } from './udpa/annotations/FieldMigrateAnnotation';
import { FileMigrateAnnotation as _udpa_annotations_FileMigrateAnnotation, FileMigrateAnnotation__Output as _udpa_annotations_FileMigrateAnnotation__Output } from './udpa/annotations/FileMigrateAnnotation';
import { FieldRules as _validate_FieldRules, FieldRules__Output as _validate_FieldRules__Output } from './validate/FieldRules';
import { FloatRules as _validate_FloatRules, FloatRules__Output as _validate_FloatRules__Output } from './validate/FloatRules';
import { DoubleRules as _validate_DoubleRules, DoubleRules__Output as _validate_DoubleRules__Output } from './validate/DoubleRules';
import { Int32Rules as _validate_Int32Rules, Int32Rules__Output as _validate_Int32Rules__Output } from './validate/Int32Rules';
import { Int64Rules as _validate_Int64Rules, Int64Rules__Output as _validate_Int64Rules__Output } from './validate/Int64Rules';
import { UInt32Rules as _validate_UInt32Rules, UInt32Rules__Output as _validate_UInt32Rules__Output } from './validate/UInt32Rules';
import { UInt64Rules as _validate_UInt64Rules, UInt64Rules__Output as _validate_UInt64Rules__Output } from './validate/UInt64Rules';
import { SInt32Rules as _validate_SInt32Rules, SInt32Rules__Output as _validate_SInt32Rules__Output } from './validate/SInt32Rules';
import { SInt64Rules as _validate_SInt64Rules, SInt64Rules__Output as _validate_SInt64Rules__Output } from './validate/SInt64Rules';
import { Fixed32Rules as _validate_Fixed32Rules, Fixed32Rules__Output as _validate_Fixed32Rules__Output } from './validate/Fixed32Rules';
import { Fixed64Rules as _validate_Fixed64Rules, Fixed64Rules__Output as _validate_Fixed64Rules__Output } from './validate/Fixed64Rules';
import { SFixed32Rules as _validate_SFixed32Rules, SFixed32Rules__Output as _validate_SFixed32Rules__Output } from './validate/SFixed32Rules';
import { SFixed64Rules as _validate_SFixed64Rules, SFixed64Rules__Output as _validate_SFixed64Rules__Output } from './validate/SFixed64Rules';
import { BoolRules as _validate_BoolRules, BoolRules__Output as _validate_BoolRules__Output } from './validate/BoolRules';
import { StringRules as _validate_StringRules, StringRules__Output as _validate_StringRules__Output } from './validate/StringRules';
import { KnownRegex as _validate_KnownRegex } from './validate/KnownRegex';
import { BytesRules as _validate_BytesRules, BytesRules__Output as _validate_BytesRules__Output } from './validate/BytesRules';
import { EnumRules as _validate_EnumRules, EnumRules__Output as _validate_EnumRules__Output } from './validate/EnumRules';
import { MessageRules as _validate_MessageRules, MessageRules__Output as _validate_MessageRules__Output } from './validate/MessageRules';
import { RepeatedRules as _validate_RepeatedRules, RepeatedRules__Output as _validate_RepeatedRules__Output } from './validate/RepeatedRules';
import { MapRules as _validate_MapRules, MapRules__Output as _validate_MapRules__Output } from './validate/MapRules';
import { AnyRules as _validate_AnyRules, AnyRules__Output as _validate_AnyRules__Output } from './validate/AnyRules';
import { DurationRules as _validate_DurationRules, DurationRules__Output as _validate_DurationRules__Output } from './validate/DurationRules';
import { TimestampRules as _validate_TimestampRules, TimestampRules__Output as _validate_TimestampRules__Output } from './validate/TimestampRules';
import { DoubleValue as _google_protobuf_DoubleValue, DoubleValue__Output as _google_protobuf_DoubleValue__Output } from './google/protobuf/DoubleValue';
import { FloatValue as _google_protobuf_FloatValue, FloatValue__Output as _google_protobuf_FloatValue__Output } from './google/protobuf/FloatValue';
import { Int64Value as _google_protobuf_Int64Value, Int64Value__Output as _google_protobuf_Int64Value__Output } from './google/protobuf/Int64Value';
import { UInt64Value as _google_protobuf_UInt64Value, UInt64Value__Output as _google_protobuf_UInt64Value__Output } from './google/protobuf/UInt64Value';
import { Int32Value as _google_protobuf_Int32Value, Int32Value__Output as _google_protobuf_Int32Value__Output } from './google/protobuf/Int32Value';
import { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from './google/protobuf/UInt32Value';
import { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from './google/protobuf/BoolValue';
import { StringValue as _google_protobuf_StringValue, StringValue__Output as _google_protobuf_StringValue__Output } from './google/protobuf/StringValue';
import { BytesValue as _google_protobuf_BytesValue, BytesValue__Output as _google_protobuf_BytesValue__Output } from './google/protobuf/BytesValue';
import { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from './google/protobuf/Any';
import { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from './google/protobuf/Duration';
import { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from './google/protobuf/Struct';
import { Value as _google_protobuf_Value, Value__Output as _google_protobuf_Value__Output } from './google/protobuf/Value';
import { NullValue as _google_protobuf_NullValue } from './google/protobuf/NullValue';
import { ListValue as _google_protobuf_ListValue, ListValue__Output as _google_protobuf_ListValue__Output } from './google/protobuf/ListValue';
import { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from './google/protobuf/Timestamp';
import { FileDescriptorSet as _google_protobuf_FileDescriptorSet, FileDescriptorSet__Output as _google_protobuf_FileDescriptorSet__Output } from './google/protobuf/FileDescriptorSet';
import { FileDescriptorProto as _google_protobuf_FileDescriptorProto, FileDescriptorProto__Output as _google_protobuf_FileDescriptorProto__Output } from './google/protobuf/FileDescriptorProto';
import { DescriptorProto as _google_protobuf_DescriptorProto, DescriptorProto__Output as _google_protobuf_DescriptorProto__Output } from './google/protobuf/DescriptorProto';
import { FieldDescriptorProto as _google_protobuf_FieldDescriptorProto, FieldDescriptorProto__Output as _google_protobuf_FieldDescriptorProto__Output } from './google/protobuf/FieldDescriptorProto';
import { OneofDescriptorProto as _google_protobuf_OneofDescriptorProto, OneofDescriptorProto__Output as _google_protobuf_OneofDescriptorProto__Output } from './google/protobuf/OneofDescriptorProto';
import { EnumDescriptorProto as _google_protobuf_EnumDescriptorProto, EnumDescriptorProto__Output as _google_protobuf_EnumDescriptorProto__Output } from './google/protobuf/EnumDescriptorProto';
import { EnumValueDescriptorProto as _google_protobuf_EnumValueDescriptorProto, EnumValueDescriptorProto__Output as _google_protobuf_EnumValueDescriptorProto__Output } from './google/protobuf/EnumValueDescriptorProto';
import { ServiceDescriptorProto as _google_protobuf_ServiceDescriptorProto, ServiceDescriptorProto__Output as _google_protobuf_ServiceDescriptorProto__Output } from './google/protobuf/ServiceDescriptorProto';
import { MethodDescriptorProto as _google_protobuf_MethodDescriptorProto, MethodDescriptorProto__Output as _google_protobuf_MethodDescriptorProto__Output } from './google/protobuf/MethodDescriptorProto';
import { FileOptions as _google_protobuf_FileOptions, FileOptions__Output as _google_protobuf_FileOptions__Output } from './google/protobuf/FileOptions';
import { MessageOptions as _google_protobuf_MessageOptions, MessageOptions__Output as _google_protobuf_MessageOptions__Output } from './google/protobuf/MessageOptions';
import { FieldOptions as _google_protobuf_FieldOptions, FieldOptions__Output as _google_protobuf_FieldOptions__Output } from './google/protobuf/FieldOptions';
import { OneofOptions as _google_protobuf_OneofOptions, OneofOptions__Output as _google_protobuf_OneofOptions__Output } from './google/protobuf/OneofOptions';
import { EnumOptions as _google_protobuf_EnumOptions, EnumOptions__Output as _google_protobuf_EnumOptions__Output } from './google/protobuf/EnumOptions';
import { EnumValueOptions as _google_protobuf_EnumValueOptions, EnumValueOptions__Output as _google_protobuf_EnumValueOptions__Output } from './google/protobuf/EnumValueOptions';
import { ServiceOptions as _google_protobuf_ServiceOptions, ServiceOptions__Output as _google_protobuf_ServiceOptions__Output } from './google/protobuf/ServiceOptions';
import { MethodOptions as _google_protobuf_MethodOptions, MethodOptions__Output as _google_protobuf_MethodOptions__Output } from './google/protobuf/MethodOptions';
import { UninterpretedOption as _google_protobuf_UninterpretedOption, UninterpretedOption__Output as _google_protobuf_UninterpretedOption__Output } from './google/protobuf/UninterpretedOption';
import { SourceCodeInfo as _google_protobuf_SourceCodeInfo, SourceCodeInfo__Output as _google_protobuf_SourceCodeInfo__Output } from './google/protobuf/SourceCodeInfo';
import { GeneratedCodeInfo as _google_protobuf_GeneratedCodeInfo, GeneratedCodeInfo__Output as _google_protobuf_GeneratedCodeInfo__Output } from './google/protobuf/GeneratedCodeInfo';
import { Empty as _google_protobuf_Empty, Empty__Output as _google_protobuf_Empty__Output } from './google/protobuf/Empty';

export namespace messages {
  export namespace envoy {
    export namespace api {
      export namespace v2 {
        export type RouteConfiguration = _envoy_api_v2_RouteConfiguration;
        export type RouteConfiguration__Output = _envoy_api_v2_RouteConfiguration__Output;
        export type Vhds = _envoy_api_v2_Vhds;
        export type Vhds__Output = _envoy_api_v2_Vhds__Output;
        export namespace core {
          export type RoutingPriority = _envoy_api_v2_core_RoutingPriority;
          export type RequestMethod = _envoy_api_v2_core_RequestMethod;
          export type TrafficDirection = _envoy_api_v2_core_TrafficDirection;
          export type Locality = _envoy_api_v2_core_Locality;
          export type Locality__Output = _envoy_api_v2_core_Locality__Output;
          export type BuildVersion = _envoy_api_v2_core_BuildVersion;
          export type BuildVersion__Output = _envoy_api_v2_core_BuildVersion__Output;
          export type Extension = _envoy_api_v2_core_Extension;
          export type Extension__Output = _envoy_api_v2_core_Extension__Output;
          export type Node = _envoy_api_v2_core_Node;
          export type Node__Output = _envoy_api_v2_core_Node__Output;
          export type Metadata = _envoy_api_v2_core_Metadata;
          export type Metadata__Output = _envoy_api_v2_core_Metadata__Output;
          export type RuntimeUInt32 = _envoy_api_v2_core_RuntimeUInt32;
          export type RuntimeUInt32__Output = _envoy_api_v2_core_RuntimeUInt32__Output;
          export type RuntimeDouble = _envoy_api_v2_core_RuntimeDouble;
          export type RuntimeDouble__Output = _envoy_api_v2_core_RuntimeDouble__Output;
          export type RuntimeFeatureFlag = _envoy_api_v2_core_RuntimeFeatureFlag;
          export type RuntimeFeatureFlag__Output = _envoy_api_v2_core_RuntimeFeatureFlag__Output;
          export type HeaderValue = _envoy_api_v2_core_HeaderValue;
          export type HeaderValue__Output = _envoy_api_v2_core_HeaderValue__Output;
          export type HeaderValueOption = _envoy_api_v2_core_HeaderValueOption;
          export type HeaderValueOption__Output = _envoy_api_v2_core_HeaderValueOption__Output;
          export type HeaderMap = _envoy_api_v2_core_HeaderMap;
          export type HeaderMap__Output = _envoy_api_v2_core_HeaderMap__Output;
          export type DataSource = _envoy_api_v2_core_DataSource;
          export type DataSource__Output = _envoy_api_v2_core_DataSource__Output;
          export type RetryPolicy = _envoy_api_v2_core_RetryPolicy;
          export type RetryPolicy__Output = _envoy_api_v2_core_RetryPolicy__Output;
          export type RemoteDataSource = _envoy_api_v2_core_RemoteDataSource;
          export type RemoteDataSource__Output = _envoy_api_v2_core_RemoteDataSource__Output;
          export type AsyncDataSource = _envoy_api_v2_core_AsyncDataSource;
          export type AsyncDataSource__Output = _envoy_api_v2_core_AsyncDataSource__Output;
          export type TransportSocket = _envoy_api_v2_core_TransportSocket;
          export type TransportSocket__Output = _envoy_api_v2_core_TransportSocket__Output;
          export type RuntimeFractionalPercent = _envoy_api_v2_core_RuntimeFractionalPercent;
          export type RuntimeFractionalPercent__Output = _envoy_api_v2_core_RuntimeFractionalPercent__Output;
          export type ControlPlane = _envoy_api_v2_core_ControlPlane;
          export type ControlPlane__Output = _envoy_api_v2_core_ControlPlane__Output;
          export type ApiVersion = _envoy_api_v2_core_ApiVersion;
          export type ApiConfigSource = _envoy_api_v2_core_ApiConfigSource;
          export type ApiConfigSource__Output = _envoy_api_v2_core_ApiConfigSource__Output;
          export type AggregatedConfigSource = _envoy_api_v2_core_AggregatedConfigSource;
          export type AggregatedConfigSource__Output = _envoy_api_v2_core_AggregatedConfigSource__Output;
          export type SelfConfigSource = _envoy_api_v2_core_SelfConfigSource;
          export type SelfConfigSource__Output = _envoy_api_v2_core_SelfConfigSource__Output;
          export type RateLimitSettings = _envoy_api_v2_core_RateLimitSettings;
          export type RateLimitSettings__Output = _envoy_api_v2_core_RateLimitSettings__Output;
          export type ConfigSource = _envoy_api_v2_core_ConfigSource;
          export type ConfigSource__Output = _envoy_api_v2_core_ConfigSource__Output;
          export type BackoffStrategy = _envoy_api_v2_core_BackoffStrategy;
          export type BackoffStrategy__Output = _envoy_api_v2_core_BackoffStrategy__Output;
          export type Pipe = _envoy_api_v2_core_Pipe;
          export type Pipe__Output = _envoy_api_v2_core_Pipe__Output;
          export type SocketAddress = _envoy_api_v2_core_SocketAddress;
          export type SocketAddress__Output = _envoy_api_v2_core_SocketAddress__Output;
          export type TcpKeepalive = _envoy_api_v2_core_TcpKeepalive;
          export type TcpKeepalive__Output = _envoy_api_v2_core_TcpKeepalive__Output;
          export type BindConfig = _envoy_api_v2_core_BindConfig;
          export type BindConfig__Output = _envoy_api_v2_core_BindConfig__Output;
          export type Address = _envoy_api_v2_core_Address;
          export type Address__Output = _envoy_api_v2_core_Address__Output;
          export type CidrRange = _envoy_api_v2_core_CidrRange;
          export type CidrRange__Output = _envoy_api_v2_core_CidrRange__Output;
          export type HttpUri = _envoy_api_v2_core_HttpUri;
          export type HttpUri__Output = _envoy_api_v2_core_HttpUri__Output;
          export type GrpcService = _envoy_api_v2_core_GrpcService;
          export type GrpcService__Output = _envoy_api_v2_core_GrpcService__Output;
          export type SocketOption = _envoy_api_v2_core_SocketOption;
          export type SocketOption__Output = _envoy_api_v2_core_SocketOption__Output;
        }
        export namespace route {
          export type VirtualHost = _envoy_api_v2_route_VirtualHost;
          export type VirtualHost__Output = _envoy_api_v2_route_VirtualHost__Output;
          export type FilterAction = _envoy_api_v2_route_FilterAction;
          export type FilterAction__Output = _envoy_api_v2_route_FilterAction__Output;
          export type Route = _envoy_api_v2_route_Route;
          export type Route__Output = _envoy_api_v2_route_Route__Output;
          export type WeightedCluster = _envoy_api_v2_route_WeightedCluster;
          export type WeightedCluster__Output = _envoy_api_v2_route_WeightedCluster__Output;
          export type RouteMatch = _envoy_api_v2_route_RouteMatch;
          export type RouteMatch__Output = _envoy_api_v2_route_RouteMatch__Output;
          export type CorsPolicy = _envoy_api_v2_route_CorsPolicy;
          export type CorsPolicy__Output = _envoy_api_v2_route_CorsPolicy__Output;
          export type RouteAction = _envoy_api_v2_route_RouteAction;
          export type RouteAction__Output = _envoy_api_v2_route_RouteAction__Output;
          export type RetryPolicy = _envoy_api_v2_route_RetryPolicy;
          export type RetryPolicy__Output = _envoy_api_v2_route_RetryPolicy__Output;
          export type HedgePolicy = _envoy_api_v2_route_HedgePolicy;
          export type HedgePolicy__Output = _envoy_api_v2_route_HedgePolicy__Output;
          export type RedirectAction = _envoy_api_v2_route_RedirectAction;
          export type RedirectAction__Output = _envoy_api_v2_route_RedirectAction__Output;
          export type DirectResponseAction = _envoy_api_v2_route_DirectResponseAction;
          export type DirectResponseAction__Output = _envoy_api_v2_route_DirectResponseAction__Output;
          export type Decorator = _envoy_api_v2_route_Decorator;
          export type Decorator__Output = _envoy_api_v2_route_Decorator__Output;
          export type Tracing = _envoy_api_v2_route_Tracing;
          export type Tracing__Output = _envoy_api_v2_route_Tracing__Output;
          export type VirtualCluster = _envoy_api_v2_route_VirtualCluster;
          export type VirtualCluster__Output = _envoy_api_v2_route_VirtualCluster__Output;
          export type RateLimit = _envoy_api_v2_route_RateLimit;
          export type RateLimit__Output = _envoy_api_v2_route_RateLimit__Output;
          export type HeaderMatcher = _envoy_api_v2_route_HeaderMatcher;
          export type HeaderMatcher__Output = _envoy_api_v2_route_HeaderMatcher__Output;
          export type QueryParameterMatcher = _envoy_api_v2_route_QueryParameterMatcher;
          export type QueryParameterMatcher__Output = _envoy_api_v2_route_QueryParameterMatcher__Output;
        }
      }
    }
    export namespace type {
      export type Percent = _envoy_type_Percent;
      export type Percent__Output = _envoy_type_Percent__Output;
      export type FractionalPercent = _envoy_type_FractionalPercent;
      export type FractionalPercent__Output = _envoy_type_FractionalPercent__Output;
      export type SemanticVersion = _envoy_type_SemanticVersion;
      export type SemanticVersion__Output = _envoy_type_SemanticVersion__Output;
      export namespace matcher {
        export type RegexMatcher = _envoy_type_matcher_RegexMatcher;
        export type RegexMatcher__Output = _envoy_type_matcher_RegexMatcher__Output;
        export type RegexMatchAndSubstitute = _envoy_type_matcher_RegexMatchAndSubstitute;
        export type RegexMatchAndSubstitute__Output = _envoy_type_matcher_RegexMatchAndSubstitute__Output;
        export type StringMatcher = _envoy_type_matcher_StringMatcher;
        export type StringMatcher__Output = _envoy_type_matcher_StringMatcher__Output;
        export type ListStringMatcher = _envoy_type_matcher_ListStringMatcher;
        export type ListStringMatcher__Output = _envoy_type_matcher_ListStringMatcher__Output;
      }
      export type Int64Range = _envoy_type_Int64Range;
      export type Int64Range__Output = _envoy_type_Int64Range__Output;
      export type Int32Range = _envoy_type_Int32Range;
      export type Int32Range__Output = _envoy_type_Int32Range__Output;
      export type DoubleRange = _envoy_type_DoubleRange;
      export type DoubleRange__Output = _envoy_type_DoubleRange__Output;
      export namespace tracing {
        export namespace v2 {
          export type CustomTag = _envoy_type_tracing_v2_CustomTag;
          export type CustomTag__Output = _envoy_type_tracing_v2_CustomTag__Output;
        }
      }
      export namespace metadata {
        export namespace v2 {
          export type MetadataKey = _envoy_type_metadata_v2_MetadataKey;
          export type MetadataKey__Output = _envoy_type_metadata_v2_MetadataKey__Output;
          export type MetadataKind = _envoy_type_metadata_v2_MetadataKind;
          export type MetadataKind__Output = _envoy_type_metadata_v2_MetadataKind__Output;
        }
      }
    }
    export namespace annotations {
    }
  }
  export namespace udpa {
    export namespace annotations {
      export type PackageVersionStatus = _udpa_annotations_PackageVersionStatus;
      export type StatusAnnotation = _udpa_annotations_StatusAnnotation;
      export type StatusAnnotation__Output = _udpa_annotations_StatusAnnotation__Output;
      export type MigrateAnnotation = _udpa_annotations_MigrateAnnotation;
      export type MigrateAnnotation__Output = _udpa_annotations_MigrateAnnotation__Output;
      export type FieldMigrateAnnotation = _udpa_annotations_FieldMigrateAnnotation;
      export type FieldMigrateAnnotation__Output = _udpa_annotations_FieldMigrateAnnotation__Output;
      export type FileMigrateAnnotation = _udpa_annotations_FileMigrateAnnotation;
      export type FileMigrateAnnotation__Output = _udpa_annotations_FileMigrateAnnotation__Output;
    }
  }
  export namespace validate {
    export type FieldRules = _validate_FieldRules;
    export type FieldRules__Output = _validate_FieldRules__Output;
    export type FloatRules = _validate_FloatRules;
    export type FloatRules__Output = _validate_FloatRules__Output;
    export type DoubleRules = _validate_DoubleRules;
    export type DoubleRules__Output = _validate_DoubleRules__Output;
    export type Int32Rules = _validate_Int32Rules;
    export type Int32Rules__Output = _validate_Int32Rules__Output;
    export type Int64Rules = _validate_Int64Rules;
    export type Int64Rules__Output = _validate_Int64Rules__Output;
    export type UInt32Rules = _validate_UInt32Rules;
    export type UInt32Rules__Output = _validate_UInt32Rules__Output;
    export type UInt64Rules = _validate_UInt64Rules;
    export type UInt64Rules__Output = _validate_UInt64Rules__Output;
    export type SInt32Rules = _validate_SInt32Rules;
    export type SInt32Rules__Output = _validate_SInt32Rules__Output;
    export type SInt64Rules = _validate_SInt64Rules;
    export type SInt64Rules__Output = _validate_SInt64Rules__Output;
    export type Fixed32Rules = _validate_Fixed32Rules;
    export type Fixed32Rules__Output = _validate_Fixed32Rules__Output;
    export type Fixed64Rules = _validate_Fixed64Rules;
    export type Fixed64Rules__Output = _validate_Fixed64Rules__Output;
    export type SFixed32Rules = _validate_SFixed32Rules;
    export type SFixed32Rules__Output = _validate_SFixed32Rules__Output;
    export type SFixed64Rules = _validate_SFixed64Rules;
    export type SFixed64Rules__Output = _validate_SFixed64Rules__Output;
    export type BoolRules = _validate_BoolRules;
    export type BoolRules__Output = _validate_BoolRules__Output;
    export type StringRules = _validate_StringRules;
    export type StringRules__Output = _validate_StringRules__Output;
    export type KnownRegex = _validate_KnownRegex;
    export type BytesRules = _validate_BytesRules;
    export type BytesRules__Output = _validate_BytesRules__Output;
    export type EnumRules = _validate_EnumRules;
    export type EnumRules__Output = _validate_EnumRules__Output;
    export type MessageRules = _validate_MessageRules;
    export type MessageRules__Output = _validate_MessageRules__Output;
    export type RepeatedRules = _validate_RepeatedRules;
    export type RepeatedRules__Output = _validate_RepeatedRules__Output;
    export type MapRules = _validate_MapRules;
    export type MapRules__Output = _validate_MapRules__Output;
    export type AnyRules = _validate_AnyRules;
    export type AnyRules__Output = _validate_AnyRules__Output;
    export type DurationRules = _validate_DurationRules;
    export type DurationRules__Output = _validate_DurationRules__Output;
    export type TimestampRules = _validate_TimestampRules;
    export type TimestampRules__Output = _validate_TimestampRules__Output;
  }
  export namespace google {
    export namespace protobuf {
      export type DoubleValue = _google_protobuf_DoubleValue;
      export type DoubleValue__Output = _google_protobuf_DoubleValue__Output;
      export type FloatValue = _google_protobuf_FloatValue;
      export type FloatValue__Output = _google_protobuf_FloatValue__Output;
      export type Int64Value = _google_protobuf_Int64Value;
      export type Int64Value__Output = _google_protobuf_Int64Value__Output;
      export type UInt64Value = _google_protobuf_UInt64Value;
      export type UInt64Value__Output = _google_protobuf_UInt64Value__Output;
      export type Int32Value = _google_protobuf_Int32Value;
      export type Int32Value__Output = _google_protobuf_Int32Value__Output;
      export type UInt32Value = _google_protobuf_UInt32Value;
      export type UInt32Value__Output = _google_protobuf_UInt32Value__Output;
      export type BoolValue = _google_protobuf_BoolValue;
      export type BoolValue__Output = _google_protobuf_BoolValue__Output;
      export type StringValue = _google_protobuf_StringValue;
      export type StringValue__Output = _google_protobuf_StringValue__Output;
      export type BytesValue = _google_protobuf_BytesValue;
      export type BytesValue__Output = _google_protobuf_BytesValue__Output;
      export type Any = _google_protobuf_Any;
      export type Any__Output = _google_protobuf_Any__Output;
      export type Duration = _google_protobuf_Duration;
      export type Duration__Output = _google_protobuf_Duration__Output;
      export type Struct = _google_protobuf_Struct;
      export type Struct__Output = _google_protobuf_Struct__Output;
      export type Value = _google_protobuf_Value;
      export type Value__Output = _google_protobuf_Value__Output;
      export type NullValue = _google_protobuf_NullValue;
      export type ListValue = _google_protobuf_ListValue;
      export type ListValue__Output = _google_protobuf_ListValue__Output;
      export type Timestamp = _google_protobuf_Timestamp;
      export type Timestamp__Output = _google_protobuf_Timestamp__Output;
      export type FileDescriptorSet = _google_protobuf_FileDescriptorSet;
      export type FileDescriptorSet__Output = _google_protobuf_FileDescriptorSet__Output;
      export type FileDescriptorProto = _google_protobuf_FileDescriptorProto;
      export type FileDescriptorProto__Output = _google_protobuf_FileDescriptorProto__Output;
      export type DescriptorProto = _google_protobuf_DescriptorProto;
      export type DescriptorProto__Output = _google_protobuf_DescriptorProto__Output;
      export type FieldDescriptorProto = _google_protobuf_FieldDescriptorProto;
      export type FieldDescriptorProto__Output = _google_protobuf_FieldDescriptorProto__Output;
      export type OneofDescriptorProto = _google_protobuf_OneofDescriptorProto;
      export type OneofDescriptorProto__Output = _google_protobuf_OneofDescriptorProto__Output;
      export type EnumDescriptorProto = _google_protobuf_EnumDescriptorProto;
      export type EnumDescriptorProto__Output = _google_protobuf_EnumDescriptorProto__Output;
      export type EnumValueDescriptorProto = _google_protobuf_EnumValueDescriptorProto;
      export type EnumValueDescriptorProto__Output = _google_protobuf_EnumValueDescriptorProto__Output;
      export type ServiceDescriptorProto = _google_protobuf_ServiceDescriptorProto;
      export type ServiceDescriptorProto__Output = _google_protobuf_ServiceDescriptorProto__Output;
      export type MethodDescriptorProto = _google_protobuf_MethodDescriptorProto;
      export type MethodDescriptorProto__Output = _google_protobuf_MethodDescriptorProto__Output;
      export type FileOptions = _google_protobuf_FileOptions;
      export type FileOptions__Output = _google_protobuf_FileOptions__Output;
      export type MessageOptions = _google_protobuf_MessageOptions;
      export type MessageOptions__Output = _google_protobuf_MessageOptions__Output;
      export type FieldOptions = _google_protobuf_FieldOptions;
      export type FieldOptions__Output = _google_protobuf_FieldOptions__Output;
      export type OneofOptions = _google_protobuf_OneofOptions;
      export type OneofOptions__Output = _google_protobuf_OneofOptions__Output;
      export type EnumOptions = _google_protobuf_EnumOptions;
      export type EnumOptions__Output = _google_protobuf_EnumOptions__Output;
      export type EnumValueOptions = _google_protobuf_EnumValueOptions;
      export type EnumValueOptions__Output = _google_protobuf_EnumValueOptions__Output;
      export type ServiceOptions = _google_protobuf_ServiceOptions;
      export type ServiceOptions__Output = _google_protobuf_ServiceOptions__Output;
      export type MethodOptions = _google_protobuf_MethodOptions;
      export type MethodOptions__Output = _google_protobuf_MethodOptions__Output;
      export type UninterpretedOption = _google_protobuf_UninterpretedOption;
      export type UninterpretedOption__Output = _google_protobuf_UninterpretedOption__Output;
      export type SourceCodeInfo = _google_protobuf_SourceCodeInfo;
      export type SourceCodeInfo__Output = _google_protobuf_SourceCodeInfo__Output;
      export type GeneratedCodeInfo = _google_protobuf_GeneratedCodeInfo;
      export type GeneratedCodeInfo__Output = _google_protobuf_GeneratedCodeInfo__Output;
      export type Empty = _google_protobuf_Empty;
      export type Empty__Output = _google_protobuf_Empty__Output;
    }
  }
}

export namespace ClientInterfaces {
  export namespace envoy {
    export namespace api {
      export namespace v2 {
        export namespace RouteConfiguration {
        }
        export namespace Vhds {
        }
        export namespace core {
          export namespace Locality {
          }
          export namespace BuildVersion {
          }
          export namespace Extension {
          }
          export namespace Node {
          }
          export namespace Metadata {
          }
          export namespace RuntimeUInt32 {
          }
          export namespace RuntimeDouble {
          }
          export namespace RuntimeFeatureFlag {
          }
          export namespace HeaderValue {
          }
          export namespace HeaderValueOption {
          }
          export namespace HeaderMap {
          }
          export namespace DataSource {
          }
          export namespace RetryPolicy {
          }
          export namespace RemoteDataSource {
          }
          export namespace AsyncDataSource {
          }
          export namespace TransportSocket {
          }
          export namespace RuntimeFractionalPercent {
          }
          export namespace ControlPlane {
          }
          export namespace ApiConfigSource {
          }
          export namespace AggregatedConfigSource {
          }
          export namespace SelfConfigSource {
          }
          export namespace RateLimitSettings {
          }
          export namespace ConfigSource {
          }
          export namespace BackoffStrategy {
          }
          export namespace Pipe {
          }
          export namespace SocketAddress {
          }
          export namespace TcpKeepalive {
          }
          export namespace BindConfig {
          }
          export namespace Address {
          }
          export namespace CidrRange {
          }
          export namespace HttpUri {
          }
          export namespace GrpcService {
            export namespace EnvoyGrpc {
            }
            export namespace GoogleGrpc {
              export namespace SslCredentials {
              }
              export namespace GoogleLocalCredentials {
              }
              export namespace ChannelCredentials {
              }
              export namespace CallCredentials {
                export namespace ServiceAccountJWTAccessCredentials {
                }
                export namespace GoogleIAMCredentials {
                }
                export namespace MetadataCredentialsFromPlugin {
                }
                export namespace StsService {
                }
              }
            }
          }
          export namespace SocketOption {
          }
        }
        export namespace route {
          export namespace VirtualHost {
          }
          export namespace FilterAction {
          }
          export namespace Route {
          }
          export namespace WeightedCluster {
            export namespace ClusterWeight {
            }
          }
          export namespace RouteMatch {
            export namespace GrpcRouteMatchOptions {
            }
            export namespace TlsContextMatchOptions {
            }
          }
          export namespace CorsPolicy {
          }
          export namespace RouteAction {
            export namespace RequestMirrorPolicy {
            }
            export namespace HashPolicy {
              export namespace Header {
              }
              export namespace Cookie {
              }
              export namespace ConnectionProperties {
              }
              export namespace QueryParameter {
              }
              export namespace FilterState {
              }
            }
            export namespace UpgradeConfig {
            }
          }
          export namespace RetryPolicy {
            export namespace RetryPriority {
            }
            export namespace RetryHostPredicate {
            }
            export namespace RetryBackOff {
            }
          }
          export namespace HedgePolicy {
          }
          export namespace RedirectAction {
          }
          export namespace DirectResponseAction {
          }
          export namespace Decorator {
          }
          export namespace Tracing {
          }
          export namespace VirtualCluster {
          }
          export namespace RateLimit {
            export namespace Action {
              export namespace SourceCluster {
              }
              export namespace DestinationCluster {
              }
              export namespace RequestHeaders {
              }
              export namespace RemoteAddress {
              }
              export namespace GenericKey {
              }
              export namespace HeaderValueMatch {
              }
            }
          }
          export namespace HeaderMatcher {
          }
          export namespace QueryParameterMatcher {
          }
        }
      }
    }
    export namespace type {
      export namespace Percent {
      }
      export namespace FractionalPercent {
      }
      export namespace SemanticVersion {
      }
      export namespace matcher {
        export namespace RegexMatcher {
          export namespace GoogleRE2 {
          }
        }
        export namespace RegexMatchAndSubstitute {
        }
        export namespace StringMatcher {
        }
        export namespace ListStringMatcher {
        }
      }
      export namespace Int64Range {
      }
      export namespace Int32Range {
      }
      export namespace DoubleRange {
      }
      export namespace tracing {
        export namespace v2 {
          export namespace CustomTag {
            export namespace Literal {
            }
            export namespace Environment {
            }
            export namespace Header {
            }
            export namespace Metadata {
            }
          }
        }
      }
      export namespace metadata {
        export namespace v2 {
          export namespace MetadataKey {
            export namespace PathSegment {
            }
          }
          export namespace MetadataKind {
            export namespace Request {
            }
            export namespace Route {
            }
            export namespace Cluster {
            }
            export namespace Host {
            }
          }
        }
      }
    }
    export namespace annotations {
    }
  }
  export namespace udpa {
    export namespace annotations {
      export namespace StatusAnnotation {
      }
      export namespace MigrateAnnotation {
      }
      export namespace FieldMigrateAnnotation {
      }
      export namespace FileMigrateAnnotation {
      }
    }
  }
  export namespace validate {
    export namespace FieldRules {
    }
    export namespace FloatRules {
    }
    export namespace DoubleRules {
    }
    export namespace Int32Rules {
    }
    export namespace Int64Rules {
    }
    export namespace UInt32Rules {
    }
    export namespace UInt64Rules {
    }
    export namespace SInt32Rules {
    }
    export namespace SInt64Rules {
    }
    export namespace Fixed32Rules {
    }
    export namespace Fixed64Rules {
    }
    export namespace SFixed32Rules {
    }
    export namespace SFixed64Rules {
    }
    export namespace BoolRules {
    }
    export namespace StringRules {
    }
    export namespace BytesRules {
    }
    export namespace EnumRules {
    }
    export namespace MessageRules {
    }
    export namespace RepeatedRules {
    }
    export namespace MapRules {
    }
    export namespace AnyRules {
    }
    export namespace DurationRules {
    }
    export namespace TimestampRules {
    }
  }
  export namespace google {
    export namespace protobuf {
      export namespace DoubleValue {
      }
      export namespace FloatValue {
      }
      export namespace Int64Value {
      }
      export namespace UInt64Value {
      }
      export namespace Int32Value {
      }
      export namespace UInt32Value {
      }
      export namespace BoolValue {
      }
      export namespace StringValue {
      }
      export namespace BytesValue {
      }
      export namespace Any {
      }
      export namespace Duration {
      }
      export namespace Struct {
      }
      export namespace Value {
      }
      export namespace ListValue {
      }
      export namespace Timestamp {
      }
      export namespace FileDescriptorSet {
      }
      export namespace FileDescriptorProto {
      }
      export namespace DescriptorProto {
        export namespace ExtensionRange {
        }
        export namespace ReservedRange {
        }
      }
      export namespace FieldDescriptorProto {
      }
      export namespace OneofDescriptorProto {
      }
      export namespace EnumDescriptorProto {
      }
      export namespace EnumValueDescriptorProto {
      }
      export namespace ServiceDescriptorProto {
      }
      export namespace MethodDescriptorProto {
      }
      export namespace FileOptions {
      }
      export namespace MessageOptions {
      }
      export namespace FieldOptions {
      }
      export namespace OneofOptions {
      }
      export namespace EnumOptions {
      }
      export namespace EnumValueOptions {
      }
      export namespace ServiceOptions {
      }
      export namespace MethodOptions {
      }
      export namespace UninterpretedOption {
        export namespace NamePart {
        }
      }
      export namespace SourceCodeInfo {
        export namespace Location {
        }
      }
      export namespace GeneratedCodeInfo {
        export namespace Annotation {
        }
      }
      export namespace Empty {
      }
    }
  }
}

type ConstructorArguments<Constructor> = Constructor extends new (...args: infer Args) => any ? Args: never;
type SubtypeConstructor<Constructor, Subtype> = {
  new(...args: ConstructorArguments<Constructor>): Subtype;
}

export interface ProtoGrpcType {
  envoy: {
    api: {
      v2: {
        RouteConfiguration: MessageTypeDefinition
        Vhds: MessageTypeDefinition
        core: {
          RoutingPriority: EnumTypeDefinition
          RequestMethod: EnumTypeDefinition
          TrafficDirection: EnumTypeDefinition
          Locality: MessageTypeDefinition
          BuildVersion: MessageTypeDefinition
          Extension: MessageTypeDefinition
          Node: MessageTypeDefinition
          Metadata: MessageTypeDefinition
          RuntimeUInt32: MessageTypeDefinition
          RuntimeDouble: MessageTypeDefinition
          RuntimeFeatureFlag: MessageTypeDefinition
          HeaderValue: MessageTypeDefinition
          HeaderValueOption: MessageTypeDefinition
          HeaderMap: MessageTypeDefinition
          DataSource: MessageTypeDefinition
          RetryPolicy: MessageTypeDefinition
          RemoteDataSource: MessageTypeDefinition
          AsyncDataSource: MessageTypeDefinition
          TransportSocket: MessageTypeDefinition
          RuntimeFractionalPercent: MessageTypeDefinition
          ControlPlane: MessageTypeDefinition
          ApiVersion: EnumTypeDefinition
          ApiConfigSource: MessageTypeDefinition
          AggregatedConfigSource: MessageTypeDefinition
          SelfConfigSource: MessageTypeDefinition
          RateLimitSettings: MessageTypeDefinition
          ConfigSource: MessageTypeDefinition
          BackoffStrategy: MessageTypeDefinition
          Pipe: MessageTypeDefinition
          SocketAddress: MessageTypeDefinition
          TcpKeepalive: MessageTypeDefinition
          BindConfig: MessageTypeDefinition
          Address: MessageTypeDefinition
          CidrRange: MessageTypeDefinition
          HttpUri: MessageTypeDefinition
          GrpcService: MessageTypeDefinition
          SocketOption: MessageTypeDefinition
        }
        route: {
          VirtualHost: MessageTypeDefinition
          FilterAction: MessageTypeDefinition
          Route: MessageTypeDefinition
          WeightedCluster: MessageTypeDefinition
          RouteMatch: MessageTypeDefinition
          CorsPolicy: MessageTypeDefinition
          RouteAction: MessageTypeDefinition
          RetryPolicy: MessageTypeDefinition
          HedgePolicy: MessageTypeDefinition
          RedirectAction: MessageTypeDefinition
          DirectResponseAction: MessageTypeDefinition
          Decorator: MessageTypeDefinition
          Tracing: MessageTypeDefinition
          VirtualCluster: MessageTypeDefinition
          RateLimit: MessageTypeDefinition
          HeaderMatcher: MessageTypeDefinition
          QueryParameterMatcher: MessageTypeDefinition
        }
      }
    }
    type: {
      Percent: MessageTypeDefinition
      FractionalPercent: MessageTypeDefinition
      SemanticVersion: MessageTypeDefinition
      matcher: {
        RegexMatcher: MessageTypeDefinition
        RegexMatchAndSubstitute: MessageTypeDefinition
        StringMatcher: MessageTypeDefinition
        ListStringMatcher: MessageTypeDefinition
      }
      Int64Range: MessageTypeDefinition
      Int32Range: MessageTypeDefinition
      DoubleRange: MessageTypeDefinition
      tracing: {
        v2: {
          CustomTag: MessageTypeDefinition
        }
      }
      metadata: {
        v2: {
          MetadataKey: MessageTypeDefinition
          MetadataKind: MessageTypeDefinition
        }
      }
    }
    annotations: {
    }
  }
  udpa: {
    annotations: {
      PackageVersionStatus: EnumTypeDefinition
      StatusAnnotation: MessageTypeDefinition
      MigrateAnnotation: MessageTypeDefinition
      FieldMigrateAnnotation: MessageTypeDefinition
      FileMigrateAnnotation: MessageTypeDefinition
    }
  }
  validate: {
    FieldRules: MessageTypeDefinition
    FloatRules: MessageTypeDefinition
    DoubleRules: MessageTypeDefinition
    Int32Rules: MessageTypeDefinition
    Int64Rules: MessageTypeDefinition
    UInt32Rules: MessageTypeDefinition
    UInt64Rules: MessageTypeDefinition
    SInt32Rules: MessageTypeDefinition
    SInt64Rules: MessageTypeDefinition
    Fixed32Rules: MessageTypeDefinition
    Fixed64Rules: MessageTypeDefinition
    SFixed32Rules: MessageTypeDefinition
    SFixed64Rules: MessageTypeDefinition
    BoolRules: MessageTypeDefinition
    StringRules: MessageTypeDefinition
    KnownRegex: EnumTypeDefinition
    BytesRules: MessageTypeDefinition
    EnumRules: MessageTypeDefinition
    MessageRules: MessageTypeDefinition
    RepeatedRules: MessageTypeDefinition
    MapRules: MessageTypeDefinition
    AnyRules: MessageTypeDefinition
    DurationRules: MessageTypeDefinition
    TimestampRules: MessageTypeDefinition
  }
  google: {
    protobuf: {
      DoubleValue: MessageTypeDefinition
      FloatValue: MessageTypeDefinition
      Int64Value: MessageTypeDefinition
      UInt64Value: MessageTypeDefinition
      Int32Value: MessageTypeDefinition
      UInt32Value: MessageTypeDefinition
      BoolValue: MessageTypeDefinition
      StringValue: MessageTypeDefinition
      BytesValue: MessageTypeDefinition
      Any: MessageTypeDefinition
      Duration: MessageTypeDefinition
      Struct: MessageTypeDefinition
      Value: MessageTypeDefinition
      NullValue: EnumTypeDefinition
      ListValue: MessageTypeDefinition
      Timestamp: MessageTypeDefinition
      FileDescriptorSet: MessageTypeDefinition
      FileDescriptorProto: MessageTypeDefinition
      DescriptorProto: MessageTypeDefinition
      FieldDescriptorProto: MessageTypeDefinition
      OneofDescriptorProto: MessageTypeDefinition
      EnumDescriptorProto: MessageTypeDefinition
      EnumValueDescriptorProto: MessageTypeDefinition
      ServiceDescriptorProto: MessageTypeDefinition
      MethodDescriptorProto: MessageTypeDefinition
      FileOptions: MessageTypeDefinition
      MessageOptions: MessageTypeDefinition
      FieldOptions: MessageTypeDefinition
      OneofOptions: MessageTypeDefinition
      EnumOptions: MessageTypeDefinition
      EnumValueOptions: MessageTypeDefinition
      ServiceOptions: MessageTypeDefinition
      MethodOptions: MessageTypeDefinition
      UninterpretedOption: MessageTypeDefinition
      SourceCodeInfo: MessageTypeDefinition
      GeneratedCodeInfo: MessageTypeDefinition
      Empty: MessageTypeDefinition
    }
  }
}

export namespace ServiceHandlers {
  export namespace envoy {
    export namespace api {
      export namespace v2 {
        export namespace RouteConfiguration {
        }
        export namespace Vhds {
        }
        export namespace core {
          export namespace Locality {
          }
          export namespace BuildVersion {
          }
          export namespace Extension {
          }
          export namespace Node {
          }
          export namespace Metadata {
          }
          export namespace RuntimeUInt32 {
          }
          export namespace RuntimeDouble {
          }
          export namespace RuntimeFeatureFlag {
          }
          export namespace HeaderValue {
          }
          export namespace HeaderValueOption {
          }
          export namespace HeaderMap {
          }
          export namespace DataSource {
          }
          export namespace RetryPolicy {
          }
          export namespace RemoteDataSource {
          }
          export namespace AsyncDataSource {
          }
          export namespace TransportSocket {
          }
          export namespace RuntimeFractionalPercent {
          }
          export namespace ControlPlane {
          }
          export namespace ApiConfigSource {
          }
          export namespace AggregatedConfigSource {
          }
          export namespace SelfConfigSource {
          }
          export namespace RateLimitSettings {
          }
          export namespace ConfigSource {
          }
          export namespace BackoffStrategy {
          }
          export namespace Pipe {
          }
          export namespace SocketAddress {
          }
          export namespace TcpKeepalive {
          }
          export namespace BindConfig {
          }
          export namespace Address {
          }
          export namespace CidrRange {
          }
          export namespace HttpUri {
          }
          export namespace GrpcService {
            export namespace EnvoyGrpc {
            }
            export namespace GoogleGrpc {
              export namespace SslCredentials {
              }
              export namespace GoogleLocalCredentials {
              }
              export namespace ChannelCredentials {
              }
              export namespace CallCredentials {
                export namespace ServiceAccountJWTAccessCredentials {
                }
                export namespace GoogleIAMCredentials {
                }
                export namespace MetadataCredentialsFromPlugin {
                }
                export namespace StsService {
                }
              }
            }
          }
          export namespace SocketOption {
          }
        }
        export namespace route {
          export namespace VirtualHost {
          }
          export namespace FilterAction {
          }
          export namespace Route {
          }
          export namespace WeightedCluster {
            export namespace ClusterWeight {
            }
          }
          export namespace RouteMatch {
            export namespace GrpcRouteMatchOptions {
            }
            export namespace TlsContextMatchOptions {
            }
          }
          export namespace CorsPolicy {
          }
          export namespace RouteAction {
            export namespace RequestMirrorPolicy {
            }
            export namespace HashPolicy {
              export namespace Header {
              }
              export namespace Cookie {
              }
              export namespace ConnectionProperties {
              }
              export namespace QueryParameter {
              }
              export namespace FilterState {
              }
            }
            export namespace UpgradeConfig {
            }
          }
          export namespace RetryPolicy {
            export namespace RetryPriority {
            }
            export namespace RetryHostPredicate {
            }
            export namespace RetryBackOff {
            }
          }
          export namespace HedgePolicy {
          }
          export namespace RedirectAction {
          }
          export namespace DirectResponseAction {
          }
          export namespace Decorator {
          }
          export namespace Tracing {
          }
          export namespace VirtualCluster {
          }
          export namespace RateLimit {
            export namespace Action {
              export namespace SourceCluster {
              }
              export namespace DestinationCluster {
              }
              export namespace RequestHeaders {
              }
              export namespace RemoteAddress {
              }
              export namespace GenericKey {
              }
              export namespace HeaderValueMatch {
              }
            }
          }
          export namespace HeaderMatcher {
          }
          export namespace QueryParameterMatcher {
          }
        }
      }
    }
    export namespace type {
      export namespace Percent {
      }
      export namespace FractionalPercent {
      }
      export namespace SemanticVersion {
      }
      export namespace matcher {
        export namespace RegexMatcher {
          export namespace GoogleRE2 {
          }
        }
        export namespace RegexMatchAndSubstitute {
        }
        export namespace StringMatcher {
        }
        export namespace ListStringMatcher {
        }
      }
      export namespace Int64Range {
      }
      export namespace Int32Range {
      }
      export namespace DoubleRange {
      }
      export namespace tracing {
        export namespace v2 {
          export namespace CustomTag {
            export namespace Literal {
            }
            export namespace Environment {
            }
            export namespace Header {
            }
            export namespace Metadata {
            }
          }
        }
      }
      export namespace metadata {
        export namespace v2 {
          export namespace MetadataKey {
            export namespace PathSegment {
            }
          }
          export namespace MetadataKind {
            export namespace Request {
            }
            export namespace Route {
            }
            export namespace Cluster {
            }
            export namespace Host {
            }
          }
        }
      }
    }
    export namespace annotations {
    }
  }
  export namespace udpa {
    export namespace annotations {
      export namespace StatusAnnotation {
      }
      export namespace MigrateAnnotation {
      }
      export namespace FieldMigrateAnnotation {
      }
      export namespace FileMigrateAnnotation {
      }
    }
  }
  export namespace validate {
    export namespace FieldRules {
    }
    export namespace FloatRules {
    }
    export namespace DoubleRules {
    }
    export namespace Int32Rules {
    }
    export namespace Int64Rules {
    }
    export namespace UInt32Rules {
    }
    export namespace UInt64Rules {
    }
    export namespace SInt32Rules {
    }
    export namespace SInt64Rules {
    }
    export namespace Fixed32Rules {
    }
    export namespace Fixed64Rules {
    }
    export namespace SFixed32Rules {
    }
    export namespace SFixed64Rules {
    }
    export namespace BoolRules {
    }
    export namespace StringRules {
    }
    export namespace BytesRules {
    }
    export namespace EnumRules {
    }
    export namespace MessageRules {
    }
    export namespace RepeatedRules {
    }
    export namespace MapRules {
    }
    export namespace AnyRules {
    }
    export namespace DurationRules {
    }
    export namespace TimestampRules {
    }
  }
  export namespace google {
    export namespace protobuf {
      export namespace DoubleValue {
      }
      export namespace FloatValue {
      }
      export namespace Int64Value {
      }
      export namespace UInt64Value {
      }
      export namespace Int32Value {
      }
      export namespace UInt32Value {
      }
      export namespace BoolValue {
      }
      export namespace StringValue {
      }
      export namespace BytesValue {
      }
      export namespace Any {
      }
      export namespace Duration {
      }
      export namespace Struct {
      }
      export namespace Value {
      }
      export namespace ListValue {
      }
      export namespace Timestamp {
      }
      export namespace FileDescriptorSet {
      }
      export namespace FileDescriptorProto {
      }
      export namespace DescriptorProto {
        export namespace ExtensionRange {
        }
        export namespace ReservedRange {
        }
      }
      export namespace FieldDescriptorProto {
      }
      export namespace OneofDescriptorProto {
      }
      export namespace EnumDescriptorProto {
      }
      export namespace EnumValueDescriptorProto {
      }
      export namespace ServiceDescriptorProto {
      }
      export namespace MethodDescriptorProto {
      }
      export namespace FileOptions {
      }
      export namespace MessageOptions {
      }
      export namespace FieldOptions {
      }
      export namespace OneofOptions {
      }
      export namespace EnumOptions {
      }
      export namespace EnumValueOptions {
      }
      export namespace ServiceOptions {
      }
      export namespace MethodOptions {
      }
      export namespace UninterpretedOption {
        export namespace NamePart {
        }
      }
      export namespace SourceCodeInfo {
        export namespace Location {
        }
      }
      export namespace GeneratedCodeInfo {
        export namespace Annotation {
        }
      }
      export namespace Empty {
      }
    }
  }
}
