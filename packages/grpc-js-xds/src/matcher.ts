/*
 * Copyright 2021 gRPC authors.
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
 */

import { Metadata } from "@grpc/grpc-js";
import { RE2 } from "re2-wasm";
import { Fraction, fractionToString } from "./fraction";

/**
 * An object representing a predicate that determines whether a given
 * combination of a methodName and metadata matches some internal conditions.
 */
export interface Matcher {
  toString(): string;
  apply(methodName: string, metadata: Metadata): boolean;
}

/**
 * An object representing a predicate that determines whether a given string
 * value matches some internal conditions.
 */
export interface ValueMatcher {
  toString(): string;
  apply(value: string): boolean;
}

export class ExactValueMatcher implements ValueMatcher {
  constructor(private targetValue: string, private ignoreCase: boolean) {
  }

  apply(value: string) {
    if (this.ignoreCase) {
      return value.toLowerCase() === this.targetValue.toLowerCase();
    } else {
      return value === this.targetValue;
    }
  }

  toString() {
    return 'Exact(' + this.targetValue + ', ignore_case=' + this.ignoreCase + ')';
  }
}

export class SafeRegexValueMatcher implements ValueMatcher {
  private targetRegexImpl: RE2;
  constructor(targetRegex: string) {
    this.targetRegexImpl = new RE2(`^${targetRegex}$`, 'u');
  }

  apply(value: string) {
    return this.targetRegexImpl.test(value);
  }

  toString() {
    return 'SafeRegex(' + this.targetRegexImpl.toString() + ')';
  }
}

const numberRegex = new RE2(/^-?\d+$/u);

export class RangeValueMatcher implements ValueMatcher {
  constructor(private start: bigint, private end: bigint) {}

  apply(value: string) {
    if (!numberRegex.test(value)) {
      return false;
    }
    const numberValue = BigInt(value);
    return this.start <= numberValue && numberValue < this.end;
  }

  toString() {
    return 'Range(' + this.start + ', ' + this.end + ')';
  }
}

export class PresentValueMatcher implements ValueMatcher {
  constructor() {}

  apply(value: string) {
    return true;
  }

  toString() {
    return 'Present()';
  }
}

export class PrefixValueMatcher implements ValueMatcher {
  constructor(private prefix: string, private ignoreCase: boolean) {
  }

  apply(value: string) {
    if (this.ignoreCase) {
      return value.toLowerCase().startsWith(this.prefix.toLowerCase());
    } else {
      return value.startsWith(this.prefix);
    }
  }

  toString() {
    return 'Prefix(' + this.prefix + ', ignore_case=' + this.ignoreCase + ')';
  }
}

export class SuffixValueMatcher implements ValueMatcher {
  constructor(private suffix: string, private ignoreCase: boolean) {}

  apply(value: string) {
    if (this.ignoreCase) {
      return value.toLowerCase().endsWith(this.suffix.toLowerCase());
    } else {
      return value.endsWith(this.suffix);
    }
  }

  toString() {
    return 'Suffix(' + this.suffix + ', ignore_case=' + this.ignoreCase + ')';
  }
}

export class ContainsValueMatcher implements ValueMatcher {
  constructor(private contains: string, private ignoreCase: boolean) {}

  apply(value: string) {
    if (this.ignoreCase) {
      return value.toLowerCase().includes(this.contains.toLowerCase());
    } else {
      return value.includes(this.contains);
    }
  }

  toString() {
    return 'Contains(' + this.contains + + ', ignore_case=' + this.ignoreCase + ')';
  }
}

export class RejectValueMatcher implements ValueMatcher {
  constructor() {}

  apply(value: string) {
    return false;
  }

  toString() {
    return 'Reject()';
  }
}

export class HeaderMatcher implements Matcher {
  constructor(private headerName: string, private valueMatcher: ValueMatcher, private invertMatch: boolean) {}

  private applyHelper(methodName: string, metadata: Metadata) {
    if (this.headerName.endsWith('-bin')) {
      return false;
    }
    let value: string;
    if (this.headerName === 'content-type') {
      value = 'application/grpc';
    } else {
      const valueArray = metadata.get(this.headerName);
      if (valueArray.length === 0) {
        return false;
      } else {
        value = valueArray.join(',');
      }
    }
    return this.valueMatcher.apply(value);
  }

  apply(methodName: string, metadata: Metadata) {
    const result = this.applyHelper(methodName, metadata);
    if (this.invertMatch) {
      return !result;
    } else {
      return result;
    }
  }

  toString() {
    return 'HeaderMatch(' + this.headerName + ', ' + this.valueMatcher.toString() + ')';
  }
}

export class PathPrefixValueMatcher {
  constructor(private prefix: string, private caseInsensitive: boolean) {}

  apply(value: string) {
    if (this.caseInsensitive) {
      return value.toLowerCase().startsWith(this.prefix.toLowerCase());
    } else {
      return value.startsWith(this.prefix);
    }
  }

  toString() {
    return 'Prefix(' + this.prefix + ', ' + this.caseInsensitive + ')';
  }
}

export class PathExactValueMatcher {
  constructor(private targetValue: string, private caseInsensitive: boolean) {}

  apply(value: string) {
    if (this.caseInsensitive) {
      return value.toLowerCase().startsWith(this.targetValue.toLowerCase());
    } else {
      return value === this.targetValue;
    }
  }

  toString() {
    return 'Exact(' + this.targetValue + ', ' + this.caseInsensitive + ')';
  }
}

export class PathSafeRegexValueMatcher {
  private targetRegexImpl: RE2;
  constructor(targetRegex: string) {
    this.targetRegexImpl = new RE2(`^${targetRegex}$`, 'u');
  }

  apply(value: string) {
    return this.targetRegexImpl.test(value);
  }

  toString() {
    return 'SafeRegex(' + this.targetRegexImpl.toString() + ')';
  }
}

export class FullMatcher implements Matcher {
  constructor(private pathMatcher: ValueMatcher, private headerMatchers: Matcher[], private fraction: Fraction | null) {}

  apply(methodName: string, metadata: Metadata) {
    if (!this.pathMatcher.apply(methodName)) {
      return false;
    }
    if (!this.headerMatchers.every(matcher => matcher.apply(methodName, metadata))) {
      return false;
    }
    if (this.fraction === null) {
      return true;
    } else {
      const randomNumber = Math.random() * this.fraction.denominator;
      return randomNumber < this.fraction.numerator;
    }
  }

  toString() {
    return `path: ${this.pathMatcher}
    headers: ${this.headerMatchers.map(matcher => matcher.toString()).join('\n\t')}
    fraction: ${this.fraction ? fractionToString(this.fraction): 'none'}`;
  }
}
