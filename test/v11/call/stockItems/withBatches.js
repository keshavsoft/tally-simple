import fs from "fs";
import { call } from "../../../../src/index.js";

const run = async () => {
    const batches = await call("masters.stockItems.withBatches", "mani9");
    console.log("batches : ", batches?.StockItems[0]);

    return await batches;
};

run().then(data => { fs.writeFileSync("withBatches.json", JSON.stringify(data)) }).catch(console.error);