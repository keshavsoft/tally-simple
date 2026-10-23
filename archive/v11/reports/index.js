import { tdl } from "tally-http-json";
import tallySpec from "tally-spec";
import jsonTransformer from "json-transformer-found";
import instructions from "./transform.json" with {type: "json"};

const company = async (path) => {
    const tdlmessage = tallySpec?.source?.tally?.reports[path]?.tdlmessage;

    const rawResponse = await tdl("KSAllBatchBalances", tdlmessage);
    rawResponse.data.collection = [rawResponse?.data?.collection[0]];

    const dataAsArray = rawResponse?.data?.collection;


    const fromTransform = jsonTransformer(rawResponse?.data, instructions);

    // const companyNames = rawResponse?.data?.collection.map(element => {
    //     return element?.name?.value;
    // });

    return await fromTransform?.Batches;
};

export default company;
