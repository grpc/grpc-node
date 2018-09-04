import * as assert from 'assert';

import * as grpc from '../src';
import {StatusBuilder} from '../src/status-builder';

describe('StatusBuilder', () => {
  it('is exported by the module', () => {
    assert.strictEqual(StatusBuilder, grpc.StatusBuilder);
  });

  it('builds a status object', () => {
    const builder = new StatusBuilder();
    const metadata = new grpc.Metadata();
    let result;

    assert.deepStrictEqual(builder.build(), {});
    result = builder.withCode(grpc.status.OK);
    assert.strictEqual(result, builder);
    assert.deepStrictEqual(builder.build(), { code: grpc.status.OK });
    result = builder.withDetails('foobar');
    assert.strictEqual(result, builder);
    assert.deepStrictEqual(builder.build(), {
      code: grpc.status.OK,
      details: 'foobar'
    });
    result = builder.withMetadata(metadata);
    assert.strictEqual(result, builder);
    assert.deepStrictEqual(builder.build(), {
      code: grpc.status.OK,
      details: 'foobar',
      metadata
    });
  });
});
