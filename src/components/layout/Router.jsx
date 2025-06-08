import { createBrowserRouter } from "react-router";
import Root from "./Root";
import Home from "../../pages/Home";


const router = createBrowserRouter([
    {
        path: "/",
        Component: Root,
        children: [
            {
                index: true,
                Component: Home
            },

            // {
            //     path: "auth",
            //     Component: AuthLayout,
            //     children: [
            //         { path: "login", Component: Login },
            //         { path: "register", Component: Register },
            //     ],
            // },

        ],
    },
]);

export default router;