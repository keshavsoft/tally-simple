import { noCompany } from "tally-http-json";

const company = async () => {
    const rawResponse = await noCompany("Company");
    // console.log("rawResponse : ", rawResponse);

    const companyNames = rawResponse?.data?.collection.map(element => {
        return element?.name?.value;
    });

    return companyNames;
};

export default company;
