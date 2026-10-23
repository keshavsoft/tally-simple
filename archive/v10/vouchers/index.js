import { vouchers as jsonVouchers } from "tally-simple-json";
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
 * Story: Fetch and Transform Vouchers from Tally
 * 
 * 1. Calls tally-simple-json vouchers(path, company, fromDate, toDate) to fetch raw JSON.
 * 2. Resolves canonical spec path in tally-spec (e.g. "sales.fetch" -> source.tally.vouchers.sales.fetch).
 * 3. Applies @keshavsoft/json-transformer using the transform.instructions from tally-spec.
 * 
 * Inputs:
 * - path: The voucher route defined in JSON (e.g. "sales.fetch", "purchases.fetch")
 * - company: The target company name (e.g. "mani9")
 * - fromDate: Period start date (e.g. "20260401")
 * - toDate: Period end date (e.g. "20260401")
 */
const vouchers = async (path, company, fromDate, toDate) => {
    const rawResponse = await jsonVouchers(path, company, fromDate, toDate);
    const jsonNeeded = rawResponse?.ENVELOPE?.BODY?.DATA?.COLLECTION;

    const fullPath = resolvePath(path);
    const leafSpec = getLeafSpec(source, fullPath);
    const instructions = leafSpec?.transform?.instructions;

    if (!jsonNeeded || !instructions) {
        return jsonNeeded ?? rawResponse;
    }

    return transform(jsonNeeded, instructions);
};

export default vouchers;
export { vouchers };
