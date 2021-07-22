
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

/// <reference types="bytebuffer" />

declare module "grpc" {
  // add imports here, inside the "grpc" module, to keep it as an ambient module
  import { EventEmitter } from "events";
  import { Duplex, Readable, Writable } from "stream";
  import { SecureContext } from "tls";

  /* The Message interface is copied and slightly modified from @types/protobuf
   * version 5.0.31, which was distributed under the following license:
   *
   * This project is licensed under the MIT license.
   * Copyrights are respective of each contributor listed at the beginning of each definition file.
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  export interface ProtobufMessage {
    $add(key: string, value: any, noAssert?: boolean): ProtobufMessage;
    $get<T>(key: string): T;
    $set(key: string | {[key: string]: any}, value?: any | boolean, noAssert?: boolean): void;
    add(key: string, value: any, noAssert?: boolean): ProtobufMessage;
    calculate(): number;
    encode(buffer?: ByteBuffer | boolean, noVerify?: boolean): ByteBuffer;
    encode64(): string;
    encodeAB(): ArrayBuffer;
    encodeNB(): Buffer;
    encodeHex(): string;
    encodeJSON(): string;
    encodeDelimited(buffer?: ByteBuffer | boolean, noVerify?: boolean): ByteBuffer;
    get<T>(key: string, noAssert?: boolean): T;
    set(key: string | {[key: string]: any}, value?: any | boolean, noAssert?: boolean): void;
    toArrayBuffer(): ArrayBuffer;
    toBase64(): string;
    toBuffer(): Buffer;
    toHex(): string;
    toRaw(binaryAsBase64?: boolean, longsAsStrings?: boolean): {[key: string]: any};
    toString(): string;
    [field: string]: any;
  }

  /**
   * Load a ProtoBuf.js object as a gRPC object.
   * @param value The ProtoBuf.js reflection object to load
   * @param options Options to apply to the loaded file
   * @return The resulting gRPC object.
   */
  export function loadObject<T = GrpcObject>(value: object, options?: LoadObjectOptions): T;

  /**
   * Options for loading proto object as gRPC object
   * @param {(number|string)=} [options.protobufjsVersion='detect'] 5 and 6
   *     respectively indicate that an object from the corresponding version of
   *     Protobuf.js is provided in the value argument. If the option is 'detect',
   *     gRPC will guess what the version is based on the structure of the value.
   */
  export interface LoadObjectOptions {
    /**
     * Deserialize bytes values as base64 strings instead of Buffers.
     * Defaults to `false`.
     */
    binaryAsBase64?: boolean;

    /**
     * Deserialize long values as strings instead of objects.
     * Defaults to `true`.
     */
    longsAsStrings?: boolean;

    /**
     * Deserialize enum values as strings instead of numbers. Only works with
     * Protobuf.js 6 values.
     * Defaults to `true`.
     */
    enumsAsStrings?: boolean;

    /**
     * use the beta method argument order for client methods, with optional
     * arguments after the callback. This option is only a temporary stopgap
     * measure to smooth an API breakage. It is deprecated, and new code
     * should not use it.
     * Defaults to `false`
     */
    deprecatedArgumentOrder?: boolean;

    /**
     * 5 and 6 respectively indicate that an object from the corresponding
     * version of Protobuf.js is provided in the value argument. If the option
     * is 'detect', gRPC wll guess what the version is based on the structure
     * of the value.
     */
    protobufjsVersion?: 5 | 6 | "detect";
  }

  /**
   * Map from `.proto` file.
   * - Namespaces become maps from the names of their direct members to those member objects
   * - Service definitions become client constructors for clients for that service. They also
   *   have a service member that can be used for constructing servers.
   * - Message definitions become Message constructors like those that ProtoBuf.js would create
   * - Enum definitions become Enum objects like those that ProtoBuf.js would create
   * - Anything else becomes the relevant reflection object that ProtoBuf.js would create
   */
  export interface GrpcObject {
    [name: string]: GrpcObject | typeof Client | ProtobufMessage;
  }

  /**
   * Load a gRPC object from a .proto file.
   * @param filename The file to load
   * @param format The file format to expect. Defaults to 'proto'
   * @param options Options to apply to the loaded file
   * @return The resulting gRPC object
   */
  export function load<T = GrpcObject>(filename: Filename, format?: "proto" | "json", options?: LoadOptions): T;

  /**
   * Load a gRPC package definition as a gRPC object hierarchy
   * @param packageDef The package definition object
   * @return The resulting gRPC object
   */
  export function loadPackageDefinition(packageDefinition: PackageDefinition): GrpcObject;

  /**
   * A filename
   */
  export type Filename = string | { root: string, file: string };

  /**
   * Options for loading proto file as gRPC object
   */
  export interface LoadOptions {
    /**
     * Load this file with field names in camel case instead of their original case.
     * Defaults to `false`.
     */
    convertFieldsToCamelCase?: boolean;

    /**
     * Deserialize bytes values as base64 strings instead of Buffers.
     * Defaults to `false`.
     */
    binaryAsBase64?: boolean;

    /**
     * Deserialize long values as strings instead of objects.
     * Defaults to `true`.
     */
    longsAsStrings?: boolean;

    /**
     * Use the beta method argument order for client methods, with optional
     * arguments after the callback. This option is only a temporary stopgap
     * measure to smooth an API breakage. It is deprecated, and new code
     * should not use it.
     * Defaults to `false`
     */
    deprecatedArgumentOrder?: boolean;
  }

  /**
   * Sets the logger function for the gRPC module. For debugging purposes, the C
   * core will log synchronously directly to stdout unless this function is
   * called. Note: the output format here is intended to be informational, and
   * is not guaranteed to stay the same in the future.
   * Logs will be directed to logger.error.
   * @param logger A Console-like object.
   */
  export function setLogger(logger: Console): void;

  /**
   * Sets the logger verbosity for gRPC module logging. The options are members
   * of the grpc.logVerbosity map.
   * @param verbosity The minimum severity to log
   */
  export function setLogVerbosity(verbosity: logVerbosity): void;

