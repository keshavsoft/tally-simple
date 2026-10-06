import traverseObject from "./traverseObject/index.js";

const escapeXml = (value) => value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;"
}[character]));

const buildRequestBody = (requestBody, { company, collection }) => {
    return requestBody
        .replace("{company}", escapeXml(company))
        .replace("{collectionBody}", collection);
};

const execute = async (connection, xml, fetchImpl, timeout) => {
    if (typeof fetchImpl !== "function") {
        throw new Error(
            "No fetch implementation is available. Use Node.js 20+ or provide fetch to createTallyClient()."
        );
    }

    const controller = typeof AbortController === "function"
        ? new AbortController()
        : undefined;
    const timeoutId = Number.isFinite(timeout) && timeout > 0
        ? setTimeout(() => controller?.abort(), timeout)
        : undefined;

    let response;

    try {
        response = await fetchImpl(connection.url, {
            method: connection.method,
            headers: connection.headers,
            body: xml,
            ...(controller ? { signal: controller.signal } : {})
        });
    } catch (error) {
        if (controller?.signal.aborted) {
            throw new Error(`Tally request timed out after ${timeout} ms.`, {
                cause: error
            });
        }

        throw error;
    } finally {
        if (timeoutId) clearTimeout(timeoutId);
    }

    const responseText = await response.text();

    if (!response.ok) {
        throw new Error(
            `Tally request failed with HTTP ${response.status}: ${responseText}`
        );
    }

    return responseText;
};

const traverse = async (
    raka,
    relativePath,
    pathToFind,
    context = {}
) => {
    if (relativePath === pathToFind) {
        if (raka?.action === "fetch") {
            const body = buildRequestBody(
                context.request.body,
                {
                    company: context.company,
                    collection: raka.tdl.collection
                }
            );

            return await execute(
                context.connection,
                body,
                context.fetch,
                context.timeout
            );
        }

        return raka;
    }

    if (typeof raka === "object" && raka !== null) {
        return await traverseObject(
            raka,
            relativePath,
            pathToFind,
            context
        );
    }

    return undefined;
};

export { traverse };
export default traverse;
