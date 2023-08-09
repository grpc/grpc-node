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

import * as assert from 'assert';
import { validateXdsServerConfig } from "../src/xds-bootstrap";

describe('bootstrap', () => {
  /* validateXdsServerConfig is used when creating the cds config, and then
   * the resulting value is validated again when creating the
   * xds_cluster_resolver config. */
  it('validateXdsServerConfig should be idempotent', () => {
    const config = {
      server_uri: 'localhost',
      channel_creds: [{type: 'google_default'}],
      server_features: ['test_feature']
    };
    assert.deepStrictEqual(validateXdsServerConfig(validateXdsServerConfig(config)), validateXdsServerConfig(config));
  });
});
