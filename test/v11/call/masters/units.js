import fs from "fs";
import { call } from "../../../../src/index.js";

const run = async () => {
    const batches = await call("masters.Unit", "mani9");
    console.log("batches : ", batches[0]);

    return await batches;
};

run().then(data => { fs.writeFileSync("withBatches.json", JSON.stringify(data)) }).catch(console.error);