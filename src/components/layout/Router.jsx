import { createBrowserRouter } from "react-router";
import Root from "./Root";
import Home from "../../pages/Home";
import Login from '../../pages/auth/Login';
import Register from '../../pages/auth/Register';
import NotFound from "../../pages/NotFound";
import AddCourse from '../../pages/courses/AddCourse';
import PrivateRoute from './PrivateRoute';
import CourseDetails from "../../pages/courses/CourseDetails";
import MyEnrolledCourses from "../../pages/dashboard/MyEnrolledCourses";


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
            {
                path: "/add-course",
                element: (
                    <PrivateRoute>
                        <AddCourse />
                    </PrivateRoute>
                )
            },
            {
                path:"/courses/:courseId",
                element: (
                    <PrivateRoute>
                        <CourseDetails />
                    </PrivateRoute>
                )
            },
            {
                path:"/my-enrolled-courses",
                element: (
                    <PrivateRoute>
                        <MyEnrolledCourses />
                    </PrivateRoute>
                )
            }
        ],
    },
    {
        path: "*",
        Component: NotFound
    }
]);

export default router;