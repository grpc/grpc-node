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

import { FractionalPercent__Output } from "./generated/envoy/type/v3/FractionalPercent";

export interface Fraction {
  numerator: number;
  denominator: number;
}

export function fractionToString(fraction: Fraction): string {
  return `${fraction.numerator}/${fraction.denominator}`;
}

const RUNTIME_FRACTION_DENOMINATOR_VALUES = {
  HUNDRED: 100,
  TEN_THOUSAND: 10_000,
  MILLION: 1_000_000
}

export function envoyFractionToFraction(envoyFraction: FractionalPercent__Output): Fraction {
  return {
    numerator: envoyFraction.numerator,
    denominator: RUNTIME_FRACTION_DENOMINATOR_VALUES[envoyFraction.denominator]
  };
}