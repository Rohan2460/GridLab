import { createContext, useContext } from "react";

import type { Role, User } from "../types";

export interface LoginResult {
    ok: boolean;
    error?: string;
}

export interface AuthContextValue {
    user: User | null;
    login: (username: string, password: string, role: Role) => LoginResult;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
    undefined,
);

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}
