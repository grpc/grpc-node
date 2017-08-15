export type MetadataValue = string | Buffer;

export interface MetadataObject {
  [propName: string]: Array<MetadataValue>;
}

export class Metadata {
  static createMetadata(): Metadata {
    return new Metadata();
  }

  set(_key: string, _value: MetadataValue): void {
    throw new Error('Not implemented');
  }

  add(_key: string, _value: MetadataValue): void {
    throw new Error('Not implemented');
  }

  remove(_key: string): void {
    throw new Error('Not implemented');
  }

  get(_key: string): Array<MetadataValue> {
    throw new Error('Not implemented');
  }
  
  getMap(): MetadataObject {
    throw new Error('Not implemented');
  }

  clone(): Metadata {
    throw new Error('Not implemented');
  }
}