  /**
   * Server object that stores request handlers and delegates incoming requests to those handlers
   */
  export class Server {
    /**
     * Constructs a server object that stores request handlers and delegates
     * incoming requests to those handlers
     * @param options Options that should be passed to the internal server
     *     implementation
     * ```
     * var server = new grpc.Server();
     * server.addProtoService(protobuf_service_descriptor, service_implementation);
     * server.bind('address:port', server_credential);
     * server.start();
     * ```
     */
    constructor(options?: object);

    /**
     * Start the server and begin handling requests
     */
    start(): void;

    /**
     * Registers a handler to handle the named method. Fails if there already is
     * a handler for the given method. Returns true on success
     * @param name The name of the method that the provided function should
     *     handle/respond to.
     * @param handler Function that takes a stream of
     *     request values and returns a stream of response values
     * @param serialize Serialization function for responses
     * @param deserialize Deserialization function for requests
     * @param type The streaming type of method that this handles
     * @return True if the handler was set. False if a handler was already
     *     set for that name.
     */
    register<RequestType, ResponseType>(
      name: string,
      handler: handleCall<RequestType, ResponseType>,
      serialize: serialize<ResponseType>,
      deserialize: deserialize<RequestType>,
      type: string
    ): boolean;

    /**
     * Gracefully shuts down the server. The server will stop receiving new calls,
     * and any pending calls will complete. The callback will be called when all
     * pending calls have completed and the server is fully shut down. This method
     * is idempotent with itself and forceShutdown.
     * @param {function()} callback The shutdown complete callback
     */
    tryShutdown(callback: () => void): void;

    /**
     * Forcibly shuts down the server. The server will stop receiving new calls
     * and cancel all pending calls. When it returns, the server has shut down.
     * This method is idempotent with itself and tryShutdown, and it will trigger
     * any outstanding tryShutdown callbacks.
     */
    forceShutdown(): void;

    /**
     * Add a service to the server, with a corresponding implementation.
     * @param service The service descriptor
     * @param implementation Map of method names to method implementation
     * for the provided service.
     */
    addService<ImplementationType = UntypedServiceImplementation>(
      service: ServiceDefinition<ImplementationType>,
      implementation: ImplementationType
    ): void;

    /**
     * Add a proto service to the server, with a corresponding implementation
     * @deprecated Use `Server#addService` instead
     * @param service The proto service descriptor
     * @param implementation Map of method names to method implementation
     * for the provided service.
     */
    addProtoService<ImplementationType = UntypedServiceImplementation>(
      service: ServiceDefinition<ImplementationType>,
      implementation: ImplementationType
    ): void;

    /**
     * Binds the server to the given port, with SSL disabled if creds is an
     * insecure credentials object
     * @param port The port that the server should bind on, in the format
     * "address:port"
     * @param creds Server credential object to be used for SSL. Pass an
     * insecure credentials object for an insecure port.
     * @return The bound port number or 0 if the operation failed.
     */
    bind(port: string, creds: ServerCredentials): number;

    /**
     * Binds the server to the given port, with SSL disabled if creds is an
     * insecure credentials object. Provides the result asynchronously.
     * @param port The port that the server should bind on, in the format "address:port"
     * @param creds Server credential object to be used for
     *     SSL. Pass an insecure credentials object for an insecure port.
     * @param callback Called with the result of attempting to bind a port
     *  	- error: If non-null, indicates that binding the port failed.
     *  	- port: The bound port number. If binding the port fails, this will be negative to match the output of bind.
     */
    bindAsync(port: string, creds: ServerCredentials, callback: (error: Error | null, port: number) => void): void;
  }

  /**
   * A type that servers as a default for an untyped service.
   */
  export type UntypedServiceImplementation = { [name: string]: handleCall<any, any> };

  /**
   * An object that completely defines a service.
   */
  export type ServiceDefinition<ImplementationType = UntypedServiceImplementation> = {
    readonly [I in keyof ImplementationType]: MethodDefinition<any, any>;
  }

  /**
   * An object that defines a protobuf type
   */
  export interface ProtobufTypeDefinition {
    format: string;
    type: object;
    fileDescriptorProtos: Buffer[];
  }

  /**
   * An object that defines a package containing multiple services
   */
  export type PackageDefinition = {
    readonly [fullyQualifiedName: string]: ServiceDefinition<any> | ProtobufTypeDefinition;
  }

  /**
   * An object that completely defines a service method signature.
   */
  export interface MethodDefinition<RequestType, ResponseType> {
    /**
     * The method's URL path
     */
    path: string;
    /**
     * Indicates whether the method accepts a stream of requests
     */
    requestStream: boolean;
    /**
     *  Indicates whether the method returns a stream of responses
     */
    responseStream: boolean;
    /**
    * Serialization function for request values
    */
    requestSerialize: serialize<RequestType>;
    /**
     * Serialization function for response values
     */
    responseSerialize: serialize<ResponseType>;
    /**
     * Deserialization function for request data
     */
    requestDeserialize: deserialize<RequestType>;
    /**
     * Deserialization function for repsonse data
     */
    responseDeserialize: deserialize<ResponseType>;
  }

  type handleCall<RequestType, ResponseType> =
    handleUnaryCall<RequestType, ResponseType> |
    handleClientStreamingCall<RequestType, ResponseType> |
    handleServerStreamingCall<RequestType, ResponseType> |
    handleBidiStreamingCall<RequestType, ResponseType>;

  /**
   * User-provided method to handle unary requests on a server
   */
  type handleUnaryCall<RequestType, ResponseType> =
    (call: ServerUnaryCall<RequestType>, callback: sendUnaryData<ResponseType>) => void;

  /**
   * An EventEmitter. Used for unary calls.
   */
  export class ServerUnaryCall<RequestType> extends EventEmitter {
    /**
     * Indicates if the call has been cancelled
     */
    cancelled: boolean;

    /**
     * The request metadata from the client
     */
    metadata: Metadata;

    /**
     * The request message from the client
     */
    request: RequestType;

    private constructor();

    /**
     * Get the endpoint this call/stream is connected to.
     * @return The URI of the endpoint
     */
    getPeer(): string;

    /**
     * Send the initial metadata for a writable stream.
     * @param responseMetadata Metadata to send
     */
    sendMetadata(responseMetadata: Metadata): void;
  }

