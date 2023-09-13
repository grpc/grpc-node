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
import * as xds_cluster_resolver from './load-balancer-xds-cluster-resolver';
import * as xds_cluster_impl from './load-balancer-xds-cluster-impl';
import * as load_balancer_priority from './load-balancer-priority';
import * as load_balancer_weighted_target from './load-balancer-weighted-target';
import * as load_balancer_xds_cluster_manager from './load-balancer-xds-cluster-manager';
import * as xds_wrr_locality from './load-balancer-xds-wrr-locality';
import * as ring_hash from './load-balancer-ring-hash';
import * as router_filter from './http-filter/router-filter';
import * as fault_injection_filter from './http-filter/fault-injection-filter';
import * as csds from './csds';
import * as round_robin_lb from './lb-policy-registry/round-robin';
import * as typed_struct_lb from './lb-policy-registry/typed-struct';
import * as pick_first_lb from './lb-policy-registry/pick-first';

/**
 * Register the "xds:" name scheme with the @grpc/grpc-js library.
 */
export function register() {
  resolver_xds.setup();
  load_balancer_cds.setup();
  xds_cluster_resolver.setup();
  xds_cluster_impl.setup();
  load_balancer_priority.setup();
  load_balancer_weighted_target.setup();
  load_balancer_xds_cluster_manager.setup();
  xds_wrr_locality.setup();
  ring_hash.setup();
  router_filter.setup();
  fault_injection_filter.setup();
  csds.setup();
  round_robin_lb.setup();
  typed_struct_lb.setup();
  pick_first_lb.setup();
}
