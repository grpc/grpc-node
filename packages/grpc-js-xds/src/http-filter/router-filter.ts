/*
 * Copyright 2021 gRPC authors.
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
 */

import { experimental } from '@grpc/grpc-js';
import { Any__Output } from '../generated/google/protobuf/Any';
import { HttpFilterConfig, registerHttpFilter } from '../http-filter';
import Filter = experimental.Filter;
import FilterFactory = experimental.FilterFactory;
import BaseFilter = experimental.BaseFilter;

class RouterFilter extends BaseFilter implements Filter {}

class RouterFilterFactory implements FilterFactory<RouterFilter> {
  constructor(config: HttpFilterConfig, overrideConfig?: HttpFilterConfig) {}

  createFilter(): RouterFilter {
    return new RouterFilter();
  }
}

const ROUTER_FILTER_URL = 'type.googleapis.com/envoy.extensions.filters.http.router.v3.Router';

function parseConfig(encodedConfig: Any__Output): HttpFilterConfig | null {
  return {
    typeUrl: ROUTER_FILTER_URL,
    config: null
  };
}

export function setup() {
  registerHttpFilter(ROUTER_FILTER_URL, {
    parseTopLevelFilterConfig: parseConfig,
    parseOverrideFilterConfig: parseConfig,
    httpFilterConstructor: RouterFilterFactory
  });
}