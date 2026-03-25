import { Navigate } from "react-router-dom";
import React from "react";
import { useAuth } from "../../../hooks/AuthContext";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { accessToken, roles } = useAuth(); // Extract accessToken and roles from AuthContext

    console.log("Access Token:", accessToken); // Debugging log
    console.log("Roles:", roles); // Debugging log

    if (!accessToken) {
        // If the user is not authenticated, redirect to the login page
        return <Navigate to="/auth/login" />;
    }

    if (!roles || !roles.some((role) => allowedRoles.includes(role))) {
        // If the user doesn't have the required roles, redirect to the 403 Forbidden page
        return <Navigate to="/403" />;
    }

    // If the user is authenticated and has the required roles, render the children
    return <>{children}</>;
};

export default ProtectedRoute;