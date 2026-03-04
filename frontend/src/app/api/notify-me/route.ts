import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, find, create } from "@/lib/strapi/api";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function POST(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { feature } = await request.json();

  if (!feature || typeof feature !== "string") {
    return NextResponse.json(
      { error: "feature is required" },
      { status: 400 }
    );
  }

  // Check if already subscribed
  const existing = await find("feature-notifications", {
    filters: {
      user: { id: { $eq: user.id } },
      feature: { $eq: feature },
    },
  });

  if (existing?.length) {
    return NextResponse.json({ message: "Already subscribed" });
  }

  try {
    await create("feature-notifications", {
      user: user.id,
      feature,
    });
    return NextResponse.json({ message: "Subscribed successfully" });
  } catch {
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await find("feature-notifications", {
    filters: { user: { id: { $eq: user.id } } },
    fields: ["feature"],
  });

  return NextResponse.json({
    features: (data ?? []).map((d: any) => d.feature),
  });
}
