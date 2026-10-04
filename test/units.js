import assert from "node:assert/strict";
import test from "node:test";
import { findEndpoint, parseArgs } from "../bin/tally-simple.js";

test("CLI parses a path and repeated headers", () => {
    assert.deepEqual(
        parseArgs([
            "masters.units.fetch",
            "--company",
            "Mani9",
            "--url",
            "http://localhost:9000",
            "--header",
            "X-Trace:abc",
            "--header",
            "X-Mode:cli",
            "--timeout",
            "1000"
        ]),
        {
            apiPath: "masters.units.fetch",
            company: "Mani9",
            url: "http://localhost:9000",
            headers: {
                "X-Trace": "abc",
                "X-Mode": "cli"
            },
            timeout: 1000
        }
    );
});

test("CLI accepts paths with or without the tally root", () => {
    const endpoint = () => {};

    assert.equal(
        findEndpoint("masters.units.fetch", {
            masters: { units: { fetch: endpoint } }
        }),
        endpoint
    );
    assert.equal(
        findEndpoint("tally.masters.units.fetch", {
            masters: { units: { fetch: endpoint } }
        }),
        endpoint
    );
});
