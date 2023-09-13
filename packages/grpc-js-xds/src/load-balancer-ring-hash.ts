/*
 * Copyright 2023 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { experimental, logVerbosity, connectivityState, status, Metadata, ChannelOptions, LoadBalancingConfig } from '@grpc/grpc-js';
import { isLocalityEndpoint } from './load-balancer-priority';
import TypedLoadBalancingConfig = experimental.TypedLoadBalancingConfig;
import LeafLoadBalancer = experimental.LeafLoadBalancer;
import Endpoint = experimental.Endpoint;
import Picker = experimental.Picker;
import PickArgs = experimental.PickArgs;
import PickResult = experimental.PickResult;
import PickResultType = experimental.PickResultType;
import LoadBalancer = experimental.LoadBalancer;
import ChannelControlHelper = experimental.ChannelControlHelper;
import createChildChannelControlHelper = experimental.createChildChannelControlHelper;
import UnavailablePicker = experimental.UnavailablePicker;
import subchannelAddressToString = experimental.subchannelAddressToString;
import registerLoadBalancerType = experimental.registerLoadBalancerType;
import EndpointMap = experimental.EndpointMap;
import { loadXxhashApi, xxhashApi } from './xxhash';
import { EXPERIMENTAL_RING_HASH } from './environment';
import { loadProtosWithOptionsSync } from '@grpc/proto-loader/build/src/util';
import { RingHash__Output } from './generated/envoy/extensions/load_balancing_policies/ring_hash/v3/RingHash';
import { Any__Output } from './generated/google/protobuf/Any';
import { TypedExtensionConfig__Output } from './generated/envoy/config/core/v3/TypedExtensionConfig';
import { LoadBalancingPolicy__Output } from './generated/envoy/config/cluster/v3/LoadBalancingPolicy';
import { registerLbPolicy } from './lb-policy-registry';

const TRACER_NAME = 'ring_hash';

function trace(text: string): void {
  experimental.trace(logVerbosity.DEBUG, TRACER_NAME, text);
}

const TYPE_NAME = 'ring_hash';

const DEFAULT_MIN_RING_SIZE = 1024;
const DEFAULT_MAX_RING_SIZE = 4096;
const ABSOLUTE_MAX_RING_SIZE = 8_388_608;
const DEFAULT_RING_SIZE_CAP = 4096;

class RingHashLoadBalancingConfig implements TypedLoadBalancingConfig {
  private minRingSize: number;
  private maxRingSize: number;
  constructor(minRingSize?: number, maxRingSize?: number) {
    this.minRingSize = Math.min(
      minRingSize ?? DEFAULT_MIN_RING_SIZE,
      ABSOLUTE_MAX_RING_SIZE
    );
    this.maxRingSize = Math.min(
      maxRingSize ?? DEFAULT_MAX_RING_SIZE,
      ABSOLUTE_MAX_RING_SIZE
    );
  }
  getLoadBalancerName(): string {
    return TYPE_NAME;
  }
  toJsonObject(): object {
    return {
      [TYPE_NAME]: {
        min_ring_size: this.minRingSize,
        max_ring_size: this.maxRingSize,
      }
    };
  }
  getMinRingSize() {
    return this.minRingSize;
  }
  getMaxRingSize() {
    return this.maxRingSize;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static createFromJson(obj: any): TypedLoadBalancingConfig {
    if ('min_ring_size' in obj) {
      if (typeof obj.min_ring_size === 'number') {
        if (obj.min_ring_size > ABSOLUTE_MAX_RING_SIZE) {
          throw new Error(`ring_hash config field min_ring_size exceeds the cap of ${ABSOLUTE_MAX_RING_SIZE}: ${obj.min_ring_size}`);
        }
      } else {
        throw new Error(
          'ring_hash config field min_ring_size must be a number if provided'
        );
      }
    }
    if ('max_ring_size' in obj) {
      if (typeof obj.max_ring_size === 'number') {
        if (obj.max_ring_size > ABSOLUTE_MAX_RING_SIZE) {
          throw new Error(`ring_hash config field max_ring_size exceeds the cap of ${ABSOLUTE_MAX_RING_SIZE}: ${obj.max_ring_size}`);
        }
      } else {
        throw new Error(
          'ring_hash config field max_ring_size must be a number if provided'
        );
      }
    }
    return new RingHashLoadBalancingConfig(
      obj.min_ring_size,
      obj.max_ring_size
    );
  }
}

interface RingEntry {
  leafBalancer: LeafLoadBalancer;
  hash: bigint;
}

interface EndpointWeight {
  endpoint: Endpoint;
  weight: number;
  normalizedWeight: number;
}

class RingHashPicker implements Picker {
  constructor(private ring: RingEntry[]) {}
  /**
   * Find the least index in the ring with a hash greater than or equal to the
   * hash parameter, or 0 if no such index exists.
   * @param hash
   */
  private findIndexForHash(hash: bigint): number {
    // Binary search to find the target index
    let low = 0;
    let high = this.ring.length;
    let index = 0;
    while (low <= high) {
      /* Commonly in binary search, this operation can overflow and result in
       * the wrong value. However, in this case the ring size is absolutely
       * limtied to 1<<23, so low+high < MAX_SAFE_INTEGER */
      index = Math.floor((low + high) / 2);
      if (index === this.ring.length) {
        index = 0;
        break;
      }
      const midval = this.ring[index].hash;
      const midval1 = index === 0 ? 0n : this.ring[index - 1].hash;
      if (hash <= midval && hash > midval1) {
        break;
      }
      if (midval < hash) {
        low = index + 1;
      } else {
        high = index - 1;
      }
      if (low > high) {
        index = 0;
        break;
      }
    }
    return index;
  }
  pick(pickArgs: PickArgs): PickResult {
    trace('Pick called. Hash=' + pickArgs.extraPickInfo.hash);
    const firstIndex = this.findIndexForHash(
      BigInt(pickArgs.extraPickInfo.hash)
    );
    for (let i = 0; i < this.ring.length; i++) {
      const index = (firstIndex + i) % this.ring.length;
      const entryState = this.ring[index].leafBalancer.getConnectivityState();
      if (entryState === connectivityState.READY) {
        return this.ring[index].leafBalancer.getPicker().pick(pickArgs);
      }
      if (entryState === connectivityState.IDLE) {
        this.ring[index].leafBalancer.startConnecting();
        return {
          pickResultType: PickResultType.QUEUE,
          subchannel: null,
          status: null,
          onCallStarted: null,
          onCallEnded: null,
        };
      }
      if (entryState === connectivityState.CONNECTING) {
        return {
          pickResultType: PickResultType.QUEUE,
          subchannel: null,
          status: null,
          onCallStarted: null,
          onCallEnded: null,
        };
      }
    }
    return {
      pickResultType: PickResultType.TRANSIENT_FAILURE,
      status: {
        code: status.UNAVAILABLE,
        details:
          'ring_hash: invalid state: all child balancers in TRANSIENT_FAILURE',
        metadata: new Metadata(),
      },
      subchannel: null,
      onCallStarted: null,
      onCallEnded: null,
    };
  }
}

