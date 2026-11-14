import connectDB from "@/utils/connectDB";
import Profile from "@/models/Profile";
import SessionView from "@/models/SessionView";
import fs from "fs";
import path from "path";

const LIMIT = 4;

// --- بخش مربوط به بارگذاری و اجرای مدل XGBoost ---
let modelData = null;
function loadModel() {
  if (!modelData) {
    try {
      const modelPath = path.join(
        process.cwd(),
        "src",
        "utils",
        "xgb_model.json",
      );
      const fileContent = fs.readFileSync(modelPath, "utf8");
      modelData = JSON.parse(fileContent);
    } catch (error) {
      console.error("خطا در بارگذاری فایل مدل XGBoost:", error);
    }
  }
  return modelData;
}

function evaluateTree(tree, features) {
  let currentNodeId = 0;
  const nodes = tree.split_indices;
  const conditions = tree.split_conditions;
  const leftChildren = tree.left_children;
  const rightChildren = tree.right_children;
  const baseWeights = tree.base_weights;

  while (true) {
    if (
      leftChildren[currentNodeId] === -1 &&
      rightChildren[currentNodeId] === -1
    ) {
      return baseWeights[currentNodeId];
    }
    const featureIdx = nodes[currentNodeId];
    const threshold = conditions[currentNodeId];
    const val = features[featureIdx];

    if (val < threshold) {
      currentNodeId = leftChildren[currentNodeId];
    } else {
      currentNodeId = rightChildren[currentNodeId];
    }

    if (currentNodeId === -1 || currentNodeId >= baseWeights.length) {
      return baseWeights[0];
    }
  }
}

// محاسبه امتیاز شباهت با استفاده از مدل یادگیری ماشین XGBoost
function scoreSimilarityWithXGBoost(current, other) {
  const model = loadModel();
  if (!model) return 0;

  // استخراج ۴ ویژگی دقیقاً مشابه اسکریپت پایتون
  const catMatch = current.category === other.category ? 1.0 : 0.0;

  const curPrice = Number(current.price || 0);
  const otherPrice = Number(other.price || 0);
  const priceRatio =
    curPrice > 0 ? Math.abs(curPrice - otherPrice) / curPrice : 0;

  const locMatch = current.location === other.location ? 1.0 : 0.0;

  const curAmenities = new Set(current.amenities || []);
  const shared = (other.amenities || []).filter((a) => curAmenities.has(a));
  const sharedCount = shared.length;

  const features = [catMatch, priceRatio, locMatch, sharedCount];

  // محاسبه امتیاز از تمام درخت‌های مدل
  const trees = model.learner.gradient_booster.model.trees;
  let rawScore = 0;
  for (let i = 0; i < trees.length; i++) {
    rawScore += evaluateTree(trees[i], features);
  }

  // تبدیل خروجی به احتمال (بین ۰ و ۱)
  const probability = 1 / (1 + Math.exp(-rawScore));
  return probability;
}
// --------------------------------------------------

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

  // 1) Content-based similar properties using XGBoost Model.
  const similar = candidates
    .map((p) => ({ profile: p, score: scoreSimilarityWithXGBoost(current, p) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, LIMIT)
    .map((item) => item.profile);

  // 2) Collaborative filtering: users also viewed.
  let alsoViewed = await getCoViewed(current._id, LIMIT);

  // Fallback: fill sparse co-visitation data with ML similar properties.
  const used = new Set(alsoViewed.map((p) => p._id.toString()));
  used.add(current._id.toString());
  similar.forEach((p) => used.add(p._id.toString()));

  if (alsoViewed.length < LIMIT) {
    const fallback = candidates
      .filter((p) => !used.has(p._id.toString()))
      .map((p) => ({
        profile: p,
        score: scoreSimilarityWithXGBoost(current, p),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, LIMIT - alsoViewed.length)
      .map((item) => item.profile);
    alsoViewed = [...alsoViewed, ...fallback];
  }

  return { similar, alsoViewed };
}
