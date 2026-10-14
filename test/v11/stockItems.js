import fs from "fs";
import { masters } from "../../src/index.js";

const run = async () => {
    console.log("=== Testing tally-simple v9: masters (stockItems.withBatches) ===");
    const batches = await masters("stockItems.withBatches", "mani9");
    console.log("batches : ", batches);

    return await batches;
};

run().then(data => { fs.writeFileSync("withBatches.json", JSON.stringify(data)) }).catch(console.error);