  /**
   * User provided method to handle client streaming methods on the server.
   */
  type handleClientStreamingCall<RequestType, ResponseType> =
    (call: ServerReadableStream<RequestType>, callback: sendUnaryData<ResponseType>) => void;

  /**
   * A stream that the server can read from. Used for calls that are streaming
   * from the client side.
   */
  export class ServerReadableStream<RequestType> extends Readable {
    /**
     * Indicates if the call has been cancelled
     */
    cancelled: boolean;

    /**
     * The request metadata from the client
     */
    metadata: Metadata;

    private constructor();

    /**
     * Get the endpoint this call/stream is connected to.
     * @return The URI of the endpoint
     */
    getPeer(): string;

    /**
     * Send the initial metadata for a writable stream.
     * @param responseMetadata Metadata to send
     */
    sendMetadata(responseMetadata: Metadata): void;
  }

  /**
   * User provided method to handle server streaming methods on the server.
   */
  type handleServerStreamingCall<RequestType, ResponseType> =
    (call: ServerWritableStream<RequestType, ResponseType>) => void;

  /**
   * A stream that the server can write to. Used for calls that are streaming
   * from the server side.
   */
  export class ServerWritableStream<RequestType, ResponseType=unknown> extends Writable {
    /**
     * Indicates if the call has been cancelled
     */
    cancelled: boolean;

    /**
     * The request metadata from the client
     */
    metadata: Metadata;

    /**
     * The request message from the client
     */
    request: RequestType;

    private constructor();

    /**
     * Get the endpoint this call/stream is connected to.
     * @return The URI of the endpoint
     */
    getPeer(): string;

    /**
     * Send the initial metadata for a writable stream.
     * @param responseMetadata Metadata to send
     */
    sendMetadata(responseMetadata: Metadata): void;
  }

  /* This typo existed in previous versions of this file, so we provide this
   * type alias for backwards compatibility. */
  export type ServerWriteableStream<RequestType, ResponseType=unknown> = ServerWritableStream<RequestType, ResponseType>;

  /**
   * User provided method to handle bidirectional streaming calls on the server.
   */
  type handleBidiStreamingCall<RequestType, ResponseType> =
    (call: ServerDuplexStream<RequestType, ResponseType>) => void;

  /**
   * A stream that the server can read from or write to. Used for calls
   * with duplex streaming.
   */
  export class ServerDuplexStream<RequestType, ResponseType> extends Duplex {
    /**
     * Indicates if the call has been cancelled
     */
    cancelled: boolean;

    /**
     * The request metadata from the client
     */
    metadata: Metadata;

    private constructor();

    /**
     * Get the endpoint this call/stream is connected to.
     * @return The URI of the endpoint
     */
    getPeer(): string;

    /**
     * Send the initial metadata for a writable stream.
     * @param responseMetadata Metadata to send
     */
    sendMetadata(responseMetadata: Metadata): void;
  }

  /**
   * A deserialization function
   * @param data The byte sequence to deserialize
   * @return The data deserialized as a value
   */
  type deserialize<T> = (data: Buffer) => T;

  /**
   * A serialization function
   * @param value The value to serialize
   * @return The value serialized as a byte sequence
   */
  type serialize<T> = (value: T) => Buffer;

  /**
   * Callback function passed to server handlers that handle methods with
   * unary responses.
   */
  type sendUnaryData<ResponseType> =
    (error: ServiceError | null, value: ResponseType | null, trailer?: Metadata, flags?: number) => void;

  interface MetadataOptions {
    /* Signal that the request is idempotent. Defaults to false */
    idempotentRequest?: boolean;
    /* Signal that the call should not return UNAVAILABLE before it has
     * started. Defaults to true. */
    waitForReady?: boolean;
    /* Signal that the call is cacheable. GRPC is free to use GET verb.
     * Defaults to false */
    cacheableRequest?: boolean;
    /* Signal that the initial metadata should be corked. Defaults to false. */
    corked?: boolean;
  }

  /**
   * A class for storing metadata. Keys are normalized to lowercase ASCII.
   */
  export class Metadata {
    /**
     * @param options Boolean options for the beginning of the call.
     *   These options only have any effect when passed at the beginning of
     *   a client request.
     */
    constructor(options?: MetadataOptions);
    /**
     * Sets the given value for the given key by replacing any other values
     * associated with that key. Normalizes the key.
     * @param key The key to whose value should be set.
     * @param value The value to set. Must be a buffer if and only
     *   if the normalized key ends with '-bin'.
     */
    set(key: string, value: MetadataValue): void;

    /**
     * Adds the given value for the given key by appending to a list of previous
     * values associated with that key. Normalizes the key.
     * @param key The key for which a new value should be appended.
     * @param value The value to add. Must be a buffer if and only
     *   if the normalized key ends with '-bin'.
     */
    add(key: string, value: MetadataValue): void;

    /**
     * Removes the given key and any associated values. Normalizes the key.
     * @param key The key whose values should be removed.
     */
    remove(key: string): void;

    /**
     * Gets a list of all values associated with the key. Normalizes the key.
     * @param key The key whose value should be retrieved.
     * @return A list of values associated with the given key.
     */
    get(key: string): MetadataValue[];

    /**
     * Gets a plain object mapping each key to the first value associated with it.
     * This reflects the most common way that people will want to see metadata.
     * @return A key/value mapping of the metadata.
     */
    getMap(): { [key: string]: MetadataValue };

    /**
     * Clones the metadata object.
     * @return The newly cloned object.
     */
    clone(): Metadata;

    /**
     * Set options on the metadata object
     * @param options Boolean options for the beginning of the call.
     *   These options only have any effect when passed at the beginning of
     *   a client request.
     */
    setOptions(options: MetadataOptions): void;
  }

  export type MetadataValue = string | Buffer;

  /**
   * Represents the status of a completed request. If `code` is
   * `grpc.status.OK`, then the request has completed successfully.
   * Otherwise, the request has failed, `details` will contain a description of
   * the error. Either way, `metadata` contains the trailing response metadata
   * sent by the server when it finishes processing the call.
   */
  export interface StatusObject {
    /**
     * The error code, a key of `grpc.status`
     */
    code: status;
    /**
     * Human-readable description of the status
     */
    details: string;
    /**
     * Trailing metadata sent with the status, if applicable
     */
    metadata: Metadata;
  }

