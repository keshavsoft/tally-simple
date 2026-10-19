import { tdl } from "tally-http-json";
import tallySpec from "tally-spec";
import jsonTransformer from "json-transformer-found";
import instructions from "./transform.json" with {type: "json"};

const company = async (path) => {
    const tdlmessage = tallySpec?.source?.tally?.reports[path]?.tdlmessage;

    const rawResponse = await tdl("KSAllBatchBalances", tdlmessage);

    const fromTransform = jsonTransformer(rawResponse?.data, instructions);

    return await fromTransform?.Batches;
};

export default company;