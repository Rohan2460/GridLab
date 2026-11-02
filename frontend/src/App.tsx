import { Navigate, Route, Routes } from "react-router";

import AppShell from "./components/AppShell";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/auth";
import Admin from "./pages/Admin";
import Course from "./pages/Course";
import Instructor from "./pages/Instructor";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Student from "./pages/Student";
import SubmissionReview from "./pages/SubmissionReview";
import Workspace from "./pages/Workspace";
import { homeForRole } from "./utils";

function HomeRedirect() {
    const { user } = useAuth();

    return (
        <Navigate
            to={user ? homeForRole(user.role) : "/login"}
            replace
        />
    );
}

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/login" element={<Login />} />

            <Route
                element={
                    <ProtectedRoute>
                        <AppShell />
                    </ProtectedRoute>
                }
            >
                <Route
                    path="/student"
                    element={
                        <ProtectedRoute roles={["student"]}>
                            <Student />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/courses/:courseId"
                    element={
                        <ProtectedRoute
                            roles={["student", "instructor", "admin"]}
                        >
                            <Course />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/workspace/:activityId"
                    element={
                        <ProtectedRoute roles={["student"]}>
                            <Workspace />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/instructor"
                    element={
                        <ProtectedRoute roles={["instructor"]}>
                            <Instructor />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/instructor/submissions/:submissionId"
                    element={
                        <ProtectedRoute roles={["instructor"]}>
                            <SubmissionReview />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute roles={["admin"]}>
                            <Admin />
                        </ProtectedRoute>
                    }
                />
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
