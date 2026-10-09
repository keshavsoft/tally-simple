# tally-simple

[![npm version](https://img.shields.io/npm/v/tally-simple.svg)](https://www.npmjs.com/package/tally-simple)
[![license](https://img.shields.io/npm/l/tally-simple.svg)](https://github.com/keshavsoft/tally-simple/blob/main/LICENSE)
[![node](https://img.shields.io/badge/node-%3E%3D20.10-brightgreen.svg)](package.json)

A clean, high-level JavaScript client for querying Tally ERP9 and Tally Prime, delivering **schema-transformed, normalized JSON**.

---

## How It Works

`tally-simple` orchestrates the complete journey from raw Tally XML to clean, production-ready JSON:

```text
Your App
   │
   │ calls company(), masters(), vouchers()
   ▼
tally-simple (v9)
   │
   ├──► 1. Calls tally-simple-json
   │       └── queries Tally HTTP server (port 9000) & parses XML to raw JSON
   │
   ├──► 2. Resolves route schema in tally-spec
   │       └── loads declarative transform.instructions
   │
   └──► 3. Compiles output via @keshavsoft/json-transformer
           └── strips XML noise, renames keys, normalizes arrays, unwraps primitives
   │
   ▼
Clean, Business-Ready JSON Object returned to your app
```

### Why Use `tally-simple`?

Raw Tally XML and naive JSON parsing suffer from major developer headaches:
* **XML Artifacts**: Fields are polluted with `@_NAME`, `@_TYPE`, and `#text` object wrappers.
* **Array Inconsistency**: A collection with 1 item returns an Object `{}`; a collection with 2+ items returns an Array `[{}]`.
* **Cluttered Payloads**: Irrelevant audit and empty metadata fields inflate response sizes.

`tally-simple` solves this declaratively:
* **Whitelisted & Renamed**: Only requested fields are retained and cleanly renamed (e.g. `@_NAME` $\rightarrow$ `Name`).
* **Normalized Arrays**: Keys marked with `valueType: "array"` are guaranteed to always be Arrays.
* **Unwrapped Values**: Values wrapped in `{ "#text": "kgs", "@_TYPE": "String" }` are flattened directly to `"kgs"`.

---

## Installation

```bash
npm install tally-simple
```

### Requirements
* **Node.js**: `>= 20.10`
* **Tally**: Tally ERP9 or Tally Prime running locally with XML server enabled (default: `http://localhost:9000`).

---

## API & Usage

```javascript
import { company, masters, vouchers } from "tally-simple";
```

### 1. `company()`
Fetches active company metadata from Tally.
* **Inputs**: Exactly **0 inputs**.
* **Returns**: `Promise<{ Companies: Array<{ Name: string, ReserveName: string }> }>`

```javascript
import { company } from "tally-simple";

const res = await company();
console.log(res);
// Output:
// {
//   Companies: [
//     { Name: "My Company Ltd", ReserveName: "" }
//   ]
// }
```

---

### 2. `masters(path, company)`
Fetches master collections (Units, Stock Items, Ledgers, Groups, Godowns) with normalized structure.
* **Inputs**: Exactly **2 inputs**:
  * `path` *(string)*: Master route (e.g., `"units.all"`, `"stockItems.withBatches"`, `"ledger.all"`, `"godown.all"`).
  * `company` *(string)*: Target Tally company name (e.g., `"mani9"`).
* **Returns**: `Promise<object>`

#### Example: Fetching Units
```javascript
import { masters } from "tally-simple";

const res = await masters("units.all", "mani9");
console.log(res.Units);
// Output:
// [
//   { Name: "kgs", ReserveName: "" },
//   { Name: "mtr", ReserveName: "" },
//   { Name: "Nos", ReserveName: "" }
// ]
```

#### Example: Fetching Stock Items with Batches
```javascript
const res = await masters("stockItems.withBatches", "mani9");
console.log(res.StockItems[0]);
// Output:
// {
//   Name: "0.09/30mm",
//   ReserveName: "",
//   Units: "kgs",
//   Batches: [
//     {
//       godownName: "Main Location",
//       BatchName: "Navratan-Rs.1210/-",
//       OpeningBalance: "-9.250 kgs",
//       OpeningValue: 11100,
//       OpeningRate: "1200.00/kgs"
//     }
//   ]
// }
```

---

### 3. `vouchers(path, company, fromDate, toDate)`
Fetches transactional vouchers for a specified date range with clean, structured inventory and ledger entries.
* **Inputs**: Exactly **4 inputs**:
  * `path` *(string)*: Voucher route (e.g., `"sales.fetch"`, `"purchases.fetch"`).
  * `company` *(string)*: Target Tally company name (e.g., `"mani9"`).
  * `fromDate` *(string)*: Start date in `YYYYMMDD` format (e.g., `"20260401"`).
  * `toDate` *(string)*: End date in `YYYYMMDD` format (e.g., `"20260430"`).
* **Returns**: `Promise<{ Vouchers: Array<object> }>`

```javascript
import { vouchers } from "tally-simple";

const res = await vouchers("sales.fetch", "mani9", "20260401", "20260430");
console.log(`Found ${res.Vouchers.length} vouchers:`);
console.log(res.Vouchers[0]);
// Output:
// {
//   Date: 20260430,
//   VoucherTypeName: "Sales/CA",
//   PartyLedgerName: "Cash",
//   VoucherNumber: 110,
//   Amount: -3555,
//   InventoryEntries: [
//     {
//       StockItemName: "Superline Connected",
//       Rate: "700.00/kgs",
//       Amount: 350,
//       ActualQty: "0.500 kgs",
//       BilledQty: "0.500 kgs",
//       Batches: [
//         { godownName: "Main Location", BatchName: "0.80-Wh-5*100-Rs.505", Amount: 350 }
//       ]
//     }
//   ],
//   LedgerEntries: [
//     { LedgerName: "Cash", Amount: -3555 },
//     { LedgerName: "Sales", Amount: 3555 }
//   ]
// }
```

---

## Documentation

* [API Reference](docs/api.md)
* [Architecture & Transformation Pipeline](docs/architecture.md)

---

## License

MIT © KeshavSoft
