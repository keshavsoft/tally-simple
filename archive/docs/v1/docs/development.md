# Developer guide

This document explains how Tally Simple is built and how to change it. End-user installation and query examples are kept in the root README.

## The developer story

Tally Simple keeps the TDL request definitions in one internal source and exposes only the queries deliberately selected for users.

~~~text
source.json
    │
    ├── public API list ──> JavaScript client
    │
    └── request traversal ──> XML over HTTP ──> Tally
                         │
                         └──> CLI stdout
~~~

The source definitions describe how Tally should answer a query. The public API list is the product boundary: only listed paths become JavaScript methods and CLI commands.

## Repository map

- src/v1/source.json: Tally connection defaults, request envelope, and TDL collections.
- src/v1/external-api/api.json: public query allowlist.
- src/v1/external-api/api.js: builds the nested runtime API.
- src/v1/traverse.js: validates, builds, and sends a request.
- src/index.d.ts: generated TypeScript declarations.
- bin/tally-simple.js: command-line entrypoint.
- test/test.js and test/units.js: offline behavior and CLI tests.
- test/v1/units.js: manual integration smoke check against a reachable Tally instance; it is not part of npm test.

## Request lifecycle

1. The application or CLI selects a public query path.
2. The client validates and trims the company name.
3. The path is resolved in source.json.
4. The company name is XML-escaped and inserted into the request envelope.
5. The selected collection body is inserted into the envelope.
6. The configured fetch implementation sends the request to Tally.
7. The response body is returned as text; non-2xx responses become errors.

## Adding a query

1. Add or update the TDL definition in src/v1/source.json.
2. Add its complete path to src/v1/external-api/api.json.
3. Run npm run generate:dts.
4. Add or update an offline test.
5. Run npm run verify.

Do not edit src/index.d.ts by hand. It is generated from the source definition and public path list.

## Client configuration

createTallyClient() is the application boundary for a different URL, method, headers, timeout, or fetch implementation. The default import uses the default connection from source.json.

The fetch option is intentionally injectable so tests can run without a Tally installation or network connection.

## Verification and publishing

~~~bash
npm install
npm run verify
npm pack --dry-run
~~~

The prepack and prepublishOnly hooks run declaration generation and the offline test suite. The package files allowlist publishes the runtime, CLI, user documentation, and package metadata while excluding tests and development-only scripts.
