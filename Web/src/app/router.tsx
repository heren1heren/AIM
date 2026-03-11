import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import SignInPage from "../features/auth/pages/SignInPage"
import HomeLayout from "../layouts/HomeLayout";
import HomePage from "../pages/HomePage";
import StudentLayout from "../layouts/StudentLayout";
import StudentHomePage from "../features/students/pages/StudentHomePage";
import AdminLayout from "../layouts/AdminLayout";
import AdminHomePage from "../features/admin/pages/AdminHomePage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <HomeLayout />,
        children: [
            { index: true, element: <HomePage /> }
        ]
    },

    {
        path: "/auth",
        element: <AuthLayout />,
        children: [
            { path: "login", element: <SignInPage /> }
        ]
    },

    {
        path: "/admin",
        element: <AdminLayout />,
        children: [
            { path: "home", element: < AdminHomePage /> }
        ]
    },
    {
        path: "/teacher",
        element: <div />,
        children: [
            { path: "home", element: <div /> }
        ]
    },
    {
        path: "/student",
        element: <StudentLayout />,
        children: [
            { path: "home", element: <StudentHomePage /> }
        ]
    },
    {
        path: "*",
        element: <div>404 Not Found</div>
    }
]);
