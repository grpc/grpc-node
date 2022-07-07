# Copyright 2022 gRPC authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# Dockerfile for building the xDS interop client. To build the image, run the
# following command from grpc-node directory:
# docker build -t <TAG> -f packages/grpc-js-xds/interop/Dockerfile .

FROM node:16-alpine as build

# Make a grpc-node directory and copy the repo into it.
WORKDIR /node/src/grpc-node
COPY . .

WORKDIR /node/src/grpc-node/packages/grpc-js
RUN npm install
WORKDIR /node/src/grpc-node/packages/grpc-js-xds
RUN npm install

FROM node:16-alpine
WORKDIR /node/src/grpc-node
COPY --from=build /node/src/grpc-node/packages/grpc-js ./packages/grpc-js/
COPY --from=build /node/src/grpc-node/packages/grpc-js-xds ./packages/grpc-js-xds/

ENV GRPC_VERBOSITY="DEBUG"
ENV GRPC_TRACE=xds_client,xds_resolver,cds_balancer,eds_balancer,priority,weighted_target,round_robin,resolving_load_balancer,subchannel,keepalive,dns_resolver,fault_injection,http_filter,csds

ENTRYPOINT [ "node", "/node/src/grpc-node/packages/grpc-js-xds/build/interop/xds-interop-client" ]
