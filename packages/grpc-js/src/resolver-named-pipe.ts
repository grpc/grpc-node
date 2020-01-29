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
 */

import {
  Resolver,
  ResolverListener,
  registerResolver,
  registerDefaultResolver,
} from './resolver';

class NamedPipeResolver implements Resolver {
  private addresses: string[] = [];
  constructor(target: string, private listener: ResolverListener) {
    this.addresses = [target];
  }
  updateResolution(): void {
    process.nextTick(
      this.listener.onSuccessfulResolution,
      this.addresses,
      null,
      null
    );
  }

  static getDefaultAuthority(target: string): string {
    return 'localhost';
  }

  static isIPC(): boolean {
    return true;
  }
}

export function setup() {
  registerResolver('\\\\.\\pipe\\', NamedPipeResolver);
  registerResolver('//./pipe/', NamedPipeResolver);
}
