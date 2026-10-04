[**View this document as HTML**](./repo-developer.html)

# Repository Developer Guide

This guide is for developers who change the repository itself.

## Source of truth

The active version contains the Tally definitions:

```text
src/
└── v1/
    ├── source.json
    ├── traverse.js
    ├── traverseObject/
    ├── external-api/
    │   ├── api.json
    │   ├── api.js
    │   └── index.js
    └── index.js
```

`source.json` contains the internal request definitions.

`external-api/api.json` contains only the public paths.

That separation is intentional.

## Adding a public operation

1. Add or change the internal TDL definition in `source.json`.
2. Add its public path to `external-api/api.json`.
3. Regenerate `src/index.d.ts`.
4. Test the public call.
5. Leave older source versions untouched.

## Company input

Do not hardcode a real company name into the public definition.

The caller supplies the company:

```js
tally.masters.units.fetch("Mani9");
```

The runtime passes that value into the request builder.

## Traversal

Traversal should remain generic.

Its job is to locate the requested definition.

The action/request layer interprets the terminal definition and performs the Tally HTTP request.

Avoid putting endpoint-specific paths directly into the traversal engine.

## Versioning

When a new implementation is required:

```text
src/v1
src/v2
src/v3
```

Create the next version and make the root `src/index.js` point to the highest active version.

Do not rewrite old versions merely to keep them visually consistent.

## Declaration generation

The generated declaration file represents the public API tree.

It should be generated from the public API definition rather than manually maintained.

```bash
node generate-dts.js
```

## Testing

Test both:

1. the public JavaScript API;
2. the generated request sent to Tally.

Keep Tally-specific request definitions in JSON where possible so adding another operation is primarily a data change rather than a new JavaScript module.

## Design boundary

The repository deliberately has three layers:

```text
public API
    ↓
traversal / execution
    ↓
source JSON
```

The public consumer sees the first layer.

The repository developer maintains all three.
