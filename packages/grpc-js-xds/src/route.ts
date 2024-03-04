 /*
 * Copyright 2024 gRPC authors.
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

import { RouteMatch__Output } from './generated/envoy/config/route/v3/RouteMatch';
import { HeaderMatcher__Output } from './generated/envoy/config/route/v3/HeaderMatcher';
import { ContainsValueMatcher, ExactValueMatcher, FullMatcher, HeaderMatcher, Matcher, PathExactValueMatcher, PathPrefixValueMatcher, PathSafeRegexValueMatcher, PrefixValueMatcher, PresentValueMatcher, RangeValueMatcher, RejectValueMatcher, SafeRegexValueMatcher, SuffixValueMatcher, ValueMatcher } from './matcher';
import { envoyFractionToFraction, Fraction } from "./fraction";

function getPredicateForHeaderMatcher(headerMatch: HeaderMatcher__Output): Matcher {
  let valueChecker: ValueMatcher;
  switch (headerMatch.header_match_specifier) {
    case 'exact_match':
      valueChecker = new ExactValueMatcher(headerMatch.exact_match!, false);
      break;
    case 'safe_regex_match':
      valueChecker = new SafeRegexValueMatcher(headerMatch.safe_regex_match!.regex);
      break;
    case 'range_match':
      const start = BigInt(headerMatch.range_match!.start);
      const end = BigInt(headerMatch.range_match!.end);
      valueChecker = new RangeValueMatcher(start, end);
      break;
    case 'present_match':
      valueChecker = new PresentValueMatcher();
      break;
    case 'prefix_match':
      valueChecker = new PrefixValueMatcher(headerMatch.prefix_match!, false);
      break;
    case 'suffix_match':
      valueChecker = new SuffixValueMatcher(headerMatch.suffix_match!, false);
      break;
    case 'string_match':
      const stringMatch = headerMatch.string_match!;
      switch (stringMatch.match_pattern) {
        case 'exact':
          valueChecker = new ExactValueMatcher(stringMatch.exact!, stringMatch.ignore_case);
          break;
        case 'safe_regex':
          valueChecker = new SafeRegexValueMatcher(stringMatch.safe_regex!.regex);
          break;
        case 'prefix':
          valueChecker = new PrefixValueMatcher(stringMatch.prefix!, stringMatch.ignore_case);
          break;
        case 'suffix':
          valueChecker = new SuffixValueMatcher(stringMatch.suffix!, stringMatch.ignore_case);
          break;
        case 'contains':
          valueChecker = new ContainsValueMatcher(stringMatch.contains!, stringMatch.ignore_case);
          break;
      }
      break;
    default:
      valueChecker = new RejectValueMatcher();
  }
  return new HeaderMatcher(headerMatch.name, valueChecker, headerMatch.invert_match);
}
export function getPredicateForMatcher(routeMatch: RouteMatch__Output): Matcher {
  let pathMatcher: ValueMatcher;
  const caseInsensitive = routeMatch.case_sensitive?.value === false;
  switch (routeMatch.path_specifier) {
    case 'prefix':
      pathMatcher = new PathPrefixValueMatcher(routeMatch.prefix!, caseInsensitive);
      break;
    case 'path':
      pathMatcher = new PathExactValueMatcher(routeMatch.path!, caseInsensitive);
      break;
    case 'safe_regex':
      pathMatcher = new PathSafeRegexValueMatcher(routeMatch.safe_regex!.regex);
      break;
    default:
      pathMatcher = new RejectValueMatcher();
  }
  const headerMatchers: Matcher[] = routeMatch.headers.map(getPredicateForHeaderMatcher);
  let runtimeFraction: Fraction | null;
  if (!routeMatch.runtime_fraction?.default_value) {
    runtimeFraction = null;
  } else {
    runtimeFraction = envoyFractionToFraction(routeMatch.runtime_fraction.default_value);
  }
  return new FullMatcher(pathMatcher, headerMatchers, runtimeFraction);
}
