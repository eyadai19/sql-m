import crypto from "crypto";
import { DUMMY_EMPLOYEES_TABLE, EmployeeRow } from "./dummyData";

/**
 * Get a deterministic subset of dummy data based on a seed and count.
 * @param seed - A unique key to determine the subset.
 * @param count - Number of rows to return.
 * @returns An array of `EmployeeRow`.
 */
export default function getDummyDataSubset(seed: string, count: number): EmployeeRow[] {
  const rows = DUMMY_EMPLOYEES_TABLE.rows;

  // Hash the seed to a numeric value
  const hash = parseInt(crypto.createHash("md5").update(seed).digest("hex").slice(0, 8), 16);

  // Determine the starting index using the hash
  const startIndex = hash % rows.length;

  // Create the subset deterministically
  const subset: EmployeeRow[] = [];
  for (let i = 0; i < count; i++) {
    const index = (startIndex + i) % rows.length; // Circular index
    subset.push(rows[index]);
  }

  return subset;
}
