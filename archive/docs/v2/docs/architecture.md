# Architecture and the package story

[Back to the package on npm](https://www.npmjs.com/package/tally-simple) · [Back to the README](../README.md) · [Visual guide](index.html)

## One definition, two ways to use it

The package has one query model and two entrypoints:

~~~text
src/v2/source.json
        │
        ├── external-api/api.json ──> generated JavaScript client ──> application imports
        │
        └── request traversal ──> XML over HTTP ──> Tally

external-api/api.json ──> tally-simple CLI ──> stdout
~~~

`src/v2/source.json` owns the TDL collection definitions and the default request envelope. `src/v2/external-api/api.json` is the product boundary: only paths listed there become public methods or CLI commands. The archived `archive/v1` tree is not used by the published runtime.

## Request lifecycle

1. An application or CLI selects a public path.
2. The client validates and trims the company name.
3. The path is traversed into the source definition.
4. The company is XML-escaped and inserted into the request envelope.
5. The collection body is inserted into the envelope.
6. The configured fetch implementation sends the request to Tally.
7. The response body is returned as text; non-2xx responses become errors.

The default client is useful for a quick start. createTallyClient() provides the boundary for applications that need a different URL, headers, timeout, or fetch implementation.

## Adding a public endpoint

1. Add the TDL definition under `src/v2/source.json`.
2. Add its complete path to `src/v2/external-api/api.json`.
3. Run npm run generate:dts.
4. Add or update an offline test.
5. Run npm run verify.

Do not edit src/index.d.ts by hand; it is generated from the public path list.

## Publish boundary

`package.json` exposes the ESM entrypoint and CLI explicitly. Its files allowlist publishes `src`, `bin`, `docs`, and the package-facing metadata while excluding tests and development scripts. `prepublishOnly` runs declaration generation and the offline test suite before npm publish.
