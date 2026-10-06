const startFunc = ({ inSource, inRoutePath }) => {
    const localSource = inSource;
    const localRoutePath = inRoutePath;

    const endpoint = localRoutePath
        .split(".")
        .reduce((current, key) => current?.[key], localSource);

    return endpoint?.tdl;
};

export default startFunc;
