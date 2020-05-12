/*
 *
 * Copyright 2015 gRPC authors.
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

#ifndef NET_GRPC_NODE_AUTH_CONTEXT_H_
#define NET_GRPC_NODE_AUTH_CONTEXT_H_

#include <nan.h>
#include <node.h>
#include "grpc/grpc_security.h"

namespace grpc {
namespace node {

using std::unique_ptr;
using std::shared_ptr;

/* Wrapper class for grpc_auth_context. */
class AuthContext : public Nan::ObjectWrap {
 public:
  static void Init(v8::Local<v8::Object> exports);
  static bool HasInstance(v8::Local<v8::Value> val);

 private:
  friend class Call;
  AuthContext(grpc_auth_context *auth_context);
  ~AuthContext();

  // Prevent copying
  AuthContext(const AuthContext &);
  AuthContext &operator=(const AuthContext &);

  static NAN_METHOD(New);
  static NAN_METHOD(GetProperty);
  static NAN_METHOD(GetProperties);

  static Nan::Callback *constructor;
  // Used for typechecking instances of this javascript class
  static Nan::Persistent<v8::FunctionTemplate> fun_tpl;

  grpc_auth_context *wrapped_auth_context;
};

}  // namespace node
}  // namespace grpc

#endif  // NET_GRPC_NODE_AUTH_CONTEXT_H_
