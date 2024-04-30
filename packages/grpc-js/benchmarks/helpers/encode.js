const fs = require('node:fs');
const { resolve } = require('node:path');
const { echoService } = require('./utils');

/**
 * Serialize a message to a length-delimited byte string.
 * @param value
 * @returns
 */
function serializeMessage(serialize, value) {
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

if (require.main === module) {
  console.log(
    'Service %s\nEcho binary bytes: %d, hex: %s',
    echoService.service.Echo.path,
    binaryMessage.length,
    binaryMessage.toString('hex')
  );

  fs.writeFileSync(resolve(__dirname, '../echo-unary.bin'), binaryMessage);
}

exports.serializeMessage = serializeMessage;
