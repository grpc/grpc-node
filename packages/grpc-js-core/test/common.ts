import * as assert from 'assert';

export function mockFunction(): never {
  throw new Error('Not implemented');
}

export namespace assert2 {
  const toCall = new Map<() => void, number>();
  const afterCallsQueue: Array<() => void> = [];

  /**
   * Assert that the given function doesn't throw an error, and then return
   * its value.
   * @param fn The function to evaluate.
   */
  export function noThrowAndReturn<T>(fn: () => T): T {
    try {
      return fn();
    } catch (e) {
      assert.throws(() => {throw e});
      throw e;  // for type safety only
    }
  }

  /**
   * Helper function that returns true when every function wrapped with
   * mustCall has been called.
   */
  function mustCallsSatisfied(): boolean {
    let result = true;
    toCall.forEach((value) => {
      result = result && value === 0;
    });
    return result;
  }

  export function clearMustCalls(): void {
    afterCallsQueue.length = 0;
  }

  /**
   * Wraps a function to keep track of whether it was called or not.
   * @param fn The function to wrap.
   */
  export function mustCall<T>(fn: (...args: any[]) => T): (...args: any[]) => T {
    const existingValue = toCall.get(fn);
    if (existingValue !== undefined) {
      toCall.set(fn, existingValue + 1);
    } else {
      toCall.set(fn, 1);
    }
    return (...args: any[]) => {
      const result = fn(...args);
      const existingValue = toCall.get(fn);
      if (existingValue !== undefined) {
        toCall.set(fn, existingValue - 1);
      }
      if (mustCallsSatisfied()) {
        afterCallsQueue.forEach(fn => fn());
        afterCallsQueue.length = 0;
      }
      return result;
    };
  }

  /**
   * Calls the given function when every function that was wrapped with
   * mustCall has been called.
   * @param fn The function to call once all mustCall-wrapped functions have
   *           been called.
   */
  export function afterMustCallsSatisfied(fn: () => void): void {
    if (!mustCallsSatisfied()) {
      afterCallsQueue.push(fn);
    } else {
      fn();
    }
  }
}
