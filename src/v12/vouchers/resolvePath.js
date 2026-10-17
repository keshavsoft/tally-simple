/**
 * Story: Vouchers Route Path Resolution
 * 
 * Prepends the "tally.vouchers." prefix to the incoming voucher path
 * so it maps directly to the canonical route defined in tally-spec schema.
 * 
 * Example:
 *   "sales.fetch" -> "tally.vouchers.sales.fetch"
 *   "purchases.fetch" -> "tally.vouchers.purchases.fetch"
 */
const resolvePath = (path) => {
    return path.startsWith("tally.vouchers.") ? path : `tally.vouchers.${path}`;
};

export default resolvePath;
export { resolvePath };
