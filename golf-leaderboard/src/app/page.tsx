"use client";
import React, { useState, useEffect } from "react";

interface Team {
  name: string;
  golfer: string;
  score: number | string;
  thru?: number | string;
}

function App() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchLeaderboard = async () => {
    console.log('fetching')
    setLoading(true);
    try {
      const response = await fetch("/api/scraper", { method: "POST" });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('got data', data)

      const sortedData = data.sort((a: Team, b: Team) => {
        const scoreA = a.score === "E" ? 0 : Number(a.score);
        const scoreB = b.score === "E" ? 0 : Number(b.score);
        return scoreA - scoreB;
      });


      setTeams(sortedData);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);
  console.log('teams', teams)

  return (
    <div className="App">
      <header className="App-header">
        <h2>Travel League Gahlf</h2>
        <div id="twodiv">
          <img src="/2e.png" alt="2e" className="responsive-image" />
          <img src="/2e-2.png" alt="2e" className="responsive-image" />
          <img src="/2e-3.png" alt="2e" className="responsive-image" />
        </div>

        <button onClick={fetchLeaderboard} disabled={loading}>
          {loading ? "Loading..." : "Refresh Leaderboard"}
        </button>
        <div className="Leaderboard-table-container">
          {loading ? (
            <div className="spinner"></div> // Add spinner for loading state
          ) : (
            <table className="Leaderboard-table">
              <thead>
                <tr>
                  <th>Team Name</th>
                  <th>Golfer</th>
                  <th>Score</th>
                  <th>Thru</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team, index) => (
                  <tr key={index}>
                    <td>{team.name}</td>
                    <td>{team.golfer}</td>
                    <td>{team.score}</td>
                    <td>{team.thru}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
