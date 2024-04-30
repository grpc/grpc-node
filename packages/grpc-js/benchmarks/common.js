const Benchmark = require('benchmark');
const { createTableHeader, H2, eventToMdTable } = require('./markdown');
const os = require('os');

function installMarkdownEmitter(
  suite,
  name,
  tableHeaderColumns = ['name', 'ops/sec', 'samples']
) {
  const tableHeader = createTableHeader(tableHeaderColumns);

  suite
    .on('start', function () {
      console.log(H2(name));
      console.log(tableHeader);
    })
    .on('cycle', function (event) {
      console.log(eventToMdTable(event));
    });
}

function getMachineInfo() {
  return {
    platform: os.platform(),
    arch: os.arch(),
    cpus: os.cpus().length,
    totalMemory: os.totalmem() / 1024 ** 3,
  };
}

function installMarkdownMachineInfo(suite) {
  if (!process.env.CI) return;

  const { platform, arch, cpus, totalMemory } = getMachineInfo();

  const machineInfo = `${platform} ${arch} | ${cpus} vCPUs | ${totalMemory.toFixed(
    1
  )}GB Mem`;

  suite.on('complete', () => {
    const writter = process.stdout;

    writter.write('\n\n');
    writter.write('<details>\n');
    writter.write('<summary>Environment</summary>');
    writter.write(`\n
* __Machine:__ ${machineInfo}
* __Run:__ ${new Date()}
`);
    writter.write('</details>');
    writter.write('\n\n');
  });
}

function installMarkdownHiddenDetailedInfo(suite) {
  if (!process.env.CI) return;

  const cycleEvents = [];

  suite
    .on('cycle', function (event) {
      cycleEvents.push({
        name: event.target.name,
        opsSec: event.target.hz,
        samples: event.target.cycles,
      });
    })
    .on('complete', function () {
      const writter = process.stdout;

      writter.write('<!--\n');
      writter.write(
        JSON.stringify({
          environment: getMachineInfo(),
          benchmarks: cycleEvents,
        })
      );
      writter.write('-->\n');
    });
}

function createBenchmarkSuite(
  name,
  { tableHeaderColumns = ['name', 'ops/sec', 'samples'] } = {}
) {
  const suite = new Benchmark.Suite();

  installMarkdownEmitter(suite, name, tableHeaderColumns);
  installMarkdownMachineInfo(suite);
  installMarkdownHiddenDetailedInfo(suite);

  return suite;
}

module.exports = {
  createBenchmarkSuite,
  installMarkdownEmitter,
  installMarkdownMachineInfo,
  installMarkdownHiddenDetailedInfo,
};
