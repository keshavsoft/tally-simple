import { masters } from "../../src/index.js";

const run = async () => {
    console.log("=== Testing tally-simple v9: masters (stockItems.withBatches) ===");
    const res = await masters("stockItems.withBatches", "mani9");
    console.log("Response type:", typeof res);

    const items = res?.StockItems;
    const isArray = Array.isArray(items);
    console.log("Is StockItems array:", isArray);
    console.log("StockItems count:", isArray ? items.length : 0);

    if (isArray && items.length > 0) {
        console.log("First item sample:", JSON.stringify(items[0], null, 2));
        console.log("SUCCESS: StockItems with batches transformed cleanly.");
    } else {
        console.log("Transformed output:", JSON.stringify(res, null, 2));
    }
};

run().catch(console.error);
