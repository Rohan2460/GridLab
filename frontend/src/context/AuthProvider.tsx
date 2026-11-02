import { useState, type ReactNode } from "react";

import { users } from "../data/mockData";
import type { Role, User } from "../types";
import { AuthContext, type LoginResult } from "./auth";

const SESSION_KEY = "gridlab.session";

const guestIds: Record<Role, number> = {
    student: 1,
    instructor: 2,
    admin: 3,
};

function readSession(): User | null {
    try {
        const raw = window.localStorage.getItem(SESSION_KEY);
        if (!raw) {
            return null;
        }

        const parsed = JSON.parse(raw) as User;
        const validRoles: Role[] = ["student", "instructor", "admin"];

        if (
            !parsed.id ||
            !parsed.username ||
            !validRoles.includes(parsed.role)
        ) {
            return null;
        }

        return parsed;
    } catch {
        return null;
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(readSession);

    function login(username: string, password: string, role: Role): LoginResult {
        const trimmedUsername = username.trim();

        if (!trimmedUsername) {
            return { ok: false, error: "Enter a username." };
        }

        if (!password) {
            return { ok: false, error: "Enter a password." };
        }

        const existingUser = users.find(
            (candidate) =>
                candidate.username.toLowerCase() ===
                    trimmedUsername.toLowerCase() && candidate.role === role,
        );

        const nextUser: User = existingUser ?? {
            id: guestIds[role],
            username: trimmedUsername,
            fullName: trimmedUsername,
            email: `${trimmedUsername.toLowerCase()}@gridlab.local`,
            role,
        };

        setUser(nextUser);
        window.localStorage.setItem(SESSION_KEY, JSON.stringify(nextUser));

        return { ok: true };
    }

    function logout() {
        setUser(null);
        window.localStorage.removeItem(SESSION_KEY);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
