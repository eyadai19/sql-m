import crypto from "crypto";

/**
 * Get a deterministic subset of dummy data based on a seed and count.
 * @param rows - The source data to sample from.
 * @param seed - A unique key to determine the subset.
 * @param count - Number of rows to return.
 * @returns An array of `T`.
 */
function getDummyDataSubset<T>(rows: T[], seed: string | undefined, count: number): T[] {
  if (!rows || rows.length === 0) {
    return [];
  }

  // Use a default seed if none is provided or if it's empty
  const safeSeed = seed?.trim() || 'default-seed-' + Date.now().toString();

  // Hash the seed to a numeric value
  const hash = parseInt(crypto.createHash("md5").update(safeSeed).digest("hex").slice(0, 8), 16);

  // Determine the starting index using the hash
  const startIndex = hash % rows.length;

  // Create the subset deterministically
  const subset: T[] = [];
  for (let i = 0; i < count; i++) {
    const index = (startIndex + i) % rows.length; // Circular index
    subset.push(rows[index]);
  }

  return subset;
}

export default getDummyDataSubset;