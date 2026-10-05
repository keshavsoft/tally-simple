# Tally Simple

[![npm version](https://img.shields.io/npm/v/tally-simple.svg)](https://www.npmjs.com/package/tally-simple)
[![license](https://img.shields.io/npm/l/tally-simple.svg)](https://github.com/keshavsoft/tally-simple/blob/main/LICENSE)

A typed JavaScript client and CLI for querying business data from Tally.

Choose a supported query, supply the company name, and receive Tally's raw XML response.

**[Documentation Hub](docs/index.html)** · **[View on npm](https://www.npmjs.com/package/tally-simple)**

---

## The Flow in 30 Seconds

```text
Your Code / CLI
      │  Endpoint path + Company name
      ▼
Tally Simple
      │  Builds TDL XML envelope
      ▼
Tally (http://localhost:9000)
      │
      ▼
Raw XML Response
```

The response is returned directly as raw XML. You can inspect it, pipe it to files or CLI tools, or parse it using JSON wrappers such as `tally-simple-json`.

---

## Installation

```bash
npm install tally-simple
```

Requires Node.js 20+ and a running Tally instance with ODBC/XML server enabled on `http://localhost:9000`.

---

## JavaScript Usage

```javascript
import tally from "tally-simple";

const xml = await tally.masters.units.fetch("Mani9");
console.log(xml);
```

Every query accepts a company name and returns a Promise that resolves to the XML string response from Tally.

---

## Command Line Usage

Run any query directly using `npx`:

```bash
npx tally-simple masters.units.fetch --company Mani9
```

Pipe output to a file:

```bash
npx tally-simple masters.units.fetch --company Mani9 > units.xml
```

You can also include the `tally.` prefix:

```bash
npx tally-simple tally.masters.stockItems.withBatches --company Mani9
```

---

## Available Queries

| Query Path | Returns |
| :--- | :--- |
| `masters.units.fetch` | Units and their names / aliases |
| `masters.stockItems.withBatches` | Stock items, base units, and batch allocations |
| `masters.ledgers.withGstDetails` | Ledgers and GST registration details |
| `masters.stockGroup.withParent` | Stock groups and their parent groups |

---

## Documentation

Explore the story-driven guides:

- **[Usage Guide](docs/usage.md)** ([HTML](docs/usage.html)): Full JavaScript, TypeScript, and CLI usage.
- **[Available Queries](docs/queries.md)** ([HTML](docs/queries.html)): Endpoint specifications, TDL definitions, and XML responses.
- **[System Architecture](docs/architecture.md)** ([HTML](docs/architecture.html)): Public API boundaries and the domain specification.
- **[Route Engine](docs/route-engine.md)** ([HTML](docs/route-engine.html)): How the callable route tree is assembled.
- **[Execution Pipeline](docs/execution-pipeline.md)** ([HTML](docs/execution-pipeline.html)): The 4-step execution story from validation to HTTP dispatch.
