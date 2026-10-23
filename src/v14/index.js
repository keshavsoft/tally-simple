import company from "./company/index.js";
import masters from "./masters/index.js";
import vouchers from "./vouchers/index.js";
import reports from "./reports/index.js";

const call = async (input, companyName) => {
    const route = String(input ?? "").trim();
    const normalized = route.replace(/^tally\./i, "");
    const splitArray = normalized.split(".");
    const firstSegment = splitArray[0]?.trim();

    if (!firstSegment) {
        throw new Error("Missing route input");
    };

    if (firstSegment === "company") {
        return await company();
    };

    if (firstSegment === "masters") {
        return await masters(splitArray[1]);
    };

    if (firstSegment === "reports") {
        splitArray.shift();

        return await reports(splitArray.join("."));
    };

    if (firstSegment === "vouchers") {
        splitArray.shift();

        return await vouchers(splitArray.join("."));
    };

    throw new Error(`Unsupported route: ${input}`);
};

export { company, masters, vouchers, call };
export default { company, masters, vouchers, call };
