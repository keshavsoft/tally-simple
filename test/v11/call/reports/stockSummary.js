import fs from "fs";
import { call } from "../../../../src/index.js";

const run = async () => {
    const stockSummary = await call("reports.stockSummaryWithBatch", "mani9");
    console.log("stockSummary : ", stockSummary[0]);

    return await stockSummary;
};

run().then(data => { fs.writeFileSync("stockSummary.json", JSON.stringify(data)) }).catch(console.error);