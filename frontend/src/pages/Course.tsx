import { Link, useParams } from "react-router";

import ActivityTable from "../components/ActivityTable";
import { buttonClass } from "../components/buttonStyles";
import {
    Badge,
    Card,
    EmptyState,
    PageHeader,
    Section,
} from "../components/ui";
import { useAuth } from "../context/auth";
import { useData } from "../context/data";
import {
    activityTypeLabel,
    courseStatusLabel,
    courseStatusTone,
    formatDate,
    homeForRole,
} from "../utils";
import "./Course.css";

export default function Course() {
    const { courseId } = useParams();
    const { user } = useAuth();
    const { users, courses, activities, submissions } = useData();

    const course = courses.find((item) => item.id === Number(courseId));

    if (!user) {
        return null;
    }

    if (!course) {
        return (
            <div className="page">
                <EmptyState
                    title="Course not found"
                    description="This course may have been removed or you followed an outdated link."
                    action={
                        <Link
                            to={homeForRole(user.role)}
                            className={buttonClass("secondary", "sm")}
                        >
                            Back to dashboard
                        </Link>
                    }
                />
            </div>
        );
    }

    const courseActivities = activities
        .filter((activity) => activity.courseId === course.id)
        .sort((a, b) => a.dueOn.localeCompare(b.dueOn));

    const instructor = users.find((item) => item.id === course.instructorId);
    const isStudent = user.role === "student";
    const nextActivity = courseActivities[0];
    const programmingCount = courseActivities.filter(
        (activity) => activity.type === "programming",
    ).length;

    return (
        <div className="page stack">
            <div>
                <Link
                    to={homeForRole(user.role)}
                    className="course-back-link"
                >
                    Back to dashboard
                </Link>

                <PageHeader
                    title={course.title}
                    subtitle={course.description}
                    actions={
                        <Badge tone={courseStatusTone(course.status)}>
                            {courseStatusLabel(course.status)}
                        </Badge>
                    }
                />
            </div>

            <Card className="course-summary">
                <div className="course-summary-item">
                    <span className="summary-label">Course code</span>
                    <span className="summary-value">{course.code}</span>
                </div>
                <div className="course-summary-item">
                    <span className="summary-label">Instructor</span>
                    <span className="summary-value">
                        {instructor?.fullName ?? "Unassigned"}
                    </span>
                </div>
                <div className="course-summary-item">
                    <span className="summary-label">Activities</span>
                    <span className="summary-value">
                        {courseActivities.length}
                    </span>
                </div>
                <div className="course-summary-item">
                    <span className="summary-label">Programming labs</span>
                    <span className="summary-value">{programmingCount}</span>
                </div>
                <div className="course-summary-item">
                    <span className="summary-label">Next due</span>
                    <span className="summary-value">
                        {nextActivity
                            ? `${formatDate(nextActivity.dueOn)} · ${activityTypeLabel(nextActivity.type)}`
                            : "—"}
                    </span>
                </div>
            </Card>

            <Section
                title="Activities"
                action={
                    <span className="muted">
                        {courseActivities.length}{" "}
                        {courseActivities.length === 1
                            ? "activity"
                            : "activities"}
                    </span>
                }
            >
                <ActivityTable
                    activities={courseActivities}
                    submissions={submissions}
                    userId={isStudent ? user.id : undefined}
                    showStatus={isStudent}
                    linkWorkspace={isStudent}
                    emptyMessage="No activities have been added to this course yet."
                />
            </Section>
        </div>
    );
}
