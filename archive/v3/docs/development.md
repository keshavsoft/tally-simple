# Developer guide

[Back to the package on npm](https://www.npmjs.com/package/tally-simple) · [Back to the README](../README.md) · [Architecture story](architecture.md)

This document explains how Tally Simple is built and how to change it. End-user installation and query examples are kept in the root README.

## The developer story

Tally Simple keeps the TDL request definitions in one internal source and exposes only the queries deliberately selected for users.

~~~text
src/vN/source.json
    │
    ├── external-api/api.json ──> JavaScript client
    │
    └── request traversal ──> XML over HTTP ──> Tally
                         │
                         └──> external-api/api.json ──> CLI stdout
~~~

The source definitions describe how Tally should answer a query. The public API list is the product boundary: only listed paths become JavaScript methods and CLI commands. The highest numbered version under `src/` is selected for declaration generation, while the archived version trees are not used by the current package runtime.

## Repository map

- src/vN/source.json: Tally connection defaults, request envelope, and TDL collections for a version.
- src/vN/external-api/api.json: public query allowlist for a version.
- src/vN/external-api/api.js: builds the nested runtime API.
- src/vN/traverse.js: validates, builds, and sends a request.
- src/index.d.ts: generated TypeScript declarations.
- bin/tally-simple.js: command-line entrypoint.
- test/test.js and test/units.js: offline behavior and CLI tests.
- test/v1/units.js: manual integration smoke check against a reachable Tally instance; it is not part of npm test.

The declaration generator is intentionally kept outside `src/` because it is a build helper:

- `scripts/dts/find-active-version.js`: selects the highest `src/vN` and checks `src/index.js` points to it.
- `scripts/dts/load-version-definition.js`: loads and validates the selected version's public API data.
- `scripts/dts/render-declaration.js`: renders the human-readable IntelliSense declaration.
- `scripts/dts/generate-dts.js`: coordinates the steps and writes `src/index.d.ts`.

## Request lifecycle

1. The application or CLI selects a public query path.
2. The client validates and trims the company name.
3. The path is resolved in the active version's `source.json`.
4. The company name is XML-escaped and inserted into the request envelope.
5. The selected collection body is inserted into the envelope.
6. The configured fetch implementation sends the request to Tally.
7. The response body is returned as text; non-2xx responses become errors.

## Adding a query

1. Add or update the TDL definition in the active `src/vN/source.json`.
2. Add its complete path to the matching `src/vN/external-api/api.json`.
3. Run npm run generate:dts.
4. Add or update an offline test.
5. Run npm run verify.

Do not edit src/index.d.ts by hand. It is generated from the source definition and public path list.

## Client configuration

createTallyClient() is the application boundary for a different URL, method, headers, timeout, or fetch implementation. The default import uses the default connection from the active version's `source.json`.

The fetch option is intentionally injectable so tests can run without a Tally installation or network connection.

## Verification and publishing

~~~bash
npm install
npm run verify
npm pack --dry-run
~~~

The prepack and prepublishOnly hooks run declaration generation and the offline test suite. The package files allowlist publishes the runtime, CLI, user documentation, and package metadata while excluding tests and development-only scripts.
