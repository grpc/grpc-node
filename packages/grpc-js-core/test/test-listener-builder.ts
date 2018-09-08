import * as assert from 'assert';

import * as grpc from '../src';
import {MessageListener, MetadataListener, StatusListener} from '../src/listener';
import {ListenerBuilder} from '../src/listener-builder';

describe('ListenerBuilder', () => {
  it('is exported by the module', () => {
    assert.strictEqual(ListenerBuilder, grpc.ListenerBuilder);
  });

  it('builds a listener object', () => {
    const builder = new ListenerBuilder();
    const onReceiveMetadata: MetadataListener = () => {};
    const onReceiveMessage: MessageListener = () => {};
    const onReceiveStatus: StatusListener = () => {};
    let result;

    assert.deepStrictEqual(builder.build(), {});
    result = builder.withOnReceiveMetadata(onReceiveMetadata);
    assert.strictEqual(result, builder);
    assert.deepStrictEqual(builder.build(), {onReceiveMetadata});
    result = builder.withOnReceiveMessage(onReceiveMessage);
    assert.strictEqual(result, builder);
    assert.deepStrictEqual(
        builder.build(), {onReceiveMetadata, onReceiveMessage});
    result = builder.withOnReceiveStatus(onReceiveStatus);
    assert.strictEqual(result, builder);
    assert.deepStrictEqual(
        builder.build(),
        {onReceiveMetadata, onReceiveMessage, onReceiveStatus});
  });
});
