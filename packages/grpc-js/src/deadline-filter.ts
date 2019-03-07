import {Call} from './call-stream';
import {ConnectivityState, Http2Channel} from './channel';
import {Status} from './constants';
import {BaseFilter, Filter, FilterFactory} from './filter';
import {Metadata} from './metadata';

const units: Array<[string, number]> =
    [['m', 1], ['S', 1000], ['M', 60 * 1000], ['H', 60 * 60 * 1000]];

function getDeadline(deadline: number) {
  const now = (new Date()).getTime();
  const timeoutMs = Math.max(deadline - now, 0);
  for (const [unit, factor] of units) {
    const amount = timeoutMs / factor;
    if (amount < 1e8) {
      return String(Math.ceil(amount)) + unit;
    }
  }
  throw new Error('Deadline is too far in the future');
}

export class DeadlineFilter extends BaseFilter implements Filter {
  private timer: NodeJS.Timer|null = null;
  private deadline: number;
  constructor(
      private readonly channel: Http2Channel,
      private readonly callStream: Call) {
    super();
    const callDeadline = callStream.getDeadline();
    if (callDeadline instanceof Date) {
      this.deadline = callDeadline.getTime();
    } else {
      this.deadline = callDeadline;
    }
    const now: number = (new Date()).getTime();
    let timeout = this.deadline - now;
    if (timeout < 0) {
      timeout = 0;
    }
    if (this.deadline !== Infinity) {
      this.timer = setTimeout(() => {
        callStream.cancelWithStatus(
            Status.DEADLINE_EXCEEDED, 'Deadline exceeded');
      }, timeout);
      callStream.on('status', () => clearTimeout(this.timer as NodeJS.Timer));
    }
  }

  sendMetadata(metadata: Promise<Metadata>) {
    if (this.deadline === Infinity) {
      return metadata;
    }
    return new Promise<Metadata>((resolve, reject) => {
             if (this.channel.getConnectivityState(false) ===
                 ConnectivityState.READY) {
               resolve(metadata);
             } else {
               const handleStateChange = (newState: ConnectivityState) => {
                 if (newState === ConnectivityState.READY) {
                   resolve(metadata);
                   this.channel.removeListener(
                       'connectivityStateChanged', handleStateChange);
                   this.callStream.removeListener('status', handleStatus);
                 }
               };
               const handleStatus = () => {
                 reject(new Error('Call ended'));
                 this.channel.removeListener(
                     'connectivityStateChanged', handleStateChange);
               };
               this.channel.on('connectivityStateChanged', handleStateChange);
               this.callStream.once('status', handleStatus);
             }
           })
        .then((finalMetadata: Metadata) => {
          const timeoutString = getDeadline(this.deadline);
          finalMetadata.set('grpc-timeout', timeoutString);
          return finalMetadata;
        });
  }
}

export class DeadlineFilterFactory implements FilterFactory<DeadlineFilter> {
  constructor(private readonly channel: Http2Channel) {}

  createFilter(callStream: Call): DeadlineFilter {
    return new DeadlineFilter(this.channel, callStream);
  }
}
