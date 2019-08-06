/*
 * Copyright 2019 gRPC authors.
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

import { Subchannel } from "./subchannel";
import { StatusObject } from "./call-stream";
import { Metadata } from "./metadata";
import { Status } from "./constants";
import { LoadBalancer } from "./load-balancer";

export enum PickResultType {
  COMPLETE,
  QUEUE,
  TRANSIENT_FAILURE
}

export interface PickResult {
  pickResultType: PickResultType,
  subchannel: Subchannel | null,
  status: StatusObject | null
}

export interface CompletePickResult extends PickResult {
  pickResultType: PickResultType.COMPLETE,
  subchannel: Subchannel | null,
  status: null
}

export interface QueuePickResult extends PickResult {
  pickResultType: PickResultType.QUEUE,
  subchannel: null,
  status: null
}

export interface TransientFailurePickResult extends PickResult {
  pickResultType: PickResultType.TRANSIENT_FAILURE,
  subchannel: null,
  status: StatusObject
}

export interface PickArgs {
  metadata: Metadata
}

export interface Picker {
  pick(pickArgs: PickArgs): PickResult;
}

export class UnavailablePicker implements Picker {
  pick(pickArgs: PickArgs): TransientFailurePickResult {
    return {
      pickResultType: PickResultType.TRANSIENT_FAILURE,
      subchannel: null,
      status: {
        code: Status.UNAVAILABLE,
        details: "No connection established",
        metadata: new Metadata()
      }
    };
  }
}

export class QueuePicker {
  private calledExitIdle: boolean = false;
  // Constructed with a load balancer. Calls exitIdle on it the first time pick is called
  constructor(private loadBalancer: LoadBalancer) {}

  pick(pickArgs: PickArgs): QueuePickResult {
    if (!this.calledExitIdle) {
      this.loadBalancer.exitIdle();
      this.calledExitIdle = true;
    }
    return {
      pickResultType: PickResultType.QUEUE,
      subchannel: null,
      status: null
    }
  }
}