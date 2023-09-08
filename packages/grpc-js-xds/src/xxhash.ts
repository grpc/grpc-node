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

/* The simpler `import xxhash from 'xxhash-wasm';` doesn't compile correctly
 * to CommonJS require calls for some reason, so we use this import to get
 * the type, and then an explicit require call to get the actual value. */
import xxhashImport from 'xxhash-wasm';
const xxhash: typeof xxhashImport = require('xxhash-wasm');

export let xxhashApi: Awaited<ReturnType<typeof xxhash>> | null = null;

export async function loadXxhashApi() {
  if (!xxhashApi) {
    xxhashApi = await xxhash();
  }
  return xxhashApi;
}
