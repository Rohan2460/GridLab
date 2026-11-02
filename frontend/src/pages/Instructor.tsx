import { useState, type FormEvent } from "react";
import { Link } from "react-router";

import { buttonClass } from "../components/buttonStyles";
import CourseCard from "../components/CourseCard";
import Modal from "../components/Modal";
import {
    Badge,
    Button,
    Card,
    EmptyState,
    Field,
    PageHeader,
    Section,
    StatCard,
} from "../components/ui";
import { useAuth } from "../context/auth";
import { useData } from "../context/data";
import { starterCode } from "../data/mockData";
import type { ActivityType, EditorLanguage } from "../types";
import {
    activityTypeLabel,
    activityTypeTone,
    formatDate,
    formatDateTime,
    languageLabel,
    submissionStatusLabel,
    submissionStatusTone,
} from "../utils";
import "./Instructor.css";

const activityTypes: ActivityType[] = ["programming", "exam", "quiz"];
const languages: EditorLanguage[] = ["c", "cpp", "python", "javascript"];

interface ActivityFormState {
    courseId: string;
    type: ActivityType;
    title: string;
    description: string;
    dueOn: string;
    language: EditorLanguage;
}

export default function Instructor() {
    const { user } = useAuth();
    const {
        users,
        courses,
        activities,
        submissions,
        addActivity,
        updateSubmissionStatus,
    } = useData();

    const taughtCourses = user
        ? courses.filter((course) => course.instructorId === user.id)
        : [];
    const taughtCourseIds = new Set(taughtCourses.map((course) => course.id));

    const [isModalOpen, setModalOpen] = useState(false);
    const [formError, setFormError] = useState("");
    const [form, setForm] = useState<ActivityFormState>({
        courseId: String(taughtCourses[0]?.id ?? ""),
        type: "programming",
        title: "",
        description: "",
        dueOn: "",
        language: "c",
    });

    if (!user) {
        return null;
    }

    const instructorActivities = activities.filter((activity) =>
        taughtCourseIds.has(activity.courseId),
    );
    const instructorActivityIds = new Set(
        instructorActivities.map((activity) => activity.id),
    );
    const instructorSubmissions = submissions.filter((submission) =>
        instructorActivityIds.has(submission.activityId),
    );

    const pendingCount = instructorSubmissions.filter(
        (submission) => submission.status === "pending",
    ).length;
    const studentCount = new Set(
        instructorSubmissions.map((submission) => submission.userId),
    ).size;

    const activitiesById = new Map(
        activities.map((activity) => [activity.id, activity]),
    );
    const coursesById = new Map(courses.map((course) => [course.id, course]));
    const usersById = new Map(users.map((item) => [item.id, item]));

    const reviewQueue = [...instructorSubmissions]
        .filter((submission) => submission.status !== "draft")
        .sort((a, b) => {
            const order = { pending: 0, rejected: 1, approved: 2, draft: 3 };
            return (
                order[a.status] - order[b.status] ||
                (b.submittedAt ?? "").localeCompare(a.submittedAt ?? "")
            );
        });

    function openModal() {
        setForm((current) => ({
            ...current,
            courseId: current.courseId || String(taughtCourses[0]?.id ?? ""),
        }));
        setFormError("");
        setModalOpen(true);
    }

    function closeModal() {
        setModalOpen(false);
        setFormError("");
    }

    function updateForm<K extends keyof ActivityFormState>(
        key: K,
        value: ActivityFormState[K],
    ) {
        setForm((current) => ({ ...current, [key]: value }));
    }

    function handleCreateActivity(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!form.courseId) {
            setFormError("Select a course.");
            return;
        }

        if (!form.title.trim()) {
            setFormError("Enter an activity title.");
            return;
        }

        if (!form.dueOn) {
            setFormError("Choose a due date.");
            return;
        }

        addActivity({
            courseId: Number(form.courseId),
            type: form.type,
            title: form.title.trim(),
            description:
                form.description.trim() || "No description provided.",
            dueOn: new Date(form.dueOn).toISOString(),
            language: form.language,
            starterCode: starterCode[form.language],
        });

        setForm({
            courseId: String(taughtCourses[0]?.id ?? ""),
            type: "programming",
            title: "",
            description: "",
            dueOn: "",
            language: "c",
        });
        setModalOpen(false);
    }

    return (
        <div className="page stack">
            <PageHeader
                title="Instructor dashboard"
                subtitle={`Welcome, ${user.fullName}. Manage your courses and review student work.`}
                actions={<Button onClick={openModal}>New activity</Button>}
            />

            <div className="stats-grid">
                <StatCard label="Courses" value={taughtCourses.length} />
                <StatCard label="Activities" value={instructorActivities.length} />
                <StatCard
                    label="Awaiting review"
                    value={pendingCount}
                    hint="Pending submissions"
                />
                <StatCard label="Active students" value={studentCount} />
            </div>

            <Section
                title="Your courses"
                action={
                    <span className="muted">
                        {taughtCourses.length}{" "}
                        {taughtCourses.length === 1 ? "course" : "courses"}
                    </span>
                }
            >
                {taughtCourses.length > 0 ? (
                    <div className="grid-cards">
                        {taughtCourses.map((course) => (
                            <CourseCard
                                key={course.id}
                                course={course}
                                activityCount={
                                    activities.filter(
                                        (activity) =>
                                            activity.courseId === course.id,
                                    ).length
                                }
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        title="No courses assigned"
                        description="Courses assigned to you will appear here."
                    />
                )}
            </Section>

            <div className="instructor-columns">
                <Section
                    title="Activities"
                    action={
                        <span className="muted">
                            Latest by due date
                        </span>
                    }
                >
                    {instructorActivities.length > 0 ? (
                        <div className="table-wrapper">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Activity</th>
                                        <th>Course</th>
                                        <th>Type</th>
                                        <th>Due</th>
                                        <th>Submissions</th>
                                        <th aria-label="Actions" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...instructorActivities]
                                        .sort((a, b) =>
                                            a.dueOn.localeCompare(b.dueOn),
                                        )
                                        .map((activity) => {
                                            const course = coursesById.get(
                                                activity.courseId,
                                            );
                                            const count =
                                                instructorSubmissions.filter(
                                                    (submission) =>
                                                        submission.activityId ===
                                                        activity.id,
                                                ).length;

                                            return (
                                                <tr key={activity.id}>
                                                    <td>
                                                        <div className="table-primary">
                                                            {activity.title}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {course?.code ?? "—"}
                                                    </td>
                                                    <td>
                                                        <Badge
                                                            tone={activityTypeTone(
                                                                activity.type,
                                                            )}
                                                        >
                                                            {activityTypeLabel(
                                                                activity.type,
                                                            )}
                                                        </Badge>
                                                    </td>
                                                    <td>
                                                        {formatDate(
                                                            activity.dueOn,
                                                        )}
                                                    </td>
                                                    <td>{count}</td>
                                                    <td className="table-actions">
                                                        <Link
                                                            to={`/courses/${activity.courseId}`}
                                                            className={buttonClass(
                                                                "secondary",
                                                                "sm",
                                                            )}
                                                        >
                                                            Open
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <EmptyState
                            title="No activities yet"
                            description="Create an activity to get started."
                            action={
                                <Button size="sm" onClick={openModal}>
                                    New activity
                                </Button>
                            }
                        />
                    )}
                </Section>

                <Section
                    title="Submission review"
                    action={
                        <span className="muted">
                            {pendingCount} pending
                        </span>
                    }
                >
                    {reviewQueue.length > 0 ? (
                        <Card className="review-list">
                            {reviewQueue.map((submission) => {
                                const activity = activitiesById.get(
                                    submission.activityId,
                                );
                                const course = activity
                                    ? coursesById.get(activity.courseId)
                                    : undefined;
                                const student = usersById.get(
                                    submission.userId,
                                );

                                return (
                                    <div
                                        className="review-item"
                                        key={submission.id}
                                    >
                                        <div className="review-info">
                                            <span className="review-title">
                                                {activity?.title ?? "Activity"}
                                            </span>
                                            <span className="review-meta">
                                                {student?.fullName ?? "Student"}
                                                {course
                                                    ? ` · ${course.code}`
                                                    : ""}
                                                {submission.submittedAt
                                                    ? ` · ${formatDateTime(
                                                          submission.submittedAt,
                                                      )}`
                                                    : ""}
                                            </span>
                                            <Badge
                                                tone={submissionStatusTone(
                                                    submission.status,
                                                )}
                                            >
                                                {submissionStatusLabel(
                                                    submission.status,
                                                )}
                                            </Badge>
                                        </div>

                                        <div className="review-actions">
                                            <Link
                                                to={`/instructor/submissions/${submission.id}`}
                                                className={buttonClass(
                                                    "secondary",
                                                    "sm",
                                                )}
                                            >
                                                Review
                                            </Link>
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                disabled={
                                                    submission.status ===
                                                    "approved"
                                                }
                                                onClick={() =>
                                                    updateSubmissionStatus(
                                                        submission.activityId,
                                                        submission.userId,
                                                        "approved",
                                                    )
                                                }
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="danger"
                                                disabled={
                                                    submission.status ===
                                                    "rejected"
                                                }
                                                onClick={() =>
                                                    updateSubmissionStatus(
                                                        submission.activityId,
                                                        submission.userId,
                                                        "rejected",
                                                    )
                                                }
                                            >
                                                Reject
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </Card>
                    ) : (
                        <EmptyState
                            title="No submissions to review"
                            description="Submitted work will appear here."
                        />
                    )}
                </Section>
            </div>

            <Modal
                open={isModalOpen}
                title="New activity"
                onClose={closeModal}
            >
                <form className="modal-body" onSubmit={handleCreateActivity}>
                    {formError && (
                        <div className="form-error" role="alert">
                            {formError}
                        </div>
                    )}

                    <div className="form-row">
                        <Field label="Course" htmlFor="activity-course">
                            <select
                                id="activity-course"
                                className="select"
                                value={form.courseId}
                                onChange={(event) =>
                                    updateForm("courseId", event.target.value)
                                }
                            >
                                {taughtCourses.map((course) => (
                                    <option key={course.id} value={course.id}>
                                        {course.code} · {course.title}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Type" htmlFor="activity-type">
                            <select
                                id="activity-type"
                                className="select"
                                value={form.type}
                                onChange={(event) =>
                                    updateForm(
                                        "type",
                                        event.target.value as ActivityType,
                                    )
                                }
                            >
                                {activityTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {activityTypeLabel(type)}
                                    </option>
                                ))}
                            </select>
                        </Field>
                    </div>

                    <Field label="Title" htmlFor="activity-title">
                        <input
                            id="activity-title"
                            className="input"
                            value={form.title}
                            onChange={(event) =>
                                updateForm("title", event.target.value)
                            }
                            placeholder="e.g. Linked list implementation"
                        />
                    </Field>

                    <Field label="Description" htmlFor="activity-description">
                        <textarea
                            id="activity-description"
                            className="textarea"
                            value={form.description}
                            onChange={(event) =>
                                updateForm("description", event.target.value)
                            }
                            placeholder="What should students do?"
                        />
                    </Field>

                    <div className="form-row">
                        <Field label="Due date" htmlFor="activity-due">
                            <input
                                id="activity-due"
                                type="datetime-local"
                                className="input"
                                value={form.dueOn}
                                onChange={(event) =>
                                    updateForm("dueOn", event.target.value)
                                }
                            />
                        </Field>

                        <Field label="Language" htmlFor="activity-language">
                            <select
                                id="activity-language"
                                className="select"
                                value={form.language}
                                onChange={(event) =>
                                    updateForm(
                                        "language",
                                        event.target.value as EditorLanguage,
                                    )
                                }
                            >
                                {languages.map((language) => (
                                    <option key={language} value={language}>
                                        {languageLabel(language)}
                                    </option>
                                ))}
                            </select>
                        </Field>
                    </div>

                    <div className="form-actions">
                        <Button variant="secondary" onClick={closeModal}>
                            Cancel
                        </Button>
                        <Button type="submit">Create activity</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
