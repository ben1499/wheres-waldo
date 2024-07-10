import { useNavigate, useOutletContext } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const { games } = useOutletContext();

  const handleGameStart = (game) => {
    return () => {
      navigate(`/game/${game}`);
    }
  }

  return (
    <div className="w-3/4 mx-auto">
      <h2 className="text-center mb-10 font-bold text-3xl">Games</h2>
      <div className="flex justify-center gap-x-20">
        {games.map(game => (
        <div className="card w-80 drop-shadow-md hover:drop-shadow-xl text-center pb-3" key={game.id}>
          <img src={game.image} alt="" />
          <p className="mt-2">{game.name}</p>
          <button className="rounded-md bg-white px-2 mt-1 start-btn" onClick={handleGameStart(game.key)}>Start Game</button>
        </div>
        ))}
      </div>
    </div>
  )
}

export default Home;