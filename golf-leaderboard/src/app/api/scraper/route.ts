import { NextRequest, NextResponse } from "next/server";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";

export async function POST(request: NextRequest) {
  console.log("GET request received at /api/scraper");

  const url = "https://www.espn.com/golf/leaderboard";
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
  };
  interface Team {
    name: string;
    golfer: string;
    score: number | string;
    thru?: number | string;
  }

  const teams: Team[] = [
    { name: "Harry", golfer: "Xander Schauffele", score: 0, thru: "N/A" },
    { name: "Topping", golfer: "Brooks Koepka", score: 0, thru: "N/A" },
    { name: "Wilson", golfer: "Scottie Scheffler", score: 0, thru: "N/A" },
    { name: "McGranahan", golfer: "Tony Finau", score: 0, thru: "N/A" },
    { name: "Drew", golfer: "Collin Morikawa", score: 0, thru: "N/A" },
    { name: "Nelson", golfer: "Robert MacIntyre", score: 0, thru: "N/A" },
    { name: "Sam", golfer: "Tyrrell Hatton", score: 0, thru: "N/A" },
    { name: "Addison", golfer: "Ludvig Åberg", score: 0, thru: "N/A" },
    { name: "2e", golfer: "Viktor Hovland", score: 0, thru: "N/A" },
    { name: "Reid", golfer: "Bryson DeChambeau", score: 0, thru: "N/A" },
    { name: "Bug", golfer: "Tommy Fleetwood", score: 0, thru: "N/A" },
    { name: "Layton", golfer: "Rory McIlroy", score: 0, thru: "N/A" },
  ];

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      console.error(
        `Failed to retrieve the golf stats page. Status code: ${response.status}`
      );
      return new NextResponse("Failed to retrieve the golf stats page", {
        status: 500,
      });
    }

    const text = await response.text();
    const dom = new JSDOM(text);
    const document = dom.window.document;

    const leaderboardEntries = document.querySelectorAll(
      "tr.PlayerRow__Overview"
    );
    interface golfers {
      name: string;
      score: string;
      thru: string;
    }
    const names = teams.map((team) => team.golfer);

    const golferScores: golfers[] = []
    leaderboardEntries.forEach((entry: any) => {
      const golferNameTag = entry.querySelector("a.leaderboard_player_name");
      const scoreTag = entry.querySelector("td:nth-child(5)");
      const thruTag = entry.querySelector("td:nth-child(7)");
      const r1 = entry.querySelector("td:nth-child(8)");
      const r2 = entry.querySelector("td:nth-child(9)");
      const golferName = golferNameTag.textContent.trim();

      if (golferNameTag && scoreTag && names.includes(golferName)) {
        // const golferName = golferNameTag.textContent.trim();
        const score = scoreTag.textContent.trim();
        const thru = thruTag.textContent.trim();
        const r1Score = r1.textContent.trim();
        const r2Score = r2.textContent.trim();
        if (score === "CUT") {
          const finalScore = Number(r1Score) + Number(r2Score) - 142;
          const finalScoreString = `+${finalScore}`;
          if (golferName === "Viktor Hovland") {
            golferScores.push({
              score: finalScoreString,
              thru: "Suggit",
              name: golferName,
            });
          } else {
          golferScores.push({
            score: finalScoreString,
            thru: "CUT",
            name: golferName,
          });

          }
        } else {
          golferScores.push({score, thru: thru, name: golferName});
        }
      }
      
    });
    console.log("Scraping successful, returning data:", golferScores);
    

    golferScores.forEach((golfer) => {
      const team = teams.find((team) => team.golfer === golfer.name);
      if (team) {
        team.score = golfer.score;
        team.thru = golfer.thru;
      }
    })

    const responseHeaders = {
      "Content-Type": "application/json",
      "Cache-Control":
        "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
    };
    return new NextResponse(JSON.stringify(teams), {
      status: 200,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Error in fetchData controller:", error);
    return new NextResponse("Error in fetchData controller", { status: 500 });
  }
}
