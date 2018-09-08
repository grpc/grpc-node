import {StatusObject} from './call-stream';
import {Metadata} from './metadata';

export type MetadataListener = (metadata: Metadata, next: Function) => void;
// tslint:disable-next-line no-any
export type MessageListener = (message: any, next: Function) => void;
export type StatusListener = (status: StatusObject, next: Function) => void;

export interface Listener {
  onReceiveMetadata?: MetadataListener;
  onReceiveMessage?: MessageListener;
  onReceiveStatus?: StatusListener;
}
