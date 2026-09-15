/*
 * Copyright 2026 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import assert = require("assert");

import * as matcher from '../src/matcher';

interface StringValueMatcherTestCase {
  /**
   * The expected string to construct the matcher with
   */
  target: string;
  /**
   * The value string to match against
   */
  value: string;
  /**
   * The expected match result
   */
  result: boolean;
  /**
   * The expected match result with the ignoreCase option set, if different
   */
  resultIgnoreCase?: boolean;
}

interface ValueMatcherConstructor {
  new(targetValue: string, ignoreCase: boolean): matcher.ValueMatcher;
}

interface StringValueMatcherGroup {
  MatcherConstructor: ValueMatcherConstructor;
  cases: StringValueMatcherTestCase[];
}

const stringValueMatcherTestCases: StringValueMatcherGroup[] = [{
  MatcherConstructor: matcher.ExactValueMatcher,
  cases: [{
    target: 'Test',
    value: 'Test',
    result: true
  }, {
    target: 'Test',
    value: 'test',
    result: false,
    resultIgnoreCase: true
  }, {
    target: 'Test',
    value: 'TestCase',
    result: false
  }, {
    target: 'correct',
    value: 'incorrect',
    result: false
  }]
}, {
  /* Note: the regex matcher does not actually accept the ignoreCase option,
   * so resultIgnoreCase will never be different for any of these */
  MatcherConstructor: matcher.SafeRegexValueMatcher,
  cases: [{
    target: 'yes|no',
    value: 'yes',
    result: true
  }, {
    target: 'yes|no',
    value: 'no',
    result: true
  }, {
    target: '[abc]',
    value: 'd',
    result: false
  }, {
    target: '[abc]',
    value: 'aaa',
    result: false
  }]
}, {
  MatcherConstructor: matcher.PrefixValueMatcher,
  cases: [{
    target: 'Test',
    value: 'Test',
    result: true
  }, {
    target: 'Test',
    value: 'TestCase',
    result: true
  }, {
    target: 'Test',
    value: 'testCase',
    result: false,
    resultIgnoreCase: true
  }, {
    target: 'correct',
    value: 'incorrect',
    result: false
  }]
}, {
  MatcherConstructor: matcher.SuffixValueMatcher,
  cases: [{
    target: 'Test',
    value: 'Test',
    result: true
  }, {
    target: 'Test',
    value: 'SuffixTest',
    result: true
  }, {
    target: 'Test',
    value: 'Suffixtest',
    result: false,
    resultIgnoreCase: true
  }, {
    target: 'Test',
    value: 'TestPrefix',
    result: false
  }, {
    target: 'correct',
    value: 'incorrect',
    result: true
  }, {
    target: 'yes',
    value: 'no',
    result: false
  }]
}, {
  MatcherConstructor: matcher.ContainsValueMatcher,
  cases: [{
    target: 'Test',
    value: 'Test',
    result: true
  }, {
    target: 'Test',
    value: 'Prefix Test Suffix',
    result: true
  }, {
    target: 'Test',
    value: 'prefix test suffix',
    result: false,
    resultIgnoreCase: true
  }, {
    target: 'correct',
    value: 'incorrect',
    result: true
  }, {
    target: 'yes',
    value: 'no',
    result: false
  }]
}, {
  MatcherConstructor: matcher.PathPrefixValueMatcher,
  cases: [{
    target: 'Test',
    value: 'Test',
    result: true
  }, {
    target: 'Test',
    value: 'TestCase',
    result: true
  }, {
    target: 'Test',
    value: 'testCase',
    result: false,
    resultIgnoreCase: true
  }, {
    target: 'correct',
    value: 'incorrect',
    result: false
  }]
}, {
  MatcherConstructor: matcher.PathExactValueMatcher,
  cases: [{
    target: 'Test',
    value: 'Test',
    result: true
  }, {
    target: 'Test',
    value: 'test',
    result: false,
    resultIgnoreCase: true
  }, {
    target: 'Test',
    value: 'TestCase',
    result: false
  }, {
    target: 'correct',
    value: 'incorrect',
    result: false
  }]
}, {
  /* Note: the regex matcher does not actually accept the ignoreCase option,
   * so resultIgnoreCase will never be different for any of these */
  MatcherConstructor: matcher.PathSafeRegexValueMatcher,
  cases: [{
    target: 'yes|no',
    value: 'yes',
    result: true
  }, {
    target: 'yes|no',
    value: 'no',
    result: true
  }, {
    target: '[abc]',
    value: 'd',
    result: false
  }, {
    target: '[abc]',
    value: 'aaa',
    result: false
  }]
}];

interface RangeValueMatcherTestCase {
  start: bigint;
  end: bigint;
  value: string;
  result: boolean;
}

const rangeValueMatcherTestCases: RangeValueMatcherTestCase[] = [{
  start: 0n,
  end: 5n,
  value: '0',
  result: true
}, {
  start: 0n,
  end: 5n,
  value: '5',
  result: false
}, {
  start: 0n,
  end: 5n,
  value: '3',
  result: true
}, {
  start: 0n,
  end: 0n,
  value: '0',
  result: false
}]

describe('matchers', () => {
  for (const testCaseGroup of stringValueMatcherTestCases) {
    describe(testCaseGroup.MatcherConstructor.name, () => {
      for (const testCase of testCaseGroup.cases) {
        it(`'${testCase.target}' should ${testCase.result ? '' : 'not '}match '${testCase.value}'`, () => {
          const matcher = new testCaseGroup.MatcherConstructor(testCase.target, false);
          assert.strictEqual(matcher.apply(testCase.value), testCase.result, `${matcher.toString()}.apply(${testCase.value}) !== ${testCase.result}`);
        });
        const resultIgnoreCase = testCase.resultIgnoreCase ?? testCase.result;
        it(`'${testCase.target}' should ${resultIgnoreCase ? '' : 'not '}match '${testCase.value}' ignoring case`, () => {
          const matcher = new testCaseGroup.MatcherConstructor(testCase.target, true);
          assert.strictEqual(matcher.apply(testCase.value), resultIgnoreCase, `${matcher.toString()}.apply(${testCase.value}) !== ${testCase.result}`);
        });
      }
    });
  }
  describe('RangeValueMatcher', () => {
    for (const testCase of rangeValueMatcherTestCases) {
      it(`${testCase.value} should ${testCase.result ? '': 'not '}match the range [${testCase.start}, ${testCase.end})`, () => {
        const rangeMatcher = new matcher.RangeValueMatcher(testCase.start, testCase.end);
        assert.strictEqual(rangeMatcher.apply(testCase.value), testCase.result)
      })
    }
  });
});
