import * as protoLoader from '@grpc/proto-loader';

/** Options to use when loading protobuf files in this repo
*
* @remarks *must* match the proto-loader-gen-types usage in the package.json
* otherwise the generated types may not match the data coming into this service
*/
export const PROTO_LOADER_OPTS: protoLoader.Options = {
  longs: String,
  enums: String,
  bytes: Array,
  defaults: true,
  oneofs: true
};
