import {CallStream} from './call-stream';
import {Channel, Http2Channel} from './channel';
import {Status} from './constants';
import {BaseFilter, Filter, FilterFactory} from './filter';
import {Metadata} from './metadata';

const units: [string, number][] =
    [['m', 1], ['S', 1000], ['M', 60 * 1000], ['H', 60 * 60 * 1000]];

function getDeadline(deadline: number) {
  let now = (new Date()).getTime();
  let timeoutMs = Math.max(deadline - now, 0);
  for (let [unit, factor] of units) {
    let amount = timeoutMs / factor;
    if (amount < 1e8) {
      return String(Math.ceil(amount)) + unit;
    }
  }
  throw new Error('Deadline is too far in the future');
}

export class DeadlineFilter extends BaseFilter implements Filter {
  private timer: NodeJS.Timer | null = null;
  private deadline: number;
  constructor(
      private readonly channel: Http2Channel,
      private readonly callStream: CallStream) {
    super();
    let callDeadline = callStream.getDeadline();
    if (callDeadline instanceof Date) {
      this.deadline = callDeadline.getTime();
    } else {
      this.deadline = callDeadline;
    }
    let now: number = (new Date()).getTime();
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

  async sendMetadata(metadata: Promise<Metadata>) {
    if (this.deadline === Infinity) {
      return await metadata;
    }
    await this.channel.connect();
    const timeoutString = getDeadline(this.deadline);
    const finalMetadata = await metadata;
    finalMetadata.set('grpc-timeout', timeoutString);
    return finalMetadata;
  }
}

export class DeadlineFilterFactory implements FilterFactory<DeadlineFilter> {
  constructor(private readonly channel: Http2Channel) {}

  createFilter(callStream: CallStream): DeadlineFilter {
    return new DeadlineFilter(this.channel, callStream);
  }
}
