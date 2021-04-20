/*
 * Copyright 2020 gRPC authors.
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

import * as resolver_xds from './resolver-xds';
import * as load_balancer_cds from './load-balancer-cds';
import * as load_balancer_eds from './load-balancer-eds';
import * as load_balancer_lrs from './load-balancer-lrs';
import * as load_balancer_priority from './load-balancer-priority';
import * as load_balancer_weighted_target from './load-balancer-weighted-target';
import * as load_balancer_xds_cluster_manager from './load-balancer-xds-cluster-manager';

/**
 * Register the "xds:" name scheme with the @grpc/grpc-js library.
 */
export function register() {
  resolver_xds.setup();
  load_balancer_cds.setup();
  load_balancer_eds.setup();
  load_balancer_lrs.setup();
  load_balancer_priority.setup();
  load_balancer_weighted_target.setup();
  load_balancer_xds_cluster_manager.setup();
}