  /**
   * Describes how a request has failed. The member `message` will be the same as
   * `details` in `StatusObject`, and `code` and `metadata` are the
   * same as in that object.
   */
  export interface ServiceError extends Error {
    /**
     * The error code, a key of {@link grpc.status} that is not `grpc.status.OK`
     */
    code?: status;
    /**
     * Trailing metadata sent with the status, if applicable
     */
    metadata?: Metadata;
    /**
     * Original status details string
     */
    details?: string;
  }

  /**
   * ServerCredentials factories
   */
  export class ServerCredentials {
    /**
     * Create insecure server credentials
     * @return The ServerCredentials
     */
    static createInsecure(): ServerCredentials;
    /**
     * Create SSL server credentials
     * @param rootCerts Root CA certificates for validating client certificates
     * @param keyCertPairs A list of private key and certificate chain pairs to
     * be used for authenticating the server
     * @param checkClientCertificate Indicates that the server should request
     * and verify the client's certificates.
     * Defaults to `false`.
     * @return The ServerCredentials
     */
    static createSsl(rootCerts: Buffer | null, keyCertPairs: KeyCertPair[], checkClientCertificate?: boolean): ServerCredentials;
  }

  /**
   * A private key and certificate pair
   */
  export interface KeyCertPair {
    /**
     * The server's private key
     */
    private_key: Buffer;

    /**
     * The server's certificate chain
     */
    cert_chain: Buffer;
  }

  /**
   * Enum of status codes that gRPC can return
   */
  export enum status {
    /**
     * Not an error; returned on success
     */
    OK = 0,
    /**
     * The operation was cancelled (typically by the caller).
     */
    CANCELLED = 1,
    /**
     * Unknown error.  An example of where this error may be returned is
     * if a status value received from another address space belongs to
     * an error-space that is not known in this address space.  Also
     * errors raised by APIs that do not return enough error information
     * may be converted to this error.
     */
    UNKNOWN = 2,
    /**
     * Client specified an invalid argument.  Note that this differs
     * from FAILED_PRECONDITION.  INVALID_ARGUMENT indicates arguments
     * that are problematic regardless of the state of the system
     * (e.g., a malformed file name).
     */
    INVALID_ARGUMENT = 3,
    /**
     * Deadline expired before operation could complete.  For operations
     * that change the state of the system, this error may be returned
     * even if the operation has completed successfully.  For example, a
     * successful response from a server could have been delayed long
     * enough for the deadline to expire.
     */
    DEADLINE_EXCEEDED = 4,
    /**
     * Some requested entity (e.g., file or directory) was not found.
     */
    NOT_FOUND = 5,
    /**
     * Some entity that we attempted to create (e.g., file or directory)
     * already exists.
     */
    ALREADY_EXISTS = 6,
    /**
     * The caller does not have permission to execute the specified
     * operation.  PERMISSION_DENIED must not be used for rejections
     * caused by exhausting some resource (use RESOURCE_EXHAUSTED
     * instead for those errors).  PERMISSION_DENIED must not be
     * used if the caller can not be identified (use UNAUTHENTICATED
     * instead for those errors).
     */
    PERMISSION_DENIED = 7,
    /**
     * Some resource has been exhausted, perhaps a per-user quota, or
     * perhaps the entire file system is out of space.
     */
    RESOURCE_EXHAUSTED = 8,
    /**
     * Operation was rejected because the system is not in a state
     * required for the operation's execution.  For example, directory
     * to be deleted may be non-empty, an rmdir operation is applied to
     * a non-directory, etc.
     *
     * A litmus test that may help a service implementor in deciding
     * between FAILED_PRECONDITION, ABORTED, and UNAVAILABLE:
     *
     *  - Use UNAVAILABLE if the client can retry just the failing call.
     *  - Use ABORTED if the client should retry at a higher-level
     *    (e.g., restarting a read-modify-write sequence).
     *  - Use FAILED_PRECONDITION if the client should not retry until
     *    the system state has been explicitly fixed.  E.g., if an "rmdir"
     *    fails because the directory is non-empty, FAILED_PRECONDITION
     *    should be returned since the client should not retry unless
     *    they have first fixed up the directory by deleting files from it.
     *  - Use FAILED_PRECONDITION if the client performs conditional
     *    REST Get/Update/Delete on a resource and the resource on the
     *    server does not match the condition. E.g., conflicting
     *    read-modify-write on the same resource.
     */
    FAILED_PRECONDITION = 9,
    /**
     * The operation was aborted, typically due to a concurrency issue
     * like sequencer check failures, transaction aborts, etc.
     *
     * See litmus test above for deciding between FAILED_PRECONDITION,
     * ABORTED, and UNAVAILABLE.
     */
    ABORTED = 10,
    /**
     * Operation was attempted past the valid range.  E.g., seeking or
     * reading past end of file.
     *
     * Unlike INVALID_ARGUMENT, this error indicates a problem that may
     * be fixed if the system state changes. For example, a 32-bit file
     * system will generate INVALID_ARGUMENT if asked to read at an
     * offset that is not in the range [0,2^32-1], but it will generate
     * OUT_OF_RANGE if asked to read from an offset past the current
     * file size.
     *
     * There is a fair bit of overlap between FAILED_PRECONDITION and
     * OUT_OF_RANGE.  We recommend using OUT_OF_RANGE (the more specific
     * error) when it applies so that callers who are iterating through
     * a space can easily look for an OUT_OF_RANGE error to detect when
     * they are done.
     */
    OUT_OF_RANGE = 11,
    /**
     * Operation is not implemented or not supported/enabled in this service.
     */
    UNIMPLEMENTED = 12,
    /**
     * Internal errors.  Means some invariants expected by underlying
     * system has been broken.  If you see one of these errors,
     * something is very broken.
     */
    INTERNAL = 13,
    /**
     * The service is currently unavailable.  This is a most likely a
     * transient condition and may be corrected by retrying with
     * a backoff.
     *
     * See litmus test above for deciding between FAILED_PRECONDITION,
     * ABORTED, and UNAVAILABLE.
     */
    UNAVAILABLE = 14,
    /**
     * Unrecoverable data loss or corruption.
     */
    DATA_LOSS = 15,
    /**
     * The request does not have valid authentication credentials for the
     * operation.
     */
    UNAUTHENTICATED = 16,
  }

