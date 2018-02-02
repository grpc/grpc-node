/**
 * @license
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

var semver = require('semver');
var useAsyncHooks = semver.satisfies(process.version, '>=8');

/**
 * Assuming that async_hooks is available, this file exposes a function
 * createAsyncResourceWrapper which creates an async resource, returning a
 * proxy object with the functions necessary to mark the entry/exit of a
 * continuation associated with that resource, as well as to destroy the
 * resource.
 * 
 * In the absence of async_hooks, a no-op implementation is returned that
 * should have minimal performance implications.
 */

if (useAsyncHooks) {
  var asyncHooks = require('async_hooks');
  module.exports = function createAsyncResourceWrapper(name) {
    var resource = new asyncHooks.AsyncResource(name);
    return {
      wrap: function(fn) {
        return function() {
          if (resource) {
            resource.emitBefore();
            try {
              var result = fn.apply(this, arguments);
            } finally {
              resource.emitAfter();
            }
            return result;
          } else {
            return fn.apply(this, arguments);
          }
        }
      },
      destroy: function() {
        if (resource) {
          resource.emitDestroy();
          resource = null;
        }
      }
    };
  }
} else {
  var noImpl = {
    wrap: function(fn) { return fn; },
    destroy: function() {}
  };
  module.exports = function createAsyncResourceWrapper() { return noImpl; }
}
