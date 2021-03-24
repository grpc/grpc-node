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
import { LoadBalancerStatsResponse } from './generated/grpc/testing/LoadBalancerStatsResponse';
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
  onCallSucceeded(peerName: string): void;
  onCallFailed(message: string): void;
}

class CallSubscriber {
  private callsStarted = 0;
  private callsSucceededByPeer: {[key: string]: number} = {};
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

  addCallSucceeded(peerName: string): void {
    if (VERBOSITY >= 2) {
      console.log(`Call to ${peerName} succeeded`);
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
      num_failures: this.callsStarted - this.callsSucceeded
    };
  }
}

class CallStatsTracker {

  private subscribers: CallSubscriber[] = [];

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
          this.subscribers.splice(this.subscribers.indexOf(subscriber), 1);
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
        this.subscribers.splice(this.subscribers.indexOf(subscriber), 1);
      }
    }
    return {
      onCallSucceeded: (peerName: string) => {
        for (const subscriber of callSubscribers) {
          subscriber.addCallSucceeded(peerName);
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

type CallType = 'EMPTY_CALL' | 'UNARY_CALL';

interface ClientConfiguration {
  callTypes: (CallType)[];
  metadata: {
    EMPTY_CALL: grpc.Metadata,
    UNARY_CALL: grpc.Metadata
  },
  timeoutSec: number
}

const currentConfig: ClientConfiguration = {
  callTypes: ['EMPTY_CALL'],
  metadata: {
    EMPTY_CALL: new grpc.Metadata(),
    UNARY_CALL: new grpc.Metadata()
  },
  timeoutSec: REQUEST_TIMEOUT_SEC
};

let anyCallSucceeded = false;

const accumulatedStats: LoadBalancerAccumulatedStatsResponse = {
  stats_per_method: {
    'EMPTY_CALL': {
      rpcs_started: 0,
      result: {}
    },
    'UNARY_CALL': {
      rpcs_started: 0,
      result: {}
    }
  }
};

function makeSingleRequest(client: TestServiceClient, type: CallType, failOnFailedRpcs: boolean, callStatsTracker: CallStatsTracker) {
  const callTypeStats = accumulatedStats.stats_per_method![type];
  callTypeStats.rpcs_started! += 1;

  const notifier = callStatsTracker.startCall();
  let gotMetadata: boolean = false;
  let hostname: string | null = null;
  let completed: boolean = false;
  let completedWithError: boolean = false;
  const deadline = new Date();
  deadline.setSeconds(deadline.getSeconds() + currentConfig.timeoutSec);
  const callback = (error: grpc.ServiceError | undefined, value: Empty__Output | undefined) => {
    const statusCode = error?.code ?? grpc.status.OK;
    callTypeStats.result![statusCode] = (callTypeStats.result![statusCode] ?? 0) + 1;
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
          notifier.onCallSucceeded(hostname);
        }
      }
    }
  };
  const method = (type === 'EMPTY_CALL' ? client.emptyCall : client.unaryCall).bind(client);
  const call = method({}, currentConfig.metadata[type], {deadline}, callback);
  call.on('metadata', (metadata) => {
    hostname = (metadata.get('hostname') as string[])[0] ?? null;
    gotMetadata = true;
    if (completed && !completedWithError) {
      if (hostname === null) {
        notifier.onCallFailed('Hostname omitted from call metadata');
      } else {
        notifier.onCallSucceeded(hostname);
      }
    }
  });

}

function sendConstantQps(client: TestServiceClient, qps: number, failOnFailedRpcs: boolean, callStatsTracker: CallStatsTracker) {
  setInterval(() => {
    for (const callType of currentConfig.callTypes) {
      makeSingleRequest(client, callType, failOnFailedRpcs, callStatsTracker);
    }
  }, 1000/qps);
}



function main() {
  const argv = yargs
    .string(['fail_on_failed_rpcs', 'server', 'stats_port'])
    .number(['num_channels', 'qps'])
    .require(['qps', 'server', 'stats_port'])
    .default('num_channels', 1)
    .argv;
  console.log('Starting xDS interop client. Args: ', argv);
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
      callback(null, accumulatedStats);
    }
  }

  const xdsUpdateClientConfigureServiceImpl: XdsUpdateClientConfigureServiceHandlers = {
    Configure: (call, callback) => {
      const callMetadata = {
        EMPTY_CALL: new grpc.Metadata(),
        UNARY_CALL: new grpc.Metadata()
      }
      for (const metadataItem of call.request.metadata) {
        callMetadata[metadataItem.type].add(metadataItem.key, metadataItem.value);
      }
      currentConfig.callTypes = call.request.types;
      currentConfig.metadata = callMetadata;
      currentConfig.timeoutSec = call.request.timeout_sec
      console.log('Received new client configuration: ' + JSON.stringify(currentConfig, undefined, 2));
      callback(null, {});
    }
  }

  const server = new grpc.Server();
  server.addService(loadedProto.grpc.testing.LoadBalancerStatsService.service, loadBalancerStatsServiceImpl);
  server.addService(loadedProto.grpc.testing.XdsUpdateClientConfigureService.service, xdsUpdateClientConfigureServiceImpl);
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