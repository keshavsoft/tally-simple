import fs from "node:fs";
import path from "node:path";

const rootDir = new URL(".", import.meta.url);
const apiFile = new URL("./src/v1/external-api/api.json", rootDir);
const sourceFile = new URL("./src/v1/source.json", rootDir);
const outputFile = new URL("./src/index.d.ts", rootDir);

const apiPaths = JSON.parse(fs.readFileSync(apiFile, "utf8"));
const source = JSON.parse(fs.readFileSync(sourceFile, "utf8"));

const getByPath = (object, pathString) => pathString.split(".").reduce(
    (current, key) => current?.[key],
    object
);

const tree = {};

for (const apiPath of apiPaths) {
    if (typeof apiPath !== "string" || !apiPath.trim()) {
        throw new Error("Every API path must be a non-empty string.");
    }

    const endpoint = getByPath(source, apiPath);

    if (endpoint === undefined) {
        throw new Error(`API path does not exist in source.json: ${apiPath}`);
    }

    const parts = apiPath.split(".");
    let current = tree;

    parts.forEach((part, index) => {
        current[part] ??= {};

        if (index === parts.length - 1) {
            current[part].__endpoint = true;
            current[part].__action = endpoint.action;
        }

        current = current[part];
    });
}

const renderTree = (node, level = 0) => {
    const indent = "    ".repeat(level);
    const childIndent = "    ".repeat(level + 1);
    const lines = ["{"];

    for (const [key, value] of Object.entries(node)) {
        if (key.startsWith("__")) continue;

        const isEndpoint = value.__endpoint === true;
        const action = value.__action;
        const nestedKeys = Object.keys(value).filter(
            (childKey) => !childKey.startsWith("__")
        );

        if (isEndpoint && nestedKeys.length === 0) {
            const signature = action === "fetch"
                ? "(company: string) => Promise<string>"
                : "() => Promise<unknown>";

            lines.push(`${childIndent}${key}: ${signature};`);
            continue;
        }

        lines.push(`${childIndent}${key}: ${renderTree(value, level + 1)};`);
    }

    lines.push(`${indent}}`);
    return lines.join("\n");
};

const rootName = Object.keys(tree)[0];

if (!rootName) {
    throw new Error("api.json does not contain any public API paths.");
}

const apiType = renderTree(tree[rootName]);
const declaration = `export interface TallyClientOptions {
    url?: string;
    method?: string;
    headers?: Record<string, string>;
    timeout?: number;
    fetch?: (url: string, options: {
        method: string;
        headers: Record<string, string>;
        body: string;
        signal?: unknown;
    }) => Promise<{
        ok: boolean;
        status: number;
        text: () => Promise<string>;
    }>;
}

export type TallyApi = ${apiType};

declare const ${rootName}: TallyApi;

export declare const createTallyClient: (options?: TallyClientOptions) => TallyApi;
export declare const tally: TallyApi;
export default ${rootName};
`;
fs.writeFileSync(outputFile, declaration);
console.log(`Generated ${path.basename(outputFile.pathname)} from src/v1/external-api/api.json`);
