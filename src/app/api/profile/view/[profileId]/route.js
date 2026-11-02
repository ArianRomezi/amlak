import connectDB from "@/utils/connectDB";
import Profile from "@/models/Profile";
import SessionView from "@/models/SessionView";
import { NextResponse } from "next/server";

// Lightweight collaborative-filtering signal: logs that a session viewed a property.
// The unique index on (sessionId, profileId) deduplicates repeated visits within a session.
export async function POST(req, context) {
  const { profileId } = context.params;

  try {
    await connectDB();

    const profile = await Profile.findById(profileId);
    if (!profile) {
      return NextResponse.json({ error: "آگهی یافت نشد" }, { status: 404 });
    }

    const sessionId = req.headers.get("x-session-id");
    if (!sessionId) {
      return NextResponse.json({ message: "session-id missing" }, { status: 200 });
    }

    await SessionView.updateOne(
      { sessionId, profileId: profile._id },
      {
        $setOnInsert: {
          sessionId,
          profileId: profile._id,
          userAgent: req.headers.get("user-agent") || undefined,
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ message: "ok" }, { status: 200 });
  } catch (error) {
    // Unique index race or DB hiccup — never break the page for tracking.
    console.log("view track error:", error.message);
    return NextResponse.json({ message: "ok" }, { status: 200 });
  }
}