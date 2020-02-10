#!/bin/sh
# Copyright 2017 gRPC authors.
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


set -e

cd $(dirname $0)/../../../..
root=$(pwd)
native_root=$root/packages/grpc-native-core

output_file=$(mktemp /tmp/genXXXXXX)
python $native_root/tools/buildgen/gen_build_yaml.py > $output_file

$native_root/deps/grpc/tools/buildgen/generate_projects.sh $native_root/build.yaml $output_file --base=$root --templates $(find templates -type f)
