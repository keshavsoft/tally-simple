import { company as jsonCompany } from "tally-simple-json";
import { source } from "tally-spec";
import transform from "@keshavsoft/json-transformer";

/**
 * Story: Fetch and Transform Company List
 * 
 * 1. Queries Tally via tally-simple-json company() (0 external inputs).
 * 2. Extracts the collection payload from ENVELOPE.BODY.DATA.COLLECTION.
 * 3. Transforms raw collection into clean JSON using tally-spec's transform.instructions via @keshavsoft/json-transformer.
 * 
 * Inputs: None (0 inputs)
 */
const company = async () => {
    const rawResponse = await jsonCompany();
    const jsonNeeded = rawResponse?.ENVELOPE?.BODY?.DATA?.COLLECTION;
    const instructions = source?.tally?.company?.fetch?.transform?.instructions;

    if (!jsonNeeded || !instructions) {
        return jsonNeeded ?? rawResponse;
    }

    return transform(jsonNeeded, instructions);
};

export default company;
export { company };
