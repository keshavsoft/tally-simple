import tally from "../../src/index.js";

const data = await tally.masters.units.fetch("mani9");

console.log("units : ", data);
