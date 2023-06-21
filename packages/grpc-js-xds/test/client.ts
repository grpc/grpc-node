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

import { credentials, loadPackageDefinition, ServiceError } from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import { ProtoGrpcType } from "./generated/echo";
import { EchoTestServiceClient } from "./generated/grpc/testing/EchoTestService";
import { XdsServer } from "./xds-server";

const loadedProtos = loadPackageDefinition(loadSync(
  [
    'grpc/testing/echo.proto'
  ],
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
    json: true,
    includeDirs: [
      // Paths are relative to build/test
      __dirname + '/../../proto/'
    ],
  })) as unknown as ProtoGrpcType;

const BOOTSTRAP_CONFIG_KEY = 'grpc.TEST_ONLY_DO_NOT_USE_IN_PROD.xds_bootstrap_config';

export class XdsTestClient {
  private client: EchoTestServiceClient;
  private callInterval: NodeJS.Timer;

  constructor(target: string, bootstrapInfo: string) {
    this.client = new loadedProtos.grpc.testing.EchoTestService(target, credentials.createInsecure(), {[BOOTSTRAP_CONFIG_KEY]: bootstrapInfo});
    this.callInterval = setInterval(() => {}, 0);
    clearInterval(this.callInterval);
  }

  static createFromServer(targetName: string, xdsServer: XdsServer) {
    return new XdsTestClient(`xds:///${targetName}`, xdsServer.getBootstrapInfoString());
  }

  startCalls(interval: number) {
    clearInterval(this.callInterval);
    this.callInterval = setInterval(() => {
      this.client.echo({message: 'test'}, (error, value) => {
        if (error) {
          throw error;
        }
      });
    }, interval);
  }

  stopCalls() {
    clearInterval(this.callInterval);
  }

  close() {
    this.stopCalls();
    this.client.close();
  }

  sendOneCall(callback: (error: ServiceError | null) => void) {
    const deadline = new Date();
    deadline.setMilliseconds(deadline.getMilliseconds() + 500);
    this.client.echo({message: 'test'}, {deadline}, (error, value) => {
      callback(error);
    });
  }

  sendNCalls(count: number, callback: (error: ServiceError| null) => void) {
    const sendInner = (count: number, callback: (error: ServiceError| null) => void) => {
      if (count === 0) {
        callback(null);
        return;
      }
      this.sendOneCall(error => {
        if (error) {
          callback(error);
          return;
        }
        sendInner(count-1, callback);
      });
    }
    sendInner(count, callback);
  }
}
