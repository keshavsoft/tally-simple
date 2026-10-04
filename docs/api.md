# Published API paths

[Back to the package on npm](https://www.npmjs.com/package/tally-simple) · [Back to the README](../README.md)

These are the paths intentionally exposed by the package. The root tally is present on the default JavaScript import, while the CLI accepts paths with or without that root.

| JavaScript call | CLI path | TDL request |
| --- | --- | --- |
| tally.masters.units.fetch(company) | masters.units.fetch | Unit with $$Alias:Name |
| tally.masters.stockItems.withBatches(company) | masters.stockItems.withBatches | StockItem with base units and batch allocations |
| tally.masters.ledgers.withGstDetails(company) | masters.ledgers.withGstDetails | Ledger with GST registration details |
| tally.masters.stockGroup.withParent(company) | masters.stockGroup.withParent | StockGroup with parent group |

All current calls:

- accept one company name;
- make a POST request with XML;
- return Tally's response body as a string;
- use the configured endpoint and headers;
- reject blank company names.

The runtime definitions live in the active `src/vN/source.json`. The public allowlist lives in the matching `src/vN/external-api/api.json`; only paths in that allowlist are exposed by the package and CLI. Older version trees are retained as historical material.

## Request shape

Each call sends a `POST` request to the configured Tally endpoint. The company name is inserted into the standard XML export envelope and escaped before the request is sent. The collection-specific TDL is then added to that envelope.

The response is returned unchanged as a string. Parsing XML is intentionally left to the consuming application or shell pipeline.
