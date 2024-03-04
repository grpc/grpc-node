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

// Types and function from https://stackoverflow.com/a/72059390/159388, with modifications
type ElementType<A> = A extends ReadonlyArray<infer T> ? T | undefined : never;

type ElementsOfAll<Inputs, R extends ReadonlyArray<unknown> = []> = Inputs extends readonly [infer F, ...infer M] ? ElementsOfAll<M, [...R, ElementType<F>]> : R;

type CartesianProduct<Inputs> = ElementsOfAll<Inputs>[];

/**
 * Get the cross product or Cartesian product of a list of groups. The
 * implementation is copied, with some modifications, from
 * https://stackoverflow.com/a/72059390/159388.
 * @param sets A list of groups of elements
 * @returns A list of all possible combinations of one element from each group
 * in sets. Empty groups will result in undefined in that slot in each
 * combination.
 */
export function crossProduct<Sets extends ReadonlyArray<ReadonlyArray<unknown>>>(sets: Sets): CartesianProduct<Sets> {
  /* The input is an array of arrays, and the expected output is an array of
   * each possible combination of one element each of the input arrays, with
   * the exception that if one of the input arrays is empty, each combination
   * gets [undefined] in that slot.
   *
   * At each step in the reduce call, we start with the cross product of the
   * first N groups, and the next group. For each combation, for each element
   * of the next group, extend the combination with that element.
   *
   * The type assertion at the end is needed because TypeScript doesn't track
   * the types well enough through the reduce calls to see that the result has
   * the expected type.
   */
  return sets.map(x => x.length === 0 ? [undefined] : x).reduce((combinations: unknown[][], nextGroup) => combinations.flatMap(combination => nextGroup.map(element => [...combination, element])), [[]] as unknown[][]) as CartesianProduct<Sets>;
}
