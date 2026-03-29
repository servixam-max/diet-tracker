import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Demo mode - return zeros
    if (!user) {
      return NextResponse.json({
        currentStreak: 0,
        longestStreak: 0,
        lastLogDate: null,
        weeklyLogs: [false, false, false, false, false, false, false],
      });
    }

    // Fetch real streak data from Supabase
    const { data: streak } = await supabase
      .from("user_streaks")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!streak) {
      // No streak data - return zeros
      return NextResponse.json({
        currentStreak: 0,
        longestStreak: 0,
        lastLogDate: null,
        weeklyLogs: [false, false, false, false, false, false, false],
      });
    }

    // Calculate weekly logs (last 7 days)
    const today = new Date();
    const weeklyLogs = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      // Check if user logged food on this date
      weeklyLogs.push(dateStr === streak.last_log_date || false);
    }

    return NextResponse.json({
      currentStreak: streak.current_streak || 0,
      longestStreak: streak.longest_streak || 0,
      lastLogDate: streak.last_log_date,
      weeklyLogs,
    });

  } catch (error) {
    console.error("Streak API error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
