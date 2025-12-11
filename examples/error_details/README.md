# Error Details

This example demonstrates the use of status details in grpc errors.

## Start the server

Run the server, which sends a rich error if the name field is empty.

```
node server.js
```

## Run the client

Run the client in another terminal. It will make two calls: first, a successful call with a valid name, and second, a failing call with an empty name.

```
node client.js
```

## Expected Output
```
Greeting: Hello World

--- Standard gRPC Error Received ---
Code: 3
Status: INVALID_ARGUMENT
Message: 3 INVALID_ARGUMENT: Simple Error: The name field was empty.

--- Rich Error Details---
Violation: [
  {
    "field": "name",
    "description": "Name field is required"
  }
]
```