  /**
   * Propagation flags: these can be bitwise or-ed to form the propagation option
   * for calls.
   *
   * Users are encouraged to write propagation masks as deltas from the default.
   * i.e. write `grpc.propagate.DEFAULTS & ~grpc.propagate.DEADLINE` to disable
   * deadline propagation.
   */
  export enum propagate {
    DEADLINE,
    CENSUS_STATS_CONTEXT,
    CENSUS_TRACING_CONTEXT,
    CANCELLATION,
    DEFAULTS,
  }

  /**
   * Call error constants. Call errors almost always indicate bugs in the gRPC
   * library, and these error codes are mainly useful for finding those bugs.
   */
  export enum callError  {
    OK,
    ERROR,
    NOT_ON_SERVER,
    NOT_ON_CLIENT,
    ALREADY_INVOKED,
    NOT_INVOKED,
    ALREADY_FINISHED,
    TOO_MANY_OPERATIONS,
    INVALID_FLAGS,
    INVALID_METADATA,
    INVALID_MESSAGE,
    NOT_SERVER_COMPLETION_QUEUE,
    BATCH_TOO_BIG,
    PAYLOAD_TYPE_MISMATCH,
  }

  /**
   * Write flags: these can be bitwise or-ed to form write options that modify
   * how data is written.
   */
  export enum writeFlags {
    /**
     * Hint that the write may be buffered and need not go out on the wire
     * immediately. GRPC is free to buffer the message until the next non-buffered
     * write, or until writes_done, but it need not buffer completely or at all.
     */
    BUFFER_HINT = 1,
    /**
     * Force compression to be disabled for a particular write
     */
    NO_COMPRESS,
  }

  /**
   * Log verbosity constants. Maps setting names to code numbers.
   */
  export enum logVerbosity {
    DEBUG,
    INFO,
    ERROR,
  }
  
  /**
   * Method type constants
   */
  export enum methodTypes {
    UNARY,
    CLIENT_STREAMING,
    SERVER_STREAMING,
    BIDI_STREAMING,
  }


  /**
   * A certificate as received by the checkServerIdentity callback.
   */
  export interface Certificate {
    /**
     * The raw certificate in DER form.
     */
    raw: Buffer;
  }

  /**
   * A callback that will receive the expected hostname and presented peer
   * certificate as parameters. The callback should return an error to
   * indicate that the presented certificate is considered invalid and
   * otherwise returned undefined.
   */
  export type CheckServerIdentityCallback = (hostname: string, cert: Certificate) => Error | undefined;

  /**
   * Additional peer verification options that can be set when creating
   * SSL credentials.
   */
  export interface VerifyOptions {
    /**
     * If set, this callback will be invoked after the usual hostname verification
     * has been performed on the peer certificate.
     */
    checkServerIdentity?: CheckServerIdentityCallback;
  }

  /**
   * Credentials module
   *
   * This module contains factory methods for two different credential types:
   * CallCredentials and ChannelCredentials. ChannelCredentials are things like
   * SSL credentials that can be used to secure a connection, and are used to
   * construct a Client object. CallCredentials generally modify metadata, so they
   * can be attached to an individual method call.
   *
   * CallCredentials can be composed with other CallCredentials to create
   * CallCredentials. ChannelCredentials can be composed with CallCredentials
   * to create ChannelCredentials. No combined credential can have more than
   * one ChannelCredentials.
   *
   * For example, to create a client secured with SSL that uses Google
   * default application credentials to authenticate:
   *
   * ```
   * var channel_creds = credentials.createSsl(root_certs);
   * (new GoogleAuth()).getApplicationDefault(function(err, credential) {
   *   var call_creds = credentials.createFromGoogleCredential(credential);
   *   var combined_creds = credentials.combineChannelCredentials(
   *       channel_creds, call_creds);
   *   var client = new Client(address, combined_creds);
   * });
   * ```
   */
  export const credentials: {
    /**
     * Create an SSL Credentials object. If using a client-side certificate, both
     * the second and third arguments must be passed.
     * @param rootCerts The root certificate data
     * @param privateKey The client certificate private key, if applicable
     * @param certChain The client certificate cert chain, if applicable
     * @param verifyOptions Additional peer verification options, if desired
     * @return The SSL Credentials object
     */
    createSsl(rootCerts?: Buffer, privateKey?: Buffer, certChain?: Buffer, verifyOptions?: VerifyOptions): ChannelCredentials;

    /**
     * Create a gRPC credentials object from a metadata generation function. This
     * function gets the service URL and a callback as parameters. The error
     * passed to the callback can optionally have a 'code' value attached to it,
     * which corresponds to a status code that this library uses.
     * @param metadataGenerator The function that generates metadata
     * @return The credentials object
     */
    createFromMetadataGenerator(metadataGenerator: metadataGenerator): CallCredentials;

    /**
     * Create a gRPC credential from a Google credential object.
     * @param googleCredential The Google credential object to use
     * @return The resulting credentials object
     */
    createFromGoogleCredential(googleCredential: GoogleOAuth2Client): CallCredentials;

    /**
     * Combine a ChannelCredentials with any number of CallCredentials into a single
     * ChannelCredentials object.
     * @param channelCredential The ChannelCredentials to start with
     * @param credentials The CallCredentials to compose
     * @return A credentials object that combines all of the input credentials
     */
    combineChannelCredentials(channelCredential: ChannelCredentials, ...credentials: CallCredentials[]): ChannelCredentials;

    /**
     * Combine any number of CallCredentials into a single CallCredentials object
     * @param credentials The CallCredentials to compose
     * @return A credentials object that combines all of the input credentials
     */
    combineCallCredentials(...credentials: CallCredentials[]): CallCredentials;

    /**
     * Create an insecure credentials object. This is used to create a channel that
     * does not use SSL. This cannot be composed with anything.
     * @return The insecure credentials object
     */
    createInsecure(): ChannelCredentials;
  };

