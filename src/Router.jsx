import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Leaderboard from "./pages/Leaderboard";

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "/game/:game",
          element: <Game />,
        },
        {
          path: "/leaderboard",
          element: <Leaderboard />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
