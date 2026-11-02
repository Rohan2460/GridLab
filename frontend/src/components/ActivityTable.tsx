import { Link } from "react-router";

import type { Activity, Course, Submission } from "../types";
import {
    activityTypeLabel,
    activityTypeTone,
    findSubmission,
    formatDate,
    isOverdue,
    submissionStatusLabel,
    submissionStatusTone,
} from "../utils";
import { buttonClass } from "./buttonStyles";
import { Badge, EmptyState } from "./ui";

interface ActivityTableProps {
    activities: Activity[];
    courses?: Course[];
    submissions?: Submission[];
    userId?: number;
    showCourse?: boolean;
    showStatus?: boolean;
    linkWorkspace?: boolean;
    emptyMessage?: string;
}

export default function ActivityTable({
    activities,
    courses = [],
    submissions = [],
    userId,
    showCourse = false,
    showStatus = true,
    linkWorkspace = true,
    emptyMessage = "No activities yet.",
}: ActivityTableProps) {
    if (activities.length === 0) {
        return <EmptyState title="Nothing here yet" description={emptyMessage} />;
    }

    const coursesById = new Map(courses.map((course) => [course.id, course]));

    return (
        <div className="table-wrapper">
            <table className="table">
                <thead>
                    <tr>
                        <th>Activity</th>
                        {showCourse && <th>Course</th>}
                        <th>Type</th>
                        <th>Due</th>
                        {showStatus && <th>Status</th>}
                        <th aria-label="Actions" />
                    </tr>
                </thead>
                <tbody>
                    {activities.map((activity) => {
                        const submission = findSubmission(
                            submissions,
                            activity.id,
                            userId,
                        );
                        const course = coursesById.get(activity.courseId);
                        const overdue =
                            !submission?.status ||
                            submission.status === "draft" ||
                            submission.status === "rejected";

                        return (
                            <tr key={activity.id}>
                                <td>
                                    <div className="table-primary">
                                        {activity.title}
                                    </div>
                                    <div className="table-secondary">
                                        {activity.description}
                                    </div>
                                </td>
                                {showCourse && (
                                    <td>
                                        {course ? (
                                            <Link to={`/courses/${course.id}`}>
                                                {course.code}
                                            </Link>
                                        ) : (
                                            "—"
                                        )}
                                    </td>
                                )}
                                <td>
                                    <Badge tone={activityTypeTone(activity.type)}>
                                        {activityTypeLabel(activity.type)}
                                    </Badge>
                                </td>
                                <td>
                                    <span
                                        className={
                                            overdue &&
                                            isOverdue(activity.dueOn)
                                                ? "text-danger"
                                                : ""
                                        }
                                    >
                                        {formatDate(activity.dueOn)}
                                    </span>
                                </td>
                                {showStatus && (
                                    <td>
                                        <Badge
                                            tone={
                                                submission
                                                    ? submissionStatusTone(
                                                          submission.status,
                                                      )
                                                    : "neutral"
                                            }
                                        >
                                            {submission
                                                ? submissionStatusLabel(
                                                      submission.status,
                                                  )
                                                : "Not started"}
                                        </Badge>
                                    </td>
                                )}
                                <td className="table-actions">
                                    {activity.type === "programming" &&
                                    linkWorkspace ? (
                                        <Link
                                            to={`/workspace/${activity.id}`}
                                            className={buttonClass(
                                                "secondary",
                                                "sm",
                                            )}
                                        >
                                            Open
                                        </Link>
                                    ) : (
                                        <span className="muted">In class</span>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
