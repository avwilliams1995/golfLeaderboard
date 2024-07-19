import fetch from "node-fetch";
import { load } from "cheerio";

async function scrapeGolfScores() {
  const url = "https://www.espn.com/golf/leaderboard";
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
  };

  const teams = [
    { name: "Harry", golfer: "Xander Schauffele", score: 0 },
    { name: "Topping", golfer: "Brooks Koepka", score: 0 },
    { name: "Wilson", golfer: "Scottie Scheffler", score: 0 },
    { name: "McGranahan", golfer: "Tony Finau", score: 0 },
    { name: "Drew", golfer: "Collin Morikawa", score: 0 },
    { name: "Nelson", golfer: "Robert MacIntyre", score: 0 },
    { name: "Sam", golfer: "Tyrrell Hatton", score: 0 },
    { name: "Addison", golfer: "Ludvig Åberg", score: 0 },
    { name: "2e", golfer: "Viktor Hovland", score: 0 },
    { name: "Reid", golfer: "Bryson DeChambeau", score: 0 },
    { name: "Bug", golfer: "Tommy Fleetwood", score: 0 },
    { name: "Topping", golfer: "Rory McIlroy", score: 0 },
  ];

  try {
    const response = await fetch(url, { headers });
    console.log(`Status Code: ${response.status}`); // Log status code
    if (response.status !== 200) {
      console.error(
        `Failed to retrieve the golf stats page. Status code: ${response.status}`
      );
      return {
        error: `Failed to retrieve the golf stats page. Status code: ${response.status}`,
      };
    }

    const body = await response.text();
    const $ = load(body);
    const leaderboardEntries = $("tr.PlayerRow__Overview");
    const golferScores = {};

    leaderboardEntries.each((index, element) => {
      const golferName = $(element)
        .find("a.leaderboard_player_name")
        .text()
        .trim();
      const score = $(element).find("td").eq(3).text().trim(); // Assuming the score is in the 4th <td>
      if (golferName && score) {
        golferScores[golferName] = score;
      }
    });

    teams.forEach((team) => {
      const golferName = team.golfer;
      if (golferName in golferScores) {
        team.score = golferScores[golferName];
      }
    });

    console.log("Scraped teams:", teams); // Log scraped data
    return teams;
  } catch (error) {
    console.error(`Error fetching data: ${error.message}`);
    return { error: `Error fetching data: ${error.message}` };
  }
}

export default scrapeGolfScores;
