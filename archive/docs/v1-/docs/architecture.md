# System Architecture

[**View this document as HTML**](./architecture.html) · [**Documentation Hub**](./index.html)

Tally Simple is designed with strict boundaries separating the public contract from the internal execution engines.

---

## Architectural Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                       Public Perimeter                      │
│                                                             │
│   external-api/api.json ───► external-api/api.js            │
│   (Allowed Paths List)       (Public Client Facade)         │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Internal Working Engines                 │
│                                                             │
│   internal-working/route/     internal-working/execution/   │
│   (Object Tree Assembly)      (4-Step Request Pipeline)     │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Domain Specification                      │
│                                                             │
│   source.json                                               │
│   (TDL Queries & Actions Only)                              │
└─────────────────────────────────────────────────────────────┘
```

---

## The Three Layers

### 1. The Public Perimeter (`external-api/`)
- **`api.json`**: An explicit allowlist array containing only the dot-separated paths that should be exposed to consumers (e.g. `tally.masters.units.fetch`).
- **`api.js`**: Connects `api.json` and `source.json` through the internal route engine and exports a single, ready-to-use client.

### 2. The Internal Engines (`internal-working/`)
- **`route/`**: Assembles the nested, callable JavaScript object tree based on the allowlist.
- **`execution/`**: Executes the runtime query: validates the company argument, retrieves the TDL query from `source.json`, constructs the XML envelope, and sends the HTTP POST request to Tally.

### 3. The Pure Domain Specification (`source.json`)
- `source.json` contains strictly the domain endpoint definitions and their TDL collections.
- It is completely decoupled from transport details. It contains **no** connection settings (`http://localhost:9000`) and **no** XML envelope templates. Those belong strictly inside the execution pipeline.

---

## Architectural Principles

1. **Single Source of Truth for Domain Only:**
   `source.json` is the authority on *what queries exist and what TDL they request*, not a dumping ground for server URLs or HTTP headers.

2. **Strictly One Export per File:**
   Every file in the codebase exports exactly one default export (`export default startFunc;`). Dual/named exports (`export { foo }; export default foo;`) are eliminated.

3. **Explicit Parameter Unwrapping:**
   Every function accepts a single object with `in`-prefixed keys and unwraps them immediately to `local`-prefixed variables:
   ```javascript
   const startFunc = ({ inRoutePath, inCompany }) => {
       const localRoutePath = inRoutePath;
       const localCompany = inCompany;
       ...
   };
   ```

4. **Zero Overhead:**
   No runtime dependencies, no intermediate proxy frameworks, and no recursive tree searches. Every path resolves directly.
