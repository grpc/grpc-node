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
 *
 */

import { isIPv4, isIPv6 } from "net";
import { ConnectivityState } from "./connectivity-state";
import { SubchannelAddress } from "./subchannel-address";

export type TraceSeverity = 'CT_UNKNOWN' | 'CT_INFO' | 'CT_WARNING' | 'CT_ERROR';

export interface ChannelRef {
  kind: 'channel';
  id: number;
  name: string;
}

export interface SubchannelRef {
  kind: 'subchannel';
  id: number;
  name: string;
}

export interface ServerRef {
  kind: 'server';
  id: number;
}

export interface SocketRef {
  kind: 'socket';
  id: number;
  name: string;
}

interface TraceEvent {
  description: string;
  severity: TraceSeverity;
  timestamp: Date;
  childChannel?: ChannelRef;
  childSubchannel?: SubchannelRef;
}

export class ChannelzTrace {
  events: TraceEvent[] = [];
  creationTimestamp: Date;
  eventsLogged: number = 0;

  constructor() {
    this.creationTimestamp = new Date();
  }

  addTrace(severity: TraceSeverity, description: string, child?: ChannelRef | SubchannelRef) {
    const timestamp = new Date();
    this.events.push({
      description: description,
      severity: severity,
      timestamp: timestamp,
      childChannel: child?.kind === 'channel' ? child : undefined,
      childSubchannel: child?.kind === 'subchannel' ? child : undefined
    });
    this.eventsLogged += 1;
  }
}

export class ChannelzChildrenTracker {
  private channelChildren: Map<number, {ref: ChannelRef, count: number}> = new Map<number, {ref: ChannelRef, count: number}>();
  private subchannelChildren: Map<number, {ref: SubchannelRef, count: number}> = new Map<number, {ref: SubchannelRef, count: number}>();
  private socketChildren: Map<number, {ref: SocketRef, count: number}> = new Map<number, {ref: SocketRef, count: number}>();

  refChild(child: ChannelRef | SubchannelRef | SocketRef) {
    switch (child.kind) {
      case 'channel': {
        let trackedChild = this.channelChildren.get(child.id) ?? {ref: child, count: 0};
        trackedChild.count += 1;
        this.channelChildren.set(child.id, trackedChild);
        break;
      }
      case 'subchannel':{
        let trackedChild = this.subchannelChildren.get(child.id) ?? {ref: child, count: 0};
        trackedChild.count += 1;
        this.subchannelChildren.set(child.id, trackedChild);
        break;
      }
      case 'socket':{
        let trackedChild = this.socketChildren.get(child.id) ?? {ref: child, count: 0};
        trackedChild.count += 1;
        this.socketChildren.set(child.id, trackedChild);
        break;
      }
    }
  }

  unrefChild(child: ChannelRef | SubchannelRef | SocketRef) {
    switch (child.kind) {
      case 'channel': {
        let trackedChild = this.channelChildren.get(child.id);
        if (trackedChild !== undefined) {
          trackedChild.count -= 1;
          if (trackedChild.count === 0) {
            this.channelChildren.delete(child.id);
          } else {
            this.channelChildren.set(child.id, trackedChild);
          }
        }
        break;
      }
      case 'subchannel': {
        let trackedChild = this.subchannelChildren.get(child.id);
        if (trackedChild !== undefined) {
          trackedChild.count -= 1;
          if (trackedChild.count === 0) {
            this.subchannelChildren.delete(child.id);
          } else {
            this.subchannelChildren.set(child.id, trackedChild);
          }
        }
        break;
      }
      case 'socket': {
        let trackedChild = this.socketChildren.get(child.id);
        if (trackedChild !== undefined) {
          trackedChild.count -= 1;
          if (trackedChild.count === 0) {
            this.socketChildren.delete(child.id);
          } else {
            this.socketChildren.set(child.id, trackedChild);
          }
        }
        break;
      }
    }
  }

  getChildLists(): ChannelzChildren {
    const channels: ChannelRef[] = [];
    for (const {ref} of this.channelChildren.values()) {
      channels.push(ref);
    }
    const subchannels: SubchannelRef[] = [];
    for (const {ref} of this.subchannelChildren.values()) {
      subchannels.push(ref);
    }
    const sockets: SocketRef[] = [];
    for (const {ref} of this.socketChildren.values()) {
      sockets.push(ref);
    }
    return {channels, subchannels, sockets};
  }
}

export class ChannelzCallTracker {
  callsStarted: number = 0;
  callsSucceeded: number = 0;
  callsFailed: number = 0;
  lastCallStartedTimestamp: Date | null = null;

  addCallStarted() {
    this.callsStarted += 1;
    this.lastCallStartedTimestamp = new Date();
  }
  addCallSucceeded() {
    this.callsSucceeded += 1;
  }
  addCallFailed() {
    this.callsFailed += 1;
  }
}

export interface ChannelzChildren {
  channels: ChannelRef[];
  subchannels: SubchannelRef[];
  sockets: SocketRef[];
}

export interface ChannelInfo {
  state: ConnectivityState;
  trace: ChannelzTrace;
  callTracker: ChannelzCallTracker;
  children: ChannelzChildren;
}

