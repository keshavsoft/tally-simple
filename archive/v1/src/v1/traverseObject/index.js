import { traverse } from "../traverse.js";

const traverseObject = async (
    specJson,
    relativePath,
    pathToFind,
    context = {}
) => {
    const nextContext = {
        ...context,
        connection: specJson.connection ?? context.connection,
        request: specJson.request ?? context.request
    };

    for (const [key, value] of Object.entries(specJson)) {
        if (key === "connection" || key === "request") continue;

        if (typeof value === "object" && value !== null) {
            const nextPath = relativePath
                ? `${relativePath}.${key}`
                : key;

            const result = await traverse(
                value,
                nextPath,
                pathToFind,
                nextContext
            );

            if (result !== undefined) {
                return result;
            }
        }
    }

    return undefined;
};

export default traverseObject;
