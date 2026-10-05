import validateCompany from "./validateCompany.js";
import getTdl from "./getTdl.js";
import buildXmlBody from "./buildXmlBody.js";
import postHttp from "./postHttp.js";

const startFunc = async ({ inRoutePath, inCompany, inSource, inOptions }) => {
    const localRoutePath = inRoutePath;
    const localCompany = inCompany;
    const localSource = inSource;
    const localOptions = inOptions;

    const companyName = validateCompany({
        inCompany: localCompany
    });

    const tdl = getTdl({
        inSource: localSource,
        inRoutePath: localRoutePath
    });

    const xmlBody = buildXmlBody({
        inCompany: companyName,
        inTdl: tdl
    });

    return await postHttp({
        inXmlBody: xmlBody,
        inOptions: localOptions
    });
};

export default startFunc;
