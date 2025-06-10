import { createBrowserRouter } from "react-router";
import Root from "./Root";
import Home from "../../pages/Home";
import Login from '../../pages/auth/Login';
import Register from '../../pages/auth/Register';
import NotFound from "../../pages/NotFound";


const router = createBrowserRouter([
    {
        path: "/",
        Component: Root,
        children: [
            {
                index: true,
                Component: Home
            },
            
            {
                path: "/login",
                Component: Login
            },

            {
                path: "/register",
                Component: Register
            },


        ],
    },
    {
        path: "*",
        Component: NotFound
    }
]);

export default router;