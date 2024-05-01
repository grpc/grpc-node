/* eslint-disable node/no-unpublished-import */
const { Server, ServerCredentials } = require('@grpc/grpc-js');
const { echoService } = require('./helpers/utils');

const serviceImpl = {
  echo: (call, callback) => {
    callback(null, call.request);
  },
};

async function main() {
  const server = new Server({
    'grpc.enable_channelz': 0,
  });

  server.addService(echoService.service, serviceImpl);

  const credentials = ServerCredentials.createInsecure();

  setInterval(
    () => console.log(`RSS: ${process.memoryUsage().rss / 1024 / 1024} MiB`),
    5e3
  ).unref();

  await new Promise((resolve, reject) => {
    server.bindAsync('localhost:9999', credentials, (error, port) => {
      if (error) {
        reject(error);
        return;
      }

      console.log('server listening on port %d', port);
      resolve();
    });
  });
}

main();
