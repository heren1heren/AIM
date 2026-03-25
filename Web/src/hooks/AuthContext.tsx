import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
    accessToken: string | null;
    roles: string[] | null;
    setAccessToken: (token: string | null) => void;
    setRoles: (roles: string[] | null) => void;
}

const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    roles: null,
    setAccessToken: () => { },
    setRoles: () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [accessToken, setAccessTokenState] = useState<string | null>(
        () => localStorage.getItem("accessToken")
    );
    const [roles, setRolesState] = useState<string[] | null>(
        () => JSON.parse(localStorage.getItem("roles") || "null")
    );


    const setAccessToken = (token: string | null) => {
        setAccessTokenState(token);
        if (token) {
            localStorage.setItem("accessToken", token);
        } else {
            localStorage.removeItem("accessToken");
        }
    };

    // Persist roles in localStorage whenever they change
    const setRoles = (roles: string[] | null) => {
        setRolesState(roles);
        if (roles) {
            localStorage.setItem("roles", JSON.stringify(roles));
        } else {
            localStorage.removeItem("roles");
        }
    };

    return (
        <AuthContext.Provider value={{ accessToken, roles, setAccessToken, setRoles }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);