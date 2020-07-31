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
 */

import { Resolver, ResolverListener, registerResolver } from './resolver';
import { GrpcUri, uriToString } from './uri-parser';
import { XdsClient } from './xds-client';
import { ServiceConfig } from './service-config';
import { StatusObject } from './call-stream';
import { Status } from './constants';
import { Metadata } from './metadata';
import { ChannelOptions } from './channel-options';

class XdsResolver implements Resolver {
  private resolutionStarted = false;
  private hasReportedSuccess = false;

  constructor(
    private target: GrpcUri,
    private listener: ResolverListener,
    private channelOptions: ChannelOptions
  ) {}

  private reportResolutionError() {
    this.listener.onError({
      code: Status.UNAVAILABLE,
      details: `xDS name resolution failed for target ${uriToString(
        this.target
      )}`,
      metadata: new Metadata(),
    });
  }

  updateResolution(): void {
    // Wait until updateResolution is called once to start the xDS requests
    if (!this.resolutionStarted) {
      this.resolutionStarted = true;
      const xdsClient = new XdsClient(
        this.target.path,
        {
          onValidUpdate: (update: ServiceConfig) => {
            this.hasReportedSuccess = true;
            this.listener.onSuccessfulResolution([], update, null, {
              xdsClient: xdsClient,
            });
          },
          onTransientError: (error: StatusObject) => {
            /* A transient error only needs to bubble up as a failure if we have
             * not already provided a ServiceConfig for the upper layer to use */
            if (!this.hasReportedSuccess) {
              this.reportResolutionError();
            }
          },
          onResourceDoesNotExist: () => {
            this.reportResolutionError();
          },
        },
        this.channelOptions
      );
    }
  }

  static getDefaultAuthority(target: GrpcUri) {
    return target.path;
  }
}

export function setup() {
  registerResolver('xds', XdsResolver);
}
