import attachPath from "./attachPath.js";

const startFunc = ({ inApiPaths, inSource, inExecutor, inOptions }) => {
    const localApiPaths = inApiPaths;
    const localSource = inSource;
    const localExecutor = inExecutor;
    const localOptions = inOptions;

    const tree = {};

    for (const path of localApiPaths) {
        attachPath({
            inTree: tree,
            inPath: path,
            inSource: localSource,
            inExecutor: localExecutor,
            inOptions: localOptions
        });
    }

    const rootNamespace = localApiPaths[0]?.split(".")[0];

    return rootNamespace ? tree[rootNamespace] : tree;
};

export default startFunc;
