import createLeafHandler from "./createLeafHandler.js";

const startFunc = ({ inTree, inPath, inSource, inExecutor }) => {
    const localTree = inTree;
    const localPath = inPath;
    const localSource = inSource;
    const localExecutor = inExecutor;

    const parts = localPath.split(".");
    const leafName = parts.pop();

    let branch = localTree;
    for (const segment of parts) {
        branch[segment] ??= {};
        branch = branch[segment];
    }

    branch[leafName] = createLeafHandler({
        inPath: localPath,
        inSource: localSource,
        inExecutor: localExecutor
    });
};

export default startFunc;
