// Original file: deps/envoy-api/envoy/data/accesslog/v3/accesslog.proto

export const AccessLogType = {
  NotSet: 'NotSet',
  TcpUpstreamConnected: 'TcpUpstreamConnected',
  TcpPeriodic: 'TcpPeriodic',
  TcpConnectionEnd: 'TcpConnectionEnd',
  DownstreamStart: 'DownstreamStart',
  DownstreamPeriodic: 'DownstreamPeriodic',
  DownstreamEnd: 'DownstreamEnd',
  UpstreamPoolReady: 'UpstreamPoolReady',
  UpstreamPeriodic: 'UpstreamPeriodic',
  UpstreamEnd: 'UpstreamEnd',
  DownstreamTunnelSuccessfullyEstablished: 'DownstreamTunnelSuccessfullyEstablished',
  UdpTunnelUpstreamConnected: 'UdpTunnelUpstreamConnected',
  UdpPeriodic: 'UdpPeriodic',
  UdpSessionEnd: 'UdpSessionEnd',
} as const;

export type AccessLogType =
  | 'NotSet'
  | 0
  | 'TcpUpstreamConnected'
  | 1
  | 'TcpPeriodic'
  | 2
  | 'TcpConnectionEnd'
  | 3
  | 'DownstreamStart'
  | 4
  | 'DownstreamPeriodic'
  | 5
  | 'DownstreamEnd'
  | 6
  | 'UpstreamPoolReady'
  | 7
  | 'UpstreamPeriodic'
  | 8
  | 'UpstreamEnd'
  | 9
  | 'DownstreamTunnelSuccessfullyEstablished'
  | 10
  | 'UdpTunnelUpstreamConnected'
  | 11
  | 'UdpPeriodic'
  | 12
  | 'UdpSessionEnd'
  | 13

export type AccessLogType__Output = typeof AccessLogType[keyof typeof AccessLogType]
