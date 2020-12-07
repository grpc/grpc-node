export const rpcFileDescriptorSet = {
  "file": [
    {
      "name": "test_protos/rpc.proto",
      "messageType": [
        {
          "name": "MyRequest",
          "field": [
            {
              "name": "path",
              "number": 1,
              "label": "LABEL_OPTIONAL",
              "type": "TYPE_STRING",
              "jsonName": "path"
            }
          ]
        },
        {
          "name": "MyResponse",
          "field": [
            {
              "name": "status",
              "number": 2,
              "label": "LABEL_OPTIONAL",
              "type": "TYPE_INT32",
              "jsonName": "status"
            }
          ]
        }
      ],
      "service": [
        {
          "name": "MyService",
          "method": [
            {
              "name": "MyMethod",
              "inputType": ".MyRequest",
              "outputType": ".MyResponse"
            }
          ]
        }
      ],
      "syntax": "proto3"
    }
  ]
}
