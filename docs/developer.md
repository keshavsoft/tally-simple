[**View this document as HTML**](./developer.html)

# Application Developer Guide

This guide is for developers consuming Tally Public API from another application.

## Public boundary

The consumer sees a tree-shaped JavaScript API:

```js
const result = await tally.masters.units.fetch("Mani9");
```

The consumer does not need to know:

- the internal source JSON structure;
- the TDL request template;
- how traversal finds the definition;
- how the HTTP request is constructed.

## Company name

The company is runtime input.

```js
await tally.masters.units.fetch("Mani9");
await tally.masters.units.fetch("Another Company");
```

The company should therefore not be permanently embedded in the source definition.

## CLI / scripting

The same public operation can be exposed through a CLI layer without duplicating the Tally definition.

## Response

The package returns the Tally response body. XML parsing and application-specific normalization remain outside this package.

For the internal architecture, see [Repository Developer Guide](repo-developer.md).
