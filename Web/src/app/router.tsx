import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import SignInPage from "../features/auth/pages/SignInPage"

export const router = createBrowserRouter([
    {
        path: "/auth",
        element: <AuthLayout />,
        children: [
            { path: "login", element: <SignInPage /> }
        ]
    },
    {
        path: "/",
        element: <Navigate to="/auth/login" replace />
    },
    {
        path: "/admin",
        element: <div />,
        children: [
            { path: "dashboard", element: <div /> }
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
        element: <div />,
        children: [
            { path: "home", element: <div /> }
        ]
    },
    {
        path: "*",
        element: <div>404 Not Found</div>
    }
]);
