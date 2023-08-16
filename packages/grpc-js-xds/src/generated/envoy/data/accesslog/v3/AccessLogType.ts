// Original file: deps/envoy-api/envoy/data/accesslog/v3/accesslog.proto

export enum AccessLogType {
  NotSet = 0,
  TcpUpstreamConnected = 1,
  TcpPeriodic = 2,
  TcpConnectionEnd = 3,
  DownstreamStart = 4,
  DownstreamPeriodic = 5,
  DownstreamEnd = 6,
  UpstreamPoolReady = 7,
  UpstreamPeriodic = 8,
  UpstreamEnd = 9,
  DownstreamTunnelSuccessfullyEstablished = 10,
}
