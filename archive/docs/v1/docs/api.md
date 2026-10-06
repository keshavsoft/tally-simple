# Published API paths

These are the paths intentionally exposed by the package. The root tally is present on the default JavaScript import, while the CLI accepts paths with or without that root.

| JavaScript call | CLI path | TDL request |
| --- | --- | --- |
| tally.masters.units.fetch(company) | masters.units.fetch | Unit with $$Alias:Name |
| tally.masters.stockItems.withBatches(company) | masters.stockItems.withBatches | StockItem with base units and batch allocations |
| tally.masters.ledgers.withGstDetails(company) | masters.ledgers.withGstDetails | Ledger with GST registration details |

All current calls:

- accept one company name;
- make a POST request with XML;
- return Tally's response body as a string;
- use the configured endpoint and headers;
- reject blank company names.

The source of truth for the request definitions is src/v1/source.json. The allowlist for this published surface is src/v1/external-api/api.json.
