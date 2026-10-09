# API Reference

`tally-simple` exports three modular async functions: `company`, `masters`, and `vouchers`.

```javascript
import { company, masters, vouchers } from "tally-simple";
```

All functions return Promises resolving to clean, schema-transformed JSON objects compiled via `@keshavsoft/json-transformer`.

---

## 1. `company()`

Fetches the list of active companies loaded in Tally as a normalized array.

### Signature
```typescript
function company(): Promise<{
    Companies: Array<{
        Name: string;
        ReserveName: string;
    }>;
}>
```

- **Arguments**: None (0 inputs).
- **Internal Route**: `tally.company.fetch`
- **Returns**: Promise resolving to an object containing a `Companies` array.

### Example
```javascript
import { company } from "tally-simple";

const res = await company();
console.log(res.Companies);
// Output: [ { Name: "mani9", ReserveName: "" } ]
```

---

## 2. `masters(path, company)`

Fetches and transforms master entities (Units, Stock Items, Ledgers, Stock Groups, Godowns).

### Signature
```typescript
function masters(path: string, company: string): Promise<object>
```

### Arguments
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `path` | `string` | Yes | The master sub-route defined in schema (e.g. `"units.all"`, `"stockItems.withBatches"`, `"ledger.withGstDetails"`) |
| `company` | `string` | Yes | The name of the active company in Tally (e.g. `"mani9"`) |

### Common Master Routes

| Route | Transformed Output Key | Key Features |
| :--- | :--- | :--- |
| `"units.all"` | `Units` | Array of `{ Name, ReserveName }` |
| `"stockItems.all"` | `StockItems` | Array of `{ Name, ReserveName }` |
| `"stockItems.withBaseUnits"` | `StockItems` | Includes unwrapped `Units` string (e.g. `"kgs"`) |
| `"stockItems.withBatches"` | `StockItems` | Includes normalized `Batches` array with `godownName`, `BatchName`, `OpeningBalance`, `OpeningValue`, `OpeningRate` |
| `"ledger.all"` | `Ledgers` | Array of `{ Name, ReserveName }` |
| `"ledger.withGstDetails"` | `Ledgers` | Includes normalized `GstDetails` array with `GSTRegistrationType`, `State`, `GSTIN` |
| `"stockGroup.all"` | `StockGroups` | Array of `{ Name, ReserveName }` |
| `"stockGroup.withParent"` | `StockGroups` | Includes unwrapped `Parent` name |
| `"godown.all"` | `Godowns` | Array of `{ Name, ReserveName }` |
| `"godown.withParent"` | `Godowns` | Includes unwrapped `Parent` name |

### Example
```javascript
import { masters } from "tally-simple";

const res = await masters("stockItems.withBatches", "mani9");
console.log(res.StockItems[0]);
// Output:
// {
//   Name: "0.09/30mm",
//   ReserveName: "",
//   Units: "kgs",
//   Batches: [
//     { godownName: "Main Location", BatchName: "Navratan-Rs.1210/-", OpeningBalance: "-9.250 kgs", OpeningValue: 11100, OpeningRate: "1200.00/kgs" }
//   ]
// }
```

---

## 3. `vouchers(path, company, fromDate, toDate)`

Fetches transactional vouchers for a specified period with structured inventory and ledger entries.

### Signature
```typescript
function vouchers(
    path: string, 
    company: string, 
    fromDate: string, 
    toDate: string
): Promise<{
    Vouchers: Array<{
        Date: number | string;
        VoucherNumber: number | string;
        VoucherTypeName: string;
        PartyLedgerName: string;
        Amount: number;
        InventoryEntries?: Array<{
            StockItemName: string;
            Rate: string;
            Amount: number;
            ActualQty: string;
            BilledQty: string;
            Batches?: Array<{
                godownName: string;
                BatchName: string;
                Amount?: number;
                ActualQty?: string;
                BilledQty?: string;
            }>;
        }>;
        LedgerEntries?: Array<{
            LedgerName: string;
            Amount: number;
        }>;
    }>;
}>
```

### Arguments
| Parameter | Type | Required | Format | Description |
| :--- | :--- | :--- | :--- | :--- |
| `path` | `string` | Yes | String | The voucher route (e.g. `"sales.fetch"`, `"purchases.fetch"`) |
| `company` | `string` | Yes | String | The active company name (e.g. `"mani9"`) |
| `fromDate` | `string` | Yes | `YYYYMMDD` | Period start date (e.g. `"20260401"`) |
| `toDate` | `string` | Yes | `YYYYMMDD` | Period end date (e.g. `"20260430"`) |

### Example
```javascript
import { vouchers } from "tally-simple";

const res = await vouchers("sales.fetch", "mani9", "20260401", "20260430");
console.log(`Retrieved ${res.Vouchers.length} sales vouchers.`);
console.log("First voucher total amount:", res.Vouchers[0].Amount);
console.log("First voucher items:", res.Vouchers[0].InventoryEntries);
```
