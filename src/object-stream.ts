import { Readable, Writable, Duplex } from 'stream';

export interface IntermediateObjectReadable<T> extends Readable {
  read(size?: number): any & T;
}

export interface ObjectReadable<T> extends IntermediateObjectReadable<T> {
  read(size?: number): T;

  addListener(event: string, listener: Function): this;
  emit(event: string | symbol, ...args: any[]): boolean;
  on(event: string, listener: Function): this;
  once(event: string, listener: Function): this;
  prependListener(event: string, listener: Function): this;
  prependOnceListener(event: string, listener: Function): this;
  removeListener(event: string, listener: Function): this;

  addListener(event: 'data', listener: (chunk: T) => void): this;
  emit(event: 'data', chunk: T): boolean;
  on(event: 'data', listener: (chunk: T) => void): this;
  once(event: 'data', listener: (chunk: T) => void): this;
  prependListener(event: 'data', listener: (chunk: T) => void): this;
  prependOnceListener(event: 'data', listener: (chunk: T) => void): this;
  removeListener(event: 'data', listener: (chunk: T) => void): this;
}

export interface IntermediateObjectWritable<T> extends Writable {
  _write(chunk: any & T, encoding: string, callback: Function): void;
  write(chunk: any & T, cb?: Function): boolean;
  write(chunk: any & T, encoding?: any, cb?: Function): boolean;
  setDefaultEncoding(encoding: string): this;
  end(): void;
  end(chunk: any & T, cb?: Function): void;
  end(chunk: any & T, encoding?: any, cb?: Function): void;
}

export interface ObjectWritable<T> extends IntermediateObjectWritable<T> {
  _write(chunk: T, encoding: string, callback: Function): void;
  write(chunk: T, cb?: Function): boolean;
  write(chunk: T, encoding?: any, cb?: Function): boolean;
  setDefaultEncoding(encoding: string): this;
  end(): void;
  end(chunk: T, cb?: Function): void;
  end(chunk: T, encoding?: any, cb?: Function): void;
}

export interface ObjectDuplex<T, U> extends Duplex, ObjectWritable<T>, ObjectReadable<U> {
  read(size?: number): U;

  _write(chunk: T, encoding: string, callback: Function): void;
  write(chunk: T, cb?: Function): boolean;
  write(chunk: T, encoding?: any, cb?: Function): boolean;
  end(): void;
  end(chunk: T, cb?: Function): void;
  end(chunk: T, encoding?: any, cb?: Function): void;


  addListener(event: string, listener: Function): this;
  emit(event: string | symbol, ...args: any[]): boolean;
  on(event: string, listener: Function): this;
  once(event: string, listener: Function): this;
  prependListener(event: string, listener: Function): this;
  prependOnceListener(event: string, listener: Function): this;
  removeListener(event: string, listener: Function): this;
}
