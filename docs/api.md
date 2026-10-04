[**View this document as HTML**](./api.html)

# API Reference

The public API is generated from `src/v1/external-api/api.json`.

Current public paths:

```text
tally.masters.units.fetch
tally.masters.stockItems.withBatches
```

Example:

```js
await tally.masters.units.fetch("Mani9");
```

The exact public surface should be changed through `external-api/api.json`, followed by declaration generation.
