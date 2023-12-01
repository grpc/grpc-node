import {
  IDescriptorProto,
  IEnumDescriptorProto,
  IEnumValueDescriptorProto,
  IFieldDescriptorProto,
  IFileDescriptorProto,
  IMethodDescriptorProto,
  IOneofDescriptorProto,
  IServiceDescriptorProto,
} from 'protobufjs/ext/descriptor';

/** A set of functions for operating on protobuf objects as we visit them in a traversal */
interface Visitor {
  field?: (fqn: string, file: IFileDescriptorProto, field: IFieldDescriptorProto) => void;
  extension?: (fqn: string, file: IFileDescriptorProto, extension: IFieldDescriptorProto) => void;
  oneOf?: (fqn: string, file: IFileDescriptorProto, decl: IOneofDescriptorProto) => void;
  message?: (fqn: string, file: IFileDescriptorProto, msg: IDescriptorProto) => void;
  enum?: (fqn: string, file: IFileDescriptorProto, msg: IEnumDescriptorProto) => void;
  enumValue?: (fqn: string, file: IFileDescriptorProto, msg: IEnumValueDescriptorProto) => void;
  service?: (fqn: string, file: IFileDescriptorProto, msg: IServiceDescriptorProto) => void;
  method?: (fqn: string, file: IFileDescriptorProto, method: IMethodDescriptorProto) => void;
}

/** Visit each node in a protobuf file and perform an operation on it
 *
 * This is useful because protocol buffers has nested objects so if we need to
 * traverse them multiple times then we don't want to duplicate that traversal
 * logic
 *
 * @see Visitor for the interface to interact with the nodes
 */
export const visit = (file: IFileDescriptorProto, visitor: Visitor): void => {
  const processField = (prefix: string, file: IFileDescriptorProto, field: IFieldDescriptorProto) => {
    const fqn = `${prefix}.${field.name}`;
    if (visitor.field) {
      visitor.field(fqn, file, field);
    }
  };

  const processExtension = (
    prefix: string,
    file: IFileDescriptorProto,
    ext: IFieldDescriptorProto,
  ) => {
    const fqn = `${prefix}.${ext.name}`;
    if (visitor.extension) {
      visitor.extension(fqn, file, ext);
    }
  };

  const processOneOf = (prefix: string, file: IFileDescriptorProto, decl: IOneofDescriptorProto) => {
    const fqn = `${prefix}.${decl.name}`;
    if (visitor.oneOf) {
      visitor.oneOf(fqn, file, decl);
    }
  };

  const processEnum = (prefix: string, file: IFileDescriptorProto, decl: IEnumDescriptorProto) => {
    const fqn = `${prefix}.${decl.name}`;

    if (visitor.enum) {
      visitor.enum(fqn, file, decl);
    }

    decl.value?.forEach((value) => {
      const valueFqn = `${fqn}.${value.name}`;
      if (visitor.enumValue) {
        visitor.enumValue(valueFqn, file, value);
      }
    });
  };

  const processMessage = (prefix: string, file: IFileDescriptorProto, msg: IDescriptorProto) => {
    const fqn = `${prefix}.${msg.name}`;
    if (visitor.message) {
      visitor.message(fqn, file, msg);
    }

    msg.nestedType?.forEach((type) => processMessage(fqn, file, type));
    msg.enumType?.forEach((type) => processEnum(fqn, file, type));
    msg.field?.forEach((field) => processField(fqn, file, field));
    msg.oneofDecl?.forEach((decl) => processOneOf(fqn, file, decl));
    msg.extension?.forEach((ext) => processExtension(fqn, file, ext));
  };

  const processService = (
    prefix: string,
    file: IFileDescriptorProto,
    service: IServiceDescriptorProto,
  ) => {
    const fqn = `${prefix}.${service.name}`;
    if (visitor.service) {
      visitor.service(fqn, file, service);
    }

    service.method?.forEach((method) => {
      const methodFqn = `${fqn}.${method.name}`;
      if (visitor.method) {
        visitor.method(methodFqn, file, method);
      }
    });
  };

  const packageName = file.package || '';
  file.enumType?.forEach((type) => processEnum(packageName, file, type));
  file.messageType?.forEach((type) => processMessage(packageName, file, type));
  file.service?.forEach((service) => processService(packageName, file, service));
  file.extension?.forEach((ext) => processExtension(packageName, file, ext));
};
