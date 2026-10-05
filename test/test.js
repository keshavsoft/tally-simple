import assert from "node:assert/strict";
import test from "node:test";
import tally from "../src/index.js";

test("the default import exposes the documented API shape", () => {
    assert.equal(typeof tally.masters.units.fetch, "function");
    assert.equal(typeof tally.masters.stockItems.withBatches, "function");
    assert.equal(typeof tally.masters.ledgers.withGstDetails, "function");
    assert.equal(typeof tally.masters.stockGroup.withParent, "function");
});

test("company names are required", async () => {
    await assert.rejects(
        tally.masters.units.fetch(" "),
        { name: "TypeError", message: "Company name is required." }
    );
    await assert.rejects(
        tally.masters.units.fetch(""),
        { name: "TypeError", message: "Company name is required." }
    );
    await assert.rejects(
        tally.masters.units.fetch(123),
        { name: "TypeError", message: "Company name is required." }
    );
});
