// Original file: deps/envoy-api/envoy/api/v2/route/route_components.proto

import { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../../google/protobuf/BoolValue';

export interface Decorator {
  /**
   * The operation name associated with the request matched to this route. If tracing is
   * enabled, this information will be used as the span name reported for this request.
   * 
   * .. note::
   * 
   * For ingress (inbound) requests, or egress (outbound) responses, this value may be overridden
   * by the :ref:`x-envoy-decorator-operation
   * <config_http_filters_router_x-envoy-decorator-operation>` header.
   */
  'operation'?: (string);
  /**
   * Whether the decorated details should be propagated to the other party. The default is true.
   */
  'propagate'?: (_google_protobuf_BoolValue);
}

export interface Decorator__Output {
  /**
   * The operation name associated with the request matched to this route. If tracing is
   * enabled, this information will be used as the span name reported for this request.
   * 
   * .. note::
   * 
   * For ingress (inbound) requests, or egress (outbound) responses, this value may be overridden
   * by the :ref:`x-envoy-decorator-operation
   * <config_http_filters_router_x-envoy-decorator-operation>` header.
   */
  'operation': (string);
  /**
   * Whether the decorated details should be propagated to the other party. The default is true.
   */
  'propagate'?: (_google_protobuf_BoolValue__Output);
}
