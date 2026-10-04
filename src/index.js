import { createApi } from "./v3/index.js";

const createTallyClient = (options = {}) => createApi(options);

const tally = createTallyClient();

export { createTallyClient, tally };
export default tally;
