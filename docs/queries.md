# Available Queries Reference

[**View this document as HTML**](./queries.html) · [**Documentation Hub**](./index.html)

This document details the queries available in Tally Simple, the underlying TDL requests generated, and the XML data returned.

---

## Master Endpoints Overview

| Query Path | Domain Object | TDL Action |
| :--- | :--- | :--- |
| `tally.masters.units.fetch` | Unit of Measurement | `fetch` |
| `tally.masters.stockItems.withBatches` | Inventory Stock Item | `fetch` |
| `tally.masters.ledgers.withGstDetails` | Accounting Ledger | `fetch` |
| `tally.masters.stockGroup.withParent` | Stock Classification | `fetch` |

---

## 1. Units (`masters.units.fetch`)

Fetches all defined units of measurement in the specified company along with their aliases and names.

### TDL Definition:
```xml
<TYPE>Unit</TYPE>
<FETCH>$$Alias:Name</FETCH>
```

### Usage:
```javascript
const xml = await tally.masters.units.fetch("Mani9");
```

---

## 2. Stock Items with Batches (`masters.stockItems.withBatches`)

Fetches stock items including their base unit of measure and batch allocation details.

### TDL Definition:
```xml
<TYPE>StockItem</TYPE>
<FETCH>$$Alias:Name</FETCH>
<FETCH>BaseUnits</FETCH>
<FETCH>BatchAllocations.*</FETCH>
```

### Usage:
```javascript
const xml = await tally.masters.stockItems.withBatches("Mani9");
```

---

## 3. Ledgers with GST Details (`masters.ledgers.withGstDetails`)

Fetches accounting ledgers including their GST registration details list.

### TDL Definition:
```xml
<TYPE>Ledger</TYPE>
<FETCH>$$Alias:Name</FETCH>
<FETCH>LEDGSTREGDETAILS.LIST</FETCH>
```

### Usage:
```javascript
const xml = await tally.masters.ledgers.withGstDetails("Mani9");
```

---

## 4. Stock Groups with Parent (`masters.stockGroup.withParent`)

Fetches stock groups and their parent group hierarchy.

### TDL Definition:
```xml
<TYPE>StockGroup</TYPE>
<FETCH>$$Alias:Name</FETCH>
<FETCH>Parent</FETCH>
```

### Usage:
```javascript
const xml = await tally.masters.stockGroup.withParent("Mani9");
```

---

## The Request Envelope

Every query is wrapped inside Tally's standard Export Collection XML envelope:

```xml
<ENVELOPE>
  <HEADER>
    <VERSION>1</VERSION>
    <TALLYREQUEST>Export</TALLYREQUEST>
    <TYPE>Collection</TYPE>
    <ID>TDLID</ID>
  </HEADER>
  <BODY>
    <DESC>
      <STATICVARIABLES>
        <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
        <SVCURRENTCOMPANY>{company}</SVCURRENTCOMPANY>
      </STATICVARIABLES>
      <TDL>
        <TDLMESSAGE>
          <COLLECTION NAME="TDLID">
            {collectionBody}
          </COLLECTION>
        </TDLMESSAGE>
      </TDL>
    </DESC>
  </BODY>
</ENVELOPE>
```

Tally Simple dynamically substitutes `{company}` (XML-escaped) and `{collectionBody}` (the TDL collection query) at runtime.
