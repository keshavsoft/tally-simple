import apiTree, { createCaller } from "@keshavsoft/api-tree";
import { source, apiPaths } from "tally-spec";

import execute from "./engine/index.js";

const tree = apiTree(source, apiPaths, execute);
const app = tree.tally ?? tree;

// Keep the package's historical root API while retaining the explicit
// `app.tally` form exposed by @keshavsoft/api-tree.
if (!app.tally) {
    Object.defineProperty(app, "tally", {
        value: app,
        enumerable: false
    });
}

const call = createCaller({ inSource: source, inExecutor: execute });

export default app;
export { app, call };
