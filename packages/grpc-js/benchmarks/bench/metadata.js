const { benchmark, createBenchmarkSuite } = require('../common');
const {
  sensitiveHeaders,
  constants: {
    HTTP2_HEADER_ACCEPT_ENCODING,
    HTTP2_HEADER_TE,
    HTTP2_HEADER_CONTENT_TYPE,
  },
} = require('node:http2');
const {
  Metadata: MetadataOriginal,
} = require('@grpc/grpc-js/build/src/metadata');
const { Metadata } = require('../../build/src/metadata');

const GRPC_ACCEPT_ENCODING_HEADER = 'grpc-accept-encoding';
const GRPC_ENCODING_HEADER = 'grpc-encoding';
const GRPC_TIMEOUT_HEADER = 'grpc-timeout';
const headers = Object.setPrototypeOf(
  {
    ':path': '/EchoService/Echo',
    ':scheme': 'http',
    ':authority': 'localhost:9999',
    ':method': 'POST',
    'user-agent': 'h2load nghttp2/1.58.0',
    'content-type': 'application/grpc',
    'content-length': '19',
    [GRPC_ACCEPT_ENCODING_HEADER]: 'identity,deflate,gzip',
    [GRPC_ENCODING_HEADER]: 'identity',
    [sensitiveHeaders]: [],
  },
  null
);

const ogMeta = MetadataOriginal.fromHttp2Headers(headers);
const currentMeta = Metadata.fromHttp2Headers(headers);

const removeHeaders = metadata => {
  metadata.remove(GRPC_TIMEOUT_HEADER);
  metadata.remove(GRPC_ENCODING_HEADER);
  metadata.remove(GRPC_ACCEPT_ENCODING_HEADER);
  metadata.remove(HTTP2_HEADER_ACCEPT_ENCODING);
  metadata.remove(HTTP2_HEADER_TE);
  metadata.remove(HTTP2_HEADER_CONTENT_TYPE);
};

removeHeaders(ogMeta);
removeHeaders(currentMeta);

createBenchmarkSuite('fromHttp2Headers')
  .add('1.10.6', function () {
    MetadataOriginal.fromHttp2Headers(headers);
  })
  .add('current', function () {
    Metadata.fromHttp2Headers(headers);
  });

createBenchmarkSuite('fromHttp2Headers + common operations')
  .add('1.10.6', () => {
    const metadata = MetadataOriginal.fromHttp2Headers(headers);
    removeHeaders(metadata);
  })
  .add('current', () => {
    const metadata = Metadata.fromHttp2Headers(headers);
    removeHeaders(metadata);
  });

createBenchmarkSuite('toHttp2Headers')
  .add('1.10.6', function () {
    return ogMeta.toHttp2Headers();
  })
  .add('current', function () {
    return currentMeta.toHttp2Headers();
  });

benchmark.run();
