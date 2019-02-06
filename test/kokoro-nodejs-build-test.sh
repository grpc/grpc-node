set -e
cd $(dirname $0)/..
base_dir=$(pwd)

./tools/release/kokoro-nodejs.sh
./tools/release/kokoro-grpc-tools.sh