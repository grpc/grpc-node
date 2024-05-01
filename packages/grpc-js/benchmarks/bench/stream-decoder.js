const { benchmark, createBenchmarkSuite } = require('../common');
const { serializeMessage } = require('../helpers/encode');
const { echoService } = require('../helpers/utils');
const {
  StreamDecoder: OGStreamDecoder,
} = require('@grpc/grpc-js/build/src/stream-decoder');
const {
  StreamDecoder: NewStreamDecoder,
  decoder: decoderManager,
} = require('../../build/src/stream-decoder');

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

createBenchmarkSuite('Small Payload')
  // mark -- original decoder, fresh copies
  .add('1.10.6', function () {
    const decoder = new OGStreamDecoder();
    decoder.write(getSmallBinary());
  })
  .add('1.10.6 cached', function () {
    const decoder = new OGStreamDecoder();
    decoder.write(getSmallBinary());
  })
  .add('current', function () {
    const decoder = new NewStreamDecoder();
    decoder.write(getSmallBinary());
  })
  .add('current cached', function () {
    currentCached.write(getSmallBinary());
  });

createBenchmarkSuite('Small Payload Chunked')
  .add('1.10.6', function () {
    const decoder = new OGStreamDecoder();
    for (const item of getSmallSplit()) {
      decoder.write(item);
    }
  })
  .add('1.10.6 cached', function () {
    for (const item of getSmallSplit()) {
      originalCached.write(item);
    }
  })
  .add('current', function () {
    const decoder = new NewStreamDecoder();
    for (const item of getSmallSplit()) {
      decoder.write(item);
    }
  })
  .add('current cached', function () {
    for (const item of getSmallSplit()) {
      currentCached.write(item);
    }
  });

createBenchmarkSuite('Large Payload')
  .add('1.10.6', function () {
    const decoder = new OGStreamDecoder();
    decoder.write(getLargeBinary());
  })
  .add('1.10.6 cached', function () {
    originalCached.write(getLargeBinary());
  })
  .add('current', function () {
    const decoder = new NewStreamDecoder();
    decoder.write(getLargeBinary());
  })
  .add('current cached', function () {
    currentCached.write(getLargeBinary());
  });

createBenchmarkSuite('Large Payload Chunked')
  .add('1.10.6', function () {
    const decoder = new OGStreamDecoder();
    for (const item of getLargeSplit()) {
      decoder.write(item);
    }
  })
  .add('1.10.6 cached', function () {
    for (const item of getLargeSplit()) {
      originalCached.write(item);
    }
  })
  .add('current', function () {
    const decoder = new NewStreamDecoder();
    for (const item of getLargeSplit()) {
      decoder.write(item);
    }
  })
  .add('current cached', function () {
    for (const item of getLargeSplit()) {
      currentCached.write(item);
    }
  });

benchmark.run();
