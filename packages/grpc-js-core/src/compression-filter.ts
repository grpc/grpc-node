import * as zlib from 'zlib';

import {Call, WriteFlags, WriteObject} from './call-stream';
import {Channel} from './channel';
import {BaseFilter, Filter, FilterFactory} from './filter';
import {Metadata, MetadataValue} from './metadata';

abstract class CompressionHandler {
  protected abstract compressMessage(message: Buffer): Promise<Buffer>;
  protected abstract decompressMessage(data: Buffer): Promise<Buffer>;
  /**
   * @param message Raw uncompressed message bytes
   * @param compress Indicates whether the message should be compressed
   * @return Framed message, compressed if applicable
   */
  async writeMessage(message: Buffer, compress: boolean): Promise<Buffer> {
    let messageBuffer = message;
    if (compress) {
      messageBuffer = await this.compressMessage(messageBuffer);
    }
    const output = Buffer.allocUnsafe(messageBuffer.length + 5);
    output.writeUInt8(compress ? 1 : 0, 0);
    output.writeUInt32BE(messageBuffer.length, 1);
    messageBuffer.copy(output, 5);
    return output;
  }
  /**
   * @param data Framed message, possibly compressed
   * @return Uncompressed message
   */
  async readMessage(data: Buffer): Promise<Buffer> {
    const compressed = data.readUInt8(1) === 1;
    const messageBuffer = data.slice(5);
    if (compressed) {
      return this.decompressMessage(messageBuffer);
    }
    return messageBuffer;
  }
}

class IdentityHandler extends CompressionHandler {
  async compressMessage(message: Buffer) {
    return message;
  }

  async writeMessage(message: Buffer, compress: boolean): Promise<Buffer> {
    const output = Buffer.allocUnsafe(message.length + 5);
    /* With "identity" compression, messages should always be marked as
     * uncompressed */
    output.writeUInt8(0, 0);
    output.writeUInt32BE(message.length, 1);
    message.copy(output, 5);
    return output;
  }

  decompressMessage(message: Buffer): Promise<Buffer> {
    return Promise.reject<Buffer>(new Error(
        'Received compressed message but "grpc-encoding" header was identity'));
  }
}

class DeflateHandler extends CompressionHandler {
  compressMessage(message: Buffer) {
    return new Promise<Buffer>((resolve, reject) => {
      zlib.deflate(message, (err, output) => {
        if (err) {
          reject(err);
        } else {
          resolve(output);
        }
      });
    });
  }

  decompressMessage(message: Buffer) {
    return new Promise<Buffer>((resolve, reject) => {
      zlib.inflate(message, (err, output) => {
        if (err) {
          reject(err);
        } else {
          resolve(output);
        }
      });
    });
  }
}

class GzipHandler extends CompressionHandler {
  compressMessage(message: Buffer) {
    return new Promise<Buffer>((resolve, reject) => {
      zlib.gzip(message, (err, output) => {
        if (err) {
          reject(err);
        } else {
          resolve(output);
        }
      });
    });
  }

  decompressMessage(message: Buffer) {
    return new Promise<Buffer>((resolve, reject) => {
      zlib.unzip(message, (err, output) => {
        if (err) {
          reject(err);
        } else {
          resolve(output);
        }
      });
    });
  }
}

class UnknownHandler extends CompressionHandler {
  constructor(private readonly compressionName: string) {
    super();
  }
  compressMessage(message: Buffer): Promise<Buffer> {
    return Promise.reject<Buffer>(new Error(
        `Received message compressed wth unsupported compression method ${
            this.compressionName}`));
  }

  decompressMessage(message: Buffer): Promise<Buffer> {
    // This should be unreachable
    return Promise.reject<Buffer>(
        new Error(`Compression method not supported: ${this.compressionName}`));
  }
}

function getCompressionHandler(compressionName: string): CompressionHandler {
  switch (compressionName) {
    case 'identity':
      return new IdentityHandler();
    case 'deflate':
      return new DeflateHandler();
    case 'gzip':
      return new GzipHandler();
    default:
      return new UnknownHandler(compressionName);
  }
}

export class CompressionFilter extends BaseFilter implements Filter {
  private sendCompression: CompressionHandler = new IdentityHandler();
  private receiveCompression: CompressionHandler = new IdentityHandler();
  async sendMetadata(metadata: Metadata): Promise<Metadata> {
    metadata.set('grpc-encoding', 'identity');
    metadata.set('grpc-accept-encoding', 'identity,deflate,gzip');
    return metadata;
  }

  async receiveMetadata(metadata: Metadata): Promise<Metadata> {
    const receiveEncoding: MetadataValue[] = metadata.get('grpc-encoding');
    if (receiveEncoding.length > 0) {
      const encoding: MetadataValue = receiveEncoding[0];
      if (typeof encoding === 'string') {
        this.receiveCompression = getCompressionHandler(encoding);
      }
    }
    metadata.remove('grpc-encoding');
    metadata.remove('grpc-accept-encoding');
    return metadata;
  }

  async sendMessage(message: WriteObject): Promise<WriteObject> {
    /* This filter is special. The input message is the bare message bytes,
     * and the output is a framed and possibly compressed message. For this
     * reason, this filter should be at the bottom of the filter stack */
    const compress = message.flags === undefined ?
        false :
        (message.flags & WriteFlags.NoCompress) === 0;
    return {
      message:
          await this.sendCompression.writeMessage(message.message, compress),
      flags: message.flags
    };
  }

  async receiveMessage(message: Buffer) {
    /* This filter is also special. The input message is framed and possibly
     * compressed, and the output message is deframed and uncompressed. So
     * this is another reason that this filter should be at the bottom of the
     * filter stack. */
    return this.receiveCompression.readMessage(message);
  }
}

export class CompressionFilterFactory implements
    FilterFactory<CompressionFilter> {
  constructor(private readonly channel: Channel) {}
  createFilter(callStream: Call): CompressionFilter {
    return new CompressionFilter();
  }
}
