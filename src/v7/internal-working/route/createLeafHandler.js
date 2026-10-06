const startFunc = ({ inPath, inSource, inExecutor }) => {
    const localPath = inPath;
    const localSource = inSource;
    const localExecutor = inExecutor;

    return async (inCompany) => {
        const localCompany = inCompany;

        return await localExecutor({
            inRoutePath: localPath,
            inCompany: localCompany,
            inSource: localSource
        });
    };
};

export default startFunc;
