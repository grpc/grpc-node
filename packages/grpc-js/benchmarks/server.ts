import {
  Server,
  ServerUnaryCall,
  sendUnaryData,
  ServerCredentials,
} from '../build/src/index';
import { echoService } from './helpers/utils';

const serviceImpl = {
  echo: (call: ServerUnaryCall<any, any>, callback: sendUnaryData<any>) => {
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

  await new Promise<void>((resolve, reject) => {
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
