import { useState, type FormEvent } from "react";

import Modal from "../components/Modal";
import {
    Badge,
    Button,
    EmptyState,
    Field,
    PageHeader,
    StatCard,
} from "../components/ui";
import { useData } from "../context/data";
import type { CourseStatus, Tone, User } from "../types";
import { courseStatusLabel } from "../utils";
import "./Admin.css";

const courseStatuses: CourseStatus[] = ["upcoming", "live", "completed"];

function roleTone(role: User["role"]): Tone {
    if (role === "admin") {
        return "danger";
    }

    if (role === "instructor") {
        return "warning";
    }

    return "info";
}

type AdminTab = "users" | "courses";

interface CourseFormState {
    code: string;
    title: string;
    description: string;
    status: CourseStatus;
    instructorId: string;
}

export default function Admin() {
    const { users, courses, activities, submissions, addCourse, updateCourseStatus } =
        useData();

    const instructors = users.filter((user) => user.role === "instructor");

    const [tab, setTab] = useState<AdminTab>("users");
    const [isModalOpen, setModalOpen] = useState(false);
    const [formError, setFormError] = useState("");
    const [form, setForm] = useState<CourseFormState>({
        code: "",
        title: "",
        description: "",
        status: "upcoming",
        instructorId: String(instructors[0]?.id ?? ""),
    });

    const pendingCount = submissions.filter(
        (submission) => submission.status === "pending",
    ).length;

    function openModal() {
        setFormError("");
        setModalOpen(true);
    }

    function closeModal() {
        setModalOpen(false);
        setFormError("");
    }

    function updateForm<K extends keyof CourseFormState>(
        key: K,
        value: CourseFormState[K],
    ) {
        setForm((current) => ({ ...current, [key]: value }));
    }

    function handleCreateCourse(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!form.code.trim() || !form.title.trim()) {
            setFormError("Enter a course code and title.");
            return;
        }

        if (!form.instructorId) {
            setFormError("Select an instructor.");
            return;
        }

        const duplicate = courses.some(
            (course) =>
                course.code.toLowerCase() === form.code.trim().toLowerCase(),
        );

        if (duplicate) {
            setFormError("A course with that code already exists.");
            return;
        }

        addCourse({
            code: form.code.trim().toUpperCase(),
            title: form.title.trim(),
            description:
                form.description.trim() || "No description provided.",
            status: form.status,
            instructorId: Number(form.instructorId),
        });

        setForm({
            code: "",
            title: "",
            description: "",
            status: "upcoming",
            instructorId: String(instructors[0]?.id ?? ""),
        });
        setModalOpen(false);
    }

    return (
        <div className="page stack">
            <PageHeader
                title="Admin dashboard"
                subtitle="Manage users, courses, and platform activity."
                actions={<Button onClick={openModal}>New course</Button>}
            />

            <div className="stats-grid">
                <StatCard label="Users" value={users.length} />
                <StatCard label="Courses" value={courses.length} />
                <StatCard label="Activities" value={activities.length} />
                <StatCard label="Pending submissions" value={pendingCount} />
            </div>

            <div className="admin-tabs">
                <div className="tabs" role="tablist" aria-label="Admin sections">
                    <button
                        type="button"
                        role="tab"
                        aria-selected={tab === "users"}
                        className={tab === "users" ? "tab active" : "tab"}
                        onClick={() => setTab("users")}
                    >
                        Users
                    </button>
                    <button
                        type="button"
                        role="tab"
                        aria-selected={tab === "courses"}
                        className={tab === "courses" ? "tab active" : "tab"}
                        onClick={() => setTab("courses")}
                    >
                        Courses
                    </button>
                </div>

                <span className="muted">
                    {tab === "users"
                        ? `${users.length} accounts`
                        : `${courses.length} courses`}
                </span>
            </div>

            {tab === "users" ? (
                <div className="table-wrapper" role="tabpanel">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        <div className="table-primary">
                                            {user.fullName}
                                        </div>
                                    </td>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <Badge tone={roleTone(user.role)}>
                                            {user.role}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : courses.length > 0 ? (
                <div className="table-wrapper" role="tabpanel">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Title</th>
                                <th>Instructor</th>
                                <th>Activities</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((course) => {
                                const instructor = users.find(
                                    (user) => user.id === course.instructorId,
                                );
                                const activityCount = activities.filter(
                                    (activity) =>
                                        activity.courseId === course.id,
                                ).length;

                                return (
                                    <tr key={course.id}>
                                        <td>
                                            <div className="table-primary">
                                                {course.code}
                                            </div>
                                        </td>
                                        <td>{course.title}</td>
                                        <td>
                                            {instructor?.fullName ??
                                                "Unassigned"}
                                        </td>
                                        <td>{activityCount}</td>
                                        <td>
                                            <select
                                                className="select select-sm"
                                                value={course.status}
                                                aria-label={`Status for ${course.code}`}
                                                onChange={(event) =>
                                                    updateCourseStatus(
                                                        course.id,
                                                        event.target
                                                            .value as CourseStatus,
                                                    )
                                                }
                                            >
                                                {courseStatuses.map(
                                                    (status) => (
                                                        <option
                                                            key={status}
                                                            value={status}
                                                        >
                                                            {courseStatusLabel(
                                                                status,
                                                            )}
                                                        </option>
                                                    ),
                                                )}
                                            </select>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <EmptyState
                    title="No courses yet"
                    description="Create the first course to get started."
                    action={
                        <Button size="sm" onClick={openModal}>
                            New course
                        </Button>
                    }
                />
            )}

            <Modal
                open={isModalOpen}
                title="New course"
                onClose={closeModal}
            >
                <form className="modal-body" onSubmit={handleCreateCourse}>
                    {formError && (
                        <div className="form-error" role="alert">
                            {formError}
                        </div>
                    )}

                    <div className="form-row">
                        <Field label="Course code" htmlFor="course-code">
                            <input
                                id="course-code"
                                className="input"
                                value={form.code}
                                onChange={(event) =>
                                    updateForm("code", event.target.value)
                                }
                                placeholder="CS103"
                            />
                        </Field>

                        <Field label="Status" htmlFor="course-status">
                            <select
                                id="course-status"
                                className="select"
                                value={form.status}
                                onChange={(event) =>
                                    updateForm(
                                        "status",
                                        event.target.value as CourseStatus,
                                    )
                                }
                            >
                                {courseStatuses.map((status) => (
                                    <option key={status} value={status}>
                                        {courseStatusLabel(status)}
                                    </option>
                                ))}
                            </select>
                        </Field>
                    </div>

                    <Field label="Title" htmlFor="course-title">
                        <input
                            id="course-title"
                            className="input"
                            value={form.title}
                            onChange={(event) =>
                                updateForm("title", event.target.value)
                            }
                            placeholder="Algorithms and Data Structures"
                        />
                    </Field>

                    <Field label="Description" htmlFor="course-description">
                        <textarea
                            id="course-description"
                            className="textarea"
                            value={form.description}
                            onChange={(event) =>
                                updateForm("description", event.target.value)
                            }
                            placeholder="Short course description"
                        />
                    </Field>

                    <Field label="Instructor" htmlFor="course-instructor">
                        <select
                            id="course-instructor"
                            className="select"
                            value={form.instructorId}
                            onChange={(event) =>
                                updateForm("instructorId", event.target.value)
                            }
                        >
                            {instructors.map((instructor) => (
                                <option
                                    key={instructor.id}
                                    value={instructor.id}
                                >
                                    {instructor.fullName}
                                </option>
                            ))}
                        </select>
                    </Field>

                    <div className="form-actions">
                        <Button variant="secondary" onClick={closeModal}>
                            Cancel
                        </Button>
                        <Button type="submit">Create course</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
