/*
 * Copyright 2020 gRPC authors.
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

import * as grpc from '@grpc/grpc-js';

import * as grpc_xds from '../src';

import { ProtoGrpcType } from './generated/test';

import * as protoLoader from '@grpc/proto-loader';
import { TestServiceClient } from './generated/grpc/testing/TestService';
import { LoadBalancerStatsResponse, _grpc_testing_LoadBalancerStatsResponse_RpcsByPeer__Output } from './generated/grpc/testing/LoadBalancerStatsResponse';
import * as yargs from 'yargs';
import { LoadBalancerStatsServiceHandlers } from './generated/grpc/testing/LoadBalancerStatsService';
import { XdsUpdateClientConfigureServiceHandlers } from './generated/grpc/testing/XdsUpdateClientConfigureService';
import { Empty__Output } from './generated/grpc/testing/Empty';
import { LoadBalancerAccumulatedStatsResponse } from './generated/grpc/testing/LoadBalancerAccumulatedStatsResponse';

grpc_xds.register();

const packageDefinition = protoLoader.loadSync('grpc/testing/test.proto', {
  keepCase: true,
  defaults: true,
  oneofs: true,
  json: true,
  longs: String,
  enums: String,
  includeDirs: [__dirname + '/../../proto']
});

const loadedProto = grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType;

const REQUEST_TIMEOUT_SEC = 20;

const VERBOSITY = Number.parseInt(process.env.NODE_XDS_INTEROP_VERBOSITY ?? '0');

interface CallEndNotifier {
  onCallSucceeded(methodName: string, peerName: string): void;
  onCallFailed(message: string): void;
}

class CallSubscriber {
  private callsStarted = 0;
  private callsSucceededByPeer: {[peer: string]: number} = {};
  private callsSucceededByMethod: {[method: string]: _grpc_testing_LoadBalancerStatsResponse_RpcsByPeer__Output} = {}
  private callsSucceeded = 0;
  private callsFinished = 0;
  private failureMessageCount: Map<string, number> = new Map<string, number>();

  constructor(private callGoal: number, private onFinished: () => void) {}

  addCallStarted(): void {
    if (VERBOSITY >= 2) {
      console.log('Call started');
    }
    this.callsStarted += 1;
  }

  private maybeOnFinished() {
    if (this.callsFinished == this.callGoal) {
      this.onFinished();
    }
  }

  addCallSucceeded(methodName: string, peerName: string): void {
    if (VERBOSITY >= 2) {
      console.log(`Call ${methodName} to ${peerName} succeeded`);
    }
    if (methodName in this.callsSucceededByMethod) {
      if (peerName in this.callsSucceededByMethod[methodName].rpcs_by_peer) {
        this.callsSucceededByMethod[methodName].rpcs_by_peer[peerName] += 1;
      } else {
        this.callsSucceededByMethod[methodName].rpcs_by_peer[peerName] = 1;
      }
    } else {
      this.callsSucceededByMethod[methodName] = {rpcs_by_peer: {[peerName]: 1}};
    }
    if (peerName in this.callsSucceededByPeer) {
      this.callsSucceededByPeer[peerName] += 1;
    } else {    
      this.callsSucceededByPeer[peerName] = 1;
    }
    this.callsSucceeded += 1;
    this.callsFinished += 1;
    this.maybeOnFinished();
  }
  addCallFailed(message: string): void {
    if (VERBOSITY >= 2) {
      console.log(`Call failed with message ${message}`);
    }
    this.callsFinished += 1;
    this.failureMessageCount.set(message, (this.failureMessageCount.get(message) ?? 0) + 1);
    this.maybeOnFinished();
  }

  needsMoreCalls(): boolean {
    return this.callsStarted < this.callGoal;
  }

  getFinalStats(): LoadBalancerStatsResponse {
    if (VERBOSITY >= 1) {
      console.log(`Out of a total of ${this.callGoal} calls requested, ${this.callsFinished} finished. ${this.callsSucceeded} succeeded`);
      for (const [message, count] of this.failureMessageCount) {
        console.log(`${count} failed with the message ${message}`);
      }
    }
    return {
      rpcs_by_peer: this.callsSucceededByPeer,
      num_failures: this.callsStarted - this.callsSucceeded,
      rpcs_by_method: this.callsSucceededByMethod
    };
  }
}

class CallStatsTracker {

  private subscribers: CallSubscriber[] = [];

  private removeSubscriber(subscriber: CallSubscriber) {
    const index = this.subscribers.indexOf(subscriber);
    if (index >= 0) {
      this.subscribers.splice(index, 1);
    }
  }

  getCallStats(callCount: number, timeoutSec: number): Promise<LoadBalancerStatsResponse> {
    return new Promise((resolve, reject) => {
      let finished = false;
      const subscriber = new CallSubscriber(callCount, () => {
        if (!finished) {
          finished = true;
          resolve(subscriber.getFinalStats());
        }
      });
      setTimeout(() => {
        if (!finished) {
          finished = true;
          this.removeSubscriber(subscriber);
          resolve(subscriber.getFinalStats());
        }
      }, timeoutSec * 1000)
      this.subscribers.push(subscriber);
    })
  }

  startCall(): CallEndNotifier {
    const callSubscribers = this.subscribers.slice();
    for (const subscriber of callSubscribers) {
      subscriber.addCallStarted();
      if (!subscriber.needsMoreCalls()) {
        this.removeSubscriber(subscriber);
      }
    }
    return {
      onCallSucceeded: (methodName: string, peerName: string) => {
        for (const subscriber of callSubscribers) {
          subscriber.addCallSucceeded(methodName, peerName);
        }
      },
      onCallFailed: (message: string) => {
        for (const subscriber of callSubscribers) {
          subscriber.addCallFailed(message);
        }
      }
    }
  }
}

class RecentTimestampList {
  private timeList: bigint[] = [];
  private nextIndex = 0;

  constructor(private readonly size: number) {}

  isFull() {
    return this.timeList.length === this.size;
  }

  insertTimestamp(timestamp: bigint) {
    this.timeList[this.nextIndex] = timestamp;
    this.nextIndex = (this.nextIndex + 1) % this.size;
  }

  getSpan(): bigint {
    const lastIndex = (this.nextIndex + this.size - 1) % this.size;
    return this.timeList[lastIndex] - this.timeList[this.nextIndex];
  }
}

type CallType = 'EmptyCall' | 'UnaryCall';

interface ClientConfiguration {
  callTypes: (CallType)[];
  metadata: {
    EmptyCall: grpc.Metadata,
    UnaryCall: grpc.Metadata
  },
  timeoutSec: number
}

const currentConfig: ClientConfiguration = {
  callTypes: ['UnaryCall'],
  metadata: {
    EmptyCall: new grpc.Metadata(),
    UnaryCall: new grpc.Metadata()
  },
  timeoutSec: REQUEST_TIMEOUT_SEC
};

let anyCallSucceeded = false;

const accumulatedStats: LoadBalancerAccumulatedStatsResponse = {
  num_rpcs_started_by_method: {
    EMPTY_CALL: 0,
    UNARY_CALL: 0
  },
  num_rpcs_succeeded_by_method: {
    EMPTY_CALL: 0,
    UNARY_CALL: 0
  },
  num_rpcs_failed_by_method: {
    EMPTY_CALL: 0,
    UNARY_CALL: 0
  },
  stats_per_method: {
    EMPTY_CALL: {
      rpcs_started: 0,
      result: {}
    },
    UNARY_CALL: {
      rpcs_started: 0,
      result: {}
    }
  }
};

function addAccumulatedCallStarted(callName: string) {
  accumulatedStats.stats_per_method![callName].rpcs_started! += 1;
  accumulatedStats.num_rpcs_started_by_method![callName] += 1;
}

function addAccumulatedCallEnded(callName: string, result: grpc.status) {
  accumulatedStats.stats_per_method![callName].result![result] = (accumulatedStats.stats_per_method![callName].result![result] ?? 0) + 1;
  if (result === grpc.status.OK) {
    accumulatedStats.num_rpcs_succeeded_by_method![callName] += 1;
  } else {
    accumulatedStats.num_rpcs_failed_by_method![callName] += 1;
  }
}

const callTimeHistogram: {[callType: string]: {[status: number]: number[]}} = {
  UnaryCall: {},
  EmptyCall: {}
}

function renderHistogram(histogram: number[]): string {
  const maxValue = Math.max(...histogram);
  const maxIndexLength = `${histogram.length - 1}`.length;
  const maxBarWidth = 60;
  const result: string[] = [];
  result.push('-'.repeat(maxIndexLength + maxBarWidth + 1));
  for (let i = 0; i < histogram.length; i++) {
    result.push(`${' '.repeat(maxIndexLength - `${i}`.length)}${i}|${'█'.repeat(maxBarWidth * histogram[i] / maxValue)}`);
  }
  return result.join('\n');
}

function printAllHistograms() {
  console.log('Call duration histograms');
  for (const callType in callTimeHistogram) {
    console.log(callType);
    const x = callTimeHistogram[callType];
    for (const statusCode in callTimeHistogram[callType]) {
      console.log(`${statusCode} ${grpc.status[statusCode]}`);
      console.log(renderHistogram(callTimeHistogram[callType][statusCode]));
    }
  }
}

/**
 * Timestamps output by process.hrtime.bigint() are a bigint number of
 * nanoseconds. This is the representation of 1 second in that context.
 */
