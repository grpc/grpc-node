---
name: ReDoS vulnerability
about: npm audit reports that protobufjs has a ReDoS vulnerability.

---
As I [ran `npm install`]/[ran 'npm audit']/[got a report from Snyk],
the tool told me that protobufjs has 1 moderate vulnerability exported
through the `grpc` package, as described here: https://nodesecurity.io/advisories/605

The gRPC team is aware of this, and this issue is a duplicate of #277.
Upgrading this depdendency would be a breaking change, and the fix has been backported
to protobufjs 5.0.3 already; the [nodesecurity.io]/[Snyk] database is simply outdated.
