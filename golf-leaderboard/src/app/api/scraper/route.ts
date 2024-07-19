import { NextRequest, NextResponse } from "next/server";
import scrapeGolfScores from "./golfScraper";

export async function GET(request: NextRequest) {
  try {
    const data = await scrapeGolfScores();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in fetchData controller:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
