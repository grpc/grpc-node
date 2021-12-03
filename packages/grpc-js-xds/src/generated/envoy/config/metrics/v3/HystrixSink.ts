// Original file: deps/envoy-api/envoy/config/metrics/v3/stats.proto

import type { Long } from '@grpc/proto-loader';

/**
 * Stats configuration proto schema for built-in *envoy.stat_sinks.hystrix* sink.
 * The sink emits stats in `text/event-stream
 * <https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events>`_
 * formatted stream for use by `Hystrix dashboard
 * <https://github.com/Netflix-Skunkworks/hystrix-dashboard/wiki>`_.
 * 
 * Note that only a single HystrixSink should be configured.
 * 
 * Streaming is started through an admin endpoint :http:get:`/hystrix_event_stream`.
 * [#extension: envoy.stat_sinks.hystrix]
 */
export interface HystrixSink {
  /**
   * The number of buckets the rolling statistical window is divided into.
   * 
   * Each time the sink is flushed, all relevant Envoy statistics are sampled and
   * added to the rolling window (removing the oldest samples in the window
   * in the process). The sink then outputs the aggregate statistics across the
   * current rolling window to the event stream(s).
   * 
   * rolling_window(ms) = stats_flush_interval(ms) * num_of_buckets
   * 
   * More detailed explanation can be found in `Hystrix wiki
   * <https://github.com/Netflix/Hystrix/wiki/Metrics-and-Monitoring#hystrixrollingnumber>`_.
   */
  'num_buckets'?: (number | string | Long);
}

/**
 * Stats configuration proto schema for built-in *envoy.stat_sinks.hystrix* sink.
 * The sink emits stats in `text/event-stream
 * <https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events>`_
 * formatted stream for use by `Hystrix dashboard
 * <https://github.com/Netflix-Skunkworks/hystrix-dashboard/wiki>`_.
 * 
 * Note that only a single HystrixSink should be configured.
 * 
 * Streaming is started through an admin endpoint :http:get:`/hystrix_event_stream`.
 * [#extension: envoy.stat_sinks.hystrix]
 */
export interface HystrixSink__Output {
  /**
   * The number of buckets the rolling statistical window is divided into.
   * 
   * Each time the sink is flushed, all relevant Envoy statistics are sampled and
   * added to the rolling window (removing the oldest samples in the window
   * in the process). The sink then outputs the aggregate statistics across the
   * current rolling window to the event stream(s).
   * 
   * rolling_window(ms) = stats_flush_interval(ms) * num_of_buckets
   * 
   * More detailed explanation can be found in `Hystrix wiki
   * <https://github.com/Netflix/Hystrix/wiki/Metrics-and-Monitoring#hystrixrollingnumber>`_.
   */
  'num_buckets': (string);
}
