import { Link } from "react-router-dom";

function Header() {
  
  return (
    <header className="flex justify-between py-5 px-10">
      <h1 className="text-2xl font-bold"><Link to="/">Where's <span style={{color: 'red'}}>Waldo</span></Link></h1>
      <p>
        <Link to="/leaderboard">Leaderboard</Link>
      </p>
    </header>
  )
}

export default Header;