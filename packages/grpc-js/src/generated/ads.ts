import * as grpc from '../index';
import { ServiceDefinition, EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import { DeltaDiscoveryRequest as _envoy_api_v2_DeltaDiscoveryRequest, DeltaDiscoveryRequest__Output as _envoy_api_v2_DeltaDiscoveryRequest__Output } from './envoy/api/v2/DeltaDiscoveryRequest';
import { DeltaDiscoveryResponse as _envoy_api_v2_DeltaDiscoveryResponse, DeltaDiscoveryResponse__Output as _envoy_api_v2_DeltaDiscoveryResponse__Output } from './envoy/api/v2/DeltaDiscoveryResponse';
import { DiscoveryRequest as _envoy_api_v2_DiscoveryRequest, DiscoveryRequest__Output as _envoy_api_v2_DiscoveryRequest__Output } from './envoy/api/v2/DiscoveryRequest';
import { DiscoveryResponse as _envoy_api_v2_DiscoveryResponse, DiscoveryResponse__Output as _envoy_api_v2_DiscoveryResponse__Output } from './envoy/api/v2/DiscoveryResponse';
import { Resource as _envoy_api_v2_Resource, Resource__Output as _envoy_api_v2_Resource__Output } from './envoy/api/v2/Resource';
import { Address as _envoy_api_v2_core_Address, Address__Output as _envoy_api_v2_core_Address__Output } from './envoy/api/v2/core/Address';
import { AsyncDataSource as _envoy_api_v2_core_AsyncDataSource, AsyncDataSource__Output as _envoy_api_v2_core_AsyncDataSource__Output } from './envoy/api/v2/core/AsyncDataSource';
import { BackoffStrategy as _envoy_api_v2_core_BackoffStrategy, BackoffStrategy__Output as _envoy_api_v2_core_BackoffStrategy__Output } from './envoy/api/v2/core/BackoffStrategy';
import { BindConfig as _envoy_api_v2_core_BindConfig, BindConfig__Output as _envoy_api_v2_core_BindConfig__Output } from './envoy/api/v2/core/BindConfig';
import { BuildVersion as _envoy_api_v2_core_BuildVersion, BuildVersion__Output as _envoy_api_v2_core_BuildVersion__Output } from './envoy/api/v2/core/BuildVersion';
import { CidrRange as _envoy_api_v2_core_CidrRange, CidrRange__Output as _envoy_api_v2_core_CidrRange__Output } from './envoy/api/v2/core/CidrRange';
import { ControlPlane as _envoy_api_v2_core_ControlPlane, ControlPlane__Output as _envoy_api_v2_core_ControlPlane__Output } from './envoy/api/v2/core/ControlPlane';
import { DataSource as _envoy_api_v2_core_DataSource, DataSource__Output as _envoy_api_v2_core_DataSource__Output } from './envoy/api/v2/core/DataSource';
import { Extension as _envoy_api_v2_core_Extension, Extension__Output as _envoy_api_v2_core_Extension__Output } from './envoy/api/v2/core/Extension';
import { HeaderMap as _envoy_api_v2_core_HeaderMap, HeaderMap__Output as _envoy_api_v2_core_HeaderMap__Output } from './envoy/api/v2/core/HeaderMap';
import { HeaderValue as _envoy_api_v2_core_HeaderValue, HeaderValue__Output as _envoy_api_v2_core_HeaderValue__Output } from './envoy/api/v2/core/HeaderValue';
import { HeaderValueOption as _envoy_api_v2_core_HeaderValueOption, HeaderValueOption__Output as _envoy_api_v2_core_HeaderValueOption__Output } from './envoy/api/v2/core/HeaderValueOption';
import { HttpUri as _envoy_api_v2_core_HttpUri, HttpUri__Output as _envoy_api_v2_core_HttpUri__Output } from './envoy/api/v2/core/HttpUri';
import { Locality as _envoy_api_v2_core_Locality, Locality__Output as _envoy_api_v2_core_Locality__Output } from './envoy/api/v2/core/Locality';
import { Metadata as _envoy_api_v2_core_Metadata, Metadata__Output as _envoy_api_v2_core_Metadata__Output } from './envoy/api/v2/core/Metadata';
import { Node as _envoy_api_v2_core_Node, Node__Output as _envoy_api_v2_core_Node__Output } from './envoy/api/v2/core/Node';
import { Pipe as _envoy_api_v2_core_Pipe, Pipe__Output as _envoy_api_v2_core_Pipe__Output } from './envoy/api/v2/core/Pipe';
import { RemoteDataSource as _envoy_api_v2_core_RemoteDataSource, RemoteDataSource__Output as _envoy_api_v2_core_RemoteDataSource__Output } from './envoy/api/v2/core/RemoteDataSource';
import { RequestMethod as _envoy_api_v2_core_RequestMethod } from './envoy/api/v2/core/RequestMethod';
import { RetryPolicy as _envoy_api_v2_core_RetryPolicy, RetryPolicy__Output as _envoy_api_v2_core_RetryPolicy__Output } from './envoy/api/v2/core/RetryPolicy';
import { RoutingPriority as _envoy_api_v2_core_RoutingPriority } from './envoy/api/v2/core/RoutingPriority';
import { RuntimeDouble as _envoy_api_v2_core_RuntimeDouble, RuntimeDouble__Output as _envoy_api_v2_core_RuntimeDouble__Output } from './envoy/api/v2/core/RuntimeDouble';
import { RuntimeFeatureFlag as _envoy_api_v2_core_RuntimeFeatureFlag, RuntimeFeatureFlag__Output as _envoy_api_v2_core_RuntimeFeatureFlag__Output } from './envoy/api/v2/core/RuntimeFeatureFlag';
import { RuntimeFractionalPercent as _envoy_api_v2_core_RuntimeFractionalPercent, RuntimeFractionalPercent__Output as _envoy_api_v2_core_RuntimeFractionalPercent__Output } from './envoy/api/v2/core/RuntimeFractionalPercent';
import { RuntimeUInt32 as _envoy_api_v2_core_RuntimeUInt32, RuntimeUInt32__Output as _envoy_api_v2_core_RuntimeUInt32__Output } from './envoy/api/v2/core/RuntimeUInt32';
import { SocketAddress as _envoy_api_v2_core_SocketAddress, SocketAddress__Output as _envoy_api_v2_core_SocketAddress__Output } from './envoy/api/v2/core/SocketAddress';
import { SocketOption as _envoy_api_v2_core_SocketOption, SocketOption__Output as _envoy_api_v2_core_SocketOption__Output } from './envoy/api/v2/core/SocketOption';
import { TcpKeepalive as _envoy_api_v2_core_TcpKeepalive, TcpKeepalive__Output as _envoy_api_v2_core_TcpKeepalive__Output } from './envoy/api/v2/core/TcpKeepalive';
import { TrafficDirection as _envoy_api_v2_core_TrafficDirection } from './envoy/api/v2/core/TrafficDirection';
import { TransportSocket as _envoy_api_v2_core_TransportSocket, TransportSocket__Output as _envoy_api_v2_core_TransportSocket__Output } from './envoy/api/v2/core/TransportSocket';
import { AdsDummy as _envoy_service_discovery_v2_AdsDummy, AdsDummy__Output as _envoy_service_discovery_v2_AdsDummy__Output } from './envoy/service/discovery/v2/AdsDummy';
import { FractionalPercent as _envoy_type_FractionalPercent, FractionalPercent__Output as _envoy_type_FractionalPercent__Output } from './envoy/type/FractionalPercent';
import { Percent as _envoy_type_Percent, Percent__Output as _envoy_type_Percent__Output } from './envoy/type/Percent';
import { SemanticVersion as _envoy_type_SemanticVersion, SemanticVersion__Output as _envoy_type_SemanticVersion__Output } from './envoy/type/SemanticVersion';
import { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from './google/protobuf/Any';
import { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from './google/protobuf/BoolValue';
import { BytesValue as _google_protobuf_BytesValue, BytesValue__Output as _google_protobuf_BytesValue__Output } from './google/protobuf/BytesValue';
import { DescriptorProto as _google_protobuf_DescriptorProto, DescriptorProto__Output as _google_protobuf_DescriptorProto__Output } from './google/protobuf/DescriptorProto';
import { DoubleValue as _google_protobuf_DoubleValue, DoubleValue__Output as _google_protobuf_DoubleValue__Output } from './google/protobuf/DoubleValue';
import { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from './google/protobuf/Duration';
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
import { Status as _google_rpc_Status, Status__Output as _google_rpc_Status__Output } from './google/rpc/Status';
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
    export namespace api {
      export namespace v2 {
        /**
         * DeltaDiscoveryRequest and DeltaDiscoveryResponse are used in a new gRPC
         * endpoint for Delta xDS.
         * 
         * With Delta xDS, the DeltaDiscoveryResponses do not need to include a full
         * snapshot of the tracked resources. Instead, DeltaDiscoveryResponses are a
         * diff to the state of a xDS client.
         * In Delta XDS there are per-resource versions, which allow tracking state at
         * the resource granularity.
         * An xDS Delta session is always in the context of a gRPC bidirectional
         * stream. This allows the xDS server to keep track of the state of xDS clients
         * connected to it.
         * 
         * In Delta xDS the nonce field is required and used to pair
         * DeltaDiscoveryResponse to a DeltaDiscoveryRequest ACK or NACK.
         * Optionally, a response message level system_version_info is present for
         * debugging purposes only.
         * 
         * DeltaDiscoveryRequest plays two independent roles. Any DeltaDiscoveryRequest
         * can be either or both of: [1] informing the server of what resources the
         * client has gained/lost interest in (using resource_names_subscribe and
         * resource_names_unsubscribe), or [2] (N)ACKing an earlier resource update from
         * the server (using response_nonce, with presence of error_detail making it a NACK).
         * Additionally, the first message (for a given type_url) of a reconnected gRPC stream
         * has a third role: informing the server of the resources (and their versions)
         * that the client already possesses, using the initial_resource_versions field.
         * 
         * As with state-of-the-world, when multiple resource types are multiplexed (ADS),
         * all requests/acknowledgments/updates are logically walled off by type_url:
         * a Cluster ACK exists in a completely separate world from a prior Route NACK.
         * In particular, initial_resource_versions being sent at the "start" of every
         * gRPC stream actually entails a message for each type_url, each with its own
         * initial_resource_versions.
         * [#next-free-field: 8]
         */
        export type DeltaDiscoveryRequest = _envoy_api_v2_DeltaDiscoveryRequest;
        /**
         * DeltaDiscoveryRequest and DeltaDiscoveryResponse are used in a new gRPC
         * endpoint for Delta xDS.
         * 
         * With Delta xDS, the DeltaDiscoveryResponses do not need to include a full
         * snapshot of the tracked resources. Instead, DeltaDiscoveryResponses are a
         * diff to the state of a xDS client.
         * In Delta XDS there are per-resource versions, which allow tracking state at
         * the resource granularity.
         * An xDS Delta session is always in the context of a gRPC bidirectional
         * stream. This allows the xDS server to keep track of the state of xDS clients
         * connected to it.
         * 
         * In Delta xDS the nonce field is required and used to pair
         * DeltaDiscoveryResponse to a DeltaDiscoveryRequest ACK or NACK.
         * Optionally, a response message level system_version_info is present for
         * debugging purposes only.
         * 
         * DeltaDiscoveryRequest plays two independent roles. Any DeltaDiscoveryRequest
         * can be either or both of: [1] informing the server of what resources the
         * client has gained/lost interest in (using resource_names_subscribe and
         * resource_names_unsubscribe), or [2] (N)ACKing an earlier resource update from
         * the server (using response_nonce, with presence of error_detail making it a NACK).
         * Additionally, the first message (for a given type_url) of a reconnected gRPC stream
         * has a third role: informing the server of the resources (and their versions)
         * that the client already possesses, using the initial_resource_versions field.
         * 
         * As with state-of-the-world, when multiple resource types are multiplexed (ADS),
         * all requests/acknowledgments/updates are logically walled off by type_url:
         * a Cluster ACK exists in a completely separate world from a prior Route NACK.
         * In particular, initial_resource_versions being sent at the "start" of every
         * gRPC stream actually entails a message for each type_url, each with its own
         * initial_resource_versions.
         * [#next-free-field: 8]
         */
        export type DeltaDiscoveryRequest__Output = _envoy_api_v2_DeltaDiscoveryRequest__Output;
        /**
         * [#next-free-field: 7]
         */
        export type DeltaDiscoveryResponse = _envoy_api_v2_DeltaDiscoveryResponse;
        /**
         * [#next-free-field: 7]
         */
        export type DeltaDiscoveryResponse__Output = _envoy_api_v2_DeltaDiscoveryResponse__Output;
        /**
         * A DiscoveryRequest requests a set of versioned resources of the same type for
         * a given Envoy node on some API.
         * [#next-free-field: 7]
         */
        export type DiscoveryRequest = _envoy_api_v2_DiscoveryRequest;
        /**
         * A DiscoveryRequest requests a set of versioned resources of the same type for
         * a given Envoy node on some API.
         * [#next-free-field: 7]
         */
        export type DiscoveryRequest__Output = _envoy_api_v2_DiscoveryRequest__Output;
        /**
         * [#next-free-field: 7]
         */
        export type DiscoveryResponse = _envoy_api_v2_DiscoveryResponse;
        /**
         * [#next-free-field: 7]
         */
        export type DiscoveryResponse__Output = _envoy_api_v2_DiscoveryResponse__Output;
        export type Resource = _envoy_api_v2_Resource;
        export type Resource__Output = _envoy_api_v2_Resource__Output;
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
        }
      }
    }
    export namespace service {
      export namespace discovery {
        export namespace v2 {
          /**
           * [#not-implemented-hide:] Not configuration. Workaround c++ protobuf issue with importing
           * services: https://github.com/google/protobuf/issues/4221
           */
          export type AdsDummy = _envoy_service_discovery_v2_AdsDummy;
          /**
           * [#not-implemented-hide:] Not configuration. Workaround c++ protobuf issue with importing
           * services: https://github.com/google/protobuf/issues/4221
           */
          export type AdsDummy__Output = _envoy_service_discovery_v2_AdsDummy__Output;
          export namespace AggregatedDiscoveryService {
          }
        }
      }
    }
    export namespace type {
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
    }
  }
  export namespace google {
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
    export namespace rpc {
      /**
       * The `Status` type defines a logical error model that is suitable for
       * different programming environments, including REST APIs and RPC APIs. It is
       * used by [gRPC](https://github.com/grpc). Each `Status` message contains
       * three pieces of data: error code, error message, and error details.
       * 
       * You can find out more about this error model and how to work with it in the
       * [API Design Guide](https://cloud.google.com/apis/design/errors).
       */
      export type Status = _google_rpc_Status;
      /**
       * The `Status` type defines a logical error model that is suitable for
       * different programming environments, including REST APIs and RPC APIs. It is
       * used by [gRPC](https://github.com/grpc). Each `Status` message contains
       * three pieces of data: error code, error message, and error details.
       * 
       * You can find out more about this error model and how to work with it in the
       * [API Design Guide](https://cloud.google.com/apis/design/errors).
       */
      export type Status__Output = _google_rpc_Status__Output;
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
    export namespace api {
      export namespace v2 {
        export namespace DeltaDiscoveryRequest {
        }
        export namespace DeltaDiscoveryResponse {
        }
        export namespace DiscoveryRequest {
        }
        export namespace DiscoveryResponse {
        }
        export namespace Resource {
        }
        export namespace core {
          export namespace Address {
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
          export namespace ControlPlane {
          }
          export namespace DataSource {
          }
          export namespace Extension {
          }
          export namespace HeaderMap {
          }
          export namespace HeaderValue {
          }
          export namespace HeaderValueOption {
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
          export namespace SocketAddress {
          }
          export namespace SocketOption {
          }
          export namespace TcpKeepalive {
          }
          export namespace TransportSocket {
          }
        }
      }
    }
    export namespace service {
      export namespace discovery {
        export namespace v2 {
          export namespace AdsDummy {
          }
          /**
           * See https://github.com/lyft/envoy-api#apis for a description of the role of
           * ADS and how it is intended to be used by a management server. ADS requests
           * have the same structure as their singleton xDS counterparts, but can
           * multiplex many resource types on a single stream. The type_url in the
           * DiscoveryRequest/DiscoveryResponse provides sufficient information to recover
           * the multiplexed singleton APIs at the Envoy instance and management server.
           */
          export interface AggregatedDiscoveryServiceClient extends grpc.Client {
            DeltaAggregatedResources(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<messages.envoy.api.v2.DeltaDiscoveryRequest, messages.envoy.api.v2.DeltaDiscoveryResponse__Output>;
            DeltaAggregatedResources(options?: grpc.CallOptions): grpc.ClientDuplexStream<messages.envoy.api.v2.DeltaDiscoveryRequest, messages.envoy.api.v2.DeltaDiscoveryResponse__Output>;
            deltaAggregatedResources(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<messages.envoy.api.v2.DeltaDiscoveryRequest, messages.envoy.api.v2.DeltaDiscoveryResponse__Output>;
            deltaAggregatedResources(options?: grpc.CallOptions): grpc.ClientDuplexStream<messages.envoy.api.v2.DeltaDiscoveryRequest, messages.envoy.api.v2.DeltaDiscoveryResponse__Output>;
            
            /**
             * This is a gRPC-only API.
             */
            StreamAggregatedResources(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<messages.envoy.api.v2.DiscoveryRequest, messages.envoy.api.v2.DiscoveryResponse__Output>;
            StreamAggregatedResources(options?: grpc.CallOptions): grpc.ClientDuplexStream<messages.envoy.api.v2.DiscoveryRequest, messages.envoy.api.v2.DiscoveryResponse__Output>;
            /**
             * This is a gRPC-only API.
             */
            streamAggregatedResources(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<messages.envoy.api.v2.DiscoveryRequest, messages.envoy.api.v2.DiscoveryResponse__Output>;
            streamAggregatedResources(options?: grpc.CallOptions): grpc.ClientDuplexStream<messages.envoy.api.v2.DiscoveryRequest, messages.envoy.api.v2.DiscoveryResponse__Output>;
            
          }
        }
      }
    }
    export namespace type {
      export namespace FractionalPercent {
      }
      export namespace Percent {
      }
      export namespace SemanticVersion {
      }
    }
  }
  export namespace google {
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
    export namespace rpc {
      export namespace Status {
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
    api: {
      v2: {
        DeltaDiscoveryRequest: MessageTypeDefinition
        DeltaDiscoveryResponse: MessageTypeDefinition
        DiscoveryRequest: MessageTypeDefinition
        DiscoveryResponse: MessageTypeDefinition
        Resource: MessageTypeDefinition
        core: {
          Address: MessageTypeDefinition
          AsyncDataSource: MessageTypeDefinition
          BackoffStrategy: MessageTypeDefinition
          BindConfig: MessageTypeDefinition
          BuildVersion: MessageTypeDefinition
          CidrRange: MessageTypeDefinition
          ControlPlane: MessageTypeDefinition
          DataSource: MessageTypeDefinition
          Extension: MessageTypeDefinition
          HeaderMap: MessageTypeDefinition
          HeaderValue: MessageTypeDefinition
          HeaderValueOption: MessageTypeDefinition
          HttpUri: MessageTypeDefinition
          Locality: MessageTypeDefinition
          Metadata: MessageTypeDefinition
          Node: MessageTypeDefinition
          Pipe: MessageTypeDefinition
          RemoteDataSource: MessageTypeDefinition
          RequestMethod: EnumTypeDefinition
          RetryPolicy: MessageTypeDefinition
          RoutingPriority: EnumTypeDefinition
          RuntimeDouble: MessageTypeDefinition
          RuntimeFeatureFlag: MessageTypeDefinition
          RuntimeFractionalPercent: MessageTypeDefinition
          RuntimeUInt32: MessageTypeDefinition
          SocketAddress: MessageTypeDefinition
          SocketOption: MessageTypeDefinition
          TcpKeepalive: MessageTypeDefinition
          TrafficDirection: EnumTypeDefinition
          TransportSocket: MessageTypeDefinition
        }
      }
    }
    service: {
      discovery: {
        v2: {
          AdsDummy: MessageTypeDefinition
          /**
           * See https://github.com/lyft/envoy-api#apis for a description of the role of
           * ADS and how it is intended to be used by a management server. ADS requests
           * have the same structure as their singleton xDS counterparts, but can
           * multiplex many resource types on a single stream. The type_url in the
           * DiscoveryRequest/DiscoveryResponse provides sufficient information to recover
           * the multiplexed singleton APIs at the Envoy instance and management server.
           */
          AggregatedDiscoveryService: SubtypeConstructor<typeof grpc.Client, ClientInterfaces.envoy.service.discovery.v2.AggregatedDiscoveryServiceClient> & { service: ServiceDefinition }
        }
      }
    }
    type: {
      FractionalPercent: MessageTypeDefinition
      Percent: MessageTypeDefinition
      SemanticVersion: MessageTypeDefinition
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
    rpc: {
      Status: MessageTypeDefinition
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
    export namespace api {
      export namespace v2 {
        export namespace DeltaDiscoveryRequest {
        }
        export namespace DeltaDiscoveryResponse {
        }
        export namespace DiscoveryRequest {
        }
        export namespace DiscoveryResponse {
        }
        export namespace Resource {
        }
        export namespace core {
          export namespace Address {
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
          export namespace ControlPlane {
          }
          export namespace DataSource {
          }
          export namespace Extension {
          }
          export namespace HeaderMap {
          }
          export namespace HeaderValue {
          }
          export namespace HeaderValueOption {
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
          export namespace SocketAddress {
          }
          export namespace SocketOption {
          }
          export namespace TcpKeepalive {
          }
          export namespace TransportSocket {
          }
        }
      }
    }
    export namespace service {
      export namespace discovery {
        export namespace v2 {
          export namespace AdsDummy {
          }
          /**
           * See https://github.com/lyft/envoy-api#apis for a description of the role of
           * ADS and how it is intended to be used by a management server. ADS requests
           * have the same structure as their singleton xDS counterparts, but can
           * multiplex many resource types on a single stream. The type_url in the
           * DiscoveryRequest/DiscoveryResponse provides sufficient information to recover
           * the multiplexed singleton APIs at the Envoy instance and management server.
           */
          export interface AggregatedDiscoveryService {
            DeltaAggregatedResources(call: grpc.ServerDuplexStream<messages.envoy.api.v2.DeltaDiscoveryRequest__Output, messages.envoy.api.v2.DeltaDiscoveryResponse>): void;
            
            /**
             * This is a gRPC-only API.
             */
            StreamAggregatedResources(call: grpc.ServerDuplexStream<messages.envoy.api.v2.DiscoveryRequest__Output, messages.envoy.api.v2.DiscoveryResponse>): void;
            
          }
        }
      }
    }
    export namespace type {
      export namespace FractionalPercent {
      }
      export namespace Percent {
      }
      export namespace SemanticVersion {
      }
    }
  }
  export namespace google {
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
    export namespace rpc {
      export namespace Status {
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
