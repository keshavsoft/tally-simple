import source from "../source.json" with { type: "json" };
import traverse from "../traverse.js";
import apiPaths from "./api.json" with { type: "json" };

const createApi = (options = {}) => {
    const connection = {
        ...source.tally.connection,
        ...options.connection,
        ...(options.url ? { url: options.url } : {}),
        ...(options.method ? { method: options.method } : {}),
        headers: {
            ...source.tally.connection.headers,
            ...options.connection?.headers,
            ...options.headers
        }
    };
    const request = options.request ?? source.tally.request;
    const fetchImpl = options.fetch ?? globalThis.fetch;
    const clientSource = {
        ...source,
        tally: {
            ...source.tally,
            connection,
            request
        }
    };

    const createFunction = (path) => async (company) => {
        if (typeof company !== "string" || !company.trim()) {
            throw new TypeError("Company name is required.");
        }

        return await traverse(clientSource, "", path, {
            company: company.trim(),
            connection,
            request,
            fetch: fetchImpl,
            timeout: options.timeout
        });
    };

    const root = {};

    for (const path of apiPaths) {
        const parts = path.split(".");
        let current = root;

        parts.forEach((part, index) => {
            const isLast = index === parts.length - 1;

            if (isLast) {
                current[part] = createFunction(path);
                return;
            }

            current[part] ??= {};
            current = current[part];
        });
    }

    const rootName = apiPaths[0]?.split(".")[0];

    return rootName ? root[rootName] : root;
};

export { createApi };
export default createApi();
