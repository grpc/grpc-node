#!/bin/bash

set -exu -o pipefail
[[ -f /VERSION ]] && cat /VERSION

cd $(dirname $0)
cd ..
base=$(pwd)
npm run compile

cd ../../..

git clone -b master --single-branch --depth=1 https://github.com/grpc/grpc.git

grpc/tools/run_tests/helper_scripts/prep_xds.sh

# Test cases "path_matching" and "header_matching" are not included in "all",
# because not all interop clients in all languages support these new tests.
#
# TODO: remove "path_matching" and "header_matching" from --test_case after
# they are added into "all".
GRPC_NODE_TRACE=all GRPC_NODE_VERBOSITY=DEBUG \
  python3 grpc/tools/run_tests/run_xds_tests.py \
    --test_case="all" \
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