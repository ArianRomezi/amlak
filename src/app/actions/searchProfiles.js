"use server";

import connectDB from "@/utils/connectDB";
import Profile from "@/models/Profile";

/**
 * Search profiles by title.
 *
 * All keywords (space-separated) must exist inside the `title` field,
 * matched case-insensitively via a $and of regexes.
 *
 * @param {string} query - raw search string from the user
 * @returns {{ profiles: Array, error: string|null }}
 */
export async function searchProfiles({ query }) {
  await connectDB();

  const keywords = String(query ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (keywords.length === 0) {
    return { profiles: [], error: null };
  }

  // Escape regex metacharacters so user input can't alter the query / cause ReDoS.
  const escapeRegExp = (value) =>
    value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const andConditions = keywords.map((keyword) => ({
    title: { $regex: escapeRegExp(keyword), $options: "i" },
  }));

  const profiles = await Profile.find({ $and: andConditions })
    .sort({ createdAt: -1 })
    .lean();

  return { profiles, error: null };
}
