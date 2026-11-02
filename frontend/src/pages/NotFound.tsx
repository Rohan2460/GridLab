import { Link } from "react-router";

import { buttonClass } from "../components/buttonStyles";
import { EmptyState } from "../components/ui";
import { useAuth } from "../context/auth";
import { homeForRole } from "../utils";

export default function NotFound() {
    const { user } = useAuth();

    return (
        <div className="page">
            <EmptyState
                title="Page not found"
                description="The page you are looking for does not exist or has moved."
                action={
                    <Link
                        to={user ? homeForRole(user.role) : "/login"}
                        className={buttonClass("secondary", "sm")}
                    >
                        {user ? "Back to dashboard" : "Go to sign in"}
                    </Link>
                }
            />
        </div>
    );
}
