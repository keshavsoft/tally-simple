import assert from "node:assert/strict";
import test from "node:test";
import tally, { createTallyClient } from "../src/index.js";

test("the default import exposes the documented API shape", () => {
    assert.equal(typeof tally.masters.units.fetch, "function");
    assert.equal(typeof tally.masters.stockItems.withBatches, "function");
    assert.equal(typeof tally.masters.ledgers.withGstDetails, "function");
});

test("a client sends a configured, XML-safe request", async () => {
    const calls = [];
    const client = createTallyClient({
        url: "http://tally.example:9000",
        headers: { "X-Request-Id": "test" },
        fetch: async (url, options) => {
            calls.push({ url, options });
            return {
                ok: true,
                status: 200,
                text: async () => "<ENVELOPE><STATUS>1</STATUS></ENVELOPE>"
            };
        }
    });

    const response = await client.masters.units.fetch(" Mani & <9> ");

    assert.equal(response, "<ENVELOPE><STATUS>1</STATUS></ENVELOPE>");
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, "http://tally.example:9000");
    assert.equal(calls[0].options.method, "POST");
    assert.equal(calls[0].options.headers["X-Request-Id"], "test");
    assert.match(calls[0].options.body, /Mani &amp; &lt;9&gt;/);
    assert.match(calls[0].options.body, /<TYPE>Unit<\/TYPE>/);
});

test("company names are required", async () => {
    const client = createTallyClient({
        fetch: async () => ({
            ok: true,
            status: 200,
            text: async () => ""
        })
    });

    await assert.rejects(
        client.masters.units.fetch(" "),
        { name: "TypeError", message: "Company name is required." }
    );
});

test("non-success Tally responses become useful errors", async () => {
    const client = createTallyClient({
        fetch: async () => ({
            ok: false,
            status: 500,
            text: async () => "Tally is unavailable"
        })
    });

    await assert.rejects(
        client.masters.units.fetch("Mani9"),
        { message: "Tally request failed with HTTP 500: Tally is unavailable" }
    );
});

test("requests can be timed out", async () => {
    const client = createTallyClient({
        timeout: 10,
        fetch: async (_url, options) => await new Promise((_resolve, reject) => {
            options.signal.addEventListener("abort", () => {
                reject(new Error("aborted"));
            });
        })
    });

    await assert.rejects(
        client.masters.units.fetch("Mani9"),
        { message: "Tally request timed out after 10 ms." }
    );
});