export interface SubchannelInfo extends ChannelInfo {}

export interface ServerInfo {
  trace: ChannelzTrace;
  callTracker: ChannelzCallTracker;
  children: ChannelzChildren;
}

export interface TlsInfo {
  cipherSuiteStandardName: string | null;
  cipherSuiteOtherName: string | null;
  localCertificate: Buffer | null;
  remoteCertificate: Buffer | null;
}

export interface SocketInfo {
  localAddress: SubchannelAddress;
  remoteAddress: SubchannelAddress | null;
  security: TlsInfo | null;
  remoteName: string | null;
  streamsStarted: number;
  streamsSucceeded: number;
  streamsFailed: number;
  messagesSent: number;
  messagesReceived: number;
  keepAlivesSent: number;
  lastLocalStreamCreatedTimestamp: Date | null;
  lastRemoteStreamCreatedTimestamp: Date | null;
  lastMessageSentTimestamp: Date | null;
  lastMessageReceivedTimestamp: Date | null;
  localFlowControlWindow: number | null;
  remoteFlowControlWindow: number | null;
}

interface ChannelEntry {
  ref: ChannelRef;
  getInfo(): ChannelInfo;
}

interface SubchannelEntry {
  ref: SubchannelRef;
  getInfo(): SubchannelInfo;
}

interface ServerEntry {
  ref: ServerRef;
  getInfo(): ServerInfo;
}

interface SocketEntry {
  ref: SocketRef;
  getInfo(): SocketInfo;
}

let nextId = 1;

function getNextId(): number {
  return nextId++;
}

const channels: (ChannelEntry | undefined)[] = [];
const subchannels: (SubchannelEntry | undefined)[] = [];
const servers: (ServerEntry | undefined)[] = [];
const sockets: (SocketEntry | undefined)[] = [];

export function registerChannelzChannel(name: string, getInfo: () => ChannelInfo): ChannelRef {
  const id = getNextId();
  const ref: ChannelRef = {id, name, kind: 'channel'};
  channels[id] = { ref, getInfo };
  return ref;
}

export function registerChannelzSubchannel(name: string, getInfo:() => SubchannelInfo): SubchannelRef {
  const id = getNextId();
  const ref: SubchannelRef = {id, name, kind: 'subchannel'};
  subchannels[id] = { ref, getInfo };
  return ref;
}

export function registerChannelzServer(getInfo: () => ServerInfo): ServerRef {
  const id = getNextId();
  const ref: ServerRef = {id, kind: 'server'};
  servers[id] = { ref, getInfo };
  return ref;
}

export function registerChannelzSocket(name: string, getInfo: () => SocketInfo): SocketRef {
  const id = getNextId();
  const ref: SocketRef = {id, name, kind: 'socket'};
  sockets[id] = { ref, getInfo};
  return ref;
}

export function unregisterChannelzRef(ref: ChannelRef | SubchannelRef | ServerRef | SocketRef) {
  switch (ref.kind) {
    case 'channel':
      delete channels[ref.id];
      return;
    case 'subchannel':
      delete subchannels[ref.id];
      return;
    case 'server':
      delete servers[ref.id];
      return;
    case 'socket':
      delete sockets[ref.id];
      return;
  }
}

export interface ChannelzClientView {
  updateState(connectivityState: ConnectivityState): void;
  addTrace(severity: TraceSeverity, description: string, child?: ChannelRef | SubchannelRef): void;
  addCallStarted(): void;
  addCallSucceeded(): void;
  addCallFailed(): void;
  addChild(child: ChannelRef | SubchannelRef): void;
  removeChild(child: ChannelRef | SubchannelRef): void;
}

export interface ChannelzSubchannelView extends ChannelzClientView {
  getRef(): SubchannelRef;
}

/**
 * Converts an IPv4 or IPv6 address from string representation to binary
 * representation
 * @param ipAddress an IP address in standard IPv4 or IPv6 text format
 * @returns 
 */
function ipAddressStringToBuffer(ipAddress: string): Buffer | null {
  if (isIPv4(ipAddress)) {
    return Buffer.from(Uint8Array.from(ipAddress.split('.').map(segment => Number.parseInt(segment))));
  } else if (isIPv6(ipAddress)) {
    let leftSection: string;
    let rightSection: string | null;
    const doubleColonIndex = ipAddress.indexOf('::');
    if (doubleColonIndex === -1) {
      leftSection = ipAddress;
      rightSection = null;
    } else {
      leftSection = ipAddress.substring(0, doubleColonIndex);
      rightSection = ipAddress.substring(doubleColonIndex + 2);
    }
    const leftBuffer = Uint8Array.from(leftSection.split(':').map(segment => Number.parseInt(segment, 16)));
    const rightBuffer = rightSection ? Uint8Array.from(rightSection.split(':').map(segment => Number.parseInt(segment, 16))) : new Uint8Array();
    const middleBuffer = Buffer.alloc(16 - leftBuffer.length - rightBuffer.length, 0);
    return Buffer.concat([leftBuffer, middleBuffer, rightBuffer]);
  } else {
    return null;
  }
}