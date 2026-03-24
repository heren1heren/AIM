import { Navigate } from "react-router-dom";
import React from "react";
interface ProtectedRouteProps {
    children: JSX.Element;
    allowedRoles: string[]; // Roles allowed to access this route
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const token = localStorage.getItem("token");
    const roles = localStorage.getItem("roles"); // Retrieve roles from localStorage

    if (!token || !roles) {
        // If no token or roles are found, redirect to login
        return <Navigate to="/auth/login" />;
    }

    // Parse roles from localStorage
    const userRoles = JSON.parse(roles);

    // Check if the user has at least one of the allowed roles
    const hasAccess = userRoles.some((role: string) => allowedRoles.includes(role));

    if (!hasAccess) {
        // If the user doesn't have access, redirect to the Not Authorized page
        return <Navigate to="/not-authorized" />;
    }

    // If the user has access, render the children
    return children;
};

export default ProtectedRoute;