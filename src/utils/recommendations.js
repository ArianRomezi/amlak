import connectDB from "@/utils/connectDB";
import Profile from "@/models/Profile";
import SessionView from "@/models/SessionView";

const LIMIT = 4;

// Content-based similarity: category, price within +/-30%, location, shared amenities.
function scoreSimilarity(current, other) {
  let score = 0;

  if (current.category === other.category) {
    score += 10;
  }

  const curPrice = Number(current.price);
  const otherPrice = Number(other.price);
  if (
    curPrice > 0 &&
    otherPrice > 0 &&
    Math.abs(curPrice - otherPrice) / curPrice <= 0.3
  ) {
    score += 10;
  }

  if (current.location === other.location) {
    score += 8;
  }

  const curAmenities = new Set(current.amenities || []);
  const shared = (other.amenities || []).filter((a) => curAmenities.has(a));
  if (shared.length) {
    score += Math.min(shared.length * 2, 6);
  }

  return score;
}

// Collaborative filtering: properties frequently viewed together (co-visitation).
async function getCoViewed(currentId, limit) {
  const sessions = await SessionView.distinct("sessionId", {
    profileId: currentId,
  });
  if (!sessions.length) return [];

  const coViews = await SessionView.aggregate([
    {
      $match: {
        sessionId: { $in: sessions },
        profileId: { $ne: currentId },
      },
    },
    {
      $group: { _id: "$profileId", count: { $sum: 1 } },
    },
    { $sort: { count: -1 } },
    { $limit: limit * 2 },
  ]);

  if (!coViews.length) return [];

  const ids = coViews.map((c) => c._id);
  const profiles = await Profile.find({
    _id: { $in: ids },
    published: true,
  }).select("-userId");

  const countMap = new Map(coViews.map((c) => [c._id.toString(), c.count]));
  return profiles
    .map((p) => ({ profile: p, count: countMap.get(p._id.toString()) || 0 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
    .map((item) => item.profile);
}

export async function getRecommendations(profileId) {
  await connectDB();

  const current = await Profile.findById(profileId);
  if (!current) return null;

  const candidates = await Profile.find({
    _id: { $ne: current._id },
    published: true,
  }).select("-userId");

  // 1) Content-based similar properties.
  const similar = candidates
    .map((p) => ({ profile: p, score: scoreSimilarity(current, p) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, LIMIT)
    .map((item) => item.profile);

  // 2) Collaborative filtering: users also viewed.
  let alsoViewed = await getCoViewed(current._id, LIMIT);

  // Fallback: fill sparse co-visitation data with similar properties.
  const used = new Set(alsoViewed.map((p) => p._id.toString()));
  used.add(current._id.toString());
  similar.forEach((p) => used.add(p._id.toString()));

  if (alsoViewed.length < LIMIT) {
    const fallback = candidates
      .filter((p) => !used.has(p._id.toString()))
      .map((p) => ({ profile: p, score: scoreSimilarity(current, p) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, LIMIT - alsoViewed.length)
      .map((item) => item.profile);
    alsoViewed = [...alsoViewed, ...fallback];
  }

  return { similar, alsoViewed };
}