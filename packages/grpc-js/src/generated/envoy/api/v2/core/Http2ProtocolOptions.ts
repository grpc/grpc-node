// Original file: deps/envoy-api/envoy/api/v2/core/protocol.proto

import { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';

export interface _envoy_api_v2_core_Http2ProtocolOptions_SettingsParameter {
  'identifier'?: (_google_protobuf_UInt32Value);
  'value'?: (_google_protobuf_UInt32Value);
}

export interface _envoy_api_v2_core_Http2ProtocolOptions_SettingsParameter__Output {
  'identifier': (_google_protobuf_UInt32Value__Output);
  'value': (_google_protobuf_UInt32Value__Output);
}

export interface Http2ProtocolOptions {
  'hpack_table_size'?: (_google_protobuf_UInt32Value);
  'max_concurrent_streams'?: (_google_protobuf_UInt32Value);
  'initial_stream_window_size'?: (_google_protobuf_UInt32Value);
  'initial_connection_window_size'?: (_google_protobuf_UInt32Value);
  'allow_connect'?: (boolean);
  'allow_metadata'?: (boolean);
  'max_outbound_frames'?: (_google_protobuf_UInt32Value);
  'max_outbound_control_frames'?: (_google_protobuf_UInt32Value);
  'max_consecutive_inbound_frames_with_empty_payload'?: (_google_protobuf_UInt32Value);
  'max_inbound_priority_frames_per_stream'?: (_google_protobuf_UInt32Value);
  'max_inbound_window_update_frames_per_data_frame_sent'?: (_google_protobuf_UInt32Value);
  'stream_error_on_invalid_http_messaging'?: (boolean);
  'custom_settings_parameters'?: (_envoy_api_v2_core_Http2ProtocolOptions_SettingsParameter)[];
}

export interface Http2ProtocolOptions__Output {
  'hpack_table_size': (_google_protobuf_UInt32Value__Output);
  'max_concurrent_streams': (_google_protobuf_UInt32Value__Output);
  'initial_stream_window_size': (_google_protobuf_UInt32Value__Output);
  'initial_connection_window_size': (_google_protobuf_UInt32Value__Output);
  'allow_connect': (boolean);
  'allow_metadata': (boolean);
  'max_outbound_frames': (_google_protobuf_UInt32Value__Output);
  'max_outbound_control_frames': (_google_protobuf_UInt32Value__Output);
  'max_consecutive_inbound_frames_with_empty_payload': (_google_protobuf_UInt32Value__Output);
  'max_inbound_priority_frames_per_stream': (_google_protobuf_UInt32Value__Output);
  'max_inbound_window_update_frames_per_data_frame_sent': (_google_protobuf_UInt32Value__Output);
  'stream_error_on_invalid_http_messaging': (boolean);
  'custom_settings_parameters': (_envoy_api_v2_core_Http2ProtocolOptions_SettingsParameter__Output)[];
}
