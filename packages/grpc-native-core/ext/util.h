/*
 *
 * Copyright 2018 gRPC authors.
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

#ifndef NET_GRPC_NODE_UTIL_H_
#define NET_GRPC_NODE_UTIL_H_

#include <node.h>
#include <nan.h>

#include <string>

namespace grpc {
namespace node {

class StringOrNull {
 public:
  StringOrNull() : assigned(false) { }
  void assign(v8::Local<v8::Value> buffer) {
    str_ = std::string(::node::Buffer::Data(buffer),
                       ::node::Buffer::Length(buffer));
    assigned = true;
  }
  const char * get() {
    return assigned ? str_.c_str() : NULL;
  }
  bool isAssigned() {
    return assigned;
  }
 private:
  std::string str_;
  bool assigned;
};

}  // namespace node
}  // namespace grpc

#endif  // NET_GRPC_NODE_UTIL_H_
