import * as assert from 'assert';

import * as proto_loader from '../src/index';

// Relative path from build output directory to test_protos directory
const TEST_PROTO_DIR = `${__dirname}/../../test_protos/`;

type TypeDefinition = proto_loader.EnumTypeDefinition | proto_loader.MessageTypeDefinition;

function isTypeObject(obj: proto_loader.AnyDefinition): obj is TypeDefinition {
  return 'format' in obj;
}

describe('Descriptor types', () => {
  it('Should be output for each enum', (done) => {
    proto_loader.load(`${TEST_PROTO_DIR}/enums.proto`).then((packageDefinition) => {
      assert('Enum1' in packageDefinition);
      assert(isTypeObject(packageDefinition.Enum1));
      // Need additional check because compiler doesn't understand asserts
      if(isTypeObject(packageDefinition.Enum1)) {
        const enum1Def: TypeDefinition = packageDefinition.Enum1;
        assert.strictEqual(enum1Def.format, 'Protocol Buffer 3 EnumDescriptorProto');
      }

      assert('Enum2' in packageDefinition);
      assert(isTypeObject(packageDefinition.Enum2));
      // Need additional check because compiler doesn't understand asserts
      if(isTypeObject(packageDefinition.Enum2)) {
        const enum2Def: TypeDefinition = packageDefinition.Enum2;
        assert.strictEqual(enum2Def.format, 'Protocol Buffer 3 EnumDescriptorProto');
      }
      done();
    }, (error) => {done(error);});
  });
  it('Should be output for each message', (done) => {
    proto_loader.load(`${TEST_PROTO_DIR}/messages.proto`).then((packageDefinition) => {
      assert('LongValues' in packageDefinition);
      assert(isTypeObject(packageDefinition.LongValues));
      if(isTypeObject(packageDefinition.LongValues)) {
        const longValuesDef: TypeDefinition = packageDefinition.LongValues;
        assert.strictEqual(longValuesDef.format, 'Protocol Buffer 3 DescriptorProto');
      }

      assert('SequenceValues' in packageDefinition);
      assert(isTypeObject(packageDefinition.SequenceValues));
      if(isTypeObject(packageDefinition.SequenceValues)) {
        const sequenceValuesDef: TypeDefinition = packageDefinition.SequenceValues;
        assert.strictEqual(sequenceValuesDef.format, 'Protocol Buffer 3 DescriptorProto');
      }
      done();
    }, (error) => {done(error);});
  });
});