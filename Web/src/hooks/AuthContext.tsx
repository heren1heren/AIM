import React, { createContext, useContext, useState } from "react";

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
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [roles, setRoles] = useState<string[] | null>(null);

    return (
        <AuthContext.Provider value={{ accessToken, roles, setAccessToken, setRoles }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext); 