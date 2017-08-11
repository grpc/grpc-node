export type MetadataValue = string | Buffer;

export interface MetadataObject {
  [propName: string]: Array<MetadataValue>;
}

export interface Metadata {
  set: (key: string, value: MetadataValue) => void;
  add: (key: string, value: MetadataValue) => void;
  remove: (key: string) => void;
  get: (key: string) => Array<MetadataValue>;
  getMap: () => MetadataObject;
  clone: () => Metadata;
}
