import attachPath from "./attachPath.js";

import source from "../../source.json" with { type: "json" };

const startFunc = ({ inApiPaths, inExecutor }) => {
    const localApiPaths = inApiPaths;
    const localSource = source;
    const localExecutor = inExecutor;

    const tree = {};

    for (const path of localApiPaths) {
        attachPath({
            inTree: tree,
            inPath: path,
            inSource: localSource,
            inExecutor: localExecutor
        });
    }

    const rootNamespace = localApiPaths[0]?.split(".")[0];

    return rootNamespace ? tree[rootNamespace] : tree;
};

export default startFunc;
