set -e
cd $(dirname $0)/../..
base_dir=$(pwd)

OS=$(uname)

case $OS in
Linux)
  docker build -t kokoro-native-image tools/release/native
  docker run -v /var/run/docker.sock:/var/run/docker.sock -v $base_dir:$base_dir -e ARTIFACTS_OUT=$base_dir/artifacts kokoro-native-image $base_dir/packages/grpc-tools/build_binaries.sh
  ;;
Darwin)
  ARTIFACTS_OUT=$base_dir/artifacts ./packages/grpc-tools/build_binaries.sh
  ;;
esac