const escapeXml = (value) => value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;"
}[character]));

const xmlEnvelopeTemplate = `<ENVELOPE>
<HEADER>
<VERSION>1</VERSION>
<TALLYREQUEST>Export</TALLYREQUEST>
<TYPE>Collection</TYPE>
<ID>TDLID</ID>
</HEADER>
<BODY>
<DESC>
<STATICVARIABLES>
<SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
<SVCURRENTCOMPANY>{company}</SVCURRENTCOMPANY>
</STATICVARIABLES>
<TDL>
<TDLMESSAGE>
<COLLECTION NAME="TDLID">
{collectionBody}</COLLECTION>
</TDLMESSAGE>
</TDL>
</DESC>
</BODY>
</ENVELOPE>`;

const startFunc = ({ inCompany, inTdl }) => {
    const localCompany = inCompany;
    const localTdl = inTdl;

    return xmlEnvelopeTemplate
        .replace("{company}", escapeXml(localCompany))
        .replace("{collectionBody}", localTdl?.collection ?? "");
};

export default startFunc;
