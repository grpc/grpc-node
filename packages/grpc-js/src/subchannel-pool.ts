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

import { ChannelOptions, channelOptionsEqual } from "./channel-options";
import { Subchannel } from "./subchannel";
import { ChannelCredentials } from "./channel-credentials";

// 10 seconds in milliseconds. This value is arbitrary.
const REF_CHECK_INTERVAL = 10_000;

export class SubchannelPool {
  private pool: {[channelTarget: string]: {[subchannelTarget: string]: {channelArguments: ChannelOptions, channelCredentials: ChannelCredentials, subchannel: Subchannel}[]}} = Object.create(null);

  constructor(private global: boolean) {
    if (global) {
      setInterval(() => {
        for (const channelTarget in this.pool) {
          for (const subchannelTarget in this.pool[channelTarget]) {
            const subchannelObjArray = this.pool[channelTarget][subchannelTarget];
            /* For each subchannel in the pool, try to unref it if it has
             * exactly one ref (which is the ref from the pool itself). If that
             * does happen, remove the subchannel from the pool */
            this.pool[channelTarget][subchannelTarget] = subchannelObjArray.filter((value) => !value.subchannel.unrefIfOneRef());
          }
        }
        /* Currently we do not delete keys with empty values. If that results
         * in significant memory usage we should change it. */
      }, REF_CHECK_INTERVAL).unref();
      // Unref because this timer should not keep the event loop running
    }
  }

  getOrCreateSubchannel(channelTarget: string, subchannelTarget: string, channelArguments: ChannelOptions, channelCredentials: ChannelCredentials): Subchannel {
    if (channelTarget in this.pool) {
      if (subchannelTarget in this.pool[channelTarget]){
        const subchannelObjArray = this.pool[channelTarget][subchannelTarget];
        for (const subchannelObj of subchannelObjArray) {
          if (channelOptionsEqual(channelArguments, subchannelObj.channelArguments) && channelCredentials._equals(subchannelObj.channelCredentials)) {
            return subchannelObj.subchannel;
          }
        }
      }
    }
    // If we get here, no matching subchannel was found
    const subchannel = new Subchannel(channelTarget, subchannelTarget, channelArguments, channelCredentials);
    if (!(channelTarget in this.pool)) {
      this.pool[channelTarget] = Object.create(null);
    }
    if (!(subchannelTarget in this.pool[channelTarget])) {
      this.pool[channelTarget][subchannelTarget] = [];
    }
    this.pool[channelTarget][subchannelTarget].push({channelArguments, channelCredentials, subchannel});
    if (this.global) {
      subchannel.ref();
    }
    return subchannel;
  }
}

const globalSubchannelPool = new SubchannelPool(true);

export function getOrCreateSubchannel(channelTarget: string, subchannelTarget: string, channelArguments: ChannelOptions, channelCredentials: ChannelCredentials): Subchannel {
  return globalSubchannelPool.getOrCreateSubchannel(channelTarget, subchannelTarget, channelArguments, channelCredentials);
}