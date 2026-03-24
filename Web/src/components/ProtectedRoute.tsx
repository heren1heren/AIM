import { Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import api from "../services/api";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const [hasAccess, setHasAccess] = useState<boolean | null>(null); // Track access state
    const [loading, setLoading] = useState(true); // Track loading state

    useEffect(() => {
        const checkAccess = async () => {
            try {
                // Make a request to the backend to verify the user's roles
                const response = await api.get("/auth/roles", { withCredentials: true });
                const userRoles = response.data.roles;

                // Check if the user has at least one of the allowed roles
                const access = userRoles.some((role: string) => allowedRoles.includes(role));
                setHasAccess(access);
            } catch (error) {
                console.error("Error verifying roles:", error);
                setHasAccess(false); // If the request fails, deny access
            } finally {
                setLoading(false); // Set loading to false after the request
            }
        };

        checkAccess();
    }, [allowedRoles]);

    if (loading) {
        // While loading, you can show a spinner or placeholder
        return <div>Loading...</div>;
    }

    if (hasAccess === false) {
        // If the user doesn't have access, redirect to the Not Authorized page
        return <Navigate to="/not-authorized" />;
    }

    if (hasAccess === null) {
        // If the user is not authenticated, redirect to the login page
        return <Navigate to="/auth/login" />;
    }

    // If the user has access, render the children
    return <>{children}</>;
};

export default ProtectedRoute;