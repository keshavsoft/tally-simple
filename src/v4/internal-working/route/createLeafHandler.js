const startFunc = ({ inPath, inSource, inExecutor, inOptions }) => {
    const localPath = inPath;
    const localSource = inSource;
    const localExecutor = inExecutor;
    const localOptions = inOptions;

    return async (inCompany) => {
        const localCompany = inCompany;

        return await localExecutor({
            inRoutePath: localPath,
            inCompany: localCompany,
            inSource: localSource,
            inOptions: localOptions
        });
    };
};

export default startFunc;
