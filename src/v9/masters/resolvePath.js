/**
 * Story: Masters Route Path Resolution
 * 
 * Prepends the "tally.masters." prefix to the user-supplied sub-route
 * so it maps directly to the canonical route defined in tally-spec schema.
 * 
 * Example:
 *   "units.all" -> "tally.masters.units.all"
 *   "stockItems.withBatches" -> "tally.masters.stockItems.withBatches"
 */
const resolvePath = (path) => {
    return path.startsWith("tally.masters.") ? path : `tally.masters.${path}`;
};

export default resolvePath;
export { resolvePath };
