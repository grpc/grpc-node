// Original file: null


export interface I_google_protobuf_GeneratedCodeInfo_Annotation {
  'path'?: (number)[];
  'sourceFile'?: (string);
  'begin'?: (number);
  'end'?: (number);
  'semantic'?: (I_google_protobuf_GeneratedCodeInfo_Annotation_Semantic);
}

export interface O_google_protobuf_GeneratedCodeInfo_Annotation {
  'path': (number)[];
  'sourceFile': (string);
  'begin': (number);
  'end': (number);
  'semantic': (O_google_protobuf_GeneratedCodeInfo_Annotation_Semantic);
}

// Original file: null

export const _google_protobuf_GeneratedCodeInfo_Annotation_Semantic = {
  NONE: 'NONE',
  SET: 'SET',
  ALIAS: 'ALIAS',
} as const;

export type I_google_protobuf_GeneratedCodeInfo_Annotation_Semantic =
  | 'NONE'
  | 0
  | 'SET'
  | 1
  | 'ALIAS'
  | 2

export type O_google_protobuf_GeneratedCodeInfo_Annotation_Semantic = typeof _google_protobuf_GeneratedCodeInfo_Annotation_Semantic[keyof typeof _google_protobuf_GeneratedCodeInfo_Annotation_Semantic]

export interface IGeneratedCodeInfo {
  'annotation'?: (I_google_protobuf_GeneratedCodeInfo_Annotation)[];
}

export interface OGeneratedCodeInfo {
  'annotation': (O_google_protobuf_GeneratedCodeInfo_Annotation)[];
}
