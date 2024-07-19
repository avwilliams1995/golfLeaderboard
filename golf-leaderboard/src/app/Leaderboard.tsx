import React from 'react'
import "./App.css";

function Leaderboard({teams}: any) {

  return (
    <div>
      <div className="Leaderboard-table-container">
        <table className="Leaderboard-table">
          <thead>
            <tr>
              <th>Team Name</th>
              <th>Golfer</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {teams.length>0 && teams.map((team:any, index:number) => (
              <tr key={index}>
                <td>{team.name}</td>
                <td>{team.golfer}</td>
                <td>{team.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard
