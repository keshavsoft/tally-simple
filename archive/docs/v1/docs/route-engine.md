# Route Assembly Engine

[**View this document as HTML**](./route-engine.html) · [**Documentation Hub**](./index.html)

The route engine transforms a flat allowlist of string paths (from `api.json`) into an intuitive, nested, callable JavaScript object tree at initialization.

---

## Why Route Assembly?

Consumers expect to call:

```javascript
await tally.masters.units.fetch("Mani9");
```

Rather than manual string dispatch:

```javascript
// Not this:
await execute("tally.masters.units.fetch", "Mani9");
```

The route engine builds this tree dynamically from `api.json` without hardcoding methods.

---

## The Three Narrative Modules

Inside `internal-working/route/`, the responsibility is divided into three small, story-driven files:

```text
internal-working/route/
├── index.js              <-- Coordinator: iterates paths & returns root
├── attachPath.js         <-- Walks tree branches & mounts leaf
└── createLeafHandler.js  <-- Factory creating the callable endpoint
```

---

### 1. The Leaf Factory (`createLeafHandler.js`)

A leaf is the terminal callable function at the end of a route. When the user executes `fetch("Mani9")`, the leaf handler captures the bound route path and delegates execution to the executor:

```javascript
const startFunc = ({ inPath, inSource, inExecutor }) => {
    const localPath = inPath;
    const localSource = inSource;
    const localExecutor = inExecutor;

    return async (inCompany) => {
        const localCompany = inCompany;

        return await localExecutor({
            inRoutePath: localPath,
            inCompany: localCompany,
            inSource: localSource
        });
    };
};

export default startFunc;
```

---

### 2. Path Attacher (`attachPath.js`)

To attach a path like `"tally.masters.units.fetch"`:
1. Split the path into branch segments (`["tally", "masters", "units"]`) and a leaf name (`"fetch"`).
2. Walk through the branch segments, creating intermediate objects if they don't yet exist.
3. Attach the callable leaf handler at the target position.

```javascript
import createLeafHandler from "./createLeafHandler.js";

const startFunc = ({ inTree, inPath, inSource, inExecutor }) => {
    const localTree = inTree;
    const localPath = inPath;
    const localSource = inSource;
    const localExecutor = inExecutor;

    const parts = localPath.split(".");
    const leafName = parts.pop();

    let branch = localTree;
    for (const segment of parts) {
        branch[segment] ??= {};
        branch = branch[segment];
    }

    branch[leafName] = createLeafHandler({
        inPath: localPath,
        inSource: localSource,
        inExecutor: localExecutor
    });
};

export default startFunc;
```

---

### 3. Route Coordinator (`index.js`)

The entry coordinator iterates each path in `inApiPaths`, mounts it into the tree using `attachPath`, and returns the root namespace:

```javascript
import attachPath from "./attachPath.js";

const startFunc = ({ inApiPaths, inSource, inExecutor }) => {
    const localApiPaths = inApiPaths;
    const localSource = inSource;
    const localExecutor = inExecutor;

    const tree = {};

    for (const path of localApiPaths) {
        attachPath({
            inTree: tree,
            inPath: path,
            inSource: localSource,
            inExecutor: localExecutor
        });
    }

    const rootNamespace = localApiPaths[0]?.split(".")[0];

    return rootNamespace ? tree[rootNamespace] : tree;
};

export default startFunc;
```

---

## Benefits of this Design

- **Predictable:** Built once at module load time. Zero runtime overhead during queries.
- **Narrative-Driven:** Every file is under 40 lines and has a single, obvious purpose.
- **Strictly One Export:** Every file uses `export default startFunc;`.