const TIMESTAMP_ONE_SECOND = BigInt(1e9);

function makeSingleRequest(client: TestServiceClient, type: CallType, failOnFailedRpcs: boolean, callStatsTracker: CallStatsTracker, callStartTimestamps: RecentTimestampList) {
  const callEnumName = callTypeEnumMapReverse[type];
  addAccumulatedCallStarted(callEnumName);
  const notifier = callStatsTracker.startCall();
  let gotMetadata: boolean = false;
  let hostname: string | null = null;
  let completed: boolean = false;
  let completedWithError: boolean = false;
  const startTime = process.hrtime.bigint();
  const deadline = new Date();
  deadline.setSeconds(deadline.getSeconds() + currentConfig.timeoutSec);
  const callback = (error: grpc.ServiceError | undefined, value: Empty__Output | undefined) => {
    const statusCode = error?.code ?? grpc.status.OK;
    const duration = process.hrtime.bigint() - startTime;
    const durationSeconds = Number(duration / TIMESTAMP_ONE_SECOND) | 0;
    if (!callTimeHistogram[type][statusCode]) {
      callTimeHistogram[type][statusCode] = [];
    }
    if (callTimeHistogram[type][statusCode][durationSeconds]) {
      callTimeHistogram[type][statusCode][durationSeconds] += 1;
    } else {
      callTimeHistogram[type][statusCode][durationSeconds] = 1;
    }
    addAccumulatedCallEnded(callEnumName, statusCode);
    if (error) {
      if (failOnFailedRpcs && anyCallSucceeded) {
        console.error('A call failed after a call succeeded');
        process.exit(1);
      }
      completed = true;
      completedWithError = true;
      notifier.onCallFailed(error.message);
    } else {
      anyCallSucceeded = true;
      if (gotMetadata) {
        if (hostname === null) {
          notifier.onCallFailed('Hostname omitted from call metadata');
        } else {
          notifier.onCallSucceeded(type, hostname);
        }
      }
    }
  };
  const method = (type === 'EmptyCall' ? client.emptyCall : client.unaryCall).bind(client);
  const call = method({}, currentConfig.metadata[type], {deadline}, callback);
  call.on('metadata', (metadata) => {
    hostname = (metadata.get('hostname') as string[])[0] ?? null;
    gotMetadata = true;
    if (completed && !completedWithError) {
      if (hostname === null) {
        notifier.onCallFailed('Hostname omitted from call metadata');
      } else {
        notifier.onCallSucceeded(type, hostname);
      }
    }
  });
  /* callStartTimestamps tracks the last N timestamps of started calls, where N
   * is the target QPS. If the measured span of time between the first and last
   * of those N calls is greater than 1 second, we make another call
   * ~immediately to correct for that. */
  callStartTimestamps.insertTimestamp(startTime);
  if (callStartTimestamps.isFull()) {
    if (callStartTimestamps.getSpan() > TIMESTAMP_ONE_SECOND) {
      setImmediate(() => {
        makeSingleRequest(client, type, failOnFailedRpcs, callStatsTracker, callStartTimestamps);
      });
    }
  }
}

