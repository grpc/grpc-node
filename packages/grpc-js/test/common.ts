/*
 * Copyright 2019 gRPC authors.
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

import * as loader from '@grpc/proto-loader';
import * as assert2 from './assert2';

import { GrpcObject, loadPackageDefinition } from '../src/make-client';

const protoLoaderOptions = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

export function mockFunction(): never {
  throw new Error('Not implemented');
}

export function loadProtoFile(file: string): GrpcObject {
  const packageDefinition = loader.loadSync(file, protoLoaderOptions);
  return loadPackageDefinition(packageDefinition);
}

export { assert2 };
