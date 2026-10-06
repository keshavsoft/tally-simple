import attachPath from "./attachPath.js";

const startFunc = ({ inApiPaths, inSource, inExecutor }) => {
    const localApiPaths = inApiPaths;
    const localSource = inSource;
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
