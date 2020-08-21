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

import * as grpc from '../src';

import { ProtoGrpcType } from './generated/test';

import * as protoLoader from '@grpc/proto-loader';
import { TestServiceClient } from './generated/grpc/testing/TestService';
import { LoadBalancerStatsResponse } from './generated/grpc/testing/LoadBalancerStatsResponse';
import * as yargs from 'yargs';
import { LoadBalancerStatsServiceHandlers } from './generated/grpc/testing/LoadBalancerStatsService';

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

interface CallEndNotifier {
  onCallSucceeded(peerName: string): void;
  onCallFailed(): void;
}

class CallSubscriber {
  private callsStarted = 0;
  private callsSucceededByPeer: {[key: string]: number} = {};
  private callsSucceeded = 0;
  private callsFinished = 0;

  constructor(private callGoal: number, private onFinished: () => void) {}

  addCallStarted(): void {
    this.callsStarted += 1;
  }

  private maybeOnFinished() {
    if (this.callsFinished == this.callGoal) {
      this.onFinished();
    }
  }

  addCallSucceeded(peerName: string): void {
    if (peerName in this.callsSucceededByPeer) {
      this.callsSucceededByPeer[peerName] += 1;
    } else {    
      this.callsSucceededByPeer[peerName] = 1;
    }
    this.callsSucceeded += 1;
    this.callsFinished += 1;
    this.maybeOnFinished();
  }
  addCallFailed(): void {
    this.callsFinished += 1;
    this.maybeOnFinished();
  }

  needsMoreCalls(): boolean {
    return this.callsStarted < this.callGoal;
  }

  getFinalStats(): LoadBalancerStatsResponse {
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
      onCallFailed: () => {
        for (const subscriber of callSubscribers) {
          subscriber.addCallFailed();
        }
      }
    }
  }
}

function sendConstantQps(client: TestServiceClient, qps: number, failOnFailedRpcs: boolean, callStatsTracker: CallStatsTracker) {
  let anyCallSucceeded: boolean = false;
  setInterval(() => {
    const notifier = callStatsTracker.startCall();
    let gotMetadata: boolean = false;
    let hostname: string | null = null;
    let completed: boolean = false;
    let completedWithError: boolean = false;
    const call = client.emptyCall({}, (error, value) => {
      if (error) {
        if (failOnFailedRpcs && anyCallSucceeded) {
          console.error('A call failed after a call succeeded');
          process.exit(1);
        }
        completed = true;
        completedWithError = true;
        notifier.onCallFailed();
      } else {
        anyCallSucceeded = true;
        if (gotMetadata) {
          if (hostname === null) {
            notifier.onCallFailed()
          } else {
            notifier.onCallSucceeded(hostname);
          }
        }
      }
    });
    call.on('metadata', (metadata) => {
      hostname = (metadata.get('hostname') as string[])[0] ?? null;
      gotMetadata = true;
      if (completed && !completedWithError) {
        if (hostname === null) {
          notifier.onCallFailed();
        } else {
          notifier.onCallSucceeded(hostname);
        }
      }
    })
  }, 1000/qps);
}



function main() {
  const argv = yargs
    .string(['fail_on_failed_rpcs', 'server', 'stats_port'])
    .number(['num_channels', 'qps'])
    .require(['fail_on_failed_rpcs', 'num_channels', 'qps', 'server', 'stats_port'])
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
      callStatsTracker.getCallStats(call.request.num_rpcs, call.request.timeout_sec).then((value) => {
        callback(null, value);
      }, (error) => {
        callback({code: grpc.status.ABORTED, details: 'Call stats collection failed'});
      });
    }
  }

  const server = new grpc.Server();
  server.addService(loadedProto.grpc.testing.LoadBalancerStatsService.service, loadBalancerStatsServiceImpl);
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