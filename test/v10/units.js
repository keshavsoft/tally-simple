import { masters } from "../../src/index.js";

const run = async () => {
    console.log("=== Testing tally-simple v9: masters (units.all) ===");
    const res = await masters("units.all", "mani9");
    console.log("Response type:", typeof res);
    console.log("Transformed output:", JSON.stringify(res, null, 2));

    if (res?.Units && Array.isArray(res.Units)) {
        console.log("SUCCESS: Units is an Array with", res.Units.length, "item(s).");
    } else {
        console.log("FAILED: Expected Units array in output.");
    }
};

run().catch(console.error);
