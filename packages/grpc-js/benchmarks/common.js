const Benchmarkify = require('benchmarkify');

const benchmark = new Benchmarkify('grpc-js benchmarks').printHeader();

function createBenchmarkSuite(name) {
  const suite = benchmark.createSuite(name);

  return suite;
}

module.exports = {
  benchmark,
  createBenchmarkSuite,
};
