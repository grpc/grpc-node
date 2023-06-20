#!/bin/bash
# Copyright 2020 gRPC authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

cd $(dirname $0)/..
base=$(pwd)

# Install NVM
cd ~
export NVM_DIR=`pwd`/.nvm
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.4/install.sh | bash

# Load NVM
. $NVM_DIR/nvm.sh

nvm install 16

set -exu -o pipefail
[[ -f /VERSION ]] && cat /VERSION

# Make nvm available to the subprocess that the python script spawns
echo "source $NVM_DIR/nvm.sh" > ~/.profile
echo "source $NVM_DIR/nvm.sh" > ~/.shrc
export ENV=~/.shrc

cd $base/../grpc-js
npm install

# grpc-js-xds has a dev dependency on "../grpc-js", so it should pull that in automatically
cd $base
git submodule update --init --recursive
npm install

cd ../../..

git clone -b master --single-branch --depth=1 https://github.com/grpc/grpc.git

grpc/tools/run_tests/helper_scripts/prep_xds.sh

mkdir -p "${KOKORO_ARTIFACTS_DIR}/github/grpc/reports"

GRPC_NODE_TRACE=xds_client,xds_resolver,xds_cluster_manager,cds_balancer,xds_cluster_resolver,xds_cluster_impl,priority,weighted_target,round_robin,resolving_load_balancer,subchannel,keepalive,dns_resolver,fault_injection,http_filter,csds,outlier_detection,server,server_call \
  GRPC_NODE_VERBOSITY=DEBUG \
  NODE_XDS_INTEROP_VERBOSITY=1 \
  python3 grpc/tools/run_tests/run_xds_tests.py \
    --test_case="ping_pong,circuit_breaking" \
    --project_id=grpc-testing \
    --source_image=projects/grpc-testing/global/images/xds-test-server-5 \
    --path_to_server_binary=/java_server/grpc-java/interop-testing/build/install/grpc-interop-testing/bin/xds-test-server \
    --gcp_suffix=$(date '+%s') \
    --verbose \
    --qps=75 \
    ${XDS_V3_OPT-} \
    --client_cmd="$(which node) --enable-source-maps --prof --logfile=${KOKORO_ARTIFACTS_DIR}/github/grpc/reports/prof.log grpc-node/packages/grpc-js-xds/build/interop/xds-interop-client \
      --server=xds:///{server_uri} \
      --stats_port={stats_port} \
      --qps={qps} \
      {fail_on_failed_rpc} \
      {rpcs_to_send} \
      {metadata_to_send}"
