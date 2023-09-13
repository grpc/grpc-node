import { experimental, logVerbosity } from "@grpc/grpc-js";
import { ClusterLoadAssignment__Output } from "../generated/envoy/config/endpoint/v3/ClusterLoadAssignment";
import { XdsDecodeContext, XdsDecodeResult, XdsResourceType } from "./xds-resource-type";
import { Locality__Output } from "../generated/envoy/config/core/v3/Locality";
import { SocketAddress__Output } from "../generated/envoy/config/core/v3/SocketAddress";
import { isIPv4, isIPv6 } from "net";
import { Any__Output } from "../generated/google/protobuf/Any";
import { EDS_TYPE_URL, decodeSingleResource } from "../resources";
import { Watcher, XdsClient } from "../xds-client";

const TRACER_NAME = 'xds_client';

const UINT32_MAX = 0xFFFFFFFF;

function trace(text: string): void {
  experimental.trace(logVerbosity.DEBUG, TRACER_NAME, text);
}

function localitiesEqual(a: Locality__Output, b: Locality__Output) {
  return a.region === b.region && a.sub_zone === b.sub_zone && a.zone === b.zone;
}

function addressesEqual(a: SocketAddress__Output, b: SocketAddress__Output) {
  return a.address === b.address && a.port_value === b.port_value;
}

export class EndpointResourceType extends XdsResourceType {
  private static singleton: EndpointResourceType = new EndpointResourceType();

  private constructor() {
    super();
  }

  static get() {
    return EndpointResourceType.singleton;
  }

  getTypeUrl(): string {
    return 'envoy.config.endpoint.v3.ClusterLoadAssignment';
  }

  private validateResource(message: ClusterLoadAssignment__Output): ClusterLoadAssignment__Output | null {
    const seenLocalities: {locality: Locality__Output, priority: number}[] = [];
    const seenAddresses: SocketAddress__Output[] = [];
    const priorityTotalWeights: Map<number,  number> = new Map();
    for (const endpoint of message.endpoints) {
      if (!endpoint.locality) {
        trace('EDS validation: endpoint locality unset');
        return null;
      }
      for (const {locality, priority} of seenLocalities) {
        if (localitiesEqual(endpoint.locality, locality) && endpoint.priority === priority) {
          trace('EDS validation: endpoint locality duplicated: ' + JSON.stringify(locality) + ', priority=' + priority);
          return null;
        }
      }
      seenLocalities.push({locality: endpoint.locality, priority: endpoint.priority});
      for (const lb of endpoint.lb_endpoints) {
        const socketAddress = lb.endpoint?.address?.socket_address;
        if (!socketAddress) {
          trace('EDS validation: endpoint socket_address not set');
          return null;
        }
        if (socketAddress.port_specifier !== 'port_value') {
          trace('EDS validation: socket_address.port_specifier !== "port_value"');
          return null;
        }
        if (!(isIPv4(socketAddress.address) || isIPv6(socketAddress.address))) {
          trace('EDS validation: address not a valid IPv4 or IPv6 address: ' + socketAddress.address);
          return null;
        }
        for (const address of seenAddresses) {
          if (addressesEqual(socketAddress, address)) {
            trace('EDS validation: duplicate address seen: ' + address);
            return null;
          }
        }
        seenAddresses.push(socketAddress);
      }
      priorityTotalWeights.set(endpoint.priority, (priorityTotalWeights.get(endpoint.priority) ?? 0) + (endpoint.load_balancing_weight?.value ?? 0));
    }
    for (const totalWeight of priorityTotalWeights.values()) {
      if (totalWeight > UINT32_MAX) {
        trace('EDS validation: total weight > UINT32_MAX')
        return null;
      }
    }
    for (const priority of priorityTotalWeights.keys()) {
      if (priority > 0 && !priorityTotalWeights.has(priority - 1)) {
        trace('EDS validation: priorities not contiguous');
        return null;
      }
    }
    return message;
  }

  decode(context: XdsDecodeContext, resource: Any__Output): XdsDecodeResult {
    if (resource.type_url !== EDS_TYPE_URL) {
      throw new Error(
        `ADS Error: Invalid resource type ${resource.type_url}, expected ${EDS_TYPE_URL}`
      );
    }
    const message = decodeSingleResource(EDS_TYPE_URL, resource.value);
    trace('Decoded raw resource of type ' + EDS_TYPE_URL + ': ' + JSON.stringify(message, undefined, 2));
    const validatedMessage = this.validateResource(message);
    if (validatedMessage) {
      return {
        name: validatedMessage.cluster_name,
        value: validatedMessage
      };
    } else {
      return {
        name: message.cluster_name,
        error: 'Endpoint message validation failed'
      };
    }
  }

  allResourcesRequiredInSotW(): boolean {
    return false;
  }

  static startWatch(client: XdsClient, name: string, watcher: Watcher<ClusterLoadAssignment__Output>) {
    client.watchResource(EndpointResourceType.get(), name, watcher);
  }

  static cancelWatch(client: XdsClient, name: string, watcher: Watcher<ClusterLoadAssignment__Output>) {
    client.cancelResourceWatch(EndpointResourceType.get(), name, watcher);
  }
}
