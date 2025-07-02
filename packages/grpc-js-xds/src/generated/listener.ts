import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { AccessLog as _envoy_config_accesslog_v3_AccessLog, AccessLog__Output as _envoy_config_accesslog_v3_AccessLog__Output } from './envoy/config/accesslog/v3/AccessLog';
import type { AccessLogFilter as _envoy_config_accesslog_v3_AccessLogFilter, AccessLogFilter__Output as _envoy_config_accesslog_v3_AccessLogFilter__Output } from './envoy/config/accesslog/v3/AccessLogFilter';
import type { AndFilter as _envoy_config_accesslog_v3_AndFilter, AndFilter__Output as _envoy_config_accesslog_v3_AndFilter__Output } from './envoy/config/accesslog/v3/AndFilter';
import type { ComparisonFilter as _envoy_config_accesslog_v3_ComparisonFilter, ComparisonFilter__Output as _envoy_config_accesslog_v3_ComparisonFilter__Output } from './envoy/config/accesslog/v3/ComparisonFilter';
import type { DurationFilter as _envoy_config_accesslog_v3_DurationFilter, DurationFilter__Output as _envoy_config_accesslog_v3_DurationFilter__Output } from './envoy/config/accesslog/v3/DurationFilter';
import type { ExtensionFilter as _envoy_config_accesslog_v3_ExtensionFilter, ExtensionFilter__Output as _envoy_config_accesslog_v3_ExtensionFilter__Output } from './envoy/config/accesslog/v3/ExtensionFilter';
import type { GrpcStatusFilter as _envoy_config_accesslog_v3_GrpcStatusFilter, GrpcStatusFilter__Output as _envoy_config_accesslog_v3_GrpcStatusFilter__Output } from './envoy/config/accesslog/v3/GrpcStatusFilter';
import type { HeaderFilter as _envoy_config_accesslog_v3_HeaderFilter, HeaderFilter__Output as _envoy_config_accesslog_v3_HeaderFilter__Output } from './envoy/config/accesslog/v3/HeaderFilter';
import type { LogTypeFilter as _envoy_config_accesslog_v3_LogTypeFilter, LogTypeFilter__Output as _envoy_config_accesslog_v3_LogTypeFilter__Output } from './envoy/config/accesslog/v3/LogTypeFilter';
import type { MetadataFilter as _envoy_config_accesslog_v3_MetadataFilter, MetadataFilter__Output as _envoy_config_accesslog_v3_MetadataFilter__Output } from './envoy/config/accesslog/v3/MetadataFilter';
import type { NotHealthCheckFilter as _envoy_config_accesslog_v3_NotHealthCheckFilter, NotHealthCheckFilter__Output as _envoy_config_accesslog_v3_NotHealthCheckFilter__Output } from './envoy/config/accesslog/v3/NotHealthCheckFilter';
import type { OrFilter as _envoy_config_accesslog_v3_OrFilter, OrFilter__Output as _envoy_config_accesslog_v3_OrFilter__Output } from './envoy/config/accesslog/v3/OrFilter';
import type { ResponseFlagFilter as _envoy_config_accesslog_v3_ResponseFlagFilter, ResponseFlagFilter__Output as _envoy_config_accesslog_v3_ResponseFlagFilter__Output } from './envoy/config/accesslog/v3/ResponseFlagFilter';
import type { RuntimeFilter as _envoy_config_accesslog_v3_RuntimeFilter, RuntimeFilter__Output as _envoy_config_accesslog_v3_RuntimeFilter__Output } from './envoy/config/accesslog/v3/RuntimeFilter';
import type { StatusCodeFilter as _envoy_config_accesslog_v3_StatusCodeFilter, StatusCodeFilter__Output as _envoy_config_accesslog_v3_StatusCodeFilter__Output } from './envoy/config/accesslog/v3/StatusCodeFilter';
import type { TraceableFilter as _envoy_config_accesslog_v3_TraceableFilter, TraceableFilter__Output as _envoy_config_accesslog_v3_TraceableFilter__Output } from './envoy/config/accesslog/v3/TraceableFilter';
import type { Address as _envoy_config_core_v3_Address, Address__Output as _envoy_config_core_v3_Address__Output } from './envoy/config/core/v3/Address';
import type { AggregatedConfigSource as _envoy_config_core_v3_AggregatedConfigSource, AggregatedConfigSource__Output as _envoy_config_core_v3_AggregatedConfigSource__Output } from './envoy/config/core/v3/AggregatedConfigSource';
import type { AlternateProtocolsCacheOptions as _envoy_config_core_v3_AlternateProtocolsCacheOptions, AlternateProtocolsCacheOptions__Output as _envoy_config_core_v3_AlternateProtocolsCacheOptions__Output } from './envoy/config/core/v3/AlternateProtocolsCacheOptions';
import type { ApiConfigSource as _envoy_config_core_v3_ApiConfigSource, ApiConfigSource__Output as _envoy_config_core_v3_ApiConfigSource__Output } from './envoy/config/core/v3/ApiConfigSource';
import type { AsyncDataSource as _envoy_config_core_v3_AsyncDataSource, AsyncDataSource__Output as _envoy_config_core_v3_AsyncDataSource__Output } from './envoy/config/core/v3/AsyncDataSource';
import type { BackoffStrategy as _envoy_config_core_v3_BackoffStrategy, BackoffStrategy__Output as _envoy_config_core_v3_BackoffStrategy__Output } from './envoy/config/core/v3/BackoffStrategy';
import type { BindConfig as _envoy_config_core_v3_BindConfig, BindConfig__Output as _envoy_config_core_v3_BindConfig__Output } from './envoy/config/core/v3/BindConfig';
import type { BuildVersion as _envoy_config_core_v3_BuildVersion, BuildVersion__Output as _envoy_config_core_v3_BuildVersion__Output } from './envoy/config/core/v3/BuildVersion';
import type { CidrRange as _envoy_config_core_v3_CidrRange, CidrRange__Output as _envoy_config_core_v3_CidrRange__Output } from './envoy/config/core/v3/CidrRange';
import type { ConfigSource as _envoy_config_core_v3_ConfigSource, ConfigSource__Output as _envoy_config_core_v3_ConfigSource__Output } from './envoy/config/core/v3/ConfigSource';
import type { ControlPlane as _envoy_config_core_v3_ControlPlane, ControlPlane__Output as _envoy_config_core_v3_ControlPlane__Output } from './envoy/config/core/v3/ControlPlane';
import type { DataSource as _envoy_config_core_v3_DataSource, DataSource__Output as _envoy_config_core_v3_DataSource__Output } from './envoy/config/core/v3/DataSource';
import type { EnvoyInternalAddress as _envoy_config_core_v3_EnvoyInternalAddress, EnvoyInternalAddress__Output as _envoy_config_core_v3_EnvoyInternalAddress__Output } from './envoy/config/core/v3/EnvoyInternalAddress';
import type { Extension as _envoy_config_core_v3_Extension, Extension__Output as _envoy_config_core_v3_Extension__Output } from './envoy/config/core/v3/Extension';
import type { ExtensionConfigSource as _envoy_config_core_v3_ExtensionConfigSource, ExtensionConfigSource__Output as _envoy_config_core_v3_ExtensionConfigSource__Output } from './envoy/config/core/v3/ExtensionConfigSource';
import type { ExtraSourceAddress as _envoy_config_core_v3_ExtraSourceAddress, ExtraSourceAddress__Output as _envoy_config_core_v3_ExtraSourceAddress__Output } from './envoy/config/core/v3/ExtraSourceAddress';
import type { GrpcProtocolOptions as _envoy_config_core_v3_GrpcProtocolOptions, GrpcProtocolOptions__Output as _envoy_config_core_v3_GrpcProtocolOptions__Output } from './envoy/config/core/v3/GrpcProtocolOptions';
import type { GrpcService as _envoy_config_core_v3_GrpcService, GrpcService__Output as _envoy_config_core_v3_GrpcService__Output } from './envoy/config/core/v3/GrpcService';
import type { HeaderMap as _envoy_config_core_v3_HeaderMap, HeaderMap__Output as _envoy_config_core_v3_HeaderMap__Output } from './envoy/config/core/v3/HeaderMap';
import type { HeaderValue as _envoy_config_core_v3_HeaderValue, HeaderValue__Output as _envoy_config_core_v3_HeaderValue__Output } from './envoy/config/core/v3/HeaderValue';
import type { HeaderValueOption as _envoy_config_core_v3_HeaderValueOption, HeaderValueOption__Output as _envoy_config_core_v3_HeaderValueOption__Output } from './envoy/config/core/v3/HeaderValueOption';
import type { Http1ProtocolOptions as _envoy_config_core_v3_Http1ProtocolOptions, Http1ProtocolOptions__Output as _envoy_config_core_v3_Http1ProtocolOptions__Output } from './envoy/config/core/v3/Http1ProtocolOptions';
import type { Http2ProtocolOptions as _envoy_config_core_v3_Http2ProtocolOptions, Http2ProtocolOptions__Output as _envoy_config_core_v3_Http2ProtocolOptions__Output } from './envoy/config/core/v3/Http2ProtocolOptions';
import type { Http3ProtocolOptions as _envoy_config_core_v3_Http3ProtocolOptions, Http3ProtocolOptions__Output as _envoy_config_core_v3_Http3ProtocolOptions__Output } from './envoy/config/core/v3/Http3ProtocolOptions';
import type { HttpProtocolOptions as _envoy_config_core_v3_HttpProtocolOptions, HttpProtocolOptions__Output as _envoy_config_core_v3_HttpProtocolOptions__Output } from './envoy/config/core/v3/HttpProtocolOptions';
import type { HttpUri as _envoy_config_core_v3_HttpUri, HttpUri__Output as _envoy_config_core_v3_HttpUri__Output } from './envoy/config/core/v3/HttpUri';
import type { KeepaliveSettings as _envoy_config_core_v3_KeepaliveSettings, KeepaliveSettings__Output as _envoy_config_core_v3_KeepaliveSettings__Output } from './envoy/config/core/v3/KeepaliveSettings';
import type { KeyValue as _envoy_config_core_v3_KeyValue, KeyValue__Output as _envoy_config_core_v3_KeyValue__Output } from './envoy/config/core/v3/KeyValue';
import type { KeyValueAppend as _envoy_config_core_v3_KeyValueAppend, KeyValueAppend__Output as _envoy_config_core_v3_KeyValueAppend__Output } from './envoy/config/core/v3/KeyValueAppend';
import type { KeyValueMutation as _envoy_config_core_v3_KeyValueMutation, KeyValueMutation__Output as _envoy_config_core_v3_KeyValueMutation__Output } from './envoy/config/core/v3/KeyValueMutation';
import type { Locality as _envoy_config_core_v3_Locality, Locality__Output as _envoy_config_core_v3_Locality__Output } from './envoy/config/core/v3/Locality';
import type { Metadata as _envoy_config_core_v3_Metadata, Metadata__Output as _envoy_config_core_v3_Metadata__Output } from './envoy/config/core/v3/Metadata';
import type { Node as _envoy_config_core_v3_Node, Node__Output as _envoy_config_core_v3_Node__Output } from './envoy/config/core/v3/Node';
import type { PathConfigSource as _envoy_config_core_v3_PathConfigSource, PathConfigSource__Output as _envoy_config_core_v3_PathConfigSource__Output } from './envoy/config/core/v3/PathConfigSource';
import type { Pipe as _envoy_config_core_v3_Pipe, Pipe__Output as _envoy_config_core_v3_Pipe__Output } from './envoy/config/core/v3/Pipe';
import type { ProxyProtocolConfig as _envoy_config_core_v3_ProxyProtocolConfig, ProxyProtocolConfig__Output as _envoy_config_core_v3_ProxyProtocolConfig__Output } from './envoy/config/core/v3/ProxyProtocolConfig';
import type { ProxyProtocolPassThroughTLVs as _envoy_config_core_v3_ProxyProtocolPassThroughTLVs, ProxyProtocolPassThroughTLVs__Output as _envoy_config_core_v3_ProxyProtocolPassThroughTLVs__Output } from './envoy/config/core/v3/ProxyProtocolPassThroughTLVs';
import type { QueryParameter as _envoy_config_core_v3_QueryParameter, QueryParameter__Output as _envoy_config_core_v3_QueryParameter__Output } from './envoy/config/core/v3/QueryParameter';
import type { QuicKeepAliveSettings as _envoy_config_core_v3_QuicKeepAliveSettings, QuicKeepAliveSettings__Output as _envoy_config_core_v3_QuicKeepAliveSettings__Output } from './envoy/config/core/v3/QuicKeepAliveSettings';
import type { QuicProtocolOptions as _envoy_config_core_v3_QuicProtocolOptions, QuicProtocolOptions__Output as _envoy_config_core_v3_QuicProtocolOptions__Output } from './envoy/config/core/v3/QuicProtocolOptions';
import type { RateLimitSettings as _envoy_config_core_v3_RateLimitSettings, RateLimitSettings__Output as _envoy_config_core_v3_RateLimitSettings__Output } from './envoy/config/core/v3/RateLimitSettings';
import type { RemoteDataSource as _envoy_config_core_v3_RemoteDataSource, RemoteDataSource__Output as _envoy_config_core_v3_RemoteDataSource__Output } from './envoy/config/core/v3/RemoteDataSource';
import type { RetryPolicy as _envoy_config_core_v3_RetryPolicy, RetryPolicy__Output as _envoy_config_core_v3_RetryPolicy__Output } from './envoy/config/core/v3/RetryPolicy';
import type { RuntimeDouble as _envoy_config_core_v3_RuntimeDouble, RuntimeDouble__Output as _envoy_config_core_v3_RuntimeDouble__Output } from './envoy/config/core/v3/RuntimeDouble';
import type { RuntimeFeatureFlag as _envoy_config_core_v3_RuntimeFeatureFlag, RuntimeFeatureFlag__Output as _envoy_config_core_v3_RuntimeFeatureFlag__Output } from './envoy/config/core/v3/RuntimeFeatureFlag';
import type { RuntimeFractionalPercent as _envoy_config_core_v3_RuntimeFractionalPercent, RuntimeFractionalPercent__Output as _envoy_config_core_v3_RuntimeFractionalPercent__Output } from './envoy/config/core/v3/RuntimeFractionalPercent';
import type { RuntimePercent as _envoy_config_core_v3_RuntimePercent, RuntimePercent__Output as _envoy_config_core_v3_RuntimePercent__Output } from './envoy/config/core/v3/RuntimePercent';
import type { RuntimeUInt32 as _envoy_config_core_v3_RuntimeUInt32, RuntimeUInt32__Output as _envoy_config_core_v3_RuntimeUInt32__Output } from './envoy/config/core/v3/RuntimeUInt32';
import type { SchemeHeaderTransformation as _envoy_config_core_v3_SchemeHeaderTransformation, SchemeHeaderTransformation__Output as _envoy_config_core_v3_SchemeHeaderTransformation__Output } from './envoy/config/core/v3/SchemeHeaderTransformation';
import type { SelfConfigSource as _envoy_config_core_v3_SelfConfigSource, SelfConfigSource__Output as _envoy_config_core_v3_SelfConfigSource__Output } from './envoy/config/core/v3/SelfConfigSource';
import type { SocketAddress as _envoy_config_core_v3_SocketAddress, SocketAddress__Output as _envoy_config_core_v3_SocketAddress__Output } from './envoy/config/core/v3/SocketAddress';
import type { SocketOption as _envoy_config_core_v3_SocketOption, SocketOption__Output as _envoy_config_core_v3_SocketOption__Output } from './envoy/config/core/v3/SocketOption';
import type { SocketOptionsOverride as _envoy_config_core_v3_SocketOptionsOverride, SocketOptionsOverride__Output as _envoy_config_core_v3_SocketOptionsOverride__Output } from './envoy/config/core/v3/SocketOptionsOverride';
import type { TcpKeepalive as _envoy_config_core_v3_TcpKeepalive, TcpKeepalive__Output as _envoy_config_core_v3_TcpKeepalive__Output } from './envoy/config/core/v3/TcpKeepalive';
import type { TcpProtocolOptions as _envoy_config_core_v3_TcpProtocolOptions, TcpProtocolOptions__Output as _envoy_config_core_v3_TcpProtocolOptions__Output } from './envoy/config/core/v3/TcpProtocolOptions';
import type { TransportSocket as _envoy_config_core_v3_TransportSocket, TransportSocket__Output as _envoy_config_core_v3_TransportSocket__Output } from './envoy/config/core/v3/TransportSocket';
import type { TypedExtensionConfig as _envoy_config_core_v3_TypedExtensionConfig, TypedExtensionConfig__Output as _envoy_config_core_v3_TypedExtensionConfig__Output } from './envoy/config/core/v3/TypedExtensionConfig';
import type { UdpSocketConfig as _envoy_config_core_v3_UdpSocketConfig, UdpSocketConfig__Output as _envoy_config_core_v3_UdpSocketConfig__Output } from './envoy/config/core/v3/UdpSocketConfig';
import type { UpstreamHttpProtocolOptions as _envoy_config_core_v3_UpstreamHttpProtocolOptions, UpstreamHttpProtocolOptions__Output as _envoy_config_core_v3_UpstreamHttpProtocolOptions__Output } from './envoy/config/core/v3/UpstreamHttpProtocolOptions';
import type { WatchedDirectory as _envoy_config_core_v3_WatchedDirectory, WatchedDirectory__Output as _envoy_config_core_v3_WatchedDirectory__Output } from './envoy/config/core/v3/WatchedDirectory';
import type { ActiveRawUdpListenerConfig as _envoy_config_listener_v3_ActiveRawUdpListenerConfig, ActiveRawUdpListenerConfig__Output as _envoy_config_listener_v3_ActiveRawUdpListenerConfig__Output } from './envoy/config/listener/v3/ActiveRawUdpListenerConfig';
import type { AdditionalAddress as _envoy_config_listener_v3_AdditionalAddress, AdditionalAddress__Output as _envoy_config_listener_v3_AdditionalAddress__Output } from './envoy/config/listener/v3/AdditionalAddress';
import type { ApiListener as _envoy_config_listener_v3_ApiListener, ApiListener__Output as _envoy_config_listener_v3_ApiListener__Output } from './envoy/config/listener/v3/ApiListener';
import type { ApiListenerManager as _envoy_config_listener_v3_ApiListenerManager, ApiListenerManager__Output as _envoy_config_listener_v3_ApiListenerManager__Output } from './envoy/config/listener/v3/ApiListenerManager';
import type { Filter as _envoy_config_listener_v3_Filter, Filter__Output as _envoy_config_listener_v3_Filter__Output } from './envoy/config/listener/v3/Filter';
import type { FilterChain as _envoy_config_listener_v3_FilterChain, FilterChain__Output as _envoy_config_listener_v3_FilterChain__Output } from './envoy/config/listener/v3/FilterChain';
import type { FilterChainMatch as _envoy_config_listener_v3_FilterChainMatch, FilterChainMatch__Output as _envoy_config_listener_v3_FilterChainMatch__Output } from './envoy/config/listener/v3/FilterChainMatch';
import type { Listener as _envoy_config_listener_v3_Listener, Listener__Output as _envoy_config_listener_v3_Listener__Output } from './envoy/config/listener/v3/Listener';
import type { ListenerCollection as _envoy_config_listener_v3_ListenerCollection, ListenerCollection__Output as _envoy_config_listener_v3_ListenerCollection__Output } from './envoy/config/listener/v3/ListenerCollection';
import type { ListenerFilter as _envoy_config_listener_v3_ListenerFilter, ListenerFilter__Output as _envoy_config_listener_v3_ListenerFilter__Output } from './envoy/config/listener/v3/ListenerFilter';
import type { ListenerFilterChainMatchPredicate as _envoy_config_listener_v3_ListenerFilterChainMatchPredicate, ListenerFilterChainMatchPredicate__Output as _envoy_config_listener_v3_ListenerFilterChainMatchPredicate__Output } from './envoy/config/listener/v3/ListenerFilterChainMatchPredicate';
import type { ListenerManager as _envoy_config_listener_v3_ListenerManager, ListenerManager__Output as _envoy_config_listener_v3_ListenerManager__Output } from './envoy/config/listener/v3/ListenerManager';
import type { QuicProtocolOptions as _envoy_config_listener_v3_QuicProtocolOptions, QuicProtocolOptions__Output as _envoy_config_listener_v3_QuicProtocolOptions__Output } from './envoy/config/listener/v3/QuicProtocolOptions';
import type { UdpListenerConfig as _envoy_config_listener_v3_UdpListenerConfig, UdpListenerConfig__Output as _envoy_config_listener_v3_UdpListenerConfig__Output } from './envoy/config/listener/v3/UdpListenerConfig';
import type { ValidationListenerManager as _envoy_config_listener_v3_ValidationListenerManager, ValidationListenerManager__Output as _envoy_config_listener_v3_ValidationListenerManager__Output } from './envoy/config/listener/v3/ValidationListenerManager';
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
import type { AccessLogCommon as _envoy_data_accesslog_v3_AccessLogCommon, AccessLogCommon__Output as _envoy_data_accesslog_v3_AccessLogCommon__Output } from './envoy/data/accesslog/v3/AccessLogCommon';
import type { ConnectionProperties as _envoy_data_accesslog_v3_ConnectionProperties, ConnectionProperties__Output as _envoy_data_accesslog_v3_ConnectionProperties__Output } from './envoy/data/accesslog/v3/ConnectionProperties';
import type { HTTPAccessLogEntry as _envoy_data_accesslog_v3_HTTPAccessLogEntry, HTTPAccessLogEntry__Output as _envoy_data_accesslog_v3_HTTPAccessLogEntry__Output } from './envoy/data/accesslog/v3/HTTPAccessLogEntry';
import type { HTTPRequestProperties as _envoy_data_accesslog_v3_HTTPRequestProperties, HTTPRequestProperties__Output as _envoy_data_accesslog_v3_HTTPRequestProperties__Output } from './envoy/data/accesslog/v3/HTTPRequestProperties';
import type { HTTPResponseProperties as _envoy_data_accesslog_v3_HTTPResponseProperties, HTTPResponseProperties__Output as _envoy_data_accesslog_v3_HTTPResponseProperties__Output } from './envoy/data/accesslog/v3/HTTPResponseProperties';
import type { ResponseFlags as _envoy_data_accesslog_v3_ResponseFlags, ResponseFlags__Output as _envoy_data_accesslog_v3_ResponseFlags__Output } from './envoy/data/accesslog/v3/ResponseFlags';
import type { TCPAccessLogEntry as _envoy_data_accesslog_v3_TCPAccessLogEntry, TCPAccessLogEntry__Output as _envoy_data_accesslog_v3_TCPAccessLogEntry__Output } from './envoy/data/accesslog/v3/TCPAccessLogEntry';
import type { TLSProperties as _envoy_data_accesslog_v3_TLSProperties, TLSProperties__Output as _envoy_data_accesslog_v3_TLSProperties__Output } from './envoy/data/accesslog/v3/TLSProperties';
import type { DoubleMatcher as _envoy_type_matcher_v3_DoubleMatcher, DoubleMatcher__Output as _envoy_type_matcher_v3_DoubleMatcher__Output } from './envoy/type/matcher/v3/DoubleMatcher';
import type { ListMatcher as _envoy_type_matcher_v3_ListMatcher, ListMatcher__Output as _envoy_type_matcher_v3_ListMatcher__Output } from './envoy/type/matcher/v3/ListMatcher';
import type { ListStringMatcher as _envoy_type_matcher_v3_ListStringMatcher, ListStringMatcher__Output as _envoy_type_matcher_v3_ListStringMatcher__Output } from './envoy/type/matcher/v3/ListStringMatcher';
import type { MetadataMatcher as _envoy_type_matcher_v3_MetadataMatcher, MetadataMatcher__Output as _envoy_type_matcher_v3_MetadataMatcher__Output } from './envoy/type/matcher/v3/MetadataMatcher';
import type { OrMatcher as _envoy_type_matcher_v3_OrMatcher, OrMatcher__Output as _envoy_type_matcher_v3_OrMatcher__Output } from './envoy/type/matcher/v3/OrMatcher';
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
import type { FieldSecurityAnnotation as _udpa_annotations_FieldSecurityAnnotation, FieldSecurityAnnotation__Output as _udpa_annotations_FieldSecurityAnnotation__Output } from './udpa/annotations/FieldSecurityAnnotation';
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
import type { Authority as _xds_core_v3_Authority, Authority__Output as _xds_core_v3_Authority__Output } from './xds/core/v3/Authority';
import type { CollectionEntry as _xds_core_v3_CollectionEntry, CollectionEntry__Output as _xds_core_v3_CollectionEntry__Output } from './xds/core/v3/CollectionEntry';
import type { ContextParams as _xds_core_v3_ContextParams, ContextParams__Output as _xds_core_v3_ContextParams__Output } from './xds/core/v3/ContextParams';
import type { ResourceLocator as _xds_core_v3_ResourceLocator, ResourceLocator__Output as _xds_core_v3_ResourceLocator__Output } from './xds/core/v3/ResourceLocator';
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
      accesslog: {
        v3: {
          AccessLog: MessageTypeDefinition<_envoy_config_accesslog_v3_AccessLog, _envoy_config_accesslog_v3_AccessLog__Output>
          AccessLogFilter: MessageTypeDefinition<_envoy_config_accesslog_v3_AccessLogFilter, _envoy_config_accesslog_v3_AccessLogFilter__Output>
          AndFilter: MessageTypeDefinition<_envoy_config_accesslog_v3_AndFilter, _envoy_config_accesslog_v3_AndFilter__Output>
          ComparisonFilter: MessageTypeDefinition<_envoy_config_accesslog_v3_ComparisonFilter, _envoy_config_accesslog_v3_ComparisonFilter__Output>
          DurationFilter: MessageTypeDefinition<_envoy_config_accesslog_v3_DurationFilter, _envoy_config_accesslog_v3_DurationFilter__Output>
          ExtensionFilter: MessageTypeDefinition<_envoy_config_accesslog_v3_ExtensionFilter, _envoy_config_accesslog_v3_ExtensionFilter__Output>
          GrpcStatusFilter: MessageTypeDefinition<_envoy_config_accesslog_v3_GrpcStatusFilter, _envoy_config_accesslog_v3_GrpcStatusFilter__Output>
          HeaderFilter: MessageTypeDefinition<_envoy_config_accesslog_v3_HeaderFilter, _envoy_config_accesslog_v3_HeaderFilter__Output>
          LogTypeFilter: MessageTypeDefinition<_envoy_config_accesslog_v3_LogTypeFilter, _envoy_config_accesslog_v3_LogTypeFilter__Output>
          MetadataFilter: MessageTypeDefinition<_envoy_config_accesslog_v3_MetadataFilter, _envoy_config_accesslog_v3_MetadataFilter__Output>
          NotHealthCheckFilter: MessageTypeDefinition<_envoy_config_accesslog_v3_NotHealthCheckFilter, _envoy_config_accesslog_v3_NotHealthCheckFilter__Output>
          OrFilter: MessageTypeDefinition<_envoy_config_accesslog_v3_OrFilter, _envoy_config_accesslog_v3_OrFilter__Output>
          ResponseFlagFilter: MessageTypeDefinition<_envoy_config_accesslog_v3_ResponseFlagFilter, _envoy_config_accesslog_v3_ResponseFlagFilter__Output>
          RuntimeFilter: MessageTypeDefinition<_envoy_config_accesslog_v3_RuntimeFilter, _envoy_config_accesslog_v3_RuntimeFilter__Output>
          StatusCodeFilter: MessageTypeDefinition<_envoy_config_accesslog_v3_StatusCodeFilter, _envoy_config_accesslog_v3_StatusCodeFilter__Output>
          TraceableFilter: MessageTypeDefinition<_envoy_config_accesslog_v3_TraceableFilter, _envoy_config_accesslog_v3_TraceableFilter__Output>
        }
      }
      core: {
        v3: {
          Address: MessageTypeDefinition<_envoy_config_core_v3_Address, _envoy_config_core_v3_Address__Output>
          AggregatedConfigSource: MessageTypeDefinition<_envoy_config_core_v3_AggregatedConfigSource, _envoy_config_core_v3_AggregatedConfigSource__Output>
          AlternateProtocolsCacheOptions: MessageTypeDefinition<_envoy_config_core_v3_AlternateProtocolsCacheOptions, _envoy_config_core_v3_AlternateProtocolsCacheOptions__Output>
          ApiConfigSource: MessageTypeDefinition<_envoy_config_core_v3_ApiConfigSource, _envoy_config_core_v3_ApiConfigSource__Output>
          ApiVersion: EnumTypeDefinition
          AsyncDataSource: MessageTypeDefinition<_envoy_config_core_v3_AsyncDataSource, _envoy_config_core_v3_AsyncDataSource__Output>
          BackoffStrategy: MessageTypeDefinition<_envoy_config_core_v3_BackoffStrategy, _envoy_config_core_v3_BackoffStrategy__Output>
          BindConfig: MessageTypeDefinition<_envoy_config_core_v3_BindConfig, _envoy_config_core_v3_BindConfig__Output>
          BuildVersion: MessageTypeDefinition<_envoy_config_core_v3_BuildVersion, _envoy_config_core_v3_BuildVersion__Output>
          CidrRange: MessageTypeDefinition<_envoy_config_core_v3_CidrRange, _envoy_config_core_v3_CidrRange__Output>
          ConfigSource: MessageTypeDefinition<_envoy_config_core_v3_ConfigSource, _envoy_config_core_v3_ConfigSource__Output>
          ControlPlane: MessageTypeDefinition<_envoy_config_core_v3_ControlPlane, _envoy_config_core_v3_ControlPlane__Output>
          DataSource: MessageTypeDefinition<_envoy_config_core_v3_DataSource, _envoy_config_core_v3_DataSource__Output>
          EnvoyInternalAddress: MessageTypeDefinition<_envoy_config_core_v3_EnvoyInternalAddress, _envoy_config_core_v3_EnvoyInternalAddress__Output>
          Extension: MessageTypeDefinition<_envoy_config_core_v3_Extension, _envoy_config_core_v3_Extension__Output>
          ExtensionConfigSource: MessageTypeDefinition<_envoy_config_core_v3_ExtensionConfigSource, _envoy_config_core_v3_ExtensionConfigSource__Output>
          ExtraSourceAddress: MessageTypeDefinition<_envoy_config_core_v3_ExtraSourceAddress, _envoy_config_core_v3_ExtraSourceAddress__Output>
          GrpcProtocolOptions: MessageTypeDefinition<_envoy_config_core_v3_GrpcProtocolOptions, _envoy_config_core_v3_GrpcProtocolOptions__Output>
          GrpcService: MessageTypeDefinition<_envoy_config_core_v3_GrpcService, _envoy_config_core_v3_GrpcService__Output>
          HeaderMap: MessageTypeDefinition<_envoy_config_core_v3_HeaderMap, _envoy_config_core_v3_HeaderMap__Output>
          HeaderValue: MessageTypeDefinition<_envoy_config_core_v3_HeaderValue, _envoy_config_core_v3_HeaderValue__Output>
          HeaderValueOption: MessageTypeDefinition<_envoy_config_core_v3_HeaderValueOption, _envoy_config_core_v3_HeaderValueOption__Output>
          Http1ProtocolOptions: MessageTypeDefinition<_envoy_config_core_v3_Http1ProtocolOptions, _envoy_config_core_v3_Http1ProtocolOptions__Output>
          Http2ProtocolOptions: MessageTypeDefinition<_envoy_config_core_v3_Http2ProtocolOptions, _envoy_config_core_v3_Http2ProtocolOptions__Output>
          Http3ProtocolOptions: MessageTypeDefinition<_envoy_config_core_v3_Http3ProtocolOptions, _envoy_config_core_v3_Http3ProtocolOptions__Output>
          HttpProtocolOptions: MessageTypeDefinition<_envoy_config_core_v3_HttpProtocolOptions, _envoy_config_core_v3_HttpProtocolOptions__Output>
          HttpUri: MessageTypeDefinition<_envoy_config_core_v3_HttpUri, _envoy_config_core_v3_HttpUri__Output>
          KeepaliveSettings: MessageTypeDefinition<_envoy_config_core_v3_KeepaliveSettings, _envoy_config_core_v3_KeepaliveSettings__Output>
          KeyValue: MessageTypeDefinition<_envoy_config_core_v3_KeyValue, _envoy_config_core_v3_KeyValue__Output>
          KeyValueAppend: MessageTypeDefinition<_envoy_config_core_v3_KeyValueAppend, _envoy_config_core_v3_KeyValueAppend__Output>
          KeyValueMutation: MessageTypeDefinition<_envoy_config_core_v3_KeyValueMutation, _envoy_config_core_v3_KeyValueMutation__Output>
          Locality: MessageTypeDefinition<_envoy_config_core_v3_Locality, _envoy_config_core_v3_Locality__Output>
          Metadata: MessageTypeDefinition<_envoy_config_core_v3_Metadata, _envoy_config_core_v3_Metadata__Output>
          Node: MessageTypeDefinition<_envoy_config_core_v3_Node, _envoy_config_core_v3_Node__Output>
          PathConfigSource: MessageTypeDefinition<_envoy_config_core_v3_PathConfigSource, _envoy_config_core_v3_PathConfigSource__Output>
          Pipe: MessageTypeDefinition<_envoy_config_core_v3_Pipe, _envoy_config_core_v3_Pipe__Output>
          ProxyProtocolConfig: MessageTypeDefinition<_envoy_config_core_v3_ProxyProtocolConfig, _envoy_config_core_v3_ProxyProtocolConfig__Output>
          ProxyProtocolPassThroughTLVs: MessageTypeDefinition<_envoy_config_core_v3_ProxyProtocolPassThroughTLVs, _envoy_config_core_v3_ProxyProtocolPassThroughTLVs__Output>
          QueryParameter: MessageTypeDefinition<_envoy_config_core_v3_QueryParameter, _envoy_config_core_v3_QueryParameter__Output>
          QuicKeepAliveSettings: MessageTypeDefinition<_envoy_config_core_v3_QuicKeepAliveSettings, _envoy_config_core_v3_QuicKeepAliveSettings__Output>
          QuicProtocolOptions: MessageTypeDefinition<_envoy_config_core_v3_QuicProtocolOptions, _envoy_config_core_v3_QuicProtocolOptions__Output>
          RateLimitSettings: MessageTypeDefinition<_envoy_config_core_v3_RateLimitSettings, _envoy_config_core_v3_RateLimitSettings__Output>
          RemoteDataSource: MessageTypeDefinition<_envoy_config_core_v3_RemoteDataSource, _envoy_config_core_v3_RemoteDataSource__Output>
          RequestMethod: EnumTypeDefinition
          RetryPolicy: MessageTypeDefinition<_envoy_config_core_v3_RetryPolicy, _envoy_config_core_v3_RetryPolicy__Output>
          RoutingPriority: EnumTypeDefinition
          RuntimeDouble: MessageTypeDefinition<_envoy_config_core_v3_RuntimeDouble, _envoy_config_core_v3_RuntimeDouble__Output>
          RuntimeFeatureFlag: MessageTypeDefinition<_envoy_config_core_v3_RuntimeFeatureFlag, _envoy_config_core_v3_RuntimeFeatureFlag__Output>
          RuntimeFractionalPercent: MessageTypeDefinition<_envoy_config_core_v3_RuntimeFractionalPercent, _envoy_config_core_v3_RuntimeFractionalPercent__Output>
          RuntimePercent: MessageTypeDefinition<_envoy_config_core_v3_RuntimePercent, _envoy_config_core_v3_RuntimePercent__Output>
          RuntimeUInt32: MessageTypeDefinition<_envoy_config_core_v3_RuntimeUInt32, _envoy_config_core_v3_RuntimeUInt32__Output>
          SchemeHeaderTransformation: MessageTypeDefinition<_envoy_config_core_v3_SchemeHeaderTransformation, _envoy_config_core_v3_SchemeHeaderTransformation__Output>
          SelfConfigSource: MessageTypeDefinition<_envoy_config_core_v3_SelfConfigSource, _envoy_config_core_v3_SelfConfigSource__Output>
          SocketAddress: MessageTypeDefinition<_envoy_config_core_v3_SocketAddress, _envoy_config_core_v3_SocketAddress__Output>
          SocketOption: MessageTypeDefinition<_envoy_config_core_v3_SocketOption, _envoy_config_core_v3_SocketOption__Output>
          SocketOptionsOverride: MessageTypeDefinition<_envoy_config_core_v3_SocketOptionsOverride, _envoy_config_core_v3_SocketOptionsOverride__Output>
          TcpKeepalive: MessageTypeDefinition<_envoy_config_core_v3_TcpKeepalive, _envoy_config_core_v3_TcpKeepalive__Output>
          TcpProtocolOptions: MessageTypeDefinition<_envoy_config_core_v3_TcpProtocolOptions, _envoy_config_core_v3_TcpProtocolOptions__Output>
          TrafficDirection: EnumTypeDefinition
          TransportSocket: MessageTypeDefinition<_envoy_config_core_v3_TransportSocket, _envoy_config_core_v3_TransportSocket__Output>
          TypedExtensionConfig: MessageTypeDefinition<_envoy_config_core_v3_TypedExtensionConfig, _envoy_config_core_v3_TypedExtensionConfig__Output>
          UdpSocketConfig: MessageTypeDefinition<_envoy_config_core_v3_UdpSocketConfig, _envoy_config_core_v3_UdpSocketConfig__Output>
          UpstreamHttpProtocolOptions: MessageTypeDefinition<_envoy_config_core_v3_UpstreamHttpProtocolOptions, _envoy_config_core_v3_UpstreamHttpProtocolOptions__Output>
          WatchedDirectory: MessageTypeDefinition<_envoy_config_core_v3_WatchedDirectory, _envoy_config_core_v3_WatchedDirectory__Output>
        }
      }
      listener: {
        v3: {
          ActiveRawUdpListenerConfig: MessageTypeDefinition<_envoy_config_listener_v3_ActiveRawUdpListenerConfig, _envoy_config_listener_v3_ActiveRawUdpListenerConfig__Output>
          AdditionalAddress: MessageTypeDefinition<_envoy_config_listener_v3_AdditionalAddress, _envoy_config_listener_v3_AdditionalAddress__Output>
          ApiListener: MessageTypeDefinition<_envoy_config_listener_v3_ApiListener, _envoy_config_listener_v3_ApiListener__Output>
          ApiListenerManager: MessageTypeDefinition<_envoy_config_listener_v3_ApiListenerManager, _envoy_config_listener_v3_ApiListenerManager__Output>
          Filter: MessageTypeDefinition<_envoy_config_listener_v3_Filter, _envoy_config_listener_v3_Filter__Output>
          FilterChain: MessageTypeDefinition<_envoy_config_listener_v3_FilterChain, _envoy_config_listener_v3_FilterChain__Output>
          FilterChainMatch: MessageTypeDefinition<_envoy_config_listener_v3_FilterChainMatch, _envoy_config_listener_v3_FilterChainMatch__Output>
          Listener: MessageTypeDefinition<_envoy_config_listener_v3_Listener, _envoy_config_listener_v3_Listener__Output>
          ListenerCollection: MessageTypeDefinition<_envoy_config_listener_v3_ListenerCollection, _envoy_config_listener_v3_ListenerCollection__Output>
          ListenerFilter: MessageTypeDefinition<_envoy_config_listener_v3_ListenerFilter, _envoy_config_listener_v3_ListenerFilter__Output>
          ListenerFilterChainMatchPredicate: MessageTypeDefinition<_envoy_config_listener_v3_ListenerFilterChainMatchPredicate, _envoy_config_listener_v3_ListenerFilterChainMatchPredicate__Output>
          ListenerManager: MessageTypeDefinition<_envoy_config_listener_v3_ListenerManager, _envoy_config_listener_v3_ListenerManager__Output>
          QuicProtocolOptions: MessageTypeDefinition<_envoy_config_listener_v3_QuicProtocolOptions, _envoy_config_listener_v3_QuicProtocolOptions__Output>
          UdpListenerConfig: MessageTypeDefinition<_envoy_config_listener_v3_UdpListenerConfig, _envoy_config_listener_v3_UdpListenerConfig__Output>
          ValidationListenerManager: MessageTypeDefinition<_envoy_config_listener_v3_ValidationListenerManager, _envoy_config_listener_v3_ValidationListenerManager__Output>
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
    data: {
      accesslog: {
        v3: {
          AccessLogCommon: MessageTypeDefinition<_envoy_data_accesslog_v3_AccessLogCommon, _envoy_data_accesslog_v3_AccessLogCommon__Output>
          AccessLogType: EnumTypeDefinition
          ConnectionProperties: MessageTypeDefinition<_envoy_data_accesslog_v3_ConnectionProperties, _envoy_data_accesslog_v3_ConnectionProperties__Output>
          HTTPAccessLogEntry: MessageTypeDefinition<_envoy_data_accesslog_v3_HTTPAccessLogEntry, _envoy_data_accesslog_v3_HTTPAccessLogEntry__Output>
          HTTPRequestProperties: MessageTypeDefinition<_envoy_data_accesslog_v3_HTTPRequestProperties, _envoy_data_accesslog_v3_HTTPRequestProperties__Output>
          HTTPResponseProperties: MessageTypeDefinition<_envoy_data_accesslog_v3_HTTPResponseProperties, _envoy_data_accesslog_v3_HTTPResponseProperties__Output>
          ResponseFlags: MessageTypeDefinition<_envoy_data_accesslog_v3_ResponseFlags, _envoy_data_accesslog_v3_ResponseFlags__Output>
          TCPAccessLogEntry: MessageTypeDefinition<_envoy_data_accesslog_v3_TCPAccessLogEntry, _envoy_data_accesslog_v3_TCPAccessLogEntry__Output>
          TLSProperties: MessageTypeDefinition<_envoy_data_accesslog_v3_TLSProperties, _envoy_data_accesslog_v3_TLSProperties__Output>
        }
      }
    }
    type: {
      matcher: {
        v3: {
          DoubleMatcher: MessageTypeDefinition<_envoy_type_matcher_v3_DoubleMatcher, _envoy_type_matcher_v3_DoubleMatcher__Output>
          ListMatcher: MessageTypeDefinition<_envoy_type_matcher_v3_ListMatcher, _envoy_type_matcher_v3_ListMatcher__Output>
          ListStringMatcher: MessageTypeDefinition<_envoy_type_matcher_v3_ListStringMatcher, _envoy_type_matcher_v3_ListStringMatcher__Output>
          MetadataMatcher: MessageTypeDefinition<_envoy_type_matcher_v3_MetadataMatcher, _envoy_type_matcher_v3_MetadataMatcher__Output>
          OrMatcher: MessageTypeDefinition<_envoy_type_matcher_v3_OrMatcher, _envoy_type_matcher_v3_OrMatcher__Output>
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
      FieldSecurityAnnotation: MessageTypeDefinition<_udpa_annotations_FieldSecurityAnnotation, _udpa_annotations_FieldSecurityAnnotation__Output>
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
        Authority: MessageTypeDefinition<_xds_core_v3_Authority, _xds_core_v3_Authority__Output>
        CollectionEntry: MessageTypeDefinition<_xds_core_v3_CollectionEntry, _xds_core_v3_CollectionEntry__Output>
        ContextParams: MessageTypeDefinition<_xds_core_v3_ContextParams, _xds_core_v3_ContextParams__Output>
        ResourceLocator: MessageTypeDefinition<_xds_core_v3_ResourceLocator, _xds_core_v3_ResourceLocator__Output>
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

