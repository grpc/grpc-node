set -e
cd $(dirname $0)/..
base_dir=$(pwd)

./tools/release/kokoro-nodejs.sh
ARTIFACTS_OUT=$base_dir/artifacts ./packages/grpc-tools/build_binaries.sh