  /**
   * Metadata generator function.
   */
  export type metadataGenerator = (params: { service_url: string }, callback: (error: Error | null, metadata?: Metadata) => void) => void;

  /**
   * This cannot be constructed directly. Instead, instances of this class should
   * be created using the factory functions in `grpc.credentials`
   */
  export interface ChannelCredentials {
    /**
     * Returns a copy of this object with the included set of per-call credentials
     * expanded to include callCredentials.
     * @param callCredentials A CallCredentials object to associate with this
     * instance.
     */
    compose(callCredentials: CallCredentials): ChannelCredentials;
  }

  /**
   * This cannot be constructed directly. Instead, instances of this class should
   * be created using the factory functions in `grpc.credentials`
   */
  export interface CallCredentials {
    /**
     * Asynchronously generates a new Metadata object.
     * @param options Options used in generating the Metadata object.
     */
    generateMetadata(options: object): Promise<Metadata>;

    /**
     * Creates a new CallCredentials object from properties of both this and
     * another CallCredentials object. This object's metadata generator will be
     * called first.
     * @param callCredentials The other CallCredentials object.
     */
    compose(callCredentials: CallCredentials): CallCredentials;
  }

  /**
   * This is the required interface from the OAuth2Client object
   * from https://github.com/google/google-auth-library-nodejs lib.
   * The definition is copied from `ts/lib/auth/oauth2client.ts`
   */
  export interface GoogleOAuth2Client {
    getRequestMetadata(optUri: string, metadataCallback: (err: Error, headers: any) => void): void;
  }

  /**
   * Creates a constructor for a client with the given methods, as specified in
   * the methods argument. The resulting class will have an instance method for
   * each method in the service, which is a partial application of one of the
   * `grpc.Client` request methods, depending on `requestSerialize`
   * and `responseSerialize`, with the `method`, `serialize`, and `deserialize`
   * arguments predefined.
   * @param methods An object mapping method names to method attributes
   * @param serviceName The fully qualified name of the service
   * @param classOptions An options object.
   * @return New client constructor, which is a subclass of `grpc.Client`, and
   * has the same arguments as that constructor.
   */
  export function makeGenericClientConstructor(
    methods: ServiceDefinition<any>,
    serviceName: string,
    classOptions: GenericClientOptions,
  ): typeof Client;

  /**
   * Options for generic client constructor.
   */
  export interface GenericClientOptions {
    /**
     * Indicates that the old argument order should be used for methods, with
     * optional arguments at the end instead of the callback at the end. This
     * option is only a temporary stopgap measure to smooth an API breakage.
     * It is deprecated, and new code should not use it.
     */
    deprecatedArgumentOrder?: boolean;
  }

  /**
   * Create a client with the given methods
   */
  export class Client {
    /**
     * A generic gRPC client. Primarily useful as a base class for generated clients
     * @param address Server address to connect to
     * @param credentials Credentials to use to connect to the server
     * @param options Options to apply to channel creation
     */
    constructor(address: string, credentials: ChannelCredentials, options?: object)

    /**
     * Make a unary request to the given method, using the given serialize
     * and deserialize functions, with the given argument.
     * @param method The name of the method to request
     * @param serialize The serialization function for inputs
     * @param deserialize The deserialization function for outputs
     * @param argument The argument to the call. Should be serializable with
     *     serialize
     * @param metadata Metadata to add to the call
     * @param options Options map
     * @param callback The callback to for when the response is received
     * @return An event emitter for stream related events
     */
    makeUnaryRequest<RequestType, ResponseType>(
      method: string,
      serialize: serialize<RequestType>,
      deserialize: deserialize<ResponseType>,
      argument: RequestType | null,
      metadata: Metadata | null,
      options: CallOptions | null,
      callback: requestCallback<ResponseType>,
    ): ClientUnaryCall;

    /**
     * Make a client stream request to the given method, using the given serialize
     * and deserialize functions, with the given argument.
     * @param method The name of the method to request
     * @param serialize The serialization function for inputs
     * @param deserialize The deserialization function for outputs
     * @param metadata Array of metadata key/value pairs to add to the call
     * @param options Options map
     * @param callback The callback to for when the response is received
     * @return An event emitter for stream related events
     */
    makeClientStreamRequest<RequestType, ResponseType>(
      method: string,
      serialize: serialize<RequestType>,
      deserialize: deserialize<ResponseType>,
      metadata: Metadata | null,
      options: CallOptions | null,
      callback: requestCallback<ResponseType>,
    ): ClientWritableStream<RequestType>;

    /**
     * Make a server stream request to the given method, with the given serialize
     * and deserialize function, using the given argument
     * @param method The name of the method to request
     * @param serialize The serialization function for inputs
     * @param deserialize The deserialization function for outputs
     * @param argument The argument to the call. Should be serializable with
     *     serialize
     * @param metadata Array of metadata key/value pairs to add to the call
     * @param options Options map
     * @return An event emitter for stream related events
     */
    makeServerStreamRequest<RequestType, ResponseType>(
      method: string,
      serialize: serialize<RequestType>,
      deserialize: deserialize<ResponseType>,
      argument: RequestType,
      metadata?: Metadata | null,
      options?: CallOptions | null,
    ): ClientReadableStream<ResponseType>;

    /**
     * Make a bidirectional stream request with this method on the given channel.
     * @param method The name of the method to request
     * @param serialize The serialization function for inputs
     * @param deserialize The deserialization
     *     function for outputs
     * @param metadata Array of metadata key/value
     *     pairs to add to the call
     * @param options Options map
     * @return An event emitter for stream related events
     */
    makeBidiStreamRequest<RequestType, ResponseType>(
      method: string,
      serialize: serialize<RequestType>,
      deserialize: deserialize<ResponseType>,
      metadata?: Metadata | null,
      options?: CallOptions | null,
    ): ClientDuplexStream<RequestType, ResponseType>;

    /**
     * Close this client.
     */
    close(): void;

    /**
     * Return the underlying channel object for the specified client
     * @return The channel
     */
    getChannel(): Channel;

