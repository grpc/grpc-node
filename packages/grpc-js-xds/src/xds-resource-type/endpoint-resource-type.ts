import { experimental, logVerbosity } from "@grpc/grpc-js";
import { ClusterLoadAssignment__Output } from "../generated/envoy/config/endpoint/v3/ClusterLoadAssignment";
import { ValidationResult, XdsDecodeContext, XdsDecodeResult, XdsResourceType } from "./xds-resource-type";
import { Locality__Output } from "../generated/envoy/config/core/v3/Locality";
import { SocketAddress__Output } from "../generated/envoy/config/core/v3/SocketAddress";
import { isIPv4, isIPv6 } from "net";
import { Any__Output } from "../generated/google/protobuf/Any";
import { EDS_TYPE_URL, decodeSingleResource } from "../resources";
import { Watcher, XdsClient } from "../xds-client";
import { EXPERIMENTAL_DUALSTACK_ENDPOINTS } from "../environment";

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

  /**
   *
   * @param socketAddress
   * @param seenAddresses
   * @returns A list of validation errors, if there are any. An empty list indicates success
   */
  private validateAddress(socketAddress: SocketAddress__Output, seenAddresses: SocketAddress__Output[]): string[] {
    const errors: string[] = [];
    if (socketAddress.port_specifier !== 'port_value') {
      errors.push(`Unsupported port_specifier: ${socketAddress.port_specifier}`);
    }
    if (!(isIPv4(socketAddress.address) || isIPv6(socketAddress.address))) {
      errors.push(`address is not a valid IPv4 or IPv6 address: ${socketAddress.address}`);
    }
    for (const address of seenAddresses) {
      if (addressesEqual(socketAddress, address)) {
        errors.push(`address is a duplicate of another address in the same endpoint: ${socketAddress.address}`);
      }
    }
    return errors;
  }

  private validateResource(message: ClusterLoadAssignment__Output): ValidationResult<ClusterLoadAssignment__Output> {
    const errors: string[] = [];
    const seenLocalities: {locality: Locality__Output, priority: number}[] = [];
    const seenAddresses: SocketAddress__Output[] = [];
    const priorityTotalWeights: Map<number,  number> = new Map();
    for (const [index, endpoint] of message.endpoints.entries()) {
      const errorPrefix = `endpoints[${index}]`;
      if (!endpoint.locality) {
        errors.push(`${errorPrefix}.locality unset`);
        continue;
      }
      for (const {locality, priority} of seenLocalities) {
        if (localitiesEqual(endpoint.locality, locality) && endpoint.priority === priority) {
          errors.push(`${errorPrefix}.locality is a duplicate of another locality in the endpoint`);
        }
      }
      seenLocalities.push({locality: endpoint.locality, priority: endpoint.priority});
      for (const [lbIndex, lb] of endpoint.lb_endpoints.entries()) {
        const lbErrorPrefix = `${errorPrefix}.lb_endpoints[${lbIndex}].endpoint`;
        const socketAddress = lb.endpoint?.address?.socket_address;
        if (socketAddress) {
          errors.push(...this.validateAddress(socketAddress, seenAddresses).map(error => `${lbErrorPrefix}: ${error}`));
          seenAddresses.push(socketAddress);
        } else {
          errors.push(`${lbErrorPrefix}.socket_address not set`);
        }
        if (EXPERIMENTAL_DUALSTACK_ENDPOINTS && lb.endpoint?.additional_addresses) {
          for (const [addressIndex, additionalAddress] of lb.endpoint.additional_addresses.entries()) {
            if (additionalAddress.address?.socket_address) {
              errors.push(...this.validateAddress(additionalAddress.address.socket_address, seenAddresses).map(error => `${lbErrorPrefix}.additional_addresses[${addressIndex}].address.socket_address: ${error}`));
              seenAddresses.push(additionalAddress.address.socket_address);
            } else {
              errors.push(`${lbErrorPrefix}.additional_addresses[${addressIndex}].address.socket_address unset`);
            }
          }
        }
      }
      priorityTotalWeights.set(endpoint.priority, (priorityTotalWeights.get(endpoint.priority) ?? 0) + (endpoint.load_balancing_weight?.value ?? 0));
    }
    for (const [priority, totalWeight] of priorityTotalWeights.entries()) {
      if (totalWeight > UINT32_MAX) {
        errors.push(`priority ${priority} has total weight greater than UINT32_MAX: ${totalWeight}`);
      }
      if (priority > 0 && !priorityTotalWeights.has(priority - 1)) {
        errors.push(`Endpoints have priority ${priority} but not ${priority - 1}`);
      }
    }
    if (errors.length === 0) {
      return {
        valid: true,
        result: message
      };
    } else {
      return {
        valid: false,
        errors
      };
    }
  }

  decode(context: XdsDecodeContext, resource: Any__Output): XdsDecodeResult {
    if (resource.type_url !== EDS_TYPE_URL) {
      throw new Error(
        `ADS Error: Invalid resource type ${resource.type_url}, expected ${EDS_TYPE_URL}`
      );
    }
    const message = decodeSingleResource(EDS_TYPE_URL, resource.value);
    trace('Decoded raw resource of type ' + EDS_TYPE_URL + ': ' + JSON.stringify(message, undefined, 2));
    const validationResult = this.validateResource(message);
    if (validationResult.valid) {
      return {
        name: validationResult.result.cluster_name,
        value: validationResult.result
      };
    } else {
      return {
        name: message.cluster_name,
        error: `ClusterLoadAssignment message validation failed: [${validationResult.errors}]`
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