class RingHashLoadBalancer implements LoadBalancer {
  /**
   * Tracks endpoint repetition across address updates, to use an appropriate
   * existing leaf load balancer for the same endpoint when possible.
   */
  private leafMap = new EndpointMap<LeafLoadBalancer>();
  /**
   * Tracks endpoints from a single address update, with their associated
   * weights aggregated from all weights associated with that endpoint in that
   * update.
   */
  private leafWeightMap = new EndpointMap<number>();
  private childChannelControlHelper: ChannelControlHelper;
  private updatesPaused = false;
  private currentState: connectivityState = connectivityState.IDLE;
  private ring: RingEntry[] = [];
  private ringHashSizeCap = DEFAULT_RING_SIZE_CAP;
  constructor(private channelControlHelper: ChannelControlHelper, private options: ChannelOptions) {
    this.childChannelControlHelper = createChildChannelControlHelper(
      channelControlHelper,
      {
        updateState: (state, picker) => {
          this.calculateAndUpdateState();
          /* If this LB policy is in the TRANSIENT_FAILURE state, requests will
           * not trigger new connections, so we need to explicitly try connecting
           * to other endpoints that are currently IDLE to try to eventually
           * connect to something. */
          if (
            state === connectivityState.TRANSIENT_FAILURE &&
            this.currentState === connectivityState.TRANSIENT_FAILURE
          ) {
            for (const leaf of this.leafMap.values()) {
              const leafState = leaf.getConnectivityState();
              if (leafState === connectivityState.CONNECTING) {
                break;
              }
              if (leafState === connectivityState.IDLE) {
                leaf.startConnecting();
                break;
              }
            }
          }
        },
      }
    );
    if (options['grpc.lb.ring_hash.ring_size_cap'] !== undefined) {
      this.ringHashSizeCap = options['grpc.lb.ring_hash.ring_size_cap'];
    }
  }

