import { vouchers } from "../../../src/index.js";

const run = async () => {
    console.log("=== Testing tally-simple v9: vouchers (sales.fetch) ===");
    const res = await vouchers("sales.fetch", "mani9", "20260430", "20260430");
    console.log("Response type:", typeof res);

    const vchList = res?.Vouchers;
    const isArray = Array.isArray(vchList);
    console.log("Is Vouchers array:", isArray);
    console.log("Vouchers count:", isArray ? vchList.length : (vchList ? 1 : 0));

    if (isArray && vchList.length > 0) {
        console.log("First voucher sample:", JSON.stringify(vchList[0], null, 2));
        console.log("SUCCESS: Vouchers array received with clean fields.");
    } else {
        console.log("Transformed output:", JSON.stringify(res, null, 2));
    }
};

run().catch(console.error);
