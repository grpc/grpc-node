import { ChannelCredentials } from '../src/channel-credentials';
import * as assert from 'assert';

describe('Channel Credentials', function() {
  it('should be an object', function() {
    assert.ok(ChannelCredentials);
  });
});
