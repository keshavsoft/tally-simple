import { vouchers } from "../../../src/index.js";

const run = async () => {
    const res = await vouchers("receipts.show.all", "mani9");

    console.log("Response type:", res);
};

run().catch(console.error);
