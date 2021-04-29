[![npm](https://img.shields.io/npm/v/grpc.svg)](https://www.npmjs.com/package/grpc)
# Node.js gRPC Library

**As of April 2021 this library is deprecated and will no longer receive any updates. We recommend using [`@grpc/grpc-js`](https://www.npmjs.com/package/@grpc/grpc-js) instead.**

## PREREQUISITES
- `node`: This requires `node` to be installed, version `4.0` or above. If you instead have the `nodejs` executable on Debian, you should install the [`nodejs-legacy`](https://packages.debian.org/sid/nodejs-legacy) package.

- **Note:** If you installed `node` via a package manager and the version is still less than `4.0`, try directly installing it from [nodejs.org](https://nodejs.org).

## LATEST VERSIONS SUPPORTED

 - Node: 14
 - Electron: 11.2

## INSTALLATION

Install the gRPC NPM package

```sh
npm install grpc
```

## BUILD FROM SOURCE

The following command can be used to build from source when installing the package from npm:

```
npm install grpc --build-from-source
```

The `--build-from-source` option will work even when installing another package that depends on `grpc`. To build only `grpc` from source, you can use the argument `--build-from-source=grpc`.

## ABOUT ELECTRON

The official electron documentation recommends to [build all of your native packages from source](https://electronjs.org/docs/tutorial/using-native-node-modules#modules-that-rely-on-node-pre-gyp). While the reasons behind this are technically good - many native extensions won't be packaged to work properly with electron - the gRPC source code is fairly difficult to build from source due to its complex nature, and we're also providing working electron pre-built binaries. Therefore, we recommend that you do not follow this model for using gRPC with electron. Also, for the same reason, `electron-rebuild` will always build from source. We advise you to not use this tool if you are depending on gRPC. Please note that there's not just one way to get native extensions running in electron, and that there's never any silver bullet for anything. The following instructions try to cater about some of the most generic ways, but different edge cases might require different methodologies.

The best way to get gRPC to work with electron is to do this, possibly in the `postinstall` script of your `package.json` file:

```
npm rebuild --target=2.0.0 --runtime=electron --dist-url=https://atom.io/download/electron
```

Note that the `2.0.0` above is the electron runtime version number. You will need to update this every time you go on a different version of the runtime.

If you have more native dependencies than gRPC, and they work better when built from source, you can explicitely specify which extension to build the following way:

```
npm rebuild --build-from-source=sqlite3 --target=2.0.0 --runtime=electron --dist-url=https://atom.io/download/electron
```

This way, if you depend on both `grpc` and `sqlite3`, only the `sqlite3` package will be rebuilt from source, leaving the `grpc` package to use its precompiled binaries.

## BUILD IN GIT REPOSITORY

 1. Clone [the grpc-node Git Repository](https://github.com/grpc/grpc-node).
 2. Run `git submodule update --init --recursive` from the repository root.
 3. Run `cd packages/grpc-native-core`.
 4. Run `npm install --build-from-source`.

 - **Note:** On Windows, this might fail due to [nodejs issue #4932](https://github.com/nodejs/node/issues/4932) in which case, you will see something like the following in `npm install`'s output (towards the very beginning):

    ```
     ..
     Building the projects in this solution one at a time. To enable parallel build, please add the "/m" switch.
     WINDOWS_BUILD_WARNING
      "..\IMPORTANT: Due to https:\github.com\nodejs\node\issues\4932, to build this library on Windows, you must first remove C:\Users\jenkins\.node-gyp\4.4.0\include\node\openssl"
      ...
      ..
    ```

    To fix this, you will have to delete the folder `C:\Users\<username>\.node-gyp\<node_version>\include\node\openssl` and retry `npm install`

## CONFIGURE BINARIES' LOCATION

You can configure the location from which the pre-compiled binaries are downloaded during installation.

`npm install --grpc_node_binary_host_mirror=https://your-url.com`

Or defining `grpc_node_binary_host_mirror` in your `.npmrc`.

## API DOCUMENTATION

See the [API Documentation](https://grpc.io/grpc/node/).

## TESTING
To run the test suite, simply run `npm test` in the install location.
