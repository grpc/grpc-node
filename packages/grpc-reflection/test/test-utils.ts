import * as assert from 'assert';

import { scope } from '../src/utils';

describe('scope', () => {
  it('traverses upwards in the package scope', () => {
    assert.strictEqual(scope('grpc.health.v1.HealthCheckResponse.ServiceStatus'), 'grpc.health.v1.HealthCheckResponse');
    assert.strictEqual(scope(scope(scope(scope('grpc.health.v1.HealthCheckResponse.ServiceStatus')))), 'grpc');
  });
  it('returns an empty package when at the top', () => {
    assert.strictEqual(scope('Message'), '');
    assert.strictEqual(scope(''), '');
  });
});
