# Architecture: The tally-simple Story

`tally-simple` serves as the high-level, business-ready JSON client for Tally Prime and Tally ERP9. It bridges raw XML transport with declarative schema transformation.

---

## 1. The Processing Pipeline

The architecture is cleanly layered across specialized repositories:

```text
Caller Application
       │
       │ calls company(), masters(), or vouchers()
       ▼
tally-simple (v9)
       │
       │ 1. Invokes tally-simple-json
       ▼
tally-simple-json (v31)
       │
       │ 2. Invokes tally-xml-tdl
       ▼
tally-xml-tdl (v31)
       │
       │ 3. Resolves TDL query and builds XML envelope
       ▼
tally-extract
       │
       │ 4. HTTP POST
       ▼
Tally HTTP Server (port 9000)
       │
       │ returns raw XML envelope
       ▼
tally-simple-json (parseXml)
       │
       │ converts XML into raw JSON (preserving @_ attributes)
       ▼
tally-simple (v9)
       │
       │ 5. Loads transform.instructions from tally-spec
       │ 6. Applies @keshavsoft/json-transformer
       ▼
Caller Application receives clean, normalized, business-ready JSON
```

---

## 2. Core Principles

### Pure Declarative Transformations
`tally-simple` contains no hardcoded data reshaping rules. All field mappings, key renaming, type normalizations, and value extractions are declared inside [`tally-spec/source.json`](https://www.npmjs.com/package/tally-spec) under `transform.instructions`.

### Whitelist Filtering & Key Resolution (`alterKey`)
By default, raw Tally XML returns hundreds of empty tags and internal flags. `json-transformer` acts as an automated whitelist: only properties explicitly configured under `transform` in the spec are kept, cleanly renamed via `alterKey`.

### Array Normalization (`valueType: "array"`)
XML-to-JSON parsers cannot determine whether a single child node should be an object or an array. In `tally-simple`, any collection marked with `valueType: "array"` is guaranteed to always be an Array:
```json
// Raw XML parser output (when 1 company is loaded):
{ "COMPANY": { "@_NAME": "mani9" } }

// tally-simple normalized output:
{ "Companies": [ { "Name": "mani9", "ReserveName": "" } ] }
```

### Primitive Value Extraction (`valueKey: "#text"`)
Tally attributes often serialize strings and numbers with XML type wrappers:
```json
// Raw XML parser output:
"BASEUNITS": { "#text": "kgs", "@_TYPE": "String" }

// tally-simple unwrapped output:
"Units": "kgs"
```

---

## 3. Domain Boundaries

The public API is divided into three focused domains:

| Domain | Method | Inputs | Responsibility |
| :--- | :--- | :--- | :--- |
| **`company`** | `company()` | **0 inputs** | Queries `tally.company.fetch` and normalizes company list |
| **`masters`** | `masters(path, company)` | **2 inputs** (`path`, `company`) | Resolves `tally.masters.<path>` in spec and normalizes master entity collections |
| **`vouchers`** | `vouchers(path, company, fromDate, toDate)` | **4 inputs** (`path`, `company`, `fromDate`, `toDate`) | Resolves `tally.vouchers.<path>` in spec and normalizes transaction vouchers |

---

## 4. Separation of Concerns across Sister Repositories

| Repository | Responsibility | Returns |
| :--- | :--- | :--- |
| **`tally-xml-tdl`** | TDL string generation and Tally query envelope construction | Raw XML string |
| **`tally-simple-json`** | Direct XML-to-JSON parsing via `fast-xml-parser` | Raw JSON object (with XML noise) |
| **`tally-spec`** | Schema contracts, TDL definitions, and `transform.instructions` | Spec definitions |
| **`tally-simple`** | High-level client compiling raw JSON against `tally-spec` via `json-transformer` | **Clean, normalized business JSON** |
