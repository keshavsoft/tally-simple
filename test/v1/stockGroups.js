import tally from "../../src/index.js";

const data = await tally.masters.stockGroup.withParent("mani9")

console.log("units : ", data);
