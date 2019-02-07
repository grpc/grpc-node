set -e
cd $(dirname $0)/../..
base_dir=$(pwd)

ARTIFACTS_OUT=$base_dir/artifacts ./packages/grpc-tools/build_binaries.sh