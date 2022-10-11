/*
 * Copyright 2022 gRPC authors.
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
import * as path from 'path';
import * as grpc from '../src';
import { loadProtoFile } from './common';
import { OutlierDetectionLoadBalancingConfig } from '../src/load-balancer-outlier-detection'

function multiDone(done: Mocha.Done, target: number) {
  let count = 0;
  return (error?: any) => {
    if (error) {
      done(error);
    }
    count++;
    if (count >= target) {
      done();
    }
  }
}

const defaultOutlierDetectionServiceConfig = {
  methodConfig: [],
  loadBalancingConfig: [
    {
      outlier_detection: {
        success_rate_ejection: {},
        failure_percentage_ejection: {},
        child_policy: [{round_robin: {}}]
      }
    }
  ]
};

const defaultOutlierDetectionServiceConfigString = JSON.stringify(defaultOutlierDetectionServiceConfig);

const goodService = {
  echo: (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) => {
    callback(null, call.request)
  }
};

const badService = {
  echo: (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) => {
    callback({
      code: grpc.status.PERMISSION_DENIED,
      details: 'Permission denied'
    })
  }
}

const protoFile = path.join(__dirname, 'fixtures', 'echo_service.proto');
const EchoService = loadProtoFile(protoFile)
  .EchoService as grpc.ServiceClientConstructor;

describe('Outlier detection config validation', () => {
  describe('interval', () => {
    it('Should reject a negative interval', () => {
      const loadBalancingConfig = {
        interval: {
          seconds: -1,
          nanos: 0
        },
        child_policy: [{round_robin: {}}]
      };
      assert.throws(() => {
        OutlierDetectionLoadBalancingConfig.createFromJson(loadBalancingConfig);
      }, /interval parse error: values out of range for non-negative Duaration/);
    });
    it('Should reject a large interval', () => {
      const loadBalancingConfig = {
        interval: {
          seconds: 1e12,
          nanos: 0
        },
        child_policy: [{round_robin: {}}]
      };
      assert.throws(() => {
        OutlierDetectionLoadBalancingConfig.createFromJson(loadBalancingConfig);
      }, /interval parse error: values out of range for non-negative Duaration/);
    });
    it('Should reject a negative interval.nanos', () => {
      const loadBalancingConfig = {
        interval: {
          seconds: 0,
          nanos: -1
        },
        child_policy: [{round_robin: {}}]
      };
      assert.throws(() => {
        OutlierDetectionLoadBalancingConfig.createFromJson(loadBalancingConfig);
      }, /interval parse error: values out of range for non-negative Duaration/);
    });
    it('Should reject a large interval.nanos', () => {
      const loadBalancingConfig = {
        interval: {
          seconds: 0,
          nanos: 1e12
        },
        child_policy: [{round_robin: {}}]
      };
      assert.throws(() => {
        OutlierDetectionLoadBalancingConfig.createFromJson(loadBalancingConfig);
      }, /interval parse error: values out of range for non-negative Duaration/);
    });
  });
  describe('base_ejection_time', () => {
    it('Should reject a negative base_ejection_time', () => {
      const loadBalancingConfig = {
        base_ejection_time: {
          seconds: -1,
          nanos: 0
        },
        child_policy: [{round_robin: {}}]
      };
      assert.throws(() => {
        OutlierDetectionLoadBalancingConfig.createFromJson(loadBalancingConfig);
      }, /base_ejection_time parse error: values out of range for non-negative Duaration/);
    });
    it('Should reject a large base_ejection_time', () => {
      const loadBalancingConfig = {
        base_ejection_time: {
          seconds: 1e12,
          nanos: 0
        },
        child_policy: [{round_robin: {}}]
      };
      assert.throws(() => {
        OutlierDetectionLoadBalancingConfig.createFromJson(loadBalancingConfig);
      }, /base_ejection_time parse error: values out of range for non-negative Duaration/);
    });
    it('Should reject a negative base_ejection_time.nanos', () => {
      const loadBalancingConfig = {
        base_ejection_time: {
          seconds: 0,
          nanos: -1
        },
        child_policy: [{round_robin: {}}]
      };
      assert.throws(() => {
        OutlierDetectionLoadBalancingConfig.createFromJson(loadBalancingConfig);
      }, /base_ejection_time parse error: values out of range for non-negative Duaration/);
    });
    it('Should reject a large base_ejection_time.nanos', () => {
      const loadBalancingConfig = {
        base_ejection_time: {
          seconds: 0,
          nanos: 1e12
        },
        child_policy: [{round_robin: {}}]
      };
      assert.throws(() => {
        OutlierDetectionLoadBalancingConfig.createFromJson(loadBalancingConfig);
      }, /base_ejection_time parse error: values out of range for non-negative Duaration/);
    });
  });
  describe('max_ejection_time', () => {
    it('Should reject a negative max_ejection_time', () => {
      const loadBalancingConfig = {
        max_ejection_time: {
          seconds: -1,
          nanos: 0
        },
        child_policy: [{round_robin: {}}]
      };
      assert.throws(() => {
        OutlierDetectionLoadBalancingConfig.createFromJson(loadBalancingConfig);
      }, /max_ejection_time parse error: values out of range for non-negative Duaration/);
    });
    it('Should reject a large max_ejection_time', () => {
      const loadBalancingConfig = {
        max_ejection_time: {
          seconds: 1e12,
          nanos: 0
        },
        child_policy: [{round_robin: {}}]
      };
      assert.throws(() => {
        OutlierDetectionLoadBalancingConfig.createFromJson(loadBalancingConfig);
      }, /max_ejection_time parse error: values out of range for non-negative Duaration/);
    });
    it('Should reject a negative max_ejection_time.nanos', () => {
      const loadBalancingConfig = {
        max_ejection_time: {
          seconds: 0,
          nanos: -1
        },
        child_policy: [{round_robin: {}}]
      };
      assert.throws(() => {
        OutlierDetectionLoadBalancingConfig.createFromJson(loadBalancingConfig);
      }, /max_ejection_time parse error: values out of range for non-negative Duaration/);
    });
    it('Should reject a large max_ejection_time.nanos', () => {
      const loadBalancingConfig = {
        max_ejection_time: {
          seconds: 0,
          nanos: 1e12
        },
        child_policy: [{round_robin: {}}]
      };
      assert.throws(() => {
        OutlierDetectionLoadBalancingConfig.createFromJson(loadBalancingConfig);
      }, /max_ejection_time parse error: values out of range for non-negative Duaration/);
    });
  });
  describe('max_ejection_percent', () => {
    it('Should reject a value above 100', () => {
      const loadBalancingConfig = {
        max_ejection_percent: 101,
        child_policy: [{round_robin: {}}]
      };
      assert.throws(() => {
        OutlierDetectionLoadBalancingConfig.createFromJson(loadBalancingConfig);
      }, /max_ejection_percent parse error: value out of range for percentage/);
    });
    it('Should reject a negative value', () => {
      const loadBalancingConfig = {
        max_ejection_percent: -1,
        child_policy: [{round_robin: {}}]
      };
      assert.throws(() => {
        OutlierDetectionLoadBalancingConfig.createFromJson(loadBalancingConfig);
      }, /max_ejection_percent parse error: value out of range for percentage/);
    });
  });
  describe('success_rate_ejection.enforcement_percentage', () => {
    it('Should reject a value above 100', () => {
      const loadBalancingConfig = {
        success_rate_ejection: {
          enforcement_percentage: 101
        },
        child_policy: [{round_robin: {}}]
      };
      assert.throws(() => {
        OutlierDetectionLoadBalancingConfig.createFromJson(loadBalancingConfig);
      }, /success_rate_ejection\.enforcement_percentage parse error: value out of range for percentage/);
    });
    it('Should reject a negative value', () => {
      const loadBalancingConfig = {
        success_rate_ejection: {
          enforcement_percentage: -1
        },
        child_policy: [{round_robin: {}}]
      };
      assert.throws(() => {
        OutlierDetectionLoadBalancingConfig.createFromJson(loadBalancingConfig);
      }, /success_rate_ejection\.enforcement_percentage parse error: value out of range for percentage/);
    });
  });
  describe('failure_percentage_ejection.threshold', () => {
    it('Should reject a value above 100', () => {
      const loadBalancingConfig = {
        failure_percentage_ejection: {
          threshold: 101
        },
        child_policy: [{round_robin: {}}]
      };
      assert.throws(() => {
        OutlierDetectionLoadBalancingConfig.createFromJson(loadBalancingConfig);
      }, /failure_percentage_ejection\.threshold parse error: value out of range for percentage/);
    });
    it('Should reject a negative value', () => {
      const loadBalancingConfig = {
        failure_percentage_ejection: {
          threshold: -1
        },
        child_policy: [{round_robin: {}}]
      };
      assert.throws(() => {
        OutlierDetectionLoadBalancingConfig.createFromJson(loadBalancingConfig);
      }, /failure_percentage_ejection\.threshold parse error: value out of range for percentage/);
    });
  });
  describe('failure_percentage_ejection.enforcement_percentage', () => {
    it('Should reject a value above 100', () => {
      const loadBalancingConfig = {
        failure_percentage_ejection: {
          enforcement_percentage: 101
        },
        child_policy: [{round_robin: {}}]
      };
      assert.throws(() => {
        OutlierDetectionLoadBalancingConfig.createFromJson(loadBalancingConfig);
      }, /failure_percentage_ejection\.enforcement_percentage parse error: value out of range for percentage/);
    });
    it('Should reject a negative value', () => {
      const loadBalancingConfig = {
        failure_percentage_ejection: {
          enforcement_percentage: -1
        },
        child_policy: [{round_robin: {}}]
      };
      assert.throws(() => {
        OutlierDetectionLoadBalancingConfig.createFromJson(loadBalancingConfig);
      }, /failure_percentage_ejection\.enforcement_percentage parse error: value out of range for percentage/);
    });
  });
});

describe('Outlier detection', () => {
  const GOOD_PORTS = 4;
  let goodServer: grpc.Server;
  let badServer: grpc.Server;
  const goodPorts: number[] = [];
  let badPort: number;
  before(done => {
    const eachDone = multiDone(() => {
      goodServer.start();
      badServer.start();
      done();
    }, GOOD_PORTS + 1);
    goodServer = new grpc.Server();
    goodServer.addService(EchoService.service, goodService);
    for (let i = 0; i < GOOD_PORTS; i++) {
      goodServer.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (error, port) => {
        if (error) {
          eachDone(error);
          return;
        }
        goodPorts.push(port);
        eachDone();
      });
    }
    badServer = new grpc.Server();
    badServer.addService(EchoService.service, badService);
    badServer.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (error, port) => {
      if (error) {
        eachDone(error);
        return;
      }
      badPort = port;
      eachDone();
    });
  });
  after(() => {
    goodServer.forceShutdown();
    badServer.forceShutdown();
  });

  it('Should allow normal operation with one server', done => {
    const client = new EchoService(`localhost:${goodPorts[0]}`, grpc.credentials.createInsecure(), {'grpc.service_config': defaultOutlierDetectionServiceConfigString});
    client.echo(
      { value: 'test value', value2: 3 },
      (error: grpc.ServiceError, response: any) => {
        assert.ifError(error);
        assert.deepStrictEqual(response, { value: 'test value', value2: 3 });
        done();
      }
    );
  });
});