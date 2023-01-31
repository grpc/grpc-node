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

import { loadPackageDefinition, sendUnaryData, Server, ServerCredentials, ServerUnaryCall, UntypedServiceImplementation } from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import { ProtoGrpcType } from "./generated/echo";
import { EchoRequest__Output } from "./generated/grpc/testing/EchoRequest";
import { EchoResponse } from "./generated/grpc/testing/EchoResponse";

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

export class Backend {
  private server: Server | null = null;
  private receivedCallCount = 0;
  private callListeners: (() => void)[] = [];
  private port: number | null = null;
  constructor() {
  }
  Echo(call: ServerUnaryCall<EchoRequest__Output, EchoResponse>, callback: sendUnaryData<EchoResponse>) {
    // call.request.params is currently ignored
    this.addCall();
    callback(null, {message: call.request.message});
  }

  addCall() {
    this.receivedCallCount++;
    this.callListeners.forEach(listener => listener());
  }

  onCall(listener: () => void) {
    this.callListeners.push(listener);
  }

  start(callback: (error: Error | null, port: number) => void) {
    if (this.server) {
      throw new Error("Backend already running");
    }
    this.server = new Server();
    this.server.addService(loadedProtos.grpc.testing.EchoTestService.service, this as unknown as UntypedServiceImplementation);
    const boundPort = this.port ?? 0;
    this.server.bindAsync(`localhost:${boundPort}`, ServerCredentials.createInsecure(), (error, port) => {
      if (!error) {
        this.port = port;
        this.server!.start();
      }
      callback(error, port);
    })
  }

  startAsync(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.start((error, port) => {
        if (error) {
          reject(error);
        } else {
          resolve(port);
        }
      });
    });
  }
  
  getPort(): number {
    if (this.port === null) {
      throw new Error('Port not set. Backend not yet started.');
    }
    return this.port;
  }

  getCallCount() {
    return this.receivedCallCount;
  }

  resetCallCount() {
    this.receivedCallCount = 0;
  }

  shutdown(callback: (error?: Error) => void) {
    if (this.server) {
      this.server.tryShutdown(error => {
        this.server = null;
        callback(error);
      });
    } else {
      process.nextTick(callback);
    }
  }

  shutdownAsync(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.shutdown(error => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
}