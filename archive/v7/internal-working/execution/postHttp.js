const url = "http://localhost:9000";
const headers = {
    "Content-Type": "text/xml"
};

const startFunc = async ({ inXmlBody }) => {
    const localXmlBody = inXmlBody;

    const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: localXmlBody
    });

    const responseText = await response.text();

    if (!response.ok) {
        throw new Error(
            `Tally request failed with HTTP ${response.status}: ${responseText}`
        );
    }

    return responseText;
};

export default startFunc;
