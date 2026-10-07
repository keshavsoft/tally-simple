import { call } from "tally-simple-json";

const startFunc = async ({ inRoutePath, inParam, inSource }) => {
    const localRoutePath = inRoutePath;
    const localParam = inParam;
    const localSource = inSource;

    const rawResponse = await call(localRoutePath,
        localParam);

    return await rawResponse;
};

export default startFunc;
