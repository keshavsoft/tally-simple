const startFunc = ({ inCompany }) => {
    const localCompany = inCompany;

    if (typeof localCompany !== "string" || !localCompany.trim()) {
        throw new TypeError("Company name is required.");
    }

    return localCompany.trim();
};

export default startFunc;
