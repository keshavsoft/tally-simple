# Tally Simple

Tally Simple gives JavaScript applications and shell scripts a straightforward way to ask Tally for business data.

Choose a supported query, provide the company name, and receive the response directly from Tally. The same queries work from an application or from the command line.

## Requirements

- Node.js 20.10 or newer
- A Tally HTTP endpoint that accepts the request, usually http://localhost:9000

Tally Simple returns Tally's response body as XML text.

## Install

~~~bash
npm install tally-simple
~~~

## Use it in JavaScript

~~~js
import tally from "tally-simple";

const xml = await tally.masters.units.fetch("Mani9");
console.log(xml);
~~~

## Use it from the command line

Run a query with npm's command runner:

~~~bash
npx tally-simple masters.units.fetch --company Mani9
~~~

You can also include the root name:

~~~bash
npx tally-simple tally.masters.stockItems.withBatches \
    --company Mani9 \
    --url http://localhost:9000
~~~

The response is written to stdout, so it can be saved or piped:

~~~bash
npx tally-simple masters.ledgers.withGstDetails --company Mani9 > ledgers.xml
~~~

For environment-based use:

~~~bash
TALLY_COMPANY=Mani9 TALLY_URL=http://localhost:9000 \
    npx tally-simple masters.units.fetch
~~~

Run npx tally-simple --help to see all CLI options.

## Available queries

| Query | Returns |
| --- | --- |
| masters.units.fetch | Units and their aliases |
| masters.stockItems.withBatches | Stock items, base units, and batch allocations |
| masters.ledgers.withGstDetails | Ledgers and GST registration details |

Every query accepts one company name. Blank company names are rejected before a request is sent. HTTP errors include the status and response body.

More user-facing details are available in [usage](docs/usage.md), the [CLI reference](docs/cli.md), and the [available query list](docs/api.md).
