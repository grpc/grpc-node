import * as assert from 'assert';

export function mockFunction(): never {
  throw new Error('Not implemented');
}

export namespace assert2 {
  export function noThrowAndReturn<T>(fn: () => T): T {
    try {
      return fn();
    } catch (e) {
      assert.throws(() => { throw e });
      throw e; // for type safety only
    }
  }
}
