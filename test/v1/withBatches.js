import tally from "../../src/index.js";

const data = await tally.masters.stockItems.withBatches("mani9")

console.log("units : ", data);
