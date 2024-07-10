import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import { FaGithub } from "react-icons/fa";
import { ToastContainer } from 'react-toastify';

import fortress from "./assets/fortress.jpg";
import maze from "./assets/maze.jpg";
import town from "./assets/town.jpg";


const games = [
  {
    id: 1,
    name: "Fortress",
    key: "fortress",
    image: fortress
  },
  {
    id: 2,
    name: "Maze",
    key: "maze",
    image: maze
  },
  {
    id: 3,
    name: "Town",
    key: "town",
    image: town
  },
]

function App() {

  return (
    <>
      <ToastContainer />
      <Header />
      <main className='mt-14 flex-1 relative'>
        <Outlet context={{ games }} />
      </main>
      <footer className='flex justify-center mb-2 mt-6'>
        <a href="https://github.com/ben1499" target="_blank" className='flex items-center gap-x-2'>
          <FaGithub style={{ fontSize: '24px' }} />
          ben1499
        </a>
      </footer>
    </>
  )
}

export default App;
