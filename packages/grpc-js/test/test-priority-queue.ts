/*
 * Copyright 2025 gRPC authors.
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

import * as assert from 'assert';
import { PriorityQueue } from '../src/priority-queue';

describe('PriorityQueue', () => {
  describe('size', () => {
    it('Should be 0 initially', () => {
      const queue = new PriorityQueue();
      assert.strictEqual(queue.size(), 0);
    });
    it('Should be 1 after pushing one item', () => {
      const queue = new PriorityQueue();
      queue.push(1);
      assert.strictEqual(queue.size(), 1);
    });
    it('Should be 0 after pushing and popping one item', () => {
      const queue = new PriorityQueue();
      queue.push(1);
      queue.pop();
      assert.strictEqual(queue.size(), 0);
    });
  });
  describe('isEmpty', () => {
    it('Should be true initially', () => {
      const queue = new PriorityQueue();
      assert.strictEqual(queue.isEmpty(), true);
    });
    it('Should be false after pushing one item', () => {
      const queue = new PriorityQueue();
      queue.push(1);
      assert.strictEqual(queue.isEmpty(), false);
    });
    it('Should be 0 after pushing and popping one item', () => {
      const queue = new PriorityQueue();
      queue.push(1);
      queue.pop();
      assert.strictEqual(queue.isEmpty(), true);
    });
  });
  describe('peek', () => {
    it('Should return undefined initially', () => {
      const queue = new PriorityQueue();
      assert.strictEqual(queue.peek(), undefined);
    });
    it('Should return the same value multiple times', () => {
      const queue = new PriorityQueue();
      queue.push(1);
      assert.strictEqual(queue.peek(), 1);
      assert.strictEqual(queue.peek(), 1);
    });
    it('Should return the maximum of multiple values', () => {
      const queue = new PriorityQueue();
      queue.push(1, 3, 8, 5, 6);
      assert.strictEqual(queue.peek(), 8);
    });
    it('Should return undefined after popping the last item', () => {
      const queue = new PriorityQueue();
      queue.push(1);
      queue.pop();
      assert.strictEqual(queue.peek(), undefined);
    });
  });
  describe('pop', () => {
    it('Should return undefined initially', () => {
      const queue = new PriorityQueue();
      assert.strictEqual(queue.pop(), undefined);
    });
    it('Should return a pushed item', () => {
      const queue = new PriorityQueue();
      queue.push(1);
      assert.strictEqual(queue.pop(), 1);
    });
    it('Should return pushed items in decreasing order', () => {
      const queue = new PriorityQueue();
      queue.push(1, 3, 8, 5, 6);
      assert.strictEqual(queue.pop(), 8);
      assert.strictEqual(queue.pop(), 6);
      assert.strictEqual(queue.pop(), 5);
      assert.strictEqual(queue.pop(), 3);
      assert.strictEqual(queue.pop(), 1);
    });
    it('Should return undefined after popping the last item', () => {
      const queue = new PriorityQueue();
      queue.push(1);
      queue.pop();
      assert.strictEqual(queue.pop(), undefined);
    });
  });
  describe('replace', () => {
    it('should return undefined initially', () => {
      const queue = new PriorityQueue();
      assert.strictEqual(queue.replace(1), undefined);
    });
    it('Should return a pushed item', () => {
      const queue = new PriorityQueue();
      queue.push(1);
      assert.strictEqual(queue.replace(2), 1);
    });
    it('Should replace the max value if providing the new max', () => {
      const queue = new PriorityQueue();
      queue.push(1, 3, 8, 5, 6);
      assert.strictEqual(queue.replace(10), 8);
      assert.strictEqual(queue.peek(), 10);
    });
    it('Should not replace the max value if providing a lower value', () => {
      const queue = new PriorityQueue();
      queue.push(1, 3, 8, 5, 6);
      assert.strictEqual(queue.replace(4), 8);
      assert.strictEqual(queue.peek(), 6);
    });
  });
  describe('push', () => {
    it('Should would the same with one call or multiple', () => {
      const queue1 = new PriorityQueue();
      queue1.push(1, 3, 8, 5, 6);
      assert.strictEqual(queue1.pop(), 8);
      assert.strictEqual(queue1.pop(), 6);
      assert.strictEqual(queue1.pop(), 5);
      assert.strictEqual(queue1.pop(), 3);
      assert.strictEqual(queue1.pop(), 1);
      const queue2 = new PriorityQueue();
      queue2.push(1);
      queue2.push(3);
      queue2.push(8);
      queue2.push(5);
      queue2.push(6);
      assert.strictEqual(queue2.pop(), 8);
      assert.strictEqual(queue2.pop(), 6);
      assert.strictEqual(queue2.pop(), 5);
      assert.strictEqual(queue2.pop(), 3);
      assert.strictEqual(queue2.pop(), 1);
    });
  });
  describe('custom comparator', () => {
    it('Should produce items in the reverse order with a reversed comparator', () => {
      const queue = new PriorityQueue((a, b) => a < b);
      queue.push(1, 3, 8, 5, 6);
      assert.strictEqual(queue.pop(), 1);
      assert.strictEqual(queue.pop(), 3);
      assert.strictEqual(queue.pop(), 5);
      assert.strictEqual(queue.pop(), 6);
      assert.strictEqual(queue.pop(), 8);
    });
    it('Should support other types', () => {
      const queue = new PriorityQueue<string>((a, b) => a.localeCompare(b) > 0);
      queue.push('a', 'c', 'b');
      assert.strictEqual(queue.pop(), 'c');
      assert.strictEqual(queue.pop(), 'b');
      assert.strictEqual(queue.pop(), 'a');
    });
  });
});
