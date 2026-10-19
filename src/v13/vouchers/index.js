import { tdl } from "tally-http-json";
import { source } from "tally-spec";
import jsonTransformer from "json-transformer-found";
import instructions from "./transform.json" with {type: "json"};

const getLeafSpec = (sourceObj, dotPath) => {
    const segments = dotPath.split(".");
    let current = sourceObj;
    for (const segment of segments) {
        if (!current || typeof current !== "object") return undefined;
        current = current[segment];
    }
    return current;
};

const company = async (path) => {
    console.log("path : ", path);

    const leafSpec = getLeafSpec(source, `tally.vouchers.${path}`);

    const tdlmessage = leafSpec?.tdlmessage;
    console.log("tdlmessage : ", leafSpec);

    const rawResponse = await tdl(leafSpec?.resource, tdlmessage);

    const fromTransform = jsonTransformer({ Receipts: rawResponse?.data?.collection }, instructions);

    return await fromTransform;
};

export default company;