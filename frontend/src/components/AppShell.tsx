import { Link, NavLink, Outlet } from "react-router";

import { useAuth } from "../context/auth";
import { homeForRole, roleLabel } from "../utils";
import { Badge, Button } from "./ui";

function initials(fullName: string): string {
    return fullName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("");
}

export default function AppShell() {
    const { user, logout } = useAuth();

    if (!user) {
        return null;
    }

    const home = homeForRole(user.role);

    return (
        <div className="app-shell">
            <header className="app-header">
                <div className="app-header-inner">
                    <Link to={home} className="brand">
                        <span className="brand-mark">G</span>
                        <span>GridLab</span>
                    </Link>

                    <nav className="app-nav" aria-label="Primary">
                        <NavLink
                            to={home}
                            end
                            className={({ isActive }) =>
                                isActive ? "nav-link active" : "nav-link"
                            }
                        >
                            Dashboard
                        </NavLink>
                    </nav>

                    <div className="app-user">
                        <div className="user-chip">
                            <span className="user-avatar" aria-hidden="true">
                                {initials(user.fullName)}
                            </span>
                            <span className="user-name">{user.fullName}</span>
                            <Badge tone="info">{roleLabel(user.role)}</Badge>
                        </div>
                        <Button variant="ghost" size="sm" onClick={logout}>
                            Log out
                        </Button>
                    </div>
                </div>
            </header>

            <main className="app-main">
                <Outlet />
            </main>
        </div>
    );
}
