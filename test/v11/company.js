import { company } from "../../src/index.js";

const run = async () => {
    console.log("=== Testing tally-simple v9: company (0 inputs) ===");
    const res = await company();
    console.log("Response type:", typeof res);
    console.log("Transformed output:", JSON.stringify(res, null, 2));
    if (res?.Companies && Array.isArray(res.Companies)) {
        console.log("SUCCESS: Companies is an Array with", res.Companies.length, "item(s).");
    } else {
        console.log("FAILED: Expected Companies array in output.");
    }
};

run().catch(console.error);
