import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser({ ignoreAttributes: false });

const startFunc = ({ inXml }) => {
    const localXml = inXml;

    return parser.parse(localXml);
};

export default startFunc;
