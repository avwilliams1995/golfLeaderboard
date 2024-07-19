import { NextRequest, NextResponse } from "next/server";
import scrapeGolfScores from "./golfScraper";

export async function GET(request: NextRequest) {
  console.log("GET request received at /api/scraper");

  try {
    const data = await scrapeGolfScores();
    console.log("Scraping successful, returning data:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error in fetchData controller: ${error}`);
    return new NextResponse(`Error in fetchData controller: ${error}`, {
      status: 500,
    });
  }
}
