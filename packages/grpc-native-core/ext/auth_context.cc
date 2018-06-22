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

#include "auth_context.h"

namespace grpc {
namespace node {

using Nan::Callback;
using Nan::EscapableHandleScope;
using Nan::HandleScope;
using Nan::Maybe;
using Nan::MaybeLocal;
using Nan::ObjectWrap;
using Nan::Persistent;
using Nan::Utf8String;

using v8::Array;
using v8::Boolean;
using v8::Exception;
using v8::External;
using v8::Function;
using v8::FunctionTemplate;
using v8::Integer;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::ObjectTemplate;
using v8::Uint32;
using v8::String;
using v8::Value;

Callback *AuthContext::constructor;
Persistent<FunctionTemplate> AuthContext::fun_tpl;

void AuthContext::Init(Local<Object> exports) {
  HandleScope scope;
  Local<FunctionTemplate> tpl = Nan::New<FunctionTemplate>(New);
  tpl->SetClassName(Nan::New("AuthContext").ToLocalChecked());
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  Nan::SetPrototypeMethod(tpl, "getProperty", GetProperty);
  Nan::SetPrototypeMethod(tpl, "getProperties", GetProperties);

  fun_tpl.Reset(tpl);
  Local<Function> ctr = Nan::GetFunction(tpl).ToLocalChecked();
  Nan::Set(exports, Nan::New("AuthContext").ToLocalChecked(), ctr);
  constructor = new Callback(ctr);
}

bool AuthContext::HasInstance(Local<Value> val) {
  HandleScope scope;
  return Nan::New(fun_tpl)->HasInstance(val);
}

AuthContext::AuthContext(grpc_auth_context *auth_context) : wrapped_auth_context(auth_context) {
}

AuthContext::~AuthContext() {
  if (wrapped_auth_context) {
    grpc_auth_context_release(wrapped_auth_context);
  }
}

NAN_METHOD(AuthContext::New) {
  if (info[0]->IsExternal()) {
    Local<External> ext = info[0].As<External>();
    // This option is used for wrapping an existing call
    grpc_auth_context *auth_context_ptr = reinterpret_cast<grpc_auth_context *>(ext->Value());
    AuthContext *auth_context = new AuthContext(auth_context_ptr);

    auth_context->Wrap(info.This());
    info.GetReturnValue().Set(info.This());
  } else {
    return Nan::ThrowError("Don't try to call AuthContext's constructor directly.");
  }
}

NAN_METHOD(AuthContext::GetProperty) {
  Nan::HandleScope scope;
  if (!HasInstance(info.This())) {
    return Nan::ThrowTypeError("getProperty can only be called on AuthContext objects");
  }

  AuthContext *auth_context_obj = ObjectWrap::Unwrap<AuthContext>(info.This());
  grpc_auth_context *auth_context = auth_context_obj->wrapped_auth_context;

  Utf8String name(info[0]);
  grpc_auth_property_iterator it = grpc_auth_context_find_properties_by_name(auth_context, *name);
  const grpc_auth_property *property = grpc_auth_property_iterator_next(&it);
  if (property) {
    info.GetReturnValue().Set(
      Nan::CopyBuffer(property->value, property->value_length).ToLocalChecked()
    );
  }
}

NAN_METHOD(AuthContext::GetProperties) {
  Nan::HandleScope scope;
  if (!HasInstance(info.This())) {
    return Nan::ThrowTypeError("getProperties can only be called on AuthContext objects");
  }

  AuthContext *auth_context_obj = ObjectWrap::Unwrap<AuthContext>(info.This());
  grpc_auth_context *auth_context = auth_context_obj->wrapped_auth_context;

  grpc_auth_property_iterator it = grpc_auth_context_property_iterator(auth_context);

  Local<Object> ret = Nan::New<Object>();

  while (true) {
    const grpc_auth_property *property = grpc_auth_property_iterator_next(&it);
    if (!property) break;

    ret->Set(
      Nan::New(property->name).ToLocalChecked(),
      Nan::CopyBuffer(property->value, property->value_length).ToLocalChecked()
    );
  }

  info.GetReturnValue().Set(ret);
}


}  // namespace node
}  // namespace grpc
