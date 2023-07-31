const grpc = require('../any_grpc').server;
const protoLoader = require('../../packages/proto-loader');
const protoPackage = protoLoader.loadSync(
    'src/proto/grpc/testing/worker_service.proto',
    {keepCase: true,
     defaults: true,
     enums: String,
     oneofs: true,
     includeDirs: [__dirname + '/../proto/']});
const serviceProto = grpc.loadPackageDefinition(protoPackage).grpc.testing;

function main() {
  const parseArgs = require('minimist');
  const argv = parseArgs(process.argv, {
    string: ['client_worker_port', 'server_worker_port']
  });
  const clientWorker = new serviceProto.WorkerService(`localhost:${argv.client_worker_port}`, grpc.credentials.createInsecure());
  const serverWorker = new serviceProto.WorkerService(`localhost:${argv.server_worker_port}`, grpc.credentials.createInsecure());
  const serverWorkerStream = serverWorker.runServer();
  const clientWorkerStream = clientWorker.runClient();
  let firstServerResponseReceived = false;
  let markCount = 0;
  serverWorkerStream.on('data', (response) => {
    console.log('Server stats:', response.stats);
    if (!firstServerResponseReceived) {
      firstServerResponseReceived = true;
      clientWorkerStream.write({
        setup: {
          server_targets: [`localhost:${response.port}`],
          client_channels: 1,
          outstanding_rpcs_per_channel: 1,
          histogram_params: {
            resolution: 0.01,
            max_possible:60000000000
          },
          payload_config: {
            bytebuf_params: {
              req_size: 10,
              resp_size: 10
            }
          },
          load_params: {
            closed_loop: {}
          }
        }
      });
      clientWorkerStream.on('status', (status) => {
        console.log('Received client worker status ' + JSON.stringify(status));
        serverWorkerStream.end();
      });
      const markInterval = setInterval(() => {
        if (markCount >= 5) {
          clientWorkerStream.end();
          clearInterval(markInterval);
        } else {
          clientWorkerStream.write({
            mark: {}
          });
          serverWorkerStream.write({
            mark: {}
          });
        }
        markCount += 1;
      }, 1000);
    }
  });
  clientWorkerStream.on('data', (response) => {
    console.log('Client stats:', response.stats);
  });
  serverWorkerStream.write({
    setup: {
      port: 0
    }
  });
  serverWorkerStream.on('status', (status) => {
    console.log('Received server worker status ' + JSON.stringify(status));
    clientWorker.quitWorker({}, (error, response) => {
      if (error) {
        console.log('Received error on clientWorker.quitWorker:', error);
      } else {
        console.log('Received response from clientWorker.quitWorker');
      }
    });
    serverWorker.quitWorker({}, (error, response) => {
      if (error) {
        console.log('Received error on serverWorker.quitWorker:', error);
      } else {
        console.log('Received response from serverWorker.quitWorker');
      }
    });
  });
}

if (require.main === module) {
  main();
}
