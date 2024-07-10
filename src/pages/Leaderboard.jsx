import { useState, useEffect } from "react";
import { useOutletContext, useLocation } from "react-router-dom";
import axios from "axios";

function Leaderboard() {
  const url = import.meta.env.VITE_API_URL;
  
  const { games } = useOutletContext();
  const location = useLocation();
  const { game } = location.state || {};

  const [selectedGame, setSelectedGame] = useState(null);
  const [scores, setScores] = useState([]);

  useEffect(() => {
    if (selectedGame) {
      axios.get(`${url}/scores`, {
        params: {
          game: selectedGame.key
        }
      }).then((res) => {
        setScores(res.data.data);
      })
    }
  }, [url, selectedGame])

  useEffect(() => {
    if (game) {
      const currentGame = games.find((item) => item.key === game);
      setSelectedGame(currentGame);
    } else {
      setSelectedGame(games[0])
    }
  }, [game, games])

  const changeSelection = (id) => {
    return () => {
      const game = games.find((item) => item.id === id);
      setSelectedGame(game);
    }
  }

  return (
    <div className="w-3/4 mx-auto">
      <h2 className="text-center mb-10 font-bold text-3xl">Leaderboard</h2>
      <div className="flex justify-center gap-x-20">
        {games.map(game => (
        <div className="card w-80 drop-shadow-md hover:drop-shadow-xl text-center gap-5" style={{ transform: selectedGame?.id === game.id ? 'scale(1.1)' : '' }} key={game.id} onClick={changeSelection(game.id)}>
          <img src={game.image} alt="" />
          <p className="py-2">{game.name}</p>
        </div>
        ))}
      </div>
      <h2 className="mt-6 text-center font-bold text-2xl uppercase">{selectedGame?.name}</h2>
      <div className="flex justify-center">
      {scores.length > 0 ? <table className="mt-5 drop-shadow-sm" width={600}>
          <thead>
            <tr className="text-left">
              <th>Place</th>
              <th>Username</th>
              <th>Time</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{score.name}</td>
                <td>{score.time_completed_formatted}</td>
                <td>{score.date_formatted}</td>
              </tr>
            ))}
          </tbody>
        </table> : <p className="font-light mt-5">Nothing to see here. Be the first one on the leaderboard!</p>}
      </div>
    </div>
  )
}

export default Leaderboard;