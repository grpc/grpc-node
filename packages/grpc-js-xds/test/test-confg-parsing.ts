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

import { experimental, LoadBalancingConfig } from "@grpc/grpc-js";
import { register } from "../src";
import assert = require("assert");
import parseLoadbalancingConfig = experimental.parseLoadBalancingConfig;

register();

/**
 * Describes a test case for config parsing. input is passed to
 * parseLoadBalancingConfig. If error is set, the expectation is that that
 * operation throws an error with a matching message. Otherwise, toJsonObject
 * is called on the result, and it is expected to match output, or input if
 * output is unset.
 */
interface TestCase {
  name: string;
  input: object,
  output?: object;
  error?: RegExp;
}

/* The main purpose of these tests is to verify that configs that are expected
 * to be valid parse successfully, and configs that are expected to be invalid
 * throw errors. The specific output of this parsing is a lower priority
 * concern.
 * Note: some tests have an expected output that is different from the output,
 * but all non-error tests additionally verify that parsing the output again
 * produces the same output. */
const allTestCases: {[lbPolicyName: string]: TestCase[]} = {
  cds: [
    {
      name: 'populated cluster field',
      input: {
        cluster: 'abc'
      }
    },
    {
      name: 'empty',
      input: {},
      error: /cluster/
    },
    {
      name: 'non-string cluster',
      input: {
        cluster: 123
      },
      error: /string.*cluster/
    }
  ],
  xds_cluster_resolver: [
    {
      name: 'empty fields',
      input: {
        discovery_mechanisms: [],
        xds_lb_policy: []
      }
    },
    {
      name: 'missing discovery_mechanisms',
      input: {
        xds_lb_policy: []
      },
      error: /discovery_mechanisms/
    },
    {
      name: 'missing xds_lb_policy',
      input: {
        discovery_mechanisms: []
      },
      error: /xds_lb_policy/
    },
    {
      name: 'discovery_mechanism: EDS',
      input: {
        discovery_mechanisms: [{
          cluster: 'abc',
          type: 'EDS'
        }],
        xds_lb_policy: []
      },
      output: {
        discovery_mechanisms: [{
          cluster: 'abc',
          type: 'EDS',
          lrs_load_reporting_server: undefined
        }],
        xds_lb_policy: []
      }
    },
    {
      name: 'discovery_mechanism: LOGICAL_DNS',
      input: {
        discovery_mechanisms: [{
          cluster: 'abc',
          type: 'LOGICAL_DNS'
        }],
        xds_lb_policy: []
      },
      output: {
        discovery_mechanisms: [{
          cluster: 'abc',
          type: 'LOGICAL_DNS',
          lrs_load_reporting_server: undefined
        }],
        xds_lb_policy: []
      }
    },
    {
      name: 'discovery_mechanism: undefined optional fields',
      input: {
        discovery_mechanisms: [{
          cluster: 'abc',
          type: 'EDS',
          max_concurrent_requests: undefined,
          eds_service_name: undefined,
          dns_hostname: undefined,
          lrs_load_reporting_server: undefined
        }],
        xds_lb_policy: []
      }
    },
    {
      name: 'discovery_mechanism: populated optional fields',
      input: {
        discovery_mechanisms: [{
          cluster: 'abc',
          type: 'EDS',
          max_concurrent_requests: 100,
          eds_service_name: 'def',
          dns_hostname: 'localhost',
          lrs_load_reporting_server: {
            server_uri: 'localhost:12345',
            channel_creds: [{
              type: 'google_default',
              config: {}
            }],
            server_features: ['test']
          }
        }],
        xds_lb_policy: []
      }
    }
  ],
  xds_cluster_impl: [
    {
      name: 'only required fields',
      input: {
        cluster: 'abc',
        eds_service_name: 'def',
        drop_categories: [],
        lrs_load_reporting_server: {
          server_uri: 'localhost:12345',
          channel_creds: [{
            type: 'google_default',
            config: {}
          }],
          server_features: ['test']
        },
        child_policy: [{round_robin: {}}]
      },
      output: {
        cluster: 'abc',
        eds_service_name: 'def',
        drop_categories: [],
        lrs_load_reporting_server: {
          server_uri: 'localhost:12345',
          channel_creds: [{
            type: 'google_default',
            config: {}
          }],
          server_features: ['test']
        },
        child_policy: [{round_robin: {}}],
        max_concurrent_requests: 1024
      }
    },
    {
      name: 'undefined optional fields',
      input: {
        cluster: 'abc',
        eds_service_name: 'def',
        drop_categories: [],
        lrs_load_reporting_server: {
          server_uri: 'localhost:12345',
          channel_creds: [{
            type: 'google_default',
            config: {}
          }],
          server_features: ['test']
        },
        child_policy: [{round_robin: {}}],
        max_concurrent_requests: undefined
      },
      output: {
        cluster: 'abc',
        eds_service_name: 'def',
        drop_categories: [],
        lrs_load_reporting_server: {
          server_uri: 'localhost:12345',
          channel_creds: [{
            type: 'google_default',
            config: {}
          }],
          server_features: ['test']
        },
        child_policy: [{round_robin: {}}],
        max_concurrent_requests: 1024
      }
    },
    {
      name: 'populated optional fields',
      input: {
        cluster: 'abc',
        eds_service_name: 'def',
        drop_categories: [{
          category: 'test',
          requests_per_million: 100
        }],
        lrs_load_reporting_server: {
          server_uri: 'localhost:12345',
          channel_creds: [{
            type: 'google_default',
            config: {}
          }],
          server_features: ['test']
        },
        child_policy: [{round_robin: {}}],
        max_concurrent_requests: 123
      },
    }
  ],
  priority: [
    {
      name: 'empty fields',
      input: {
        children: {},
        priorities: []
      }
    },
    {
      name: 'populated fields',
      input: {
        children: {
          child0: {
            config: [{round_robin: {}}],
            ignore_reresolution_requests: true
          },
          child1: {
            config: [{round_robin: {}}],
            ignore_reresolution_requests: false
          }
        },
        priorities: ['child0', 'child1']
      }
    }
  ],
  weighted_target: [
    {
      name: 'empty targets field',
      input: {
        targets: {}
      }
    },
    {
      name: 'populated targets field',
      input: {
        targets: {
          target0: {
            weight: 1,
            child_policy: [{round_robin: {}}]
          },
          target1: {
            weight: 2,
            child_policy: [{round_robin: {}}]
          }
        }
      }
    }
  ],
  xds_cluster_manager: [
    {
      name: 'empty children field',
      input: {
        children: {}
      }
    },
    {
      name: 'populated children field',
      input: {
        children: {
          child0: {
            child_policy: [{round_robin: {}}]
          }
        }
      }
    }
  ],
  ring_hash: [
    {
      name: 'empty config',
      input: {},
      output: {
        min_ring_size: 1024,
        max_ring_size: 4096
      }
    },
    {
      name: 'populated config',
      input: {
        min_ring_size: 2048,
        max_ring_size: 8192
      }
    },
    {
      name: 'min_ring_size too large',
      input: {
        min_ring_size: 8_388_609
      },
      error: /min_ring_size/
    },
    {
      name: 'max_ring_size too large',
      input: {
        max_ring_size: 8_388_609
      },
      error: /max_ring_size/
    }
  ]
}

describe('Load balancing policy config parsing', () => {
  for (const [lbPolicyName, testCases] of Object.entries(allTestCases)) {
    describe(lbPolicyName, () => {
      for (const testCase of testCases) {
        it(testCase.name, () => {
          const lbConfigInput = {[lbPolicyName]: testCase.input};
          if (testCase.error) {
            assert.throws(() => {
              parseLoadbalancingConfig(lbConfigInput);
            }, testCase.error);
          } else {
            const expectedOutput = testCase.output ?? testCase.input;
            const parsedJson = parseLoadbalancingConfig(lbConfigInput).toJsonObject();
            assert.deepStrictEqual(parsedJson, {[lbPolicyName]: expectedOutput});
            // Test idempotency
            assert.deepStrictEqual(parseLoadbalancingConfig(parsedJson).toJsonObject(), parsedJson);
          }
        });
      }
    });
  }
});
