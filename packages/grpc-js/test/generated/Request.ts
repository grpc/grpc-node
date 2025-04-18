// Original file: test/fixtures/test_service.proto


export interface Request {
  'error'?: (boolean);
  'message'?: (string);
  'errorAfter'?: (number);
  'responseLength'?: (number);
}

export interface Request__Output {
  'error': (boolean);
  'message': (string);
  'errorAfter': (number);
  'responseLength': (number);
}
