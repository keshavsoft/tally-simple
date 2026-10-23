import { masters as jsonMasters } from "tally-simple-json";
import { source } from "tally-spec";
import transform from "@keshavsoft/json-transformer";
import resolvePath from "./resolvePath.js";

const getLeafSpec = (sourceObj, dotPath) => {
    const segments = dotPath.split(".");
    let current = sourceObj;
    for (const segment of segments) {
        if (!current || typeof current !== "object") return undefined;
        current = current[segment];
    }
    return current;
};

/**
 * Story: Fetch and Transform Masters from Tally
 * 
 * 1. Calls tally-simple-json masters(path, company) to fetch raw JSON.
 * 2. Resolves canonical spec path in tally-spec (e.g. "units.all" -> source.tally.masters.units.all).
 * 3. Applies @keshavsoft/json-transformer using the transform.instructions from tally-spec.
 * 
 * Inputs:
 * - path: The master sub-route defined in JSON (e.g. "units.all", "stockItems.withBatches")
 * - company: The target company name (e.g. "mani9")
 */
const masters = async (path, company) => {
    const rawResponse = await jsonMasters(path, company);
    const jsonNeeded = rawResponse?.ENVELOPE?.BODY?.DATA?.COLLECTION;

    const fullPath = resolvePath(path);
    const leafSpec = getLeafSpec(source, fullPath);
    const instructions = leafSpec?.transform?.instructions;

    if (!jsonNeeded || !instructions) {
        return jsonNeeded ?? rawResponse;
    };

    const fromTransform = transform(jsonNeeded, instructions);

    return fromTransform;
};

export default masters;
export { masters };
