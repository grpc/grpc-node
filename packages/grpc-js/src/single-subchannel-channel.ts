/*
 * Copyright 2025 gRPC authors.
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

import { AuthContext } from "./auth-context";
import { CallCredentials } from "./call-credentials";
import { Call, CallStreamOptions, InterceptingListener, MessageContext, StatusObject } from "./call-interface";
import { getNextCallNumber } from "./call-number";
import { Channel } from "./channel";
import { ChannelOptions } from "./channel-options";
import { ChannelRef, ChannelzCallTracker, ChannelzChildrenTracker, ChannelzTrace, registerChannelzChannel, unregisterChannelzRef } from "./channelz";
import { ConnectivityState } from "./connectivity-state";
import { Propagate, Status } from "./constants";
import { restrictControlPlaneStatusCode } from "./control-plane-status";
import { Deadline, getRelativeTimeout } from "./deadline";
import { Metadata } from "./metadata";
import { getDefaultAuthority } from "./resolver";
import { Subchannel } from "./subchannel";
import { SubchannelCall } from "./subchannel-call";
import { GrpcUri, splitHostPort, uriToString } from "./uri-parser";

class SubchannelCallWrapper implements Call {
  private childCall: SubchannelCall | null = null;
  private pendingMessage: { context: MessageContext; message: Buffer } | null =
    null;
  private readPending = false;
  private halfClosePending = false;
  private pendingStatus: StatusObject | null = null;
  private serviceUrl: string;
  constructor(private subchannel: Subchannel, private method: string, private options: CallStreamOptions, private callNumber: number) {
    const splitPath: string[] = this.method.split('/');
    let serviceName = '';
    /* The standard path format is "/{serviceName}/{methodName}", so if we split
      * by '/', the first item should be empty and the second should be the
      * service name */
    if (splitPath.length >= 2) {
      serviceName = splitPath[1];
    }
    const hostname = splitHostPort(this.options.host)?.host ?? 'localhost';
    /* Currently, call credentials are only allowed on HTTPS connections, so we
      * can assume that the scheme is "https" */
    this.serviceUrl = `https://${hostname}/${serviceName}`;
    const timeout = getRelativeTimeout(options.deadline);
    if (timeout !== Infinity) {
      if (timeout <= 0) {
        this.cancelWithStatus(Status.DEADLINE_EXCEEDED, 'Deadline exceeded');
      } else {
        setTimeout(() => {
          this.cancelWithStatus(Status.DEADLINE_EXCEEDED, 'Deadline exceeded');
        }, timeout);
      }
    }
  }

  cancelWithStatus(status: Status, details: string): void {
    if (this.childCall) {
      this.childCall.cancelWithStatus(status, details);
    } else {
      this.pendingStatus = {
        code: status,
        details: details,
        metadata: new Metadata()
      };
    }

  }
  getPeer(): string {
    return this.childCall?.getPeer() ?? this.subchannel.getAddress();
  }
  start(metadata: Metadata, listener: InterceptingListener): void {
    if (this.pendingStatus) {
      listener.onReceiveStatus(this.pendingStatus);
      return;
    }
    if (this.subchannel.getConnectivityState() !== ConnectivityState.READY) {
      listener.onReceiveStatus({
        code: Status.UNAVAILABLE,
        details: 'Subchannel not ready',
        metadata: new Metadata()
      });
      return;
    }
    this.subchannel.getCallCredentials()
      .generateMetadata({method_name: this.method, service_url: this.serviceUrl})
      .then(credsMetadata => {
        this.childCall = this.subchannel.createCall(credsMetadata, this.options.host, this.method, listener);
        if (this.readPending) {
          this.childCall.startRead();
        }
        if (this.pendingMessage) {
          this.childCall.sendMessageWithContext(this.pendingMessage.context, this.pendingMessage.message);
        }
        if (this.halfClosePending) {
          this.childCall.halfClose();
        }
      }, (error: Error & { code: number }) => {
        const { code, details } = restrictControlPlaneStatusCode(
          typeof error.code === 'number' ? error.code : Status.UNKNOWN,
          `Getting metadata from plugin failed with error: ${error.message}`
        );
        listener.onReceiveStatus(
          {
            code: code,
            details: details,
            metadata: new Metadata(),
          }
        );
      });
  }
  sendMessageWithContext(context: MessageContext, message: Buffer): void {
    if (this.childCall) {
      this.childCall.sendMessageWithContext(context, message);
    } else {
      this.pendingMessage = { context, message };
    }
  }
  startRead(): void {
    if (this.childCall) {
      this.childCall.startRead();
    } else {
      this.readPending = true;
    }
  }
  halfClose(): void {
    if (this.childCall) {
      this.childCall.halfClose();
    } else {
      this.halfClosePending = true;
    }
  }
  getCallNumber(): number {
    return this.callNumber;
  }
  setCredentials(credentials: CallCredentials): void {
    throw new Error("Method not implemented.");
  }
  getAuthContext(): AuthContext | null {
    if (this.childCall) {
      return this.childCall.getAuthContext();
    } else {
      return null;
    }
  }
}

export class SingleSubchannelChannel implements Channel {
  private channelzRef: ChannelRef;
  private channelzEnabled = false;
  private channelzTrace = new ChannelzTrace();
  private callTracker = new ChannelzCallTracker();
  private childrenTracker = new ChannelzChildrenTracker();
  constructor(private subchannel: Subchannel, private target: GrpcUri, options: ChannelOptions) {
    this.channelzEnabled = options['grpc.enable_channelz'] !== 0;
    this.channelzRef = registerChannelzChannel(uriToString(target),  () => ({
      target: `${uriToString(target)} (${subchannel.getAddress()})`,
      state: this.subchannel.getConnectivityState(),
      trace: this.channelzTrace,
      callTracker: this.callTracker,
      children: this.childrenTracker.getChildLists()
    }), this.channelzEnabled);
    if (this.channelzEnabled) {
      this.childrenTracker.refChild(subchannel.getChannelzRef());
    }
  }

  close(): void {
    if (this.channelzEnabled) {
      this.childrenTracker.unrefChild(this.subchannel.getChannelzRef());
    }
    unregisterChannelzRef(this.channelzRef);
  }

  getTarget(): string {
    return uriToString(this.target);
  }
  getConnectivityState(tryToConnect: boolean): ConnectivityState {
    throw new Error("Method not implemented.");
  }
  watchConnectivityState(currentState: ConnectivityState, deadline: Date | number, callback: (error?: Error) => void): void {
    throw new Error("Method not implemented.");
  }
  getChannelzRef(): ChannelRef {
    return this.channelzRef;
  }
  createCall(method: string, deadline: Deadline): Call {
    const callOptions: CallStreamOptions = {
      deadline: deadline,
      host: getDefaultAuthority(this.target),
      flags: Propagate.DEFAULTS,
      parentCall: null
    };
    return new SubchannelCallWrapper(this.subchannel, method, callOptions, getNextCallNumber());
  }
}
