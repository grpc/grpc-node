import { ClientUnaryCall } from './call'
import { Metadata } from './metadata'

export interface CallOptions {}

export class Client {
  makeUnaryRequest<RequestType, ResponseType>(
    method: string,
    serialize: (value: RequestType) => Buffer,
    deserialize: (value: Buffer) => ResponseType,
    argument: RequestType,
    metadata?: Metadata,
    options?: CallOptions,
    callback?: (err?: Error, value?: ResponseType) => void
  ): ClientUnaryCall {
    throw new Error();
  }
  // TODO: Do for other method types and overloads
}