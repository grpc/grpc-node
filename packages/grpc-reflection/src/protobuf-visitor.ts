import {
  DescriptorProto,
  EnumDescriptorProto,
  EnumValueDescriptorProto,
  FieldDescriptorProto,
  FileDescriptorProto,
  MethodDescriptorProto,
  OneofDescriptorProto,
  ServiceDescriptorProto,
} from 'google-protobuf/google/protobuf/descriptor_pb';

/** A set of functions for operating on protobuf objects as we visit them in a traversal */
interface Visitor {
  field?: (fqn: string, file: FileDescriptorProto, field: FieldDescriptorProto) => void;
  extension?: (fqn: string, file: FileDescriptorProto, extension: FieldDescriptorProto) => void;
  oneOf?: (fqn: string, file: FileDescriptorProto, decl: OneofDescriptorProto) => void;
  message?: (fqn: string, file: FileDescriptorProto, msg: DescriptorProto) => void;
  enum?: (fqn: string, file: FileDescriptorProto, msg: EnumDescriptorProto) => void;
  enumValue?: (fqn: string, file: FileDescriptorProto, msg: EnumValueDescriptorProto) => void;
  service?: (fqn: string, file: FileDescriptorProto, msg: ServiceDescriptorProto) => void;
  method?: (fqn: string, file: FileDescriptorProto, method: MethodDescriptorProto) => void;
}

/** Visit each node in a protobuf file and perform an operation on it
 *
 * This is useful because protocol buffers has nested objects so if we need to
 * traverse them multiple times then we don't want to duplicate that traversal
 * logic
 *
 * @see Visitor for the interface to interact with the nodes
 */
export const visit = (file: FileDescriptorProto, visitor: Visitor): void => {
  const processField = (prefix: string, file: FileDescriptorProto, field: FieldDescriptorProto) => {
    const fqn = `${prefix}.${field.getName()}`;
    if (visitor.field) {
      visitor.field(fqn, file, field);
    }
  };

  const processExtension = (
    prefix: string,
    file: FileDescriptorProto,
    ext: FieldDescriptorProto,
  ) => {
    const fqn = `${prefix}.${ext.getName()}`;
    if (visitor.extension) {
      visitor.extension(fqn, file, ext);
    }
  };

  const processOneOf = (prefix: string, file: FileDescriptorProto, decl: OneofDescriptorProto) => {
    const fqn = `${prefix}.${decl.getName()}`;
    if (visitor.oneOf) {
      visitor.oneOf(fqn, file, decl);
    }
  };

  const processEnum = (prefix: string, file: FileDescriptorProto, decl: EnumDescriptorProto) => {
    const fqn = `${prefix}.${decl.getName()}`;

    if (visitor.enum) {
      visitor.enum(fqn, file, decl);
    }

    decl.getValueList().forEach((value) => {
      const valueFqn = `${fqn}.${value.getName()}`;
      if (visitor.enumValue) {
        visitor.enumValue(valueFqn, file, value);
      }
    });
  };

  const processMessage = (prefix: string, file: FileDescriptorProto, msg: DescriptorProto) => {
    const fqn = `${prefix}.${msg.getName()}`;
    if (visitor.message) {
      visitor.message(fqn, file, msg);
    }

    msg.getNestedTypeList().forEach((type) => processMessage(fqn, file, type));
    msg.getEnumTypeList().forEach((type) => processEnum(fqn, file, type));
    msg.getFieldList().forEach((field) => processField(fqn, file, field));
    msg.getOneofDeclList().forEach((decl) => processOneOf(fqn, file, decl));
    msg.getExtensionList().forEach((ext) => processExtension(fqn, file, ext));
  };

  const processService = (
    prefix: string,
    file: FileDescriptorProto,
    service: ServiceDescriptorProto,
  ) => {
    const fqn = `${prefix}.${service.getName()}`;
    if (visitor.service) {
      visitor.service(fqn, file, service);
    }

    service.getMethodList().forEach((method) => {
      const methodFqn = `${fqn}.${method.getName()}`;
      if (visitor.method) {
        visitor.method(methodFqn, file, method);
      }
    });
  };

  const packageName = file.getPackage();
  file.getEnumTypeList().forEach((type) => processEnum(packageName, file, type));
  file.getMessageTypeList().forEach((type) => processMessage(packageName, file, type));
  file.getServiceList().forEach((service) => processService(packageName, file, service));

  file.getExtensionList().forEach((ext) => processExtension(packageName, file, ext));
};
