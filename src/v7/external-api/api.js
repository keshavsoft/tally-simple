/**
 * tally-simple (v5)
 *
 * Public Entry Point:
 *  Connects the public allowlist (api.json) and domain specification (source.json)
 *  through the internal-working route and execution engines.
 */

import source from "../source.json" with { type: "json" };
import apiPaths from "./api.json" with { type: "json" };

import createRoute from "../internal-working/route/index.js";
import execute from "../internal-working/execution/index.js";

const tally = createRoute({
    inApiPaths: apiPaths,
    inSource: source,
    inExecutor: execute
});

export default tally;
