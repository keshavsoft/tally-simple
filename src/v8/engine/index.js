import { call } from "tally-simple-json";
import transform from "@keshavsoft/json-transformer";

const startFunc = async ({ inRoutePath, inParam, inSource, inLeafSpec }) => {
    const localRoutePath = inRoutePath;
    const localParam = inParam;
    const localSource = inSource;
    const localLeafSpec = inLeafSpec;

    const rawResponse = await call(localRoutePath,
        localParam);
    const jsonNeeded = rawResponse?.ENVELOPE?.BODY?.DATA?.COLLECTION;
    const transformedResponse = transform(jsonNeeded, localLeafSpec?.transform?.instructions);
    // console.log("localSource: ", jsonNeeded, localLeafSpec?.transform?.instructions, transformedResponse);
    return transformedResponse;
};

export default startFunc;
