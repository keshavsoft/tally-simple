import fs from "fs";
import { call, masters } from "../../../../src/index.js";

const run = async () => {
    const stockSummary = await call("reports.stockSummary", "mani9");
    console.log("stockSummary : ", stockSummary);

    return await stockSummary;
};

run().then(data => { fs.writeFileSync("stockSummary.json", JSON.stringify(data)) }).catch(console.error);