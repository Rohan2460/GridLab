import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router";

import { Button, Field } from "../components/ui";
import { useAuth } from "../context/auth";
import { demoAccounts, type DemoAccount } from "../data/mockData";
import type { Role } from "../types";
import { homeForRole } from "../utils";
import "./Login.css";

const roles: Role[] = ["student", "instructor", "admin"];

function roleLabel(role: Role): string {
    return role.charAt(0).toUpperCase() + role.slice(1);
}

export default function Login() {
    const { user, login } = useAuth();
    const navigate = useNavigate();

    const [role, setRole] = useState<Role>("student");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    if (user) {
        return <Navigate to={homeForRole(user.role)} replace />;
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const result = login(username, password, role);
        if (!result.ok) {
            setError(result.error ?? "Unable to sign in.");
            return;
        }

        navigate(homeForRole(role), { replace: true });
    }

    function fillDemoAccount(account: DemoAccount) {
        setRole(account.role);
        setUsername(account.username);
        setPassword(account.password);
        setError("");
    }

    return (
        <div className="login-page">
            <div className="login-shell">
                <section className="login-intro">
                    <div className="brand login-brand">
                        <span className="brand-mark">G</span>
                        <span>GridLab</span>
                    </div>

                    <h1>Your programming labs, in one place.</h1>
                    <p>
                        Track activities, write code, and submit your work from
                        a single focused workspace.
                    </p>

                    <ul className="login-features">
                        <li>Course and activity dashboards</li>
                        <li>Browser-based code editor and terminal</li>
                        <li>Submission review for instructors</li>
                    </ul>
                </section>

                <section className="card login-card">
                    <div className="login-card-body">
                        <h2>Sign in</h2>
                        <p className="login-card-subtitle">
                            Pick a demo account or sign in with any username.
                        </p>

                        <form className="login-form" onSubmit={handleSubmit}>
                            {error && (
                                <div className="form-error" role="alert">
                                    {error}
                                </div>
                            )}

                            <Field label="Role" htmlFor="role">
                                <select
                                    id="role"
                                    className="select"
                                    value={role}
                                    onChange={(event) =>
                                        setRole(event.target.value as Role)
                                    }
                                >
                                    {roles.map((value) => (
                                        <option key={value} value={value}>
                                            {roleLabel(value)}
                                        </option>
                                    ))}
                                </select>
                            </Field>

                            <Field label="Username" htmlFor="username">
                                <input
                                    id="username"
                                    className="input"
                                    value={username}
                                    onChange={(event) =>
                                        setUsername(event.target.value)
                                    }
                                    autoComplete="username"
                                    placeholder="student01"
                                />
                            </Field>

                            <Field label="Password" htmlFor="password">
                                <input
                                    id="password"
                                    type="password"
                                    className="input"
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                    autoComplete="current-password"
                                    placeholder="Any password works"
                                />
                            </Field>

                            <Button type="submit" className="login-submit">
                                Sign in
                            </Button>
                        </form>

                        <div className="login-divider">
                            <span>Demo accounts</span>
                        </div>

                        <div className="demo-grid">
                            {demoAccounts.map((account) => (
                                <button
                                    key={account.role}
                                    type="button"
                                    className="demo-account"
                                    onClick={() => fillDemoAccount(account)}
                                >
                                    <span className="demo-role">
                                        {account.label}
                                    </span>
                                    <span className="demo-username">
                                        {account.username}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <p className="login-note">
                            Authentication is mocked for this frontend build.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
