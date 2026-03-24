import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "1.0.0",
    features: {
      pwa: true,
      offline: true,
      notifications: true,
      analytics: true,
      achievements: true,
      theme: true,
      units: true,
    },
  });
}
