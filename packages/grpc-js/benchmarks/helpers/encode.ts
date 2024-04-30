import * as fs from 'node:fs';
import { resolve } from 'node:path';
import { echoService } from './utils';

/**
 * Serialize a message to a length-delimited byte string.
 * @param value
 * @returns
 */
function serializeMessage(serialize: any, value: any) {
  const messageBuffer = serialize(value);
  const byteLength = messageBuffer.byteLength;
  const output = Buffer.allocUnsafe(byteLength + 5);
  /* Note: response compression is currently not supported, so this
   * compressed bit is always 0. */
  output.writeUInt8(0, 0);
  output.writeUInt32BE(byteLength, 1);
  messageBuffer.copy(output, 5);
  return output;
}

const binaryMessage = serializeMessage(
  echoService.service.Echo.requestSerialize,
  {
    value: 'string-val',
    value2: 10,
  }
);

console.log(
  'Service %s\nEcho binary bytes: %d, hex: %s',
  echoService.service.Echo.path,
  binaryMessage.length,
  binaryMessage.toString('hex')
);

fs.writeFileSync(resolve(__dirname, '../echo-unary.bin'), binaryMessage);
