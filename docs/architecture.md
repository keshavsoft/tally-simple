# System Architecture

[**View this document as HTML**](./architecture.html) · [**Documentation Hub**](./index.html)

Tally Simple is designed with strict boundaries separating the public contract from the internal execution engines.

---

## Architectural Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                 1. Declarative Specifications               │
│                                                             │
│   src/v7/api.json                 src/v7/source.json        │
│   (Public Route Allowlist)        (TDL Definition Tree)     │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 2. Public Composition Root                  │
│                                                             │
│   src/v7/index.js                                           │
│   (Injects Specifications into Route & Execution Engines)   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 3. Internal Working Engines                 │
│                                                             │
│   internal-working/route/         internal-working/execution│
│   (Object Tree Assembly)          (4-Step Request Pipeline) │
└─────────────────────────────────────────────────────────────┘
```

---

## The Three Layers

### 1. The Declarative Specifications (`src/v7/`)
- **`api.json` (The Allowlist)**: An explicit array of dot-separated string paths that declare the public API boundary (e.g., `["tally.masters.units.fetch", "tally.masters.stockItems.withBatches", ...]`).
- **`source.json` (The Tree of Truth)**: A pure domain tree containing the TDL collection queries (`<TYPE>Unit</TYPE>...`) and actions. It is completely decoupled from transport and contains **no** connection settings or HTTP logic.

### 2. The Public Composition Root (`src/v7/index.js`)
- Acts as the single entry point for the active version.
- Imports `source.json` and `api.json` and injects them directly into the internal route builder:
  ```javascript
  const tally = createRoute({
      inApiPaths: apiPaths,
      inSource: source,
      inExecutor: execute
  });
  ```
- Exports a single, ready-to-use default client object.

### 3. The Internal Working Engines (`src/v7/internal-working/`)
- **`route/`**: Dynamically builds the nested, callable JavaScript object tree based on `api.json` without hardcoding methods.
- **`execution/`**: Executes the runtime query: validates the company argument, retrieves the TDL query from `source.json`, constructs the XML request envelope, and dispatches the HTTP POST request to Tally.

---

## Architectural Principles

1. **Single Source of Truth for Domain Only:**
   `source.json` is the sole authority on *what queries exist and what TDL they request*, not a dumping ground for server URLs or HTTP headers.

2. **Strictly One Export per File:**
   Every module in the codebase adheres to a single default export (`export default startFunc;`).

3. **Explicit Parameter Unwrapping:**
   Every function accepts a single object with `in`-prefixed keys and unwraps them immediately to `local`-prefixed variables:
   ```javascript
   const startFunc = ({ inRoutePath, inCompany, inSource }) => {
       const localRoutePath = inRoutePath;
       const localCompany = inCompany;
       const localSource = inSource;
       // ...
   };
   ```

4. **Zero Runtime Dependencies:**
   Built entirely on standard Node.js built-ins. No intermediate proxy frameworks, no third-party HTTP libraries.
