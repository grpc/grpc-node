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
import {
  Call,
  CallStreamOptions,
  createWriteFailure,
  InterceptingListener,
  MessageContext,
  StatusObject,
} from "./call-interface";
import { getNextCallNumber } from "./call-number";
import { Channel } from "./channel";
import { ChannelOptions } from "./channel-options";
import { ChannelRef, ChannelzCallTracker, ChannelzChildrenTracker, ChannelzTrace, registerChannelzChannel, unregisterChannelzRef } from "./channelz";
import { CompressionFilterFactory } from "./compression-filter";
import { ConnectivityState } from "./connectivity-state";
import { Propagate, Status } from "./constants";
import { restrictControlPlaneStatusCode } from "./control-plane-status";
import { Deadline, getRelativeTimeout } from "./deadline";
import { FilterStack, FilterStackFactory } from "./filter-stack";
import { Metadata } from "./metadata";
import { getDefaultAuthority } from "./resolver";
import { Subchannel } from "./subchannel";
import { SubchannelCall } from "./subchannel-call";
import { GrpcUri, computeServiceUrl, uriToString } from "./uri-parser";

class SubchannelCallWrapper implements Call {
  private childCall: SubchannelCall | null = null;
  private pendingMessages: Array<{ context: MessageContext; message: Buffer }> =
    [];
  private readPending = false;
  private halfClosePending = false;
  private pendingStatus: StatusObject | null = null;
  private endedStatus: StatusObject | null = null;
  private serviceUrl: string;
  private filterStack: FilterStack;
  private readFilterPending = false;
  private writeFilterPending = false;
  constructor(private subchannel: Subchannel, private method: string, filterStackFactory: FilterStackFactory, private options: CallStreamOptions, private callNumber: number) {
    this.serviceUrl = computeServiceUrl(this.options.host, this.method);
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
    this.filterStack = filterStackFactory.createFilter();
  }

  private rejectPendingMessages(status: StatusObject): void {
    const pending = this.pendingMessages.splice(0);
    for (const entry of pending) {
      const callback = entry.context.callback;
      entry.context.callback = undefined;
      callback?.(createWriteFailure(status));
    }
  }

  private dequeuePendingMessage(): void {
    if (!this.childCall || this.writeFilterPending) {
      return;
    }
    const pending = this.pendingMessages.shift();
    if (!pending) {
      if (this.halfClosePending) {
        this.halfClosePending = false;
        this.childCall.halfClose();
      }
      return;
    }
    this.sendMessageOnChild(pending.context, pending.message);
  }

  private sendMessageOnChild(context: MessageContext, message: Buffer): void {
    const childCall = this.childCall!;
    this.writeFilterPending = true;
    this.filterStack
      .sendMessage(Promise.resolve({ message: message, flags: context.flags }))
      .then(
        filteredMessage => {
          this.writeFilterPending = false;
          if (this.endedStatus) {
            const callback = context.callback;
            context.callback = undefined;
            callback?.(createWriteFailure(this.endedStatus));
            this.rejectPendingMessages(this.endedStatus);
            return;
          }
          childCall.sendMessageWithContext(context, filteredMessage.message);
          this.dequeuePendingMessage();
        },
        (status: StatusObject) => {
          this.writeFilterPending = false;
          const callback = context.callback;
          context.callback = undefined;
          callback?.(createWriteFailure(status));
          this.cancelWithStatus(status.code, status.details);
        }
      );
  }

  cancelWithStatus(status: Status, details: string): void {
    const endedStatus = {
      code: status,
      details: details,
      metadata: new Metadata(),
    };
    this.endedStatus = endedStatus;
    if (this.childCall) {
      this.childCall.cancelWithStatus(status, details);
    } else {
      this.pendingStatus = endedStatus;
    }
    this.rejectPendingMessages(endedStatus);
  }
  getPeer(): string {
    return this.childCall?.getPeer() ?? this.subchannel.getAddress();
  }
  async start(metadata: Metadata, listener: InterceptingListener): Promise<void> {
    if (this.pendingStatus) {
      this.endedStatus = this.pendingStatus;
      listener.onReceiveStatus(this.pendingStatus);
      this.rejectPendingMessages(this.pendingStatus);
      return;
    }
    if (this.subchannel.getConnectivityState() !== ConnectivityState.READY) {
      const status = {
        code: Status.UNAVAILABLE,
        details: 'Subchannel not ready',
        metadata: new Metadata()
      };
      this.endedStatus = status;
      listener.onReceiveStatus(status);
      this.rejectPendingMessages(status);
      return;
    }
    const filteredMetadata = await this.filterStack.sendMetadata(Promise.resolve(metadata));
    let credsMetadata: Metadata;
    try {
      credsMetadata = await this.subchannel.getCallCredentials()
        .generateMetadata({method_name: this.method, service_url: this.serviceUrl});
    } catch (e) {
      const error = e as (Error & { code: number });
      const { code, details } = restrictControlPlaneStatusCode(
        typeof error.code === 'number' ? error.code : Status.UNKNOWN,
        `Getting metadata from plugin failed with error: ${error.message}`
      );
      const status = {
        code: code,
        details: details,
        metadata: new Metadata(),
      };
      this.endedStatus = status;
      listener.onReceiveStatus(status);
      this.rejectPendingMessages(status);
      return;
    }
    if (this.endedStatus) {
      this.rejectPendingMessages(this.endedStatus);
      return;
    }
    credsMetadata.merge(filteredMetadata);
    const childListener: InterceptingListener = {
      onReceiveMetadata: async metadata => {
        listener.onReceiveMetadata(await this.filterStack.receiveMetadata(metadata));
      },
      onReceiveMessage: async message => {
        this.readFilterPending = true;
        const filteredMessage = await this.filterStack.receiveMessage(message);
        this.readFilterPending = false;
        listener.onReceiveMessage(filteredMessage);
        if (this.pendingStatus) {
          listener.onReceiveStatus(this.pendingStatus);
        }
      },
      onReceiveStatus: async status => {
        const filteredStatus = await this.filterStack.receiveTrailers(status);
        if (this.readFilterPending) {
          this.pendingStatus = filteredStatus;
        } else {
          listener.onReceiveStatus(filteredStatus);
        }
      }
    }
    this.childCall = this.subchannel.createCall(
      credsMetadata,
      this.options.host,
      this.method,
      childListener,
      this.callNumber
    );
    if (this.readPending) {
      this.childCall.startRead();
    }
    this.dequeuePendingMessage();
  }
  sendMessageWithContext(context: MessageContext, message: Buffer): void {
    if (this.endedStatus) {
      const status = this.endedStatus;
      process.nextTick(() => {
        context.callback?.(createWriteFailure(status));
      });
      return;
    }
    if (
      !this.childCall ||
      this.writeFilterPending ||
      this.pendingMessages.length > 0
    ) {
      this.pendingMessages.push({ context, message });
      if (this.childCall && !this.writeFilterPending) {
        this.dequeuePendingMessage();
      }
      return;
    }
    this.sendMessageOnChild(context, message);
  }
  startRead(): void {
    if (this.childCall) {
      this.childCall.startRead();
    } else {
      this.readPending = true;
    }
  }
  halfClose(): void {
    if (
      this.childCall &&
      !this.writeFilterPending &&
      this.pendingMessages.length === 0
    ) {
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
  private filterStackFactory: FilterStackFactory;
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
    this.filterStackFactory = new FilterStackFactory([new CompressionFilterFactory(this, options)]);
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
    return new SubchannelCallWrapper(this.subchannel, method, this.filterStackFactory, callOptions, getNextCallNumber());
  }
}
