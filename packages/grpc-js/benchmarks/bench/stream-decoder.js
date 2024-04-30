const { createBenchmarkSuite } = require('../common');
const { serializeMessage } = require('../helpers/encode');
const { echoService } = require('../helpers/utils');
const {
  StreamDecoder: OGStreamDecoder,
} = require('@grpc/grpc-js/build/src/stream-decoder');
const {
  StreamDecoder: NewStreamDecoder,
} = require('../../build/src/stream-decoder');

const suite = createBenchmarkSuite('Stream Decoder');

const smallBinary = serializeMessage(
  echoService.service.Echo.requestSerialize,
  {
    value: 'string-val',
    value2: 10,
  }
);

const smallBinarySplitPartOne = Buffer.from(smallBinary.subarray(0, 3));
const smallBinarySplitPartTwo = Buffer.from(smallBinary.subarray(3, 5));
const smallBinarySplitPartThree = Buffer.from(smallBinary.subarray(5));

const largeBinary = serializeMessage(
  echoService.service.Echo.requestSerialize,
  {
    value: 'a'.repeat(2 ** 16),
    value2: 12803182109,
  }
);

const largeBinarySplitPartOne = Buffer.from(largeBinary.subarray(0, 4096));
const largeBinarySplitPartTwo = Buffer.from(largeBinary.subarray(4096));

const cachedSD2 = new NewStreamDecoder();
const cachedOG = new OGStreamDecoder();

suite
  .add('original stream decoder', function () {
    const decoder = new OGStreamDecoder();
    decoder.write(smallBinary);
  })
  .add('original stream decoder cached', function () {
    cachedOG.write(smallBinary);
  })
  .add('stream decoder v2', function () {
    const decoder = new NewStreamDecoder();
    decoder.write(smallBinary);
  })
  .add('stream decoder v2 cached', function () {
    cachedSD2.write(smallBinary);
  })
  .add('original stream decoder - large', function () {
    const decoder = new OGStreamDecoder();
    decoder.write(largeBinary);
  })
  .add('original stream decoder cached - large', function () {
    cachedOG.write(largeBinary);
  })
  .add('stream decoder v2 - large', function () {
    const decoder = new NewStreamDecoder();
    decoder.write(largeBinary);
  })
  .add('stream decoder v2 cached - large', function () {
    cachedSD2.write(largeBinary);
  })
  .add('original stream decoder - small split', function () {
    const decoder = new OGStreamDecoder();
    decoder.write(smallBinarySplitPartOne);
    decoder.write(smallBinarySplitPartTwo);
    decoder.write(smallBinarySplitPartThree);
  })
  .add('original stream decoder cached - small split', function () {
    cachedOG.write(smallBinarySplitPartOne);
    cachedOG.write(smallBinarySplitPartTwo);
    cachedOG.write(smallBinarySplitPartThree);
  })
  .add('stream decoder v2 - small split', function () {
    const decoder = new NewStreamDecoder();
    decoder.write(smallBinarySplitPartOne);
    decoder.write(smallBinarySplitPartTwo);
    decoder.write(smallBinarySplitPartThree);
  })
  .add('stream decoder v2 cached - small split', function () {
    cachedSD2.write(smallBinarySplitPartOne);
    cachedSD2.write(smallBinarySplitPartTwo);
    cachedSD2.write(smallBinarySplitPartThree);
  })
  .add('original stream decoder - large split', function () {
    const decoder = new OGStreamDecoder();
    decoder.write(largeBinarySplitPartOne);
    decoder.write(largeBinarySplitPartTwo);
  })
  .add('original stream decoder cached - large split', function () {
    cachedOG.write(largeBinarySplitPartOne);
    cachedOG.write(largeBinarySplitPartTwo);
  })
  .add('stream decoder v2 - large split', function () {
    const decoder = new NewStreamDecoder();
    decoder.write(largeBinarySplitPartOne);
    decoder.write(largeBinarySplitPartTwo);
  })
  .add('stream decoder v2 cached - large split', function () {
    cachedSD2.write(largeBinarySplitPartOne);
    cachedSD2.write(largeBinarySplitPartTwo);
  })
  .run({ async: false });
