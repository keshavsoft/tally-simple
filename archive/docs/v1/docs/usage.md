# Usage Guide

[**View this document as HTML**](./usage.html) · [**Documentation Hub**](./index.html)

This guide explains how to consume Tally Simple in JavaScript/TypeScript applications and from the command line.

---

## Requirements

- **Node.js**: Version 20.10 or newer.
- **Tally**: A running Tally Prime / ERP instance with the ODBC/XML server enabled on `http://localhost:9000`.

---

## Installation

Add Tally Simple to your project:

```bash
npm install tally-simple
```

The package contains zero runtime dependencies and ships as an ECMAScript Module (ESM).

---

## Using in JavaScript (ESM)

Import the default `tally` client and call any supported query path with a company name:

```javascript
import tally from "tally-simple";

const unitsXml = await tally.masters.units.fetch("Mani9");
console.log(unitsXml);
```

### Supported Query Paths

The client mirrors the hierarchy exposed in the public API:

```javascript
// Units
const units = await tally.masters.units.fetch("Mani9");

// Stock items with batch details
const items = await tally.masters.stockItems.withBatches("Mani9");

// Ledgers with GST registration
const ledgers = await tally.masters.ledgers.withGstDetails("Mani9");

// Stock groups with parent hierarchy
const groups = await tally.masters.stockGroup.withParent("Mani9");
```

---

## TypeScript Support

Tally Simple automatically generates TypeScript declarations (`src/index.d.ts`) directly from the domain specification.

You receive full autocomplete and inline documentation in editors like VS Code:

```typescript
import tally from "tally-simple";

// Editor automatically autocompletes:
// tally.masters.units.fetch
// tally.masters.stockItems.withBatches
// tally.masters.ledgers.withGstDetails
// tally.masters.stockGroup.withParent

const xml: string = await tally.masters.units.fetch("Mani9");
```

---

## Command Line Interface (CLI)

You can run any query path directly from the shell using `npx`:

```bash
npx tally-simple masters.units.fetch --company Mani9
```

### Saving & Piping Output

The CLI writes Tally's raw XML response directly to `stdout`, making it easy to pipe to a file or another command:

```bash
npx tally-simple masters.units.fetch --company Mani9 > units.xml
```

Pipe directly into `xmllint` or formatting utilities:

```bash
npx tally-simple masters.units.fetch --company Mani9 | xmllint --format -
```

---

## Error Handling

Tally Simple provides clear, predictable errors:

1. **Company Name Validation:**
   Passing an empty string or non-string argument throws a `TypeError` before any request is sent:
   ```javascript
   await tally.masters.units.fetch(" "); // Throws: TypeError: Company name is required.
   ```

2. **HTTP Failures:**
   If the Tally server returns an error status (e.g. 500), an error is thrown containing the HTTP status and response body:
   ```text
   Error: Tally request failed with HTTP 500: Tally is unavailable
   ```