    /**
     * Wait for the client to be ready. The callback will be called when the
     * client has successfully connected to the server, and it will be called
     * with an error if the attempt to connect to the server has unrecoverablly
     * failed or if the deadline expires. This function will make the channel
     * start connecting if it has not already done so.
     * @param deadline When to stop waiting for a connection.
     * @param callback The callback to call when done attempting to connect.
     */
    waitForReady(deadline: Deadline, callback: (error: Error | null) => void): void;
  }

  /**
   * Options that can be set on a call.
   */
  export interface CallOptions {
    /**
     * The deadline for the entire call to complete.
     */
    deadline?: Deadline;
    /**
     * Server hostname to set on the call. Only meaningful if different from
     * the server address used to construct the client.
     */
    host?: string;
    /**
     * Parent call. Used in servers when making a call as part of the process
     * of handling a call. Used to propagate some information automatically,
     * as specified by propagate_flags.
     */
    parent?: Call;
    /**
     * Indicates which properties of a parent call should propagate to this
     * call. Bitwise combination of flags in `grpc.propagate`.
     */
    propagate_flags?: number;
    /**
     * The credentials that should be used to make this particular call.
     */
    credentials?: CallCredentials;
    /**
     * Additional custom call options. These can be used to pass additional
     * data per-call to client interceptors
     */
    [key: string]: any;
  }

  /**
   * The deadline of an operation. If it is a date, the deadline is reached at
   * the date and time specified. If it is a finite number, it is treated as
   * a number of milliseconds since the Unix Epoch. If it is Infinity, the
   * deadline will never be reached. If it is -Infinity, the deadline has already
   * passed.
   */
  export type Deadline = number | Date;

  /**
   * Any client call type
   */
  type Call =
    ClientUnaryCall |
    ClientReadableStream<any> |
    ClientWritableStream<any> |
    ClientDuplexStream<any, any>;

  /**
   * An EventEmitter. Used for unary calls.
   */
  export class ClientUnaryCall extends EventEmitter {
    private constructor();

    /**
     * Cancel the ongoing call. Results in the call ending with a CANCELLED status,
     * unless it has already ended with some other status.
     */
    cancel(): void;

    /**
     * Get the endpoint this call/stream is connected to.
     * @return The URI of the endpoint
     */
    getPeer(): string;
  }

  /**
   * A stream that the client can read from. Used for calls that are streaming
   * from the server side.
   */
  export class ClientReadableStream<ResponseType> extends Readable {
    private constructor();

    /**
     * Cancel the ongoing call. Results in the call ending with a CANCELLED status,
     * unless it has already ended with some other status.
     */
    cancel(): void;

    /**
     * Get the endpoint this call/stream is connected to.
     * @return The URI of the endpoint
     */
    getPeer(): string;
  }

  /**
   * A stream that the client can write to. Used for calls that are streaming from
   * the client side.
   */
  export class ClientWritableStream<RequestType> extends Writable {
    private constructor();

    /**
     * Write a message to the request stream. If serializing the argument fails,
     * the call will be cancelled and the stream will end with an error.
     * @param message The message to write. Must be a valid argument to the
     *     serialize function of the corresponding method
     * @param flags Flags to modify how the message is written
     * @param callback Callback for when this chunk of data is flushed
     * @return As defined for [Writable]{@link external:Writable}
     */
    write(message: RequestType, flags?: any&writeFlags, callback?: Function): boolean;

    /**
     * Cancel the ongoing call. Results in the call ending with a CANCELLED status,
     * unless it has already ended with some other status.
     */
    cancel(): void;

    /**
     * Get the endpoint this call/stream is connected to.
     * @return The URI of the endpoint
     */
    getPeer(): string;
  }

  /**
   * A stream that the client can read from or write to. Used for calls with
   * duplex streaming.
   */
  export class ClientDuplexStream<RequestType, ResponseType> extends Duplex {
    private constructor();

    /**
     * Write a message to the request stream. If serializing the argument fails,
     * the call will be cancelled and the stream will end with an error.
     * @param message The message to write. Must be a valid argument to the
     *     serialize function of the corresponding method
     * @param flags Flags to modify how the message is written
     * @param callback Callback for when this chunk of data is flushed
     * @return As defined for [Writable]{@link external:Writable}
     */
    write(message: RequestType, flags?: any&writeFlags, callback?: Function): boolean;

    /**
     * Cancel the ongoing call. Results in the call ending with a CANCELLED status,
     * unless it has already ended with some other status.
     */
    cancel(): void;

    /**
     * Get the endpoint this call/stream is connected to.
     * @return The URI of the endpoint
     */
    getPeer(): string;
  }

  /**
   * Client request callback
   * @param error The error, if the call failed
   * @param value The response value, if the call succeeded
   */
  export type requestCallback<ResponseType> =
    (error: ServiceError | null, value?: ResponseType) => void;

  /**
   * Return the underlying channel object for the specified client
   * @see grpc.Client#getChannel
   * @param client The client
   * @return The channel
   */
  export function getClientChannel(client: Client): Channel;

  /**
   * Wait for the client to be ready. The callback will be called when the
   * client has successfully connected to the server, and it will be called
   * with an error if the attempt to connect to the server has unrecoverably
   * failed or if the deadline expires. This function will make the channel
   * start connecting if it has not already done so.
   * @see grpc.Client#waitForReady
   * @param client The client to wait on
   * @param deadline When to stop waiting for a connection. Pass Infinity to
   * wait forever.
   * @param callback The callback to call when done attempting to connect.
   */
  export function waitForClientReady(client: Client, deadline: Deadline, callback: (error: Error | null) => void): void;

  /**
   * Close client.
   * @param clientObj The client to close
   */
  export function closeClient(clientObj: Client): void;

  /**
   * A builder for gRPC status objects
   */
  export class StatusBuilder {
    constructor()

    /**
     * Adds a status code to the builder
     * @param code The status code
     */
    withCode(code: number): this;

    /**
     * Adds details to the builder
     * @param details A status message
     */
    withDetails(details: string): this;

    /**
     * Adds metadata to the builder
     * @param metadata The gRPC status metadata
     */
    withMetadata(metadata: Metadata): this;

    /**
     * Builds the status object
     * @return A gRPC status
     */
    build(): StatusObject;
  }

  export type MetadataListener = (metadata: Metadata, next: Function) => void;

  export type MessageListener = (message: any, next: Function) => void;