function sendConstantQps(client: TestServiceClient, qps: number, failOnFailedRpcs: boolean, callStatsTracker: CallStatsTracker) {
  const callStartTimestampsTrackers: {[callType: string]: RecentTimestampList} = {};
  for (const callType of ['EmptyCall', 'UnaryCall']) {
    callStartTimestampsTrackers[callType] = new RecentTimestampList(qps);
  }
  setInterval(() => {
    for (const callType of currentConfig.callTypes) {
      makeSingleRequest(client, callType, failOnFailedRpcs, callStatsTracker, callStartTimestampsTrackers[callType]);
    }
  }, 1000/qps);
  setInterval(() => {
    console.log(`Accumulated stats: ${JSON.stringify(accumulatedStats, undefined, 2)}`);
  }, 1000);
}

const callTypeEnumMap = {
  'EMPTY_CALL': 'EmptyCall' as CallType,
  'UNARY_CALL': 'UnaryCall' as CallType
};

const callTypeEnumMapReverse = {
  'EmptyCall': 'EMPTY_CALL',
  'UnaryCall': 'UNARY_CALL'
}

const DEFAULT_TIMEOUT_SEC = 20;

function main() {
  const argv = yargs
    .string(['fail_on_failed_rpcs', 'server', 'stats_port', 'rpc', 'metadata'])
    .number(['num_channels', 'qps', 'rpc_timeout_sec'])
    .demandOption(['server', 'stats_port'])
    .default('num_channels', 1)
    .default('qps', 1)
    .default('rpc', 'UnaryCall')
    .default('metadata', '')
    .default('rpc_timeout_sec', DEFAULT_TIMEOUT_SEC)
    .argv;
  console.log('Starting xDS interop client. Args: ', argv);
  currentConfig.callTypes = argv.rpc.split(',').filter(value => value === 'EmptyCall' || value === 'UnaryCall') as CallType[];
  currentConfig.timeoutSec = argv.rpc_timeout_sec;
  for (const item of argv.metadata.split(',')) {
    const [method, key, value] = item.split(':');
    if (value === undefined) {
      continue;
    }
    if (method !== 'EmptyCall' && method !== 'UnaryCall') {
      continue;
    }
    currentConfig.metadata[method].add(key, value);
  }
  console.log('EmptyCall metadata: ' + JSON.stringify(currentConfig.metadata.EmptyCall.getMap()));
  console.log('UnaryCall metadata: ' + JSON.stringify(currentConfig.metadata.UnaryCall.getMap()));
  const callStatsTracker = new CallStatsTracker();
  for (let i = 0; i < argv.num_channels; i++) {
    /* The 'unique' channel argument is there solely to ensure that the
     * channels do not share any subchannels. It does not have any
     * inherent function. */
    console.log(`Interop client channel ${i} starting sending ${argv.qps} QPS to ${argv.server}`);
    sendConstantQps(new loadedProto.grpc.testing.TestService(argv.server, grpc.credentials.createInsecure(), {'unique': i}), 
      argv.qps, 
      argv.fail_on_failed_rpcs === 'true', 
      callStatsTracker);
  }

  const loadBalancerStatsServiceImpl: LoadBalancerStatsServiceHandlers = {
    GetClientStats: (call, callback) => {
      console.log(`Received stats request with num_rpcs=${call.request.num_rpcs} and timeout_sec=${call.request.num_rpcs}`);
      callStatsTracker.getCallStats(call.request.num_rpcs, call.request.timeout_sec).then((value) => {
        console.log(`Sending stats response: ${JSON.stringify(value)}`);
        callback(null, value);
      }, (error) => {
        callback({code: grpc.status.ABORTED, details: 'Call stats collection failed'});
      });
    },
    GetClientAccumulatedStats: (call, callback) => {
      console.log(`Sending accumulated stats response: ${JSON.stringify(accumulatedStats)}`);
      printAllHistograms();
      callback(null, accumulatedStats);
    }
  }

  const xdsUpdateClientConfigureServiceImpl: XdsUpdateClientConfigureServiceHandlers = {
    Configure: (call, callback) => {
      console.log('Received new client configuration: ' + JSON.stringify(call.request, undefined, 2));
      const callMetadata = {
        EmptyCall: new grpc.Metadata(),
        UnaryCall: new grpc.Metadata()
      };
      for (const metadataItem of call.request.metadata) {
        callMetadata[callTypeEnumMap[metadataItem.type]].add(metadataItem.key, metadataItem.value);
      }
      currentConfig.callTypes = call.request.types.map(value => callTypeEnumMap[value]);
      currentConfig.metadata = callMetadata;
      if (call.request.timeout_sec > 0) {
        currentConfig.timeoutSec = call.request.timeout_sec;
      } else {
        currentConfig.timeoutSec = DEFAULT_TIMEOUT_SEC;
      }
      console.log('Updated to new client configuration: ' + JSON.stringify(currentConfig, undefined, 2));
      callback(null, {});
    }
  }

  const server = new grpc.Server();
  server.addService(loadedProto.grpc.testing.LoadBalancerStatsService.service, loadBalancerStatsServiceImpl);
  server.addService(loadedProto.grpc.testing.XdsUpdateClientConfigureService.service, xdsUpdateClientConfigureServiceImpl);
  grpc.addAdminServicesToServer(server);
  server.bindAsync(`0.0.0.0:${argv.stats_port}`, grpc.ServerCredentials.createInsecure(), (error, port) => {
    if (error) {
      throw error;
    }
    console.log(`Starting stats service server bound to port ${port}`);
    server.start();
  });
}

if (require.main === module) {
  main();
}