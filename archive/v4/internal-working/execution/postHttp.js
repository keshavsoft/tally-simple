const defaultUrl = "http://localhost:9000";
const defaultHeaders = {
    "Content-Type": "text/xml"
};

const startFunc = async ({ inXmlBody, inOptions = {} }) => {
    const localXmlBody = inXmlBody;
    const localOptions = inOptions;

    const url = localOptions.url ?? defaultUrl;
    const headers = {
        ...defaultHeaders,
        ...localOptions.connection?.headers,
        ...localOptions.headers
    };
    const fetchImpl = localOptions.fetch ?? globalThis.fetch;
    const timeout = localOptions.timeout;

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
        response = await fetchImpl(url, {
            method: "POST",
            headers: headers,
            body: localXmlBody,
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

export default startFunc;