  export type StatusListener = (status: StatusObject, next: Function) => void;

  export interface Listener {
    onReceiveMetadata?: MetadataListener;
    onReceiveMessage?: MessageListener;
    onReceiveStatus?: StatusListener;
  }

  /**
   * A builder for listener interceptors
   */
  export class ListenerBuilder {
    constructor();

    /**
     * Adds onReceiveMetadata method to the builder
     * @param onReceiveMetadata A listener method for receiving metadata
     */
    withOnReceiveMetadata(onReceiveMetadata: MetadataListener): this;

    /**
     * Adds onReceiveMessage method to the builder
     * @param onReceiveMessage A listener method for receiving message
     */
    withOnReceiveMessage(onReceiveMessage: MessageListener): this;

    /**
     * Adds onReceiveStatus method to the builder
     * @param onReceiveStatus A listener method for receiving status
     */
    withOnReceiveStatus(onReceiveStatus: StatusListener): this;

    /**
     * Builds the call listener
     */
    build(): Listener;
  }

  export type MetadataRequester = (metadata: Metadata, listener: Listener, next: Function) => void;

  export type MessageRequester = (message: any, next: Function) => void;

  export type CloseRequester = (next: Function) => void;

  export type CancelRequester = (next: Function) => void;

  export type GetPeerRequester = (next: Function) => string;

  export interface Requester {
    start?: MetadataRequester;
    sendMessage?: MessageRequester;
    halfClose?: CloseRequester;
    cancel?: CancelRequester;
    getPeer?: GetPeerRequester;
  }

  /**
   * A builder for the outbound methods of an interceptor
   */
  export class RequesterBuilder {
    constructor();

    /**
     * Add a metadata requester to the builder
     * @param start A requester method for handling metadata
     */
    withStart(start: MetadataRequester): this;

    /**
     * Add a message requester to the builder.
     * @param sendMessage A requester method for handling
     * messages.
     */
    withSendMessage(sendMessage: MessageRequester): this;

    /**
     * Add a close requester to the builder.
     * @param halfClose A requester method for handling client
     * close.
     */
    withHalfClose(halfClose: CloseRequester): this;

    /**
     * Add a cancel requester to the builder.
     * @param cancel A requester method for handling `cancel`
     */
    withCancel(cancel: CancelRequester): this;

    /**
     * Builds the requester's interceptor methods.
     */
    build(): Requester;
  }

  /**
   * A chainable gRPC call proxy which will delegate to an optional requester
   * object. By default, interceptor methods will chain to nextCall. If a
   * requester is provided which implements an interceptor method, that
   * requester method will be executed as part of the chain.
   * operations.
   */
  export class InterceptingCall {
    /**
     * @param next_Call The next call in the chain
     * @param requester Interceptor methods to handle request
     */
    constructor(nextCall: InterceptingCall|null, requester?: Requester);

    /**
     * Starts a call through the outbound interceptor chain and adds an element to
     * the reciprocal inbound listener chain.
     */
    start(metadata: Metadata, listener: Listener): void;

    /**
     * Pass a message through the interceptor chain.
     */
    sendMessage(message: any): void;

    /**
     * Run a close operation through the interceptor chain
     */
    halfClose(): void;

    /**
     * Run a cancel operation through the interceptor chain
     */
    cancel(): void;

    /**
     * Run a cancelWithStatus operation through the interceptor chain.
     * @param status
     * @param message
     */
    cancelWithStatus(status: StatusObject, message: string): void;

    /**
     * Pass a getPeer call down to the base gRPC call (should not be intercepted)
     */
    getPeer(): object;

    /**
     * For streaming calls, we need to transparently pass the stream's context
     * through the interceptor chain. Passes the context between InterceptingCalls
     * but hides it from any requester implementations.
     * @param context Carries objects needed for streaming operations.
     * @param message The message to send.
     */
    sendMessageWithContext(context: object, message: any): void;

    /**
     * For receiving streaming messages, we need to seed the base interceptor with
     * the streaming context to create a RECV_MESSAGE batch.
     * @param context Carries objects needed for streaming operations
     */
    recvMessageWithContext(context: object): void;
  }
  export enum connectivityState {
    IDLE = 0,
    CONNECTING = 1,
    READY = 2,
    TRANSIENT_FAILURE = 3,
    SHUTDOWN = 4
  }

  export class Channel {
    /**
     * This constructor API is almost identical to the Client constructor,
     * except that some of the options for the Client constructor are not valid
     * here.
     * @param target The address of the server to connect to
     * @param credentials Channel credentials to use when connecting
     * @param options A map of channel options that will be passed to the core
     */
    constructor(target: string, credentials: ChannelCredentials, options: {[key:string]: string|number});
    /**
     * Close the channel. This has the same functionality as the existing grpc.Client.prototype.close
     */
    close(): void;
    /**
     * Return the target that this channel connects to
     */
    getTarget(): string;
    /**
     * Get the channel's current connectivity state.
     * @param tryToConnect If true, the channel will start connecting if it is
     *     idle. Otherwise, idle channels will only start connecting when a
     *     call starts.
     */
    getConnectivityState(tryToConnect: boolean): connectivityState;
    /**
     * Watch for connectivity state changes.
     * @param currentState The state to watch for transitions from. This should
     *     always be populated by calling getConnectivityState immediately
     *     before.
     * @param deadline A deadline for waiting for a state change
     * @param callback Called with no error when a state change, or with an
     *     error if the deadline passes without a state change.
     */
    watchConnectivityState(currentState: connectivityState, deadline: Date|number, callback: (error?: Error) => void): void;
    /**
     * Create a call object. Call is an opaque type that is used by the Client
     * and Server classes. This function is called by the gRPC library when
     * starting a request. Implementers should return an instance of Call that
     * is returned from calling createCall on an instance of the provided
     * Channel class.
     * @param method The full method string to request.
     * @param deadline The call deadline
     * @param host A host string override for making the request
     * @param parentCall A server call to propagate some information from
     * @param propagateFlags A bitwise combination of elements of grpc.propagate
     *     that indicates what information to propagate from parentCall.
     */
    createCall(method: string, deadline: Date|number, host: string|null, parentCall: Call|null, propagateFlags: number|null): Call;
  }
}