  private calculateAndUpdateState() {
    if (this.updatesPaused) {
      return;
    }
    const stateCounts = {
      [connectivityState.READY]: 0,
      [connectivityState.TRANSIENT_FAILURE]: 0,
      [connectivityState.CONNECTING]: 0,
      [connectivityState.IDLE]: 0,
      [connectivityState.SHUTDOWN]: 0,
    };
    for (const leaf of this.leafMap.values()) {
      stateCounts[leaf.getConnectivityState()] += 1;
    }
    if (stateCounts[connectivityState.READY] > 0) {
      this.updateState(connectivityState.READY, new RingHashPicker(this.ring));
      // REPORT READY
    } else if (stateCounts[connectivityState.TRANSIENT_FAILURE] > 1) {
      this.updateState(
        connectivityState.TRANSIENT_FAILURE,
        new UnavailablePicker()
      );
    } else if (stateCounts[connectivityState.CONNECTING] > 0) {
      this.updateState(
        connectivityState.CONNECTING,
        new RingHashPicker(this.ring)
      );
    } else if (
      stateCounts[connectivityState.TRANSIENT_FAILURE] > 0 &&
      this.leafMap.size > 1
    ) {
      this.updateState(
        connectivityState.CONNECTING,
        new RingHashPicker(this.ring)
      );
    } else if (stateCounts[connectivityState.IDLE] > 0) {
      this.updateState(connectivityState.IDLE, new RingHashPicker(this.ring));
    } else {
      this.updateState(
        connectivityState.TRANSIENT_FAILURE,
        new UnavailablePicker()
      );
    }
  }

  private updateState(newState: connectivityState, picker: Picker) {
    trace(
      connectivityState[this.currentState] +
        ' -> ' +
        connectivityState[newState]
    );
    this.currentState = newState;
    this.channelControlHelper.updateState(newState, picker);
  }

