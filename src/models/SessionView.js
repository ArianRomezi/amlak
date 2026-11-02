import { Schema, model, models } from "mongoose";

const sessionViewSchema = new Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    profileId: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    userAgent: {
      type: String,
    },
  },
  { timestamps: true }
);

// A session should count only once per property.
sessionViewSchema.index({ sessionId: 1, profileId: 1 }, { unique: true });
// Auto-expire old tracking data after 90 days so the collection stays lean.
sessionViewSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

const SessionView = models.SessionView || model("SessionView", sessionViewSchema);
export default SessionView;
