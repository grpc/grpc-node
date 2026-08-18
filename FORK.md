# Wingspan fork of grpc/grpc-node

This is Wingspan's fork of [grpc/grpc-node](https://github.com/grpc/grpc-node). It exists to
publish **`@wingspanhq/grpc-js`** — a build of `@grpc/grpc-js` that carries one behavioral fix —
to GitHub Packages. No other package in this monorepo is published from the fork.

## Why this fork exists

A graceful HTTP/2 GOAWAY leaves grpc-js's keepalive timer running on both the client transport
and the server session. The next PING that fails or times out triggers the disconnect path,
destroying in-flight RPCs the GOAWAY had deliberately allowed to finish draining. In production
this surfaced as status 14 / `Connection dropped` on calls that were completing normally during
deploys and connection-age recycling.

Reported upstream as [grpc/grpc-node#3068](https://github.com/grpc/grpc-node/issues/3068).
Upstream has pushed back on the premise (RFC 9113 requires a PING to be ACKed regardless of
GOAWAY), so this fix may never merge upstream in its current form. Until that conversation
resolves, this fork is the delivery vehicle. It replaces the previous mechanism — a
`patch-package` postinstall hook in `@wingspanhq/grpc` that rewrote grpc-js's compiled output in
consumers' `node_modules` — which was fragile across package managers and install layouts
(see wingspanHQ/grpc#89).

## What is changed relative to upstream

Branch naming: `wingspan/grpc-js-<upstream-version>`, based on the upstream release tag
`@grpc/grpc-js@<upstream-version>`. Each branch contains exactly two kinds of commits:

1. **The fix** — `packages/grpc-js/src/transport.ts` and `packages/grpc-js/src/server.ts` only.
   Client: mark the transport draining on `goaway`, clear the keepalive timeout, refuse new
   pings, ignore in-flight ping completions. Server: begin draining before locally initiated
   closes (`closeSession`, max connection age) and on peer GOAWAY. Kept free of fork-identity
   noise so it can be cherry-picked into an upstream PR.
2. **Fork identity** — package rename to `@wingspanhq/grpc-js`, version `X.Y.Z-wingspan.N`,
   GitHub Packages `publishConfig`, this file, and the publish workflow.

`master` tracks upstream and carries no Wingspan changes.

## How it is consumed

`@wingspanhq/grpc` (the internal gRPC framework) depends on it via an npm alias:

```json
"@grpc/grpc-js": "npm:@wingspanhq/grpc-js@1.14.4-wingspan.1"
```

so every `import from '@grpc/grpc-js'` — including deep imports and `@grpc/grpc-js-xds`'s peer
resolution — lands on the fork. Services do not (and should not) depend on this package
directly; it arrives transitively through `@wingspanhq/grpc`.

Expect a yarn peer-dependency warning from `@grpc/grpc-js-xds` (`~1.14.0` does not match a
prerelease version). It is benign: the alias puts the fork at `node_modules/@grpc/grpc-js`,
which is what xds resolves.

## Publishing a new version

The `Publish @wingspanhq/grpc-js` workflow (`.github/workflows/publish-wingspan-grpc-js.yml`)
runs on pushes to `wingspan/**` branches that touch `packages/grpc-js/`, or manually via
workflow dispatch. It builds from checked-in generated types (no proto regeneration) and
publishes to GitHub Packages with the repo's `GITHUB_TOKEN`.

To publish locally instead (requires a token with `write:packages` for wingspanHQ):

```bash
git submodule update --init packages/grpc-js-xds/deps/xds packages/grpc-js-xds/deps/protoc-gen-validate
(cd packages/proto-loader && npm install --ignore-scripts && ./node_modules/.bin/tsc -p .)
cd packages/grpc-js
npm install --ignore-scripts
node copy-protos.js
./node_modules/.bin/tsc -p tsconfig.publish.json
npm publish --ignore-scripts
```

`--ignore-scripts` on install stops the sibling packages' `prepare` scripts, which do not build
in isolation; on publish it skips `prepare`, which would regenerate checked-in proto types with
tooling this flow deliberately avoids. proto-loader must be compiled first because grpc-js
consumes it as a `file:` devDependency (a symlink) and resolves types from its `build/` output.
`tsconfig.publish.json` compiles `src/` only (the published `build/src` tree) with node types
included explicitly; the stock `tsconfig.json` targets upstream's gulp pipeline and compiles
tests too.

## Tracking a new upstream release

When upstream tags `@grpc/grpc-js@X.Y.Z`:

```bash
git fetch upstream --tags        # upstream = https://github.com/grpc/grpc-node.git
git checkout -b wingspan/grpc-js-X.Y.Z "@grpc/grpc-js@X.Y.Z"
git cherry-pick <fix commit>     # commit 1 from the previous wingspan/ branch
git cherry-pick <identity commit> # then bump version to X.Y.Z-wingspan.1
```

Resolve conflicts in the two touched source files by re-reading the surrounding upstream code —
the fix is small and its anchors (goaway handler, `canSendPing`, ping callback, `closeSession`,
connection-age timers) are stable but not guaranteed. After building, compare the compiled
`transport.js`/`server.js` against the previous branch's output to review what upstream changed
underneath the fix. Then update the alias version and the expected SHA-256 digests in
`@wingspanhq/grpc` (`src/grpcJsPatchIntegrity.ts`) — its startup integrity check hashes the
compiled files and fails closed on drift.

## Exit criteria

If upstream ships an equivalent fix (or #3068 concludes with a config-level answer), point
`@wingspanhq/grpc` back at stock `@grpc/grpc-js`, delete the alias and digests bump, and archive
this fork.
