import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
    accessToken: string | null;
    roles: string[] | null;
    userId: number | null; // Add userId to the context
    setAccessToken: (token: string | null) => void;
    setRoles: (roles: string[] | null) => void;
    setUserId: (id: number | null) => void; // Add a setter for userId
}

const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    roles: null,
    userId: null, // Default value for userId
    setAccessToken: () => { },
    setRoles: () => { },
    setUserId: () => { }, // Default setter for userId
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [accessToken, setAccessTokenState] = useState<string | null>(
        () => localStorage.getItem("accessToken")
    );
    const [roles, setRolesState] = useState<string[] | null>(
        () => JSON.parse(localStorage.getItem("roles") || "null")
    );
    const [userId, setUserIdState] = useState<number | null>(
        () => JSON.parse(localStorage.getItem("userId") || "null") // Retrieve userId from localStorage
    );

    const setAccessToken = (token: string | null) => {
        setAccessTokenState(token);
        if (token) {
            localStorage.setItem("accessToken", token);
        } else {
            localStorage.removeItem("accessToken");
        }
    };


    const setRoles = (roles: string[] | null) => {
        setRolesState(roles);
        if (roles) {
            localStorage.setItem("roles", JSON.stringify(roles));
        } else {
            localStorage.removeItem("roles");
        }
    };

    const setUserId = (id: number | null) => {
        setUserIdState(id);
        if (id !== null) {
            localStorage.setItem("userId", JSON.stringify(id));
        } else {
            localStorage.removeItem("userId");
        }
    };

    return (
        <AuthContext.Provider value={{ accessToken, roles, userId, setAccessToken, setRoles, setUserId }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);