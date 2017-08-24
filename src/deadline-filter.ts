import {Filter} from './filter'
import {Status} from './constants'

const units = [
  ['m', 1],
  ['S', 1000],
  ['M', 60 * 1000],
  ['H', 60 * 60 * 1000]
]

export class DeadlineFilter extends BaseFilter implements Filter {
  private deadline;
  constructor(private readonly channel: Channel, private readonly callStream: CallStream) {
    let deadline = callStream.deadline;
    this.deadline = deadline;
    let now: number = (new Date()).getTime();
    let timeout = deadline - now;
    if (timeout < 0) {
      timeout = 0;
    }
    if (deadline !== Infinity) {
      setTimeout(() => {
        callStream.cancelWithStatus(Status.DEADLINE_EXCEEDED, 'Deadline exceeded');
      }, timeout);
    }
  }

  async sendMetadata(metadata: Promise<Metadata>) {
    if (this.deadline === Infinity) {
      return await metadata;
    }
    let timeoutString : Promise<string> = new Promise<string>((resolve, reject) => {
      this.channel.connect(() => {
        let now = (new Date()).getTime();
        let timeoutMs = this.deadline - now;
        for (let [unit, factor] of units) {
          let amount = timeoutMs / factor;
          if (amount < 1e8) {
            resolve(String(Math.ceil(amount)) + unit);
            return;
          }
        }
      });
    });
    (await metadata).set('grpc-timeout', await timeoutString);
  }
}

export class DeadlineFilterFactory implements FilterFactory<DeadlineFilter> {
  constructor(private readonly channel: Http2Channel) {}

  createFilter(callStream: CallStream): DeadlineFilter {
    return new DeadlineFilter(this.channel, callStream);
  }
}
