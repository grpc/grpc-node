// Original file: proto/grpc/testing/messages.proto

/**
 * The type of route that a client took to reach a server w.r.t. gRPCLB.
 * The server must fill in "fallback" if it detects that the RPC reached
 * the server via the "gRPCLB fallback" path, and "backend" if it detects
 * that the RPC reached the server via "gRPCLB backend" path (i.e. if it got
 * the address of this server from the gRPCLB server BalanceLoad RPC). Exactly
 * how this detection is done is context and server dependent.
 */
export enum GrpclbRouteType {
  /**
   * Server didn't detect the route that a client took to reach it.
   */
  GRPCLB_ROUTE_TYPE_UNKNOWN = 0,
  /**
   * Indicates that a client reached a server via gRPCLB fallback.
   */
  GRPCLB_ROUTE_TYPE_FALLBACK = 1,
  /**
   * Indicates that a client reached a server as a gRPCLB-given backend.
   */
  GRPCLB_ROUTE_TYPE_BACKEND = 2,
}
