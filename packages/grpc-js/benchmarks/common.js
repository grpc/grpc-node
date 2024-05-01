const Benchmarkify = require('benchmarkify');

function createBenchmarkSuite(name) {
  const benchmark = new Benchmarkify('grpc-js benchmarks').printHeader();
  const suite = benchmark.createSuite(name);

  return suite;
}

module.exports = {
  createBenchmarkSuite,
};
