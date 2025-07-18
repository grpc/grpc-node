/*
 * Copyright 2025 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

/**
 * Copy xDS protos that are needed for ORCA into this directory.
 */

const fs = require('fs');

fs.mkdirSync(__dirname + '/proto/protoc-gen-validate/validate', { recursive: true });
fs.mkdirSync(__dirname + '/proto/xds/xds/data/orca/v3', { recursive: true });
fs.mkdirSync(__dirname + '/proto/xds/xds/service/orca/v3', { recursive: true });
fs.copyFileSync(__dirname + '/../grpc-js-xds/deps/protoc-gen-validate/LICENSE', __dirname + '/proto/protoc-gen-validate/LICENSE');
fs.copyFileSync(__dirname + '/../grpc-js-xds/deps/protoc-gen-validate/validate/validate.proto', __dirname + '/proto/protoc-gen-validate/validate/validate.proto');
fs.copyFileSync(__dirname + '/../grpc-js-xds/deps/xds/LICENSE', __dirname + '/proto/xds/LICENSE')
fs.copyFileSync(__dirname + '/../grpc-js-xds/deps/xds/xds/data/orca/v3/orca_load_report.proto', __dirname + '/proto/xds/xds/data/orca/v3/orca_load_report.proto');
fs.copyFileSync(__dirname + '/../grpc-js-xds/deps/xds/xds/service/orca/v3/orca.proto', __dirname + '/proto/xds/xds/service/orca/v3/orca.proto');