  private constructRing(
    endpointList: Endpoint[],
    config: RingHashLoadBalancingConfig
  ) {
    this.ring = [];
    const endpointWeights: EndpointWeight[] = [];
    let weightSum = 0;
    for (const endpoint of endpointList) {
      const weight = this.leafWeightMap.get(endpoint) ?? 1;
      endpointWeights.push({ endpoint, weight, normalizedWeight: 0 });
      weightSum += weight;
    }
    /* The normalized weights sum to 1, with some small potential error due to
     * the limitation of floating point precision. */
    let minNormalizedWeight = 1;
    for (const endpointWeight of endpointWeights) {
      endpointWeight.normalizedWeight = endpointWeight.weight / weightSum;
      minNormalizedWeight = Math.min(
        endpointWeight.normalizedWeight,
        minNormalizedWeight
      );
    }
    const minRingSize = Math.min(config.getMinRingSize(), this.ringHashSizeCap);
    const maxRingSize = Math.min(config.getMaxRingSize(), this.ringHashSizeCap);
    /* Calculate a scale factor that meets the following conditions:
     *  1. The result is between minRingSize and maxRingSize, inclusive
     *  2. The smallest normalized weight is scaled to a whole number, if it
     *     does not violate the previous condition.
     * The size of the ring is ceil(scale)
     */
    const scale = Math.min(
      Math.ceil(minNormalizedWeight * minRingSize) / minNormalizedWeight,
      maxRingSize
    );
    trace('Creating a ring with size ' + Math.ceil(scale));
    /* For each endpoint, create a number of entries proportional to its
     * weight, such that the total number of entries is equal to ceil(scale).
     */
    let currentHashes = 0;
    let targetHashes = 0;
    for (const endpointWeight of endpointWeights) {
      const addressString = subchannelAddressToString(
        endpointWeight.endpoint.addresses[0]
      );
      targetHashes += scale * endpointWeight.normalizedWeight;
      const leafBalancer = this.leafMap.get(endpointWeight.endpoint);
      if (!leafBalancer) {
        throw new Error(
          'ring_hash: Invalid state: endpoint found in leafWeightMap but not in leafMap'
        );
      }
      let count = 0;
      while (currentHashes < targetHashes) {
        const hashKey = `${addressString}_${count}`;
        const hash = xxhashApi!.h64(hashKey, 0n);
        this.ring.push({ hash, leafBalancer });
        currentHashes++;
        count++;
      }
    }
    /* The ring is sorted by the hash so that it can be efficiently searched
     * for a hash that is closest to any arbitrary hash. */
    this.ring.sort((a, b) => {
      if (a.hash > b.hash) {
        return 1;
      } else if (a.hash < b.hash) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  updateAddressList(
    endpointList: Endpoint[],
    lbConfig: TypedLoadBalancingConfig,
    attributes: { [key: string]: unknown }
  ): void {
    if (!(lbConfig instanceof RingHashLoadBalancingConfig)) {
      trace('Discarding address update with unrecognized config ' + JSON.stringify(lbConfig.toJsonObject(), undefined, 2));
      return;
    }
    trace('Received update with config ' + JSON.stringify(lbConfig.toJsonObject(), undefined, 2));
    this.updatesPaused = true;
    this.leafWeightMap.clear();
    const dedupedEndpointList: Endpoint[] = [];
    for (const endpoint of endpointList) {
      const leafBalancer = this.leafMap.get(endpoint);
      if (leafBalancer) {
        leafBalancer.updateEndpoint(endpoint);
      } else {
        this.leafMap.set(
          endpoint,
          new LeafLoadBalancer(endpoint, this.childChannelControlHelper, this.options)
        );
      }
      const weight = this.leafWeightMap.get(endpoint);
      if (weight === undefined) {
        dedupedEndpointList.push(endpoint);
      }
      this.leafWeightMap.set(endpoint, (weight ?? 0) + (isLocalityEndpoint(endpoint) ? endpoint.endpointWeight : 1));
    }
    const removedLeaves = this.leafMap.deleteMissing(endpointList);
    for (const leaf of removedLeaves) {
      leaf.destroy();
    }
    loadXxhashApi().then(() => {
      this.constructRing(dedupedEndpointList, lbConfig);
      this.updatesPaused = false;
      this.calculateAndUpdateState();
    });
  }
  exitIdle(): void {
    /* This operation does not make sense here. We don't want to make the whole
     * balancer exit idle, and instead propagate that to individual chlidren as
     * relevant. */
  }
  resetBackoff(): void {
    // There is no backoff to reset here
  }
  destroy(): void {
    this.ring = [];
    for (const child of this.leafMap.values()) {
      child.destroy();
    }
    this.leafMap.clear();
    this.leafWeightMap.clear();
  }
  getTypeName(): string {
    return TYPE_NAME;
  }
}

const RING_HASH_TYPE_URL = 'type.googleapis.com/envoy.extensions.load_balancing_policies.ring_hash.v3.RingHash';

const resourceRoot = loadProtosWithOptionsSync([
  'envoy/extensions/load_balancing_policies/ring_hash/v3/ring_hash.proto'], {
    keepCase: true,
    includeDirs: [
      // Paths are relative to src/build
      __dirname + '/../../deps/envoy-api/',
      __dirname + '/../../deps/xds/',
      __dirname + '/../../deps/protoc-gen-validate'
    ],
  }
);

const toObjectOptions = {
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
}

function decodeRingHash(message: Any__Output): RingHash__Output {
  const name = message.type_url.substring(message.type_url.lastIndexOf('/') + 1);
  const type = resourceRoot.lookup(name);
  if (type) {
    const decodedMessage = (type as any).decode(message.value);
    return decodedMessage.$type.toObject(decodedMessage, toObjectOptions) as RingHash__Output;
  } else {
    throw new Error(`TypedStruct parsing error: unexpected type URL ${message.type_url}`);
  }
}

function convertToLoadBalancingPolicy(protoPolicy: TypedExtensionConfig__Output, selectChildPolicy: (childPolicy: LoadBalancingPolicy__Output) => LoadBalancingConfig): LoadBalancingConfig {
  if (protoPolicy.typed_config?.type_url !== RING_HASH_TYPE_URL) {
    throw new Error(`Ring Hash LB policy parsing error: unexpected type URL ${protoPolicy.typed_config?.type_url}`);
  }
  const ringHashMessage = decodeRingHash(protoPolicy.typed_config);
  if (ringHashMessage.hash_function !== 'XX_HASH') {
    throw new Error(`Ring Hash LB policy parsing error: unexpected hash function ${ringHashMessage.hash_function}`);
  }
  return {
    [TYPE_NAME]: {
      min_ring_size: ringHashMessage.minimum_ring_size?.value ?? 1024,
      max_ring_size: ringHashMessage.maximum_ring_size?.value ?? 8_388_608
    }
  };
}

export function setup() {
  if (EXPERIMENTAL_RING_HASH) {
    registerLoadBalancerType(
      TYPE_NAME,
      RingHashLoadBalancer,
      RingHashLoadBalancingConfig
    );
    registerLbPolicy(RING_HASH_TYPE_URL, convertToLoadBalancingPolicy);
  }
}
