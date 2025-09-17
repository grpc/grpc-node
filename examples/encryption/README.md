# Encryption

This directory contains two related examples: one for TLS and one for mTLS.

## Try it

In each example's subdirectory:

```
node server.js
```

```
node client.js
```

## Explanation

### TLS

TLS is a commonly used cryptographic protocol to provide end-to-end communication security. In the example, we show how to set up a server authenticated TLS connection to transmit RPC.

The function [`grpc.credentials.createSsl`](https://grpc.github.io/grpc/node/grpc.credentials.html#.createSsl__anchor) can be used to create client TLS credentials, and the function [`grpc.ServerCredentials.createSsl`](https://grpc.github.io/grpc/node/grpc.ServerCredentials.html#.createSsl__anchor) can be used to create server TLS credentials.

This example uses public/private keys created in advance (found in `examples/data/x509`):

 - `server_cert.pem` contains the server certificate (public key).
 - `server_key.pem` contains the server private key.
 - `ca_cert.pem` contains the certificate (certificate authority) that can verify the server's certificate.

The server credentials can be passed to the `Server#bindAsync` method, and the client credentials can be passed to the `Client` constructor.

### mTLS

In mutual TLS (mTLS), the client and the server authenticate each other. gRPC allows users to configure mutual TLS at the connection level.

This example uses public/private keys created in advance (found in `examples/data/x509`):

 - `server_cert.pem` contains the server's certificate (public key).
 - `server_key.pem` contains the server's private key.
 - `ca_cert.pem` contains the certificate of the certificate authority that can verify the server's certificate.
 - `client_cert.pem` contains the client's certificate (public key).
 - `client_key.pem` contains the client's private key.
 - `client_ca_cert.pem` contains the certificate of the certificate authority that can verify the client's certificate.

In normal TLS, the server is only concerned with presenting the server certificate for clients to verify. In mutual TLS, the server also loads in a list of trusted CA files for verifying the client's presented certificates. This is done by passing the CA file as the first argument to `grpc.ServerCredentials.createSsl`, and by setting the last argument `checkClientCertificate` to `true`.

In normal TLS, the client is only concerned with authenticating the server by using one or more trusted CA file. In mutual TLS, the client also presents its client certificate to the server for authentication. This is done by passing the key and cert files as the second and third arguments to `grpc.credentials.createSsl`.
