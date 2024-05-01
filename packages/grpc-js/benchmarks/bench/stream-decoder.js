const { createBenchmarkSuite } = require('../common');
const { serializeMessage } = require('../helpers/encode');
const { echoService } = require('../helpers/utils');
const {
  StreamDecoder: OGStreamDecoder,
} = require('@grpc/grpc-js/build/src/stream-decoder');
const {
  StreamDecoder: NewStreamDecoder,
  decoder: decoderManager,
} = require('../../build/src/stream-decoder');

const suite = createBenchmarkSuite('Stream Decoder');

const serializedSmallBinary = serializeMessage(
  echoService.service.Echo.requestSerialize,
  {
    value: 'string-val',
    value2: 10,
  }
);
const getSmallBinary = () => {
  const buf = Buffer.allocUnsafe(serializedSmallBinary.length);
  serializedSmallBinary.copy(buf);
  return buf;
};

const getSmallSplit = () => {
  const binary = getSmallBinary();
  return [binary.subarray(0, 3), binary.subarray(3, 5), binary.subarray(5)];
};

const largeObj = {
  value: 'a'.repeat(2 ** 16),
  value2: 12803182109,
};
const serializedLargeObj = serializeMessage(
  echoService.service.Echo.requestSerialize,
  largeObj
);

const getLargeBinary = () => {
  const buf = Buffer.allocUnsafeSlow(serializedLargeObj.length);
  serializedLargeObj.copy(buf);
  return buf;
};

const getLargeSplit = () => {
  const binary = getLargeBinary();
  return [
    binary.subarray(0, Math.ceil(Buffer.poolSize * 0.5)),
    binary.subarray(Math.ceil(Buffer.poolSize * 0.5)),
  ];
};

const originalCached = new OGStreamDecoder();
const currentCached = decoderManager.get();

suite
  // mark -- original decoder, fresh copies
  .add('original stream decoder', function () {
    const decoder = new OGStreamDecoder();
    decoder.write(getSmallBinary());
  })
  .add('original stream decoder - small split', function () {
    const decoder = new OGStreamDecoder();
    for (const item of getSmallSplit()) {
      decoder.write(item);
    }
  })
  .add('original stream decoder - large', function () {
    const decoder = new OGStreamDecoder();
    decoder.write(getLargeBinary());
  })
  .add('original stream decoder - large split', function () {
    const decoder = new OGStreamDecoder();
    for (const item of getLargeSplit()) {
      decoder.write(item);
    }
  })
  // original decoder - cached instance
  .add('original stream decoder cached', function () {
    originalCached.write(getSmallBinary());
  })
  .add('original stream decoder cached - small split', function () {
    for (const item of getSmallSplit()) {
      originalCached.write(item);
    }
  })
  .add('original stream decoder cached - large', function () {
    originalCached.write(getLargeBinary());
  })
  .add('original stream decoder cached - large split', function () {
    for (const item of getLargeSplit()) {
      originalCached.write(item);
    }
  })
  // decoder v2 - new instance
  .add('stream decoder v2', function () {
    const decoder = new NewStreamDecoder();
    decoder.write(getSmallBinary());
  })
  .add('stream decoder v2 - small split', function () {
    const decoder = new NewStreamDecoder();
    for (const item of getSmallSplit()) {
      decoder.write(item);
    }
  })
  .add('stream decoder v2 - large', function () {
    const decoder = new NewStreamDecoder();
    decoder.write(getLargeBinary());
  })
  .add('stream decoder v2 - large split', function () {
    const decoder = new NewStreamDecoder();
    for (const item of getLargeSplit()) {
      decoder.write(item);
    }
  })
  // decoder v2 - cached
  .add('stream decoder v2 cached', function () {
    currentCached.write(getSmallBinary());
  })
  .add('stream decoder v2 cached - small split', function () {
    for (const item of getSmallSplit()) {
      currentCached.write(item);
    }
  })
  .add('stream decoder v2 cached - large', function () {
    currentCached.write(getLargeBinary());
  })
  .add('stream decoder v2 cached - large split', function () {
    for (const item of getLargeSplit()) {
      currentCached.write(item);
    }
  })
  .run({ async: false });
