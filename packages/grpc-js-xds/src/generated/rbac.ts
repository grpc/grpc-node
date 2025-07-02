import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { Address as _envoy_config_core_v3_Address, Address__Output as _envoy_config_core_v3_Address__Output } from './envoy/config/core/v3/Address';
import type { AsyncDataSource as _envoy_config_core_v3_AsyncDataSource, AsyncDataSource__Output as _envoy_config_core_v3_AsyncDataSource__Output } from './envoy/config/core/v3/AsyncDataSource';
import type { BackoffStrategy as _envoy_config_core_v3_BackoffStrategy, BackoffStrategy__Output as _envoy_config_core_v3_BackoffStrategy__Output } from './envoy/config/core/v3/BackoffStrategy';
import type { BindConfig as _envoy_config_core_v3_BindConfig, BindConfig__Output as _envoy_config_core_v3_BindConfig__Output } from './envoy/config/core/v3/BindConfig';
import type { BuildVersion as _envoy_config_core_v3_BuildVersion, BuildVersion__Output as _envoy_config_core_v3_BuildVersion__Output } from './envoy/config/core/v3/BuildVersion';
import type { CidrRange as _envoy_config_core_v3_CidrRange, CidrRange__Output as _envoy_config_core_v3_CidrRange__Output } from './envoy/config/core/v3/CidrRange';
import type { ControlPlane as _envoy_config_core_v3_ControlPlane, ControlPlane__Output as _envoy_config_core_v3_ControlPlane__Output } from './envoy/config/core/v3/ControlPlane';
import type { DataSource as _envoy_config_core_v3_DataSource, DataSource__Output as _envoy_config_core_v3_DataSource__Output } from './envoy/config/core/v3/DataSource';
import type { EnvoyInternalAddress as _envoy_config_core_v3_EnvoyInternalAddress, EnvoyInternalAddress__Output as _envoy_config_core_v3_EnvoyInternalAddress__Output } from './envoy/config/core/v3/EnvoyInternalAddress';
import type { Extension as _envoy_config_core_v3_Extension, Extension__Output as _envoy_config_core_v3_Extension__Output } from './envoy/config/core/v3/Extension';
import type { ExtraSourceAddress as _envoy_config_core_v3_ExtraSourceAddress, ExtraSourceAddress__Output as _envoy_config_core_v3_ExtraSourceAddress__Output } from './envoy/config/core/v3/ExtraSourceAddress';
import type { HeaderMap as _envoy_config_core_v3_HeaderMap, HeaderMap__Output as _envoy_config_core_v3_HeaderMap__Output } from './envoy/config/core/v3/HeaderMap';
import type { HeaderValue as _envoy_config_core_v3_HeaderValue, HeaderValue__Output as _envoy_config_core_v3_HeaderValue__Output } from './envoy/config/core/v3/HeaderValue';
import type { HeaderValueOption as _envoy_config_core_v3_HeaderValueOption, HeaderValueOption__Output as _envoy_config_core_v3_HeaderValueOption__Output } from './envoy/config/core/v3/HeaderValueOption';
import type { HttpUri as _envoy_config_core_v3_HttpUri, HttpUri__Output as _envoy_config_core_v3_HttpUri__Output } from './envoy/config/core/v3/HttpUri';
import type { KeyValue as _envoy_config_core_v3_KeyValue, KeyValue__Output as _envoy_config_core_v3_KeyValue__Output } from './envoy/config/core/v3/KeyValue';
import type { KeyValueAppend as _envoy_config_core_v3_KeyValueAppend, KeyValueAppend__Output as _envoy_config_core_v3_KeyValueAppend__Output } from './envoy/config/core/v3/KeyValueAppend';
import type { KeyValueMutation as _envoy_config_core_v3_KeyValueMutation, KeyValueMutation__Output as _envoy_config_core_v3_KeyValueMutation__Output } from './envoy/config/core/v3/KeyValueMutation';
import type { Locality as _envoy_config_core_v3_Locality, Locality__Output as _envoy_config_core_v3_Locality__Output } from './envoy/config/core/v3/Locality';
import type { Metadata as _envoy_config_core_v3_Metadata, Metadata__Output as _envoy_config_core_v3_Metadata__Output } from './envoy/config/core/v3/Metadata';
import type { Node as _envoy_config_core_v3_Node, Node__Output as _envoy_config_core_v3_Node__Output } from './envoy/config/core/v3/Node';
import type { Pipe as _envoy_config_core_v3_Pipe, Pipe__Output as _envoy_config_core_v3_Pipe__Output } from './envoy/config/core/v3/Pipe';
import type { ProxyProtocolConfig as _envoy_config_core_v3_ProxyProtocolConfig, ProxyProtocolConfig__Output as _envoy_config_core_v3_ProxyProtocolConfig__Output } from './envoy/config/core/v3/ProxyProtocolConfig';
import type { ProxyProtocolPassThroughTLVs as _envoy_config_core_v3_ProxyProtocolPassThroughTLVs, ProxyProtocolPassThroughTLVs__Output as _envoy_config_core_v3_ProxyProtocolPassThroughTLVs__Output } from './envoy/config/core/v3/ProxyProtocolPassThroughTLVs';
import type { QueryParameter as _envoy_config_core_v3_QueryParameter, QueryParameter__Output as _envoy_config_core_v3_QueryParameter__Output } from './envoy/config/core/v3/QueryParameter';
import type { RemoteDataSource as _envoy_config_core_v3_RemoteDataSource, RemoteDataSource__Output as _envoy_config_core_v3_RemoteDataSource__Output } from './envoy/config/core/v3/RemoteDataSource';
import type { RetryPolicy as _envoy_config_core_v3_RetryPolicy, RetryPolicy__Output as _envoy_config_core_v3_RetryPolicy__Output } from './envoy/config/core/v3/RetryPolicy';
import type { RuntimeDouble as _envoy_config_core_v3_RuntimeDouble, RuntimeDouble__Output as _envoy_config_core_v3_RuntimeDouble__Output } from './envoy/config/core/v3/RuntimeDouble';
import type { RuntimeFeatureFlag as _envoy_config_core_v3_RuntimeFeatureFlag, RuntimeFeatureFlag__Output as _envoy_config_core_v3_RuntimeFeatureFlag__Output } from './envoy/config/core/v3/RuntimeFeatureFlag';
import type { RuntimeFractionalPercent as _envoy_config_core_v3_RuntimeFractionalPercent, RuntimeFractionalPercent__Output as _envoy_config_core_v3_RuntimeFractionalPercent__Output } from './envoy/config/core/v3/RuntimeFractionalPercent';
import type { RuntimePercent as _envoy_config_core_v3_RuntimePercent, RuntimePercent__Output as _envoy_config_core_v3_RuntimePercent__Output } from './envoy/config/core/v3/RuntimePercent';
import type { RuntimeUInt32 as _envoy_config_core_v3_RuntimeUInt32, RuntimeUInt32__Output as _envoy_config_core_v3_RuntimeUInt32__Output } from './envoy/config/core/v3/RuntimeUInt32';
import type { SocketAddress as _envoy_config_core_v3_SocketAddress, SocketAddress__Output as _envoy_config_core_v3_SocketAddress__Output } from './envoy/config/core/v3/SocketAddress';
import type { SocketOption as _envoy_config_core_v3_SocketOption, SocketOption__Output as _envoy_config_core_v3_SocketOption__Output } from './envoy/config/core/v3/SocketOption';
import type { SocketOptionsOverride as _envoy_config_core_v3_SocketOptionsOverride, SocketOptionsOverride__Output as _envoy_config_core_v3_SocketOptionsOverride__Output } from './envoy/config/core/v3/SocketOptionsOverride';
import type { TcpKeepalive as _envoy_config_core_v3_TcpKeepalive, TcpKeepalive__Output as _envoy_config_core_v3_TcpKeepalive__Output } from './envoy/config/core/v3/TcpKeepalive';
import type { TransportSocket as _envoy_config_core_v3_TransportSocket, TransportSocket__Output as _envoy_config_core_v3_TransportSocket__Output } from './envoy/config/core/v3/TransportSocket';
import type { TypedExtensionConfig as _envoy_config_core_v3_TypedExtensionConfig, TypedExtensionConfig__Output as _envoy_config_core_v3_TypedExtensionConfig__Output } from './envoy/config/core/v3/TypedExtensionConfig';
import type { WatchedDirectory as _envoy_config_core_v3_WatchedDirectory, WatchedDirectory__Output as _envoy_config_core_v3_WatchedDirectory__Output } from './envoy/config/core/v3/WatchedDirectory';
import type { Action as _envoy_config_rbac_v3_Action, Action__Output as _envoy_config_rbac_v3_Action__Output } from './envoy/config/rbac/v3/Action';
import type { Permission as _envoy_config_rbac_v3_Permission, Permission__Output as _envoy_config_rbac_v3_Permission__Output } from './envoy/config/rbac/v3/Permission';
import type { Policy as _envoy_config_rbac_v3_Policy, Policy__Output as _envoy_config_rbac_v3_Policy__Output } from './envoy/config/rbac/v3/Policy';
import type { Principal as _envoy_config_rbac_v3_Principal, Principal__Output as _envoy_config_rbac_v3_Principal__Output } from './envoy/config/rbac/v3/Principal';
import type { RBAC as _envoy_config_rbac_v3_RBAC, RBAC__Output as _envoy_config_rbac_v3_RBAC__Output } from './envoy/config/rbac/v3/RBAC';
import type { ClusterSpecifierPlugin as _envoy_config_route_v3_ClusterSpecifierPlugin, ClusterSpecifierPlugin__Output as _envoy_config_route_v3_ClusterSpecifierPlugin__Output } from './envoy/config/route/v3/ClusterSpecifierPlugin';
import type { CorsPolicy as _envoy_config_route_v3_CorsPolicy, CorsPolicy__Output as _envoy_config_route_v3_CorsPolicy__Output } from './envoy/config/route/v3/CorsPolicy';
import type { Decorator as _envoy_config_route_v3_Decorator, Decorator__Output as _envoy_config_route_v3_Decorator__Output } from './envoy/config/route/v3/Decorator';
import type { DirectResponseAction as _envoy_config_route_v3_DirectResponseAction, DirectResponseAction__Output as _envoy_config_route_v3_DirectResponseAction__Output } from './envoy/config/route/v3/DirectResponseAction';
import type { FilterAction as _envoy_config_route_v3_FilterAction, FilterAction__Output as _envoy_config_route_v3_FilterAction__Output } from './envoy/config/route/v3/FilterAction';
import type { FilterConfig as _envoy_config_route_v3_FilterConfig, FilterConfig__Output as _envoy_config_route_v3_FilterConfig__Output } from './envoy/config/route/v3/FilterConfig';
import type { HeaderMatcher as _envoy_config_route_v3_HeaderMatcher, HeaderMatcher__Output as _envoy_config_route_v3_HeaderMatcher__Output } from './envoy/config/route/v3/HeaderMatcher';
import type { HedgePolicy as _envoy_config_route_v3_HedgePolicy, HedgePolicy__Output as _envoy_config_route_v3_HedgePolicy__Output } from './envoy/config/route/v3/HedgePolicy';
import type { InternalRedirectPolicy as _envoy_config_route_v3_InternalRedirectPolicy, InternalRedirectPolicy__Output as _envoy_config_route_v3_InternalRedirectPolicy__Output } from './envoy/config/route/v3/InternalRedirectPolicy';
import type { NonForwardingAction as _envoy_config_route_v3_NonForwardingAction, NonForwardingAction__Output as _envoy_config_route_v3_NonForwardingAction__Output } from './envoy/config/route/v3/NonForwardingAction';
import type { QueryParameterMatcher as _envoy_config_route_v3_QueryParameterMatcher, QueryParameterMatcher__Output as _envoy_config_route_v3_QueryParameterMatcher__Output } from './envoy/config/route/v3/QueryParameterMatcher';
import type { RateLimit as _envoy_config_route_v3_RateLimit, RateLimit__Output as _envoy_config_route_v3_RateLimit__Output } from './envoy/config/route/v3/RateLimit';
import type { RedirectAction as _envoy_config_route_v3_RedirectAction, RedirectAction__Output as _envoy_config_route_v3_RedirectAction__Output } from './envoy/config/route/v3/RedirectAction';
import type { RetryPolicy as _envoy_config_route_v3_RetryPolicy, RetryPolicy__Output as _envoy_config_route_v3_RetryPolicy__Output } from './envoy/config/route/v3/RetryPolicy';
import type { Route as _envoy_config_route_v3_Route, Route__Output as _envoy_config_route_v3_Route__Output } from './envoy/config/route/v3/Route';
import type { RouteAction as _envoy_config_route_v3_RouteAction, RouteAction__Output as _envoy_config_route_v3_RouteAction__Output } from './envoy/config/route/v3/RouteAction';
import type { RouteList as _envoy_config_route_v3_RouteList, RouteList__Output as _envoy_config_route_v3_RouteList__Output } from './envoy/config/route/v3/RouteList';
import type { RouteMatch as _envoy_config_route_v3_RouteMatch, RouteMatch__Output as _envoy_config_route_v3_RouteMatch__Output } from './envoy/config/route/v3/RouteMatch';
import type { Tracing as _envoy_config_route_v3_Tracing, Tracing__Output as _envoy_config_route_v3_Tracing__Output } from './envoy/config/route/v3/Tracing';
import type { VirtualCluster as _envoy_config_route_v3_VirtualCluster, VirtualCluster__Output as _envoy_config_route_v3_VirtualCluster__Output } from './envoy/config/route/v3/VirtualCluster';
import type { VirtualHost as _envoy_config_route_v3_VirtualHost, VirtualHost__Output as _envoy_config_route_v3_VirtualHost__Output } from './envoy/config/route/v3/VirtualHost';
import type { WeightedCluster as _envoy_config_route_v3_WeightedCluster, WeightedCluster__Output as _envoy_config_route_v3_WeightedCluster__Output } from './envoy/config/route/v3/WeightedCluster';
import type { RBAC as _envoy_extensions_filters_http_rbac_v3_RBAC, RBAC__Output as _envoy_extensions_filters_http_rbac_v3_RBAC__Output } from './envoy/extensions/filters/http/rbac/v3/RBAC';
import type { RBACPerRoute as _envoy_extensions_filters_http_rbac_v3_RBACPerRoute, RBACPerRoute__Output as _envoy_extensions_filters_http_rbac_v3_RBACPerRoute__Output } from './envoy/extensions/filters/http/rbac/v3/RBACPerRoute';
import type { DoubleMatcher as _envoy_type_matcher_v3_DoubleMatcher, DoubleMatcher__Output as _envoy_type_matcher_v3_DoubleMatcher__Output } from './envoy/type/matcher/v3/DoubleMatcher';
import type { FilterStateMatcher as _envoy_type_matcher_v3_FilterStateMatcher, FilterStateMatcher__Output as _envoy_type_matcher_v3_FilterStateMatcher__Output } from './envoy/type/matcher/v3/FilterStateMatcher';
import type { ListMatcher as _envoy_type_matcher_v3_ListMatcher, ListMatcher__Output as _envoy_type_matcher_v3_ListMatcher__Output } from './envoy/type/matcher/v3/ListMatcher';
import type { ListStringMatcher as _envoy_type_matcher_v3_ListStringMatcher, ListStringMatcher__Output as _envoy_type_matcher_v3_ListStringMatcher__Output } from './envoy/type/matcher/v3/ListStringMatcher';
import type { MetadataMatcher as _envoy_type_matcher_v3_MetadataMatcher, MetadataMatcher__Output as _envoy_type_matcher_v3_MetadataMatcher__Output } from './envoy/type/matcher/v3/MetadataMatcher';
import type { OrMatcher as _envoy_type_matcher_v3_OrMatcher, OrMatcher__Output as _envoy_type_matcher_v3_OrMatcher__Output } from './envoy/type/matcher/v3/OrMatcher';
import type { PathMatcher as _envoy_type_matcher_v3_PathMatcher, PathMatcher__Output as _envoy_type_matcher_v3_PathMatcher__Output } from './envoy/type/matcher/v3/PathMatcher';
import type { RegexMatchAndSubstitute as _envoy_type_matcher_v3_RegexMatchAndSubstitute, RegexMatchAndSubstitute__Output as _envoy_type_matcher_v3_RegexMatchAndSubstitute__Output } from './envoy/type/matcher/v3/RegexMatchAndSubstitute';
import type { RegexMatcher as _envoy_type_matcher_v3_RegexMatcher, RegexMatcher__Output as _envoy_type_matcher_v3_RegexMatcher__Output } from './envoy/type/matcher/v3/RegexMatcher';
import type { StringMatcher as _envoy_type_matcher_v3_StringMatcher, StringMatcher__Output as _envoy_type_matcher_v3_StringMatcher__Output } from './envoy/type/matcher/v3/StringMatcher';
import type { ValueMatcher as _envoy_type_matcher_v3_ValueMatcher, ValueMatcher__Output as _envoy_type_matcher_v3_ValueMatcher__Output } from './envoy/type/matcher/v3/ValueMatcher';
import type { MetadataKey as _envoy_type_metadata_v3_MetadataKey, MetadataKey__Output as _envoy_type_metadata_v3_MetadataKey__Output } from './envoy/type/metadata/v3/MetadataKey';
import type { MetadataKind as _envoy_type_metadata_v3_MetadataKind, MetadataKind__Output as _envoy_type_metadata_v3_MetadataKind__Output } from './envoy/type/metadata/v3/MetadataKind';
import type { CustomTag as _envoy_type_tracing_v3_CustomTag, CustomTag__Output as _envoy_type_tracing_v3_CustomTag__Output } from './envoy/type/tracing/v3/CustomTag';
import type { DoubleRange as _envoy_type_v3_DoubleRange, DoubleRange__Output as _envoy_type_v3_DoubleRange__Output } from './envoy/type/v3/DoubleRange';
import type { FractionalPercent as _envoy_type_v3_FractionalPercent, FractionalPercent__Output as _envoy_type_v3_FractionalPercent__Output } from './envoy/type/v3/FractionalPercent';
import type { Int32Range as _envoy_type_v3_Int32Range, Int32Range__Output as _envoy_type_v3_Int32Range__Output } from './envoy/type/v3/Int32Range';
import type { Int64Range as _envoy_type_v3_Int64Range, Int64Range__Output as _envoy_type_v3_Int64Range__Output } from './envoy/type/v3/Int64Range';
import type { Percent as _envoy_type_v3_Percent, Percent__Output as _envoy_type_v3_Percent__Output } from './envoy/type/v3/Percent';
import type { SemanticVersion as _envoy_type_v3_SemanticVersion, SemanticVersion__Output as _envoy_type_v3_SemanticVersion__Output } from './envoy/type/v3/SemanticVersion';
import type { CheckedExpr as _google_api_expr_v1alpha1_CheckedExpr, CheckedExpr__Output as _google_api_expr_v1alpha1_CheckedExpr__Output } from './google/api/expr/v1alpha1/CheckedExpr';
import type { Constant as _google_api_expr_v1alpha1_Constant, Constant__Output as _google_api_expr_v1alpha1_Constant__Output } from './google/api/expr/v1alpha1/Constant';
import type { Decl as _google_api_expr_v1alpha1_Decl, Decl__Output as _google_api_expr_v1alpha1_Decl__Output } from './google/api/expr/v1alpha1/Decl';
import type { Expr as _google_api_expr_v1alpha1_Expr, Expr__Output as _google_api_expr_v1alpha1_Expr__Output } from './google/api/expr/v1alpha1/Expr';
import type { ParsedExpr as _google_api_expr_v1alpha1_ParsedExpr, ParsedExpr__Output as _google_api_expr_v1alpha1_ParsedExpr__Output } from './google/api/expr/v1alpha1/ParsedExpr';
import type { Reference as _google_api_expr_v1alpha1_Reference, Reference__Output as _google_api_expr_v1alpha1_Reference__Output } from './google/api/expr/v1alpha1/Reference';
import type { SourceInfo as _google_api_expr_v1alpha1_SourceInfo, SourceInfo__Output as _google_api_expr_v1alpha1_SourceInfo__Output } from './google/api/expr/v1alpha1/SourceInfo';
import type { SourcePosition as _google_api_expr_v1alpha1_SourcePosition, SourcePosition__Output as _google_api_expr_v1alpha1_SourcePosition__Output } from './google/api/expr/v1alpha1/SourcePosition';
import type { Type as _google_api_expr_v1alpha1_Type, Type__Output as _google_api_expr_v1alpha1_Type__Output } from './google/api/expr/v1alpha1/Type';
import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from './google/protobuf/Any';
import type { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from './google/protobuf/BoolValue';
import type { BytesValue as _google_protobuf_BytesValue, BytesValue__Output as _google_protobuf_BytesValue__Output } from './google/protobuf/BytesValue';
import type { DescriptorProto as _google_protobuf_DescriptorProto, DescriptorProto__Output as _google_protobuf_DescriptorProto__Output } from './google/protobuf/DescriptorProto';
import type { DoubleValue as _google_protobuf_DoubleValue, DoubleValue__Output as _google_protobuf_DoubleValue__Output } from './google/protobuf/DoubleValue';
import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from './google/protobuf/Duration';
import type { Empty as _google_protobuf_Empty, Empty__Output as _google_protobuf_Empty__Output } from './google/protobuf/Empty';
import type { EnumDescriptorProto as _google_protobuf_EnumDescriptorProto, EnumDescriptorProto__Output as _google_protobuf_EnumDescriptorProto__Output } from './google/protobuf/EnumDescriptorProto';
import type { EnumOptions as _google_protobuf_EnumOptions, EnumOptions__Output as _google_protobuf_EnumOptions__Output } from './google/protobuf/EnumOptions';
import type { EnumValueDescriptorProto as _google_protobuf_EnumValueDescriptorProto, EnumValueDescriptorProto__Output as _google_protobuf_EnumValueDescriptorProto__Output } from './google/protobuf/EnumValueDescriptorProto';
import type { EnumValueOptions as _google_protobuf_EnumValueOptions, EnumValueOptions__Output as _google_protobuf_EnumValueOptions__Output } from './google/protobuf/EnumValueOptions';
import type { ExtensionRangeOptions as _google_protobuf_ExtensionRangeOptions, ExtensionRangeOptions__Output as _google_protobuf_ExtensionRangeOptions__Output } from './google/protobuf/ExtensionRangeOptions';
import type { FeatureSet as _google_protobuf_FeatureSet, FeatureSet__Output as _google_protobuf_FeatureSet__Output } from './google/protobuf/FeatureSet';
import type { FeatureSetDefaults as _google_protobuf_FeatureSetDefaults, FeatureSetDefaults__Output as _google_protobuf_FeatureSetDefaults__Output } from './google/protobuf/FeatureSetDefaults';
import type { FieldDescriptorProto as _google_protobuf_FieldDescriptorProto, FieldDescriptorProto__Output as _google_protobuf_FieldDescriptorProto__Output } from './google/protobuf/FieldDescriptorProto';
import type { FieldOptions as _google_protobuf_FieldOptions, FieldOptions__Output as _google_protobuf_FieldOptions__Output } from './google/protobuf/FieldOptions';
import type { FileDescriptorProto as _google_protobuf_FileDescriptorProto, FileDescriptorProto__Output as _google_protobuf_FileDescriptorProto__Output } from './google/protobuf/FileDescriptorProto';
import type { FileDescriptorSet as _google_protobuf_FileDescriptorSet, FileDescriptorSet__Output as _google_protobuf_FileDescriptorSet__Output } from './google/protobuf/FileDescriptorSet';
import type { FileOptions as _google_protobuf_FileOptions, FileOptions__Output as _google_protobuf_FileOptions__Output } from './google/protobuf/FileOptions';
import type { FloatValue as _google_protobuf_FloatValue, FloatValue__Output as _google_protobuf_FloatValue__Output } from './google/protobuf/FloatValue';
import type { GeneratedCodeInfo as _google_protobuf_GeneratedCodeInfo, GeneratedCodeInfo__Output as _google_protobuf_GeneratedCodeInfo__Output } from './google/protobuf/GeneratedCodeInfo';
import type { Int32Value as _google_protobuf_Int32Value, Int32Value__Output as _google_protobuf_Int32Value__Output } from './google/protobuf/Int32Value';
import type { Int64Value as _google_protobuf_Int64Value, Int64Value__Output as _google_protobuf_Int64Value__Output } from './google/protobuf/Int64Value';
import type { ListValue as _google_protobuf_ListValue, ListValue__Output as _google_protobuf_ListValue__Output } from './google/protobuf/ListValue';
import type { MessageOptions as _google_protobuf_MessageOptions, MessageOptions__Output as _google_protobuf_MessageOptions__Output } from './google/protobuf/MessageOptions';
import type { MethodDescriptorProto as _google_protobuf_MethodDescriptorProto, MethodDescriptorProto__Output as _google_protobuf_MethodDescriptorProto__Output } from './google/protobuf/MethodDescriptorProto';
import type { MethodOptions as _google_protobuf_MethodOptions, MethodOptions__Output as _google_protobuf_MethodOptions__Output } from './google/protobuf/MethodOptions';
import type { OneofDescriptorProto as _google_protobuf_OneofDescriptorProto, OneofDescriptorProto__Output as _google_protobuf_OneofDescriptorProto__Output } from './google/protobuf/OneofDescriptorProto';
import type { OneofOptions as _google_protobuf_OneofOptions, OneofOptions__Output as _google_protobuf_OneofOptions__Output } from './google/protobuf/OneofOptions';
import type { ServiceDescriptorProto as _google_protobuf_ServiceDescriptorProto, ServiceDescriptorProto__Output as _google_protobuf_ServiceDescriptorProto__Output } from './google/protobuf/ServiceDescriptorProto';
import type { ServiceOptions as _google_protobuf_ServiceOptions, ServiceOptions__Output as _google_protobuf_ServiceOptions__Output } from './google/protobuf/ServiceOptions';
import type { SourceCodeInfo as _google_protobuf_SourceCodeInfo, SourceCodeInfo__Output as _google_protobuf_SourceCodeInfo__Output } from './google/protobuf/SourceCodeInfo';
import type { StringValue as _google_protobuf_StringValue, StringValue__Output as _google_protobuf_StringValue__Output } from './google/protobuf/StringValue';
import type { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from './google/protobuf/Struct';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from './google/protobuf/Timestamp';
import type { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from './google/protobuf/UInt32Value';
import type { UInt64Value as _google_protobuf_UInt64Value, UInt64Value__Output as _google_protobuf_UInt64Value__Output } from './google/protobuf/UInt64Value';
import type { UninterpretedOption as _google_protobuf_UninterpretedOption, UninterpretedOption__Output as _google_protobuf_UninterpretedOption__Output } from './google/protobuf/UninterpretedOption';
import type { Value as _google_protobuf_Value, Value__Output as _google_protobuf_Value__Output } from './google/protobuf/Value';
import type { FieldMigrateAnnotation as _udpa_annotations_FieldMigrateAnnotation, FieldMigrateAnnotation__Output as _udpa_annotations_FieldMigrateAnnotation__Output } from './udpa/annotations/FieldMigrateAnnotation';
import type { FileMigrateAnnotation as _udpa_annotations_FileMigrateAnnotation, FileMigrateAnnotation__Output as _udpa_annotations_FileMigrateAnnotation__Output } from './udpa/annotations/FileMigrateAnnotation';
import type { MigrateAnnotation as _udpa_annotations_MigrateAnnotation, MigrateAnnotation__Output as _udpa_annotations_MigrateAnnotation__Output } from './udpa/annotations/MigrateAnnotation';
import type { StatusAnnotation as _udpa_annotations_StatusAnnotation, StatusAnnotation__Output as _udpa_annotations_StatusAnnotation__Output } from './udpa/annotations/StatusAnnotation';
import type { VersioningAnnotation as _udpa_annotations_VersioningAnnotation, VersioningAnnotation__Output as _udpa_annotations_VersioningAnnotation__Output } from './udpa/annotations/VersioningAnnotation';
import type { AnyRules as _validate_AnyRules, AnyRules__Output as _validate_AnyRules__Output } from './validate/AnyRules';
import type { BoolRules as _validate_BoolRules, BoolRules__Output as _validate_BoolRules__Output } from './validate/BoolRules';
import type { BytesRules as _validate_BytesRules, BytesRules__Output as _validate_BytesRules__Output } from './validate/BytesRules';
import type { DoubleRules as _validate_DoubleRules, DoubleRules__Output as _validate_DoubleRules__Output } from './validate/DoubleRules';
import type { DurationRules as _validate_DurationRules, DurationRules__Output as _validate_DurationRules__Output } from './validate/DurationRules';
import type { EnumRules as _validate_EnumRules, EnumRules__Output as _validate_EnumRules__Output } from './validate/EnumRules';
import type { FieldRules as _validate_FieldRules, FieldRules__Output as _validate_FieldRules__Output } from './validate/FieldRules';
import type { Fixed32Rules as _validate_Fixed32Rules, Fixed32Rules__Output as _validate_Fixed32Rules__Output } from './validate/Fixed32Rules';
import type { Fixed64Rules as _validate_Fixed64Rules, Fixed64Rules__Output as _validate_Fixed64Rules__Output } from './validate/Fixed64Rules';
import type { FloatRules as _validate_FloatRules, FloatRules__Output as _validate_FloatRules__Output } from './validate/FloatRules';
import type { Int32Rules as _validate_Int32Rules, Int32Rules__Output as _validate_Int32Rules__Output } from './validate/Int32Rules';
import type { Int64Rules as _validate_Int64Rules, Int64Rules__Output as _validate_Int64Rules__Output } from './validate/Int64Rules';
import type { MapRules as _validate_MapRules, MapRules__Output as _validate_MapRules__Output } from './validate/MapRules';
import type { MessageRules as _validate_MessageRules, MessageRules__Output as _validate_MessageRules__Output } from './validate/MessageRules';
import type { RepeatedRules as _validate_RepeatedRules, RepeatedRules__Output as _validate_RepeatedRules__Output } from './validate/RepeatedRules';
import type { SFixed32Rules as _validate_SFixed32Rules, SFixed32Rules__Output as _validate_SFixed32Rules__Output } from './validate/SFixed32Rules';
import type { SFixed64Rules as _validate_SFixed64Rules, SFixed64Rules__Output as _validate_SFixed64Rules__Output } from './validate/SFixed64Rules';
import type { SInt32Rules as _validate_SInt32Rules, SInt32Rules__Output as _validate_SInt32Rules__Output } from './validate/SInt32Rules';
import type { SInt64Rules as _validate_SInt64Rules, SInt64Rules__Output as _validate_SInt64Rules__Output } from './validate/SInt64Rules';
import type { StringRules as _validate_StringRules, StringRules__Output as _validate_StringRules__Output } from './validate/StringRules';
import type { TimestampRules as _validate_TimestampRules, TimestampRules__Output as _validate_TimestampRules__Output } from './validate/TimestampRules';
import type { UInt32Rules as _validate_UInt32Rules, UInt32Rules__Output as _validate_UInt32Rules__Output } from './validate/UInt32Rules';
import type { UInt64Rules as _validate_UInt64Rules, UInt64Rules__Output as _validate_UInt64Rules__Output } from './validate/UInt64Rules';
import type { FieldStatusAnnotation as _xds_annotations_v3_FieldStatusAnnotation, FieldStatusAnnotation__Output as _xds_annotations_v3_FieldStatusAnnotation__Output } from './xds/annotations/v3/FieldStatusAnnotation';
import type { FileStatusAnnotation as _xds_annotations_v3_FileStatusAnnotation, FileStatusAnnotation__Output as _xds_annotations_v3_FileStatusAnnotation__Output } from './xds/annotations/v3/FileStatusAnnotation';
import type { MessageStatusAnnotation as _xds_annotations_v3_MessageStatusAnnotation, MessageStatusAnnotation__Output as _xds_annotations_v3_MessageStatusAnnotation__Output } from './xds/annotations/v3/MessageStatusAnnotation';
import type { StatusAnnotation as _xds_annotations_v3_StatusAnnotation, StatusAnnotation__Output as _xds_annotations_v3_StatusAnnotation__Output } from './xds/annotations/v3/StatusAnnotation';
import type { ContextParams as _xds_core_v3_ContextParams, ContextParams__Output as _xds_core_v3_ContextParams__Output } from './xds/core/v3/ContextParams';
import type { TypedExtensionConfig as _xds_core_v3_TypedExtensionConfig, TypedExtensionConfig__Output as _xds_core_v3_TypedExtensionConfig__Output } from './xds/core/v3/TypedExtensionConfig';
import type { ListStringMatcher as _xds_type_matcher_v3_ListStringMatcher, ListStringMatcher__Output as _xds_type_matcher_v3_ListStringMatcher__Output } from './xds/type/matcher/v3/ListStringMatcher';
import type { Matcher as _xds_type_matcher_v3_Matcher, Matcher__Output as _xds_type_matcher_v3_Matcher__Output } from './xds/type/matcher/v3/Matcher';
import type { RegexMatcher as _xds_type_matcher_v3_RegexMatcher, RegexMatcher__Output as _xds_type_matcher_v3_RegexMatcher__Output } from './xds/type/matcher/v3/RegexMatcher';
import type { StringMatcher as _xds_type_matcher_v3_StringMatcher, StringMatcher__Output as _xds_type_matcher_v3_StringMatcher__Output } from './xds/type/matcher/v3/StringMatcher';

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
          Address: MessageTypeDefinition<_envoy_config_core_v3_Address, _envoy_config_core_v3_Address__Output>
          AsyncDataSource: MessageTypeDefinition<_envoy_config_core_v3_AsyncDataSource, _envoy_config_core_v3_AsyncDataSource__Output>
          BackoffStrategy: MessageTypeDefinition<_envoy_config_core_v3_BackoffStrategy, _envoy_config_core_v3_BackoffStrategy__Output>
          BindConfig: MessageTypeDefinition<_envoy_config_core_v3_BindConfig, _envoy_config_core_v3_BindConfig__Output>
          BuildVersion: MessageTypeDefinition<_envoy_config_core_v3_BuildVersion, _envoy_config_core_v3_BuildVersion__Output>
          CidrRange: MessageTypeDefinition<_envoy_config_core_v3_CidrRange, _envoy_config_core_v3_CidrRange__Output>
          ControlPlane: MessageTypeDefinition<_envoy_config_core_v3_ControlPlane, _envoy_config_core_v3_ControlPlane__Output>
          DataSource: MessageTypeDefinition<_envoy_config_core_v3_DataSource, _envoy_config_core_v3_DataSource__Output>
          EnvoyInternalAddress: MessageTypeDefinition<_envoy_config_core_v3_EnvoyInternalAddress, _envoy_config_core_v3_EnvoyInternalAddress__Output>
          Extension: MessageTypeDefinition<_envoy_config_core_v3_Extension, _envoy_config_core_v3_Extension__Output>
          ExtraSourceAddress: MessageTypeDefinition<_envoy_config_core_v3_ExtraSourceAddress, _envoy_config_core_v3_ExtraSourceAddress__Output>
          HeaderMap: MessageTypeDefinition<_envoy_config_core_v3_HeaderMap, _envoy_config_core_v3_HeaderMap__Output>
          HeaderValue: MessageTypeDefinition<_envoy_config_core_v3_HeaderValue, _envoy_config_core_v3_HeaderValue__Output>
          HeaderValueOption: MessageTypeDefinition<_envoy_config_core_v3_HeaderValueOption, _envoy_config_core_v3_HeaderValueOption__Output>
          HttpUri: MessageTypeDefinition<_envoy_config_core_v3_HttpUri, _envoy_config_core_v3_HttpUri__Output>
          KeyValue: MessageTypeDefinition<_envoy_config_core_v3_KeyValue, _envoy_config_core_v3_KeyValue__Output>
          KeyValueAppend: MessageTypeDefinition<_envoy_config_core_v3_KeyValueAppend, _envoy_config_core_v3_KeyValueAppend__Output>
          KeyValueMutation: MessageTypeDefinition<_envoy_config_core_v3_KeyValueMutation, _envoy_config_core_v3_KeyValueMutation__Output>
          Locality: MessageTypeDefinition<_envoy_config_core_v3_Locality, _envoy_config_core_v3_Locality__Output>
          Metadata: MessageTypeDefinition<_envoy_config_core_v3_Metadata, _envoy_config_core_v3_Metadata__Output>
          Node: MessageTypeDefinition<_envoy_config_core_v3_Node, _envoy_config_core_v3_Node__Output>
          Pipe: MessageTypeDefinition<_envoy_config_core_v3_Pipe, _envoy_config_core_v3_Pipe__Output>
          ProxyProtocolConfig: MessageTypeDefinition<_envoy_config_core_v3_ProxyProtocolConfig, _envoy_config_core_v3_ProxyProtocolConfig__Output>
          ProxyProtocolPassThroughTLVs: MessageTypeDefinition<_envoy_config_core_v3_ProxyProtocolPassThroughTLVs, _envoy_config_core_v3_ProxyProtocolPassThroughTLVs__Output>
          QueryParameter: MessageTypeDefinition<_envoy_config_core_v3_QueryParameter, _envoy_config_core_v3_QueryParameter__Output>
          RemoteDataSource: MessageTypeDefinition<_envoy_config_core_v3_RemoteDataSource, _envoy_config_core_v3_RemoteDataSource__Output>
          RequestMethod: EnumTypeDefinition
          RetryPolicy: MessageTypeDefinition<_envoy_config_core_v3_RetryPolicy, _envoy_config_core_v3_RetryPolicy__Output>
          RoutingPriority: EnumTypeDefinition
          RuntimeDouble: MessageTypeDefinition<_envoy_config_core_v3_RuntimeDouble, _envoy_config_core_v3_RuntimeDouble__Output>
          RuntimeFeatureFlag: MessageTypeDefinition<_envoy_config_core_v3_RuntimeFeatureFlag, _envoy_config_core_v3_RuntimeFeatureFlag__Output>
          RuntimeFractionalPercent: MessageTypeDefinition<_envoy_config_core_v3_RuntimeFractionalPercent, _envoy_config_core_v3_RuntimeFractionalPercent__Output>
          RuntimePercent: MessageTypeDefinition<_envoy_config_core_v3_RuntimePercent, _envoy_config_core_v3_RuntimePercent__Output>
          RuntimeUInt32: MessageTypeDefinition<_envoy_config_core_v3_RuntimeUInt32, _envoy_config_core_v3_RuntimeUInt32__Output>
          SocketAddress: MessageTypeDefinition<_envoy_config_core_v3_SocketAddress, _envoy_config_core_v3_SocketAddress__Output>
          SocketOption: MessageTypeDefinition<_envoy_config_core_v3_SocketOption, _envoy_config_core_v3_SocketOption__Output>
          SocketOptionsOverride: MessageTypeDefinition<_envoy_config_core_v3_SocketOptionsOverride, _envoy_config_core_v3_SocketOptionsOverride__Output>
          TcpKeepalive: MessageTypeDefinition<_envoy_config_core_v3_TcpKeepalive, _envoy_config_core_v3_TcpKeepalive__Output>
          TrafficDirection: EnumTypeDefinition
          TransportSocket: MessageTypeDefinition<_envoy_config_core_v3_TransportSocket, _envoy_config_core_v3_TransportSocket__Output>
          TypedExtensionConfig: MessageTypeDefinition<_envoy_config_core_v3_TypedExtensionConfig, _envoy_config_core_v3_TypedExtensionConfig__Output>
          WatchedDirectory: MessageTypeDefinition<_envoy_config_core_v3_WatchedDirectory, _envoy_config_core_v3_WatchedDirectory__Output>
        }
      }
      rbac: {
        v3: {
          Action: MessageTypeDefinition<_envoy_config_rbac_v3_Action, _envoy_config_rbac_v3_Action__Output>
          Permission: MessageTypeDefinition<_envoy_config_rbac_v3_Permission, _envoy_config_rbac_v3_Permission__Output>
          Policy: MessageTypeDefinition<_envoy_config_rbac_v3_Policy, _envoy_config_rbac_v3_Policy__Output>
          Principal: MessageTypeDefinition<_envoy_config_rbac_v3_Principal, _envoy_config_rbac_v3_Principal__Output>
          RBAC: MessageTypeDefinition<_envoy_config_rbac_v3_RBAC, _envoy_config_rbac_v3_RBAC__Output>
        }
      }
      route: {
        v3: {
          ClusterSpecifierPlugin: MessageTypeDefinition<_envoy_config_route_v3_ClusterSpecifierPlugin, _envoy_config_route_v3_ClusterSpecifierPlugin__Output>
          CorsPolicy: MessageTypeDefinition<_envoy_config_route_v3_CorsPolicy, _envoy_config_route_v3_CorsPolicy__Output>
          Decorator: MessageTypeDefinition<_envoy_config_route_v3_Decorator, _envoy_config_route_v3_Decorator__Output>
          DirectResponseAction: MessageTypeDefinition<_envoy_config_route_v3_DirectResponseAction, _envoy_config_route_v3_DirectResponseAction__Output>
          FilterAction: MessageTypeDefinition<_envoy_config_route_v3_FilterAction, _envoy_config_route_v3_FilterAction__Output>
          FilterConfig: MessageTypeDefinition<_envoy_config_route_v3_FilterConfig, _envoy_config_route_v3_FilterConfig__Output>
          HeaderMatcher: MessageTypeDefinition<_envoy_config_route_v3_HeaderMatcher, _envoy_config_route_v3_HeaderMatcher__Output>
          HedgePolicy: MessageTypeDefinition<_envoy_config_route_v3_HedgePolicy, _envoy_config_route_v3_HedgePolicy__Output>
          InternalRedirectPolicy: MessageTypeDefinition<_envoy_config_route_v3_InternalRedirectPolicy, _envoy_config_route_v3_InternalRedirectPolicy__Output>
          NonForwardingAction: MessageTypeDefinition<_envoy_config_route_v3_NonForwardingAction, _envoy_config_route_v3_NonForwardingAction__Output>
          QueryParameterMatcher: MessageTypeDefinition<_envoy_config_route_v3_QueryParameterMatcher, _envoy_config_route_v3_QueryParameterMatcher__Output>
          RateLimit: MessageTypeDefinition<_envoy_config_route_v3_RateLimit, _envoy_config_route_v3_RateLimit__Output>
          RedirectAction: MessageTypeDefinition<_envoy_config_route_v3_RedirectAction, _envoy_config_route_v3_RedirectAction__Output>
          RetryPolicy: MessageTypeDefinition<_envoy_config_route_v3_RetryPolicy, _envoy_config_route_v3_RetryPolicy__Output>
          Route: MessageTypeDefinition<_envoy_config_route_v3_Route, _envoy_config_route_v3_Route__Output>
          RouteAction: MessageTypeDefinition<_envoy_config_route_v3_RouteAction, _envoy_config_route_v3_RouteAction__Output>
          RouteList: MessageTypeDefinition<_envoy_config_route_v3_RouteList, _envoy_config_route_v3_RouteList__Output>
          RouteMatch: MessageTypeDefinition<_envoy_config_route_v3_RouteMatch, _envoy_config_route_v3_RouteMatch__Output>
          Tracing: MessageTypeDefinition<_envoy_config_route_v3_Tracing, _envoy_config_route_v3_Tracing__Output>
          VirtualCluster: MessageTypeDefinition<_envoy_config_route_v3_VirtualCluster, _envoy_config_route_v3_VirtualCluster__Output>
          VirtualHost: MessageTypeDefinition<_envoy_config_route_v3_VirtualHost, _envoy_config_route_v3_VirtualHost__Output>
          WeightedCluster: MessageTypeDefinition<_envoy_config_route_v3_WeightedCluster, _envoy_config_route_v3_WeightedCluster__Output>
        }
      }
    }
    extensions: {
      filters: {
        http: {
          rbac: {
            v3: {
              RBAC: MessageTypeDefinition<_envoy_extensions_filters_http_rbac_v3_RBAC, _envoy_extensions_filters_http_rbac_v3_RBAC__Output>
              RBACPerRoute: MessageTypeDefinition<_envoy_extensions_filters_http_rbac_v3_RBACPerRoute, _envoy_extensions_filters_http_rbac_v3_RBACPerRoute__Output>
            }
          }
        }
      }
    }
    type: {
      matcher: {
        v3: {
          DoubleMatcher: MessageTypeDefinition<_envoy_type_matcher_v3_DoubleMatcher, _envoy_type_matcher_v3_DoubleMatcher__Output>
          FilterStateMatcher: MessageTypeDefinition<_envoy_type_matcher_v3_FilterStateMatcher, _envoy_type_matcher_v3_FilterStateMatcher__Output>
          ListMatcher: MessageTypeDefinition<_envoy_type_matcher_v3_ListMatcher, _envoy_type_matcher_v3_ListMatcher__Output>
          ListStringMatcher: MessageTypeDefinition<_envoy_type_matcher_v3_ListStringMatcher, _envoy_type_matcher_v3_ListStringMatcher__Output>
          MetadataMatcher: MessageTypeDefinition<_envoy_type_matcher_v3_MetadataMatcher, _envoy_type_matcher_v3_MetadataMatcher__Output>
          OrMatcher: MessageTypeDefinition<_envoy_type_matcher_v3_OrMatcher, _envoy_type_matcher_v3_OrMatcher__Output>
          PathMatcher: MessageTypeDefinition<_envoy_type_matcher_v3_PathMatcher, _envoy_type_matcher_v3_PathMatcher__Output>
          RegexMatchAndSubstitute: MessageTypeDefinition<_envoy_type_matcher_v3_RegexMatchAndSubstitute, _envoy_type_matcher_v3_RegexMatchAndSubstitute__Output>
          RegexMatcher: MessageTypeDefinition<_envoy_type_matcher_v3_RegexMatcher, _envoy_type_matcher_v3_RegexMatcher__Output>
          StringMatcher: MessageTypeDefinition<_envoy_type_matcher_v3_StringMatcher, _envoy_type_matcher_v3_StringMatcher__Output>
          ValueMatcher: MessageTypeDefinition<_envoy_type_matcher_v3_ValueMatcher, _envoy_type_matcher_v3_ValueMatcher__Output>
        }
      }
      metadata: {
        v3: {
          MetadataKey: MessageTypeDefinition<_envoy_type_metadata_v3_MetadataKey, _envoy_type_metadata_v3_MetadataKey__Output>
          MetadataKind: MessageTypeDefinition<_envoy_type_metadata_v3_MetadataKind, _envoy_type_metadata_v3_MetadataKind__Output>
        }
      }
      tracing: {
        v3: {
          CustomTag: MessageTypeDefinition<_envoy_type_tracing_v3_CustomTag, _envoy_type_tracing_v3_CustomTag__Output>
        }
      }
      v3: {
        DoubleRange: MessageTypeDefinition<_envoy_type_v3_DoubleRange, _envoy_type_v3_DoubleRange__Output>
        FractionalPercent: MessageTypeDefinition<_envoy_type_v3_FractionalPercent, _envoy_type_v3_FractionalPercent__Output>
        Int32Range: MessageTypeDefinition<_envoy_type_v3_Int32Range, _envoy_type_v3_Int32Range__Output>
        Int64Range: MessageTypeDefinition<_envoy_type_v3_Int64Range, _envoy_type_v3_Int64Range__Output>
        Percent: MessageTypeDefinition<_envoy_type_v3_Percent, _envoy_type_v3_Percent__Output>
        SemanticVersion: MessageTypeDefinition<_envoy_type_v3_SemanticVersion, _envoy_type_v3_SemanticVersion__Output>
      }
    }
  }
  google: {
    api: {
      expr: {
        v1alpha1: {
          CheckedExpr: MessageTypeDefinition<_google_api_expr_v1alpha1_CheckedExpr, _google_api_expr_v1alpha1_CheckedExpr__Output>
          Constant: MessageTypeDefinition<_google_api_expr_v1alpha1_Constant, _google_api_expr_v1alpha1_Constant__Output>
          Decl: MessageTypeDefinition<_google_api_expr_v1alpha1_Decl, _google_api_expr_v1alpha1_Decl__Output>
          Expr: MessageTypeDefinition<_google_api_expr_v1alpha1_Expr, _google_api_expr_v1alpha1_Expr__Output>
          ParsedExpr: MessageTypeDefinition<_google_api_expr_v1alpha1_ParsedExpr, _google_api_expr_v1alpha1_ParsedExpr__Output>
          Reference: MessageTypeDefinition<_google_api_expr_v1alpha1_Reference, _google_api_expr_v1alpha1_Reference__Output>
          SourceInfo: MessageTypeDefinition<_google_api_expr_v1alpha1_SourceInfo, _google_api_expr_v1alpha1_SourceInfo__Output>
          SourcePosition: MessageTypeDefinition<_google_api_expr_v1alpha1_SourcePosition, _google_api_expr_v1alpha1_SourcePosition__Output>
          Type: MessageTypeDefinition<_google_api_expr_v1alpha1_Type, _google_api_expr_v1alpha1_Type__Output>
        }
      }
    }
    protobuf: {
      Any: MessageTypeDefinition<_google_protobuf_Any, _google_protobuf_Any__Output>
      BoolValue: MessageTypeDefinition<_google_protobuf_BoolValue, _google_protobuf_BoolValue__Output>
      BytesValue: MessageTypeDefinition<_google_protobuf_BytesValue, _google_protobuf_BytesValue__Output>
      DescriptorProto: MessageTypeDefinition<_google_protobuf_DescriptorProto, _google_protobuf_DescriptorProto__Output>
      DoubleValue: MessageTypeDefinition<_google_protobuf_DoubleValue, _google_protobuf_DoubleValue__Output>
      Duration: MessageTypeDefinition<_google_protobuf_Duration, _google_protobuf_Duration__Output>
      Edition: EnumTypeDefinition
      Empty: MessageTypeDefinition<_google_protobuf_Empty, _google_protobuf_Empty__Output>
      EnumDescriptorProto: MessageTypeDefinition<_google_protobuf_EnumDescriptorProto, _google_protobuf_EnumDescriptorProto__Output>
      EnumOptions: MessageTypeDefinition<_google_protobuf_EnumOptions, _google_protobuf_EnumOptions__Output>
      EnumValueDescriptorProto: MessageTypeDefinition<_google_protobuf_EnumValueDescriptorProto, _google_protobuf_EnumValueDescriptorProto__Output>
      EnumValueOptions: MessageTypeDefinition<_google_protobuf_EnumValueOptions, _google_protobuf_EnumValueOptions__Output>
      ExtensionRangeOptions: MessageTypeDefinition<_google_protobuf_ExtensionRangeOptions, _google_protobuf_ExtensionRangeOptions__Output>
      FeatureSet: MessageTypeDefinition<_google_protobuf_FeatureSet, _google_protobuf_FeatureSet__Output>
      FeatureSetDefaults: MessageTypeDefinition<_google_protobuf_FeatureSetDefaults, _google_protobuf_FeatureSetDefaults__Output>
      FieldDescriptorProto: MessageTypeDefinition<_google_protobuf_FieldDescriptorProto, _google_protobuf_FieldDescriptorProto__Output>
      FieldOptions: MessageTypeDefinition<_google_protobuf_FieldOptions, _google_protobuf_FieldOptions__Output>
      FileDescriptorProto: MessageTypeDefinition<_google_protobuf_FileDescriptorProto, _google_protobuf_FileDescriptorProto__Output>
      FileDescriptorSet: MessageTypeDefinition<_google_protobuf_FileDescriptorSet, _google_protobuf_FileDescriptorSet__Output>
      FileOptions: MessageTypeDefinition<_google_protobuf_FileOptions, _google_protobuf_FileOptions__Output>
      FloatValue: MessageTypeDefinition<_google_protobuf_FloatValue, _google_protobuf_FloatValue__Output>
      GeneratedCodeInfo: MessageTypeDefinition<_google_protobuf_GeneratedCodeInfo, _google_protobuf_GeneratedCodeInfo__Output>
      Int32Value: MessageTypeDefinition<_google_protobuf_Int32Value, _google_protobuf_Int32Value__Output>
      Int64Value: MessageTypeDefinition<_google_protobuf_Int64Value, _google_protobuf_Int64Value__Output>
      ListValue: MessageTypeDefinition<_google_protobuf_ListValue, _google_protobuf_ListValue__Output>
      MessageOptions: MessageTypeDefinition<_google_protobuf_MessageOptions, _google_protobuf_MessageOptions__Output>
      MethodDescriptorProto: MessageTypeDefinition<_google_protobuf_MethodDescriptorProto, _google_protobuf_MethodDescriptorProto__Output>
      MethodOptions: MessageTypeDefinition<_google_protobuf_MethodOptions, _google_protobuf_MethodOptions__Output>
      NullValue: EnumTypeDefinition
      OneofDescriptorProto: MessageTypeDefinition<_google_protobuf_OneofDescriptorProto, _google_protobuf_OneofDescriptorProto__Output>
      OneofOptions: MessageTypeDefinition<_google_protobuf_OneofOptions, _google_protobuf_OneofOptions__Output>
      ServiceDescriptorProto: MessageTypeDefinition<_google_protobuf_ServiceDescriptorProto, _google_protobuf_ServiceDescriptorProto__Output>
      ServiceOptions: MessageTypeDefinition<_google_protobuf_ServiceOptions, _google_protobuf_ServiceOptions__Output>
      SourceCodeInfo: MessageTypeDefinition<_google_protobuf_SourceCodeInfo, _google_protobuf_SourceCodeInfo__Output>
      StringValue: MessageTypeDefinition<_google_protobuf_StringValue, _google_protobuf_StringValue__Output>
      Struct: MessageTypeDefinition<_google_protobuf_Struct, _google_protobuf_Struct__Output>
      SymbolVisibility: EnumTypeDefinition
      Timestamp: MessageTypeDefinition<_google_protobuf_Timestamp, _google_protobuf_Timestamp__Output>
      UInt32Value: MessageTypeDefinition<_google_protobuf_UInt32Value, _google_protobuf_UInt32Value__Output>
      UInt64Value: MessageTypeDefinition<_google_protobuf_UInt64Value, _google_protobuf_UInt64Value__Output>
      UninterpretedOption: MessageTypeDefinition<_google_protobuf_UninterpretedOption, _google_protobuf_UninterpretedOption__Output>
      Value: MessageTypeDefinition<_google_protobuf_Value, _google_protobuf_Value__Output>
    }
  }
  udpa: {
    annotations: {
      FieldMigrateAnnotation: MessageTypeDefinition<_udpa_annotations_FieldMigrateAnnotation, _udpa_annotations_FieldMigrateAnnotation__Output>
      FileMigrateAnnotation: MessageTypeDefinition<_udpa_annotations_FileMigrateAnnotation, _udpa_annotations_FileMigrateAnnotation__Output>
      MigrateAnnotation: MessageTypeDefinition<_udpa_annotations_MigrateAnnotation, _udpa_annotations_MigrateAnnotation__Output>
      PackageVersionStatus: EnumTypeDefinition
      StatusAnnotation: MessageTypeDefinition<_udpa_annotations_StatusAnnotation, _udpa_annotations_StatusAnnotation__Output>
      VersioningAnnotation: MessageTypeDefinition<_udpa_annotations_VersioningAnnotation, _udpa_annotations_VersioningAnnotation__Output>
    }
  }
  validate: {
    AnyRules: MessageTypeDefinition<_validate_AnyRules, _validate_AnyRules__Output>
    BoolRules: MessageTypeDefinition<_validate_BoolRules, _validate_BoolRules__Output>
    BytesRules: MessageTypeDefinition<_validate_BytesRules, _validate_BytesRules__Output>
    DoubleRules: MessageTypeDefinition<_validate_DoubleRules, _validate_DoubleRules__Output>
    DurationRules: MessageTypeDefinition<_validate_DurationRules, _validate_DurationRules__Output>
    EnumRules: MessageTypeDefinition<_validate_EnumRules, _validate_EnumRules__Output>
    FieldRules: MessageTypeDefinition<_validate_FieldRules, _validate_FieldRules__Output>
    Fixed32Rules: MessageTypeDefinition<_validate_Fixed32Rules, _validate_Fixed32Rules__Output>
    Fixed64Rules: MessageTypeDefinition<_validate_Fixed64Rules, _validate_Fixed64Rules__Output>
    FloatRules: MessageTypeDefinition<_validate_FloatRules, _validate_FloatRules__Output>
    Int32Rules: MessageTypeDefinition<_validate_Int32Rules, _validate_Int32Rules__Output>
    Int64Rules: MessageTypeDefinition<_validate_Int64Rules, _validate_Int64Rules__Output>
    KnownRegex: EnumTypeDefinition
    MapRules: MessageTypeDefinition<_validate_MapRules, _validate_MapRules__Output>
    MessageRules: MessageTypeDefinition<_validate_MessageRules, _validate_MessageRules__Output>
    RepeatedRules: MessageTypeDefinition<_validate_RepeatedRules, _validate_RepeatedRules__Output>
    SFixed32Rules: MessageTypeDefinition<_validate_SFixed32Rules, _validate_SFixed32Rules__Output>
    SFixed64Rules: MessageTypeDefinition<_validate_SFixed64Rules, _validate_SFixed64Rules__Output>
    SInt32Rules: MessageTypeDefinition<_validate_SInt32Rules, _validate_SInt32Rules__Output>
    SInt64Rules: MessageTypeDefinition<_validate_SInt64Rules, _validate_SInt64Rules__Output>
    StringRules: MessageTypeDefinition<_validate_StringRules, _validate_StringRules__Output>
    TimestampRules: MessageTypeDefinition<_validate_TimestampRules, _validate_TimestampRules__Output>
    UInt32Rules: MessageTypeDefinition<_validate_UInt32Rules, _validate_UInt32Rules__Output>
    UInt64Rules: MessageTypeDefinition<_validate_UInt64Rules, _validate_UInt64Rules__Output>
  }
  xds: {
    annotations: {
      v3: {
        FieldStatusAnnotation: MessageTypeDefinition<_xds_annotations_v3_FieldStatusAnnotation, _xds_annotations_v3_FieldStatusAnnotation__Output>
        FileStatusAnnotation: MessageTypeDefinition<_xds_annotations_v3_FileStatusAnnotation, _xds_annotations_v3_FileStatusAnnotation__Output>
        MessageStatusAnnotation: MessageTypeDefinition<_xds_annotations_v3_MessageStatusAnnotation, _xds_annotations_v3_MessageStatusAnnotation__Output>
        PackageVersionStatus: EnumTypeDefinition
        StatusAnnotation: MessageTypeDefinition<_xds_annotations_v3_StatusAnnotation, _xds_annotations_v3_StatusAnnotation__Output>
      }
    }
    core: {
      v3: {
        ContextParams: MessageTypeDefinition<_xds_core_v3_ContextParams, _xds_core_v3_ContextParams__Output>
        TypedExtensionConfig: MessageTypeDefinition<_xds_core_v3_TypedExtensionConfig, _xds_core_v3_TypedExtensionConfig__Output>
      }
    }
    type: {
      matcher: {
        v3: {
          ListStringMatcher: MessageTypeDefinition<_xds_type_matcher_v3_ListStringMatcher, _xds_type_matcher_v3_ListStringMatcher__Output>
          Matcher: MessageTypeDefinition<_xds_type_matcher_v3_Matcher, _xds_type_matcher_v3_Matcher__Output>
          RegexMatcher: MessageTypeDefinition<_xds_type_matcher_v3_RegexMatcher, _xds_type_matcher_v3_RegexMatcher__Output>
          StringMatcher: MessageTypeDefinition<_xds_type_matcher_v3_StringMatcher, _xds_type_matcher_v3_StringMatcher__Output>
        }
      }
    }
  }
}

