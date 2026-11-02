import { NextResponse } from "next/server";
import { getRecommendations } from "@/utils/recommendations";

// Reads a dynamic [profileId] param and queries MongoDB — never statically generated.
export const dynamic = "force-dynamic";

export async function GET(req, context) {
  const { profileId } = context.params;

  try {
    const result = await getRecommendations(profileId);
    if (!result) {
      return NextResponse.json({ error: "آگهی یافت نشد" }, { status: 404 });
    }
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log("recommendations error:", error.message);
    return NextResponse.json(
      { error: "مشکلی در سرور رخ داده است" },
      { status: 500 }
    );
  }
}