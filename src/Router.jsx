import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";

const Router = () => {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <App />,
            children: [
                {
                    index: true,
                    element: <Home />
                },
                // {
                //     path: "/shop",
                //     element: <Shop />,
                // },
                // { 
                //     path: "/shop/cart",
                //     element: <Cart /> 
                // }
            ]
        },
    ])

    return <RouterProvider router={router} />
}

export default Router;