/*
 * Copyright 2019 gRPC authors.
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
import { rpcFileDescriptorSet } from '../test_protos/rpc.desc';
import { readFileSync } from 'fs';

import * as proto_loader from '../src/index';

// Relative path from build output directory to test_protos directory
const TEST_PROTO_DIR = `${__dirname}/../../test_protos/`;

type TypeDefinition =
  | proto_loader.EnumTypeDefinition
  | proto_loader.MessageTypeDefinition;

function isTypeObject(obj: proto_loader.AnyDefinition): obj is TypeDefinition {
  return 'format' in obj;
}

describe('Descriptor types', () => {
  it('Should be output for each enum', done => {
    proto_loader.load(`${TEST_PROTO_DIR}/enums.proto`).then(
      packageDefinition => {
        assert('Enum1' in packageDefinition);
        assert(isTypeObject(packageDefinition.Enum1));
        // Need additional check because compiler doesn't understand
        // asserts
        if (isTypeObject(packageDefinition.Enum1)) {
          const enum1Def: TypeDefinition = packageDefinition.Enum1;
          assert.strictEqual(
            enum1Def.format,
            'Protocol Buffer 3 EnumDescriptorProto'
          );
        }

        assert('Enum2' in packageDefinition);
        assert(isTypeObject(packageDefinition.Enum2));
        // Need additional check because compiler doesn't understand
        // asserts
        if (isTypeObject(packageDefinition.Enum2)) {
          const enum2Def: TypeDefinition = packageDefinition.Enum2;
          assert.strictEqual(
            enum2Def.format,
            'Protocol Buffer 3 EnumDescriptorProto'
          );
        }
        done();
      },
      error => {
        done(error);
      }
    );
  });
  it('Should be output for each message', done => {
    proto_loader.load(`${TEST_PROTO_DIR}/messages.proto`).then(
      packageDefinition => {
        assert('LongValues' in packageDefinition);
        assert(isTypeObject(packageDefinition.LongValues));
        if (isTypeObject(packageDefinition.LongValues)) {
          const longValuesDef: TypeDefinition = packageDefinition.LongValues;
          assert.strictEqual(
            longValuesDef.format,
            'Protocol Buffer 3 DescriptorProto'
          );
        }

        assert('SequenceValues' in packageDefinition);
        assert(isTypeObject(packageDefinition.SequenceValues));
        if (isTypeObject(packageDefinition.SequenceValues)) {
          const sequenceValuesDef: TypeDefinition =
            packageDefinition.SequenceValues;
          assert.strictEqual(
            sequenceValuesDef.format,
            'Protocol Buffer 3 DescriptorProto'
          );
        }
        done();
      },
      error => {
        done(error);
      }
    );
  });

  it('Can use well known Google protos', () => {
    // This will throw if the well known protos are not available.
    proto_loader.loadSync(`${TEST_PROTO_DIR}/well_known.proto`);
  });

  it('Can load JSON descriptors', () => {
    // This is protobuf.js JSON descriptor
    // https://github.com/protobufjs/protobuf.js#using-json-descriptors
    const buffer = readFileSync(`${TEST_PROTO_DIR}/rpc.proto.json`);
    const json = JSON.parse(buffer.toString());
    // This will throw if the rpc descriptor JSON cannot be decoded
    proto_loader.fromJSON(json);
  });

  it('Can load binary-encoded proto file descriptor sets', () => {
    const buffer = readFileSync(`${TEST_PROTO_DIR}/rpc.desc.bin`);
    // This will throw if the rpc descriptor cannot be decoded
    proto_loader.loadFileDescriptorSetFromBuffer(buffer);
  });

  it('Can load json file descriptor sets', () => {
    const buffer = readFileSync(`${TEST_PROTO_DIR}/rpc.desc.json`);
    const json = JSON.parse(buffer.toString());
    // This will throw if the rpc descriptor JSON cannot be decoded
    proto_loader.loadFileDescriptorSetFromObject(json);
  });

  it('Can parse plain file descriptor set objects', () => {
    // This will throw if the file descriptor object cannot be parsed
    proto_loader.loadFileDescriptorSetFromObject(rpcFileDescriptorSet);
  });
});
