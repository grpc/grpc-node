// Original file: deps/envoy-api/envoy/admin/v3/config_dump_shared.proto

/**
 * Resource status from the view of a xDS client, which tells the synchronization
 * status between the xDS client and the xDS server.
 */
export enum ClientResourceStatus {
  /**
   * Resource status is not available/unknown.
   */
  UNKNOWN = 0,
  /**
   * Client requested this resource but hasn't received any update from management
   * server. The client will not fail requests, but will queue them until update
   * arrives or the client times out waiting for the resource.
   */
  REQUESTED = 1,
  /**
   * This resource has been requested by the client but has either not been
   * delivered by the server or was previously delivered by the server and then
   * subsequently removed from resources provided by the server. For more
   * information, please refer to the :ref:`"Knowing When a Requested Resource
   * Does Not Exist" <xds_protocol_resource_not_existed>` section.
   */
  DOES_NOT_EXIST = 2,
  /**
   * Client received this resource and replied with ACK.
   */
  ACKED = 3,
  /**
   * Client received this resource and replied with NACK.
   */
  NACKED = 4,
}
