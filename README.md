# Tally Simple

[![npm version](https://img.shields.io/npm/v/tally-simple.svg)](https://www.npmjs.com/package/tally-simple)
[![license](https://img.shields.io/npm/l/tally-simple.svg)](https://github.com/keshavsoft/tally-simple/blob/main/LICENSE)

Tally Simple is a small, typed JavaScript client and CLI for asking Tally for business data.

Choose a supported query, provide the company name, and receive Tally's response as XML. The same query paths work in an application and from a shell, so a quick experiment can grow into an automated job without changing the request model.

**[View the package on npm](https://www.npmjs.com/package/tally-simple)** · **[Open the visual guide](docs/index.html)**

## The story in one minute

Tally Simple sits between your code or shell and a Tally HTTP endpoint:

~~~text
your app / shell command
          │  choose a public query + company
          ▼
       Tally Simple
          │  builds the XML request
          ▼
    Tally HTTP endpoint
          │
          ▼
     XML response text
~~~

It deliberately keeps the response raw. You can inspect it, save it, pipe it to another tool, or parse it with the XML library your application already uses.

## Requirements

- Node.js 20.10 or newer
- A Tally HTTP endpoint that accepts the request, usually http://localhost:9000

Tally Simple returns Tally's response body as XML text.

## Install

~~~bash
npm install tally-simple
~~~

The package has no runtime dependencies and requires Node.js 20.10 or newer.

## Use it in JavaScript

~~~js
import tally from "tally-simple";

const xml = await tally.masters.units.fetch("Mani9");
console.log(xml);
~~~

The default import is a ready-to-use client. For a different endpoint, headers, timeout, or fetch implementation, use `createTallyClient()`:

~~~js
import { createTallyClient } from "tally-simple";

const tally = createTallyClient({
    url: "http://localhost:9000",
    timeout: 15_000
});

const xml = await tally.masters.ledgers.withGstDetails("Mani9");
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

In PowerShell, environment variables use this form:

~~~powershell
$env:TALLY_COMPANY = "Mani9"
$env:TALLY_URL = "http://localhost:9000"
npx tally-simple masters.units.fetch
~~~

## Available queries

| Query | Returns |
| --- | --- |
| masters.units.fetch | Units and their aliases |
| masters.stockItems.withBatches | Stock items, base units, and batch allocations |
| masters.ledgers.withGstDetails | Ledgers and GST registration details |
| masters.stockGroup.withParent | Stock groups and their parent groups |

Every query accepts one company name. Blank company names are rejected before a request is sent. HTTP errors include the status and response body.

## Choose your next step

- [JavaScript usage](docs/usage.md): configure the client, test without Tally, and use TypeScript.
- [CLI reference](docs/cli.md): see options, environment variables, piping, and errors.
- [Available query paths](docs/api.md): see the public API and the TDL each path requests.
- [Architecture story](docs/architecture.md): see how one definition drives the client and CLI.
- [Developer guide](docs/development.md): see versioning, declaration generation, and verification.
- [Visual guide](docs/index.html): a dependency-free HTML walkthrough of the same flow.

The source code is on [GitHub](https://github.com/keshavsoft/tally-simple), and the published package is on [npm](https://www.npmjs.com/package/tally-simple).
