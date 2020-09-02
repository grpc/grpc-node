#!/bin/bash

# Install NVM
cd ~
export NVM_DIR=`pwd`/.nvm
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.4/install.sh | bash

# Load NVM
. $NVM_DIR/nvm.sh

nvm install 12

set -exu -o pipefail
[[ -f /VERSION ]] && cat /VERSION

cd $(dirname $0)/..
base=$(pwd)
npm run compile

cd ../../..

git clone -b master --single-branch --depth=1 https://github.com/grpc/grpc.git

grpc/tools/run_tests/helper_scripts/prep_xds.sh

GRPC_NODE_TRACE=xds_client,xds_resolver,cds_balancer,eds_balancer,priority,weighted_target,round_robin,resolving_load_balancer,subchannel,keepalive,dns_resolver GRPC_NODE_VERBOSITY=DEBUG \
  python3 grpc/tools/run_tests/run_xds_tests.py \
    --test_case="backends_restart,change_backend_service,gentle_failover,ping_pong,remove_instance_group,round_robin,secondary_locality_gets_no_requests_on_partial_primary_failure,secondary_locality_gets_requests_on_primary_failure" \
    --project_id=grpc-testing \
    --source_image=projects/grpc-testing/global/images/xds-test-server-2 \
    --path_to_server_binary=/java_server/grpc-java/interop-testing/build/install/grpc-interop-testing/bin/xds-test-server \
    --gcp_suffix=$(date '+%s') \
    --verbose \
    --client_cmd="node grpc-node/packages/grpc-js/build/interop/xds-interop-client \
      --server=xds:///{server_uri} \
      --stats_port={stats_port} \
      --qps={qps} \
      {fail_on_failed_rpc} \
      {rpcs_to_send} \
      {metadata_to_send}"
