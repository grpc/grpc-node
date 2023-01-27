// Original file: proto/grpc/testing/xds/v3/orca_load_report.proto

import type { Long } from '@grpc/proto-loader';

export interface OrcaLoadReport {
  /**
   * CPU utilization expressed as a fraction of available CPU resources. This
   * should be derived from the latest sample or measurement.
   */
  'cpu_utilization'?: (number | string);
  /**
   * Memory utilization expressed as a fraction of available memory
   * resources. This should be derived from the latest sample or measurement.
   */
  'mem_utilization'?: (number | string);
  /**
   * Total RPS being served by an endpoint. This should cover all services that an endpoint is
   * responsible for.
   */
  'rps'?: (number | string | Long);
  /**
   * Application specific requests costs. Each value is an absolute cost (e.g. 3487 bytes of
   * storage) associated with the request.
   */
  'request_cost'?: ({[key: string]: number | string});
  /**
   * Resource utilization values. Each value is expressed as a fraction of total resources
   * available, derived from the latest sample or measurement.
   */
  'utilization'?: ({[key: string]: number | string});
}

export interface OrcaLoadReport__Output {
  /**
   * CPU utilization expressed as a fraction of available CPU resources. This
   * should be derived from the latest sample or measurement.
   */
  'cpu_utilization': (number | string);
  /**
   * Memory utilization expressed as a fraction of available memory
   * resources. This should be derived from the latest sample or measurement.
   */
  'mem_utilization': (number | string);
  /**
   * Total RPS being served by an endpoint. This should cover all services that an endpoint is
   * responsible for.
   */
  'rps': (string);
  /**
   * Application specific requests costs. Each value is an absolute cost (e.g. 3487 bytes of
   * storage) associated with the request.
   */
  'request_cost': ({[key: string]: number | string});
  /**
   * Resource utilization values. Each value is expressed as a fraction of total resources
   * available, derived from the latest sample or measurement.
   */
  'utilization': ({[key: string]: number | string});
}
