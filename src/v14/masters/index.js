import { noCompany } from "tally-http-json";

const masters = async (collectionName) => {
    const rawResponse = await noCompany(collectionName);
    console.log("rawResponse : ", rawResponse?.data?.collection[0]);

    const companyNames = rawResponse?.data?.collection.map(element => {
        return element?.metadata?.name;
    });

    return companyNames;
};

export default masters;
