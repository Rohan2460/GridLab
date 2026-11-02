import type { ReactNode } from "react";
import { Navigate, Outlet } from "react-router";

import { useAuth } from "../context/auth";
import type { Role } from "../types";
import { homeForRole } from "../utils";

interface ProtectedRouteProps {
    roles?: Role[];
    children?: ReactNode;
}

export default function ProtectedRoute({
    roles,
    children,
}: ProtectedRouteProps) {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to={homeForRole(user.role)} replace />;
    }

    return children === undefined ? <Outlet /> : <>{children}</>;
}
