import ActivityTable from "../components/ActivityTable";
import CourseCard from "../components/CourseCard";
import {
    Badge,
    Card,
    EmptyState,
    PageHeader,
    Section,
    StatCard,
} from "../components/ui";
import { useAuth } from "../context/auth";
import { useData } from "../context/data";
import { memberships } from "../data/mockData";
import {
    findSubmission,
    formatDate,
    submissionStatusLabel,
    submissionStatusTone,
} from "../utils";
import "./Student.css";

export default function Student() {
    const { user } = useAuth();
    const { courses, activities, submissions } = useData();

    if (!user) {
        return null;
    }

    const enrolledCourseIds = new Set(
        memberships
            .filter((membership) => membership.userId === user.id)
            .map((membership) => membership.courseId),
    );

    const enrolledCourses = courses.filter((course) =>
        enrolledCourseIds.has(course.id),
    );
    const enrolledCourseIdSet = new Set(
        enrolledCourses.map((course) => course.id),
    );

    const studentActivities = activities.filter((activity) =>
        enrolledCourseIdSet.has(activity.courseId),
    );
    const studentActivityIds = new Set(
        studentActivities.map((activity) => activity.id),
    );
    const studentSubmissions = submissions.filter(
        (submission) =>
            submission.userId === user.id &&
            studentActivityIds.has(submission.activityId),
    );

    const openActivities = studentActivities.filter((activity) => {
        const submission = findSubmission(
            studentSubmissions,
            activity.id,
            user.id,
        );
        return (
            !submission ||
            submission.status === "draft" ||
            submission.status === "rejected"
        );
    });

    const pendingCount = studentSubmissions.filter(
        (submission) => submission.status === "pending",
    ).length;
    const approvedCount = studentSubmissions.filter(
        (submission) => submission.status === "approved",
    ).length;

    const upcomingActivities = [...studentActivities]
        .sort((a, b) => a.dueOn.localeCompare(b.dueOn))
        .slice(0, 6);

    const activitiesById = new Map(
        activities.map((activity) => [activity.id, activity]),
    );
    const coursesById = new Map(courses.map((course) => [course.id, course]));

    const recentSubmissions = studentSubmissions
        .filter((submission) => submission.submittedAt !== null)
        .sort((a, b) =>
            (b.submittedAt ?? "").localeCompare(a.submittedAt ?? ""),
        )
        .slice(0, 4)
        .map((submission) => ({
            submission,
            activity: activitiesById.get(submission.activityId),
        }))
        .filter((entry) => entry.activity !== undefined);

    const firstName = user.fullName.split(" ")[0];

    return (
        <div className="page stack">
            <PageHeader
                title={`Welcome back, ${firstName}`}
                subtitle="Here is what is happening across your courses."
                actions={<Badge tone="info">Student</Badge>}
            />

            <div className="stats-grid">
                <StatCard
                    label="Enrolled courses"
                    value={enrolledCourses.length}
                />
                <StatCard
                    label="Open activities"
                    value={openActivities.length}
                    hint="Includes drafts and returned work"
                />
                <StatCard label="Pending review" value={pendingCount} />
                <StatCard label="Approved" value={approvedCount} />
            </div>

            <Section
                title="Your courses"
                action={
                    <span className="muted">
                        {enrolledCourses.length}{" "}
                        {enrolledCourses.length === 1 ? "course" : "courses"}
                    </span>
                }
            >
                {enrolledCourses.length > 0 ? (
                    <div className="grid-cards">
                        {enrolledCourses.map((course) => (
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
                        title="No courses yet"
                        description="Courses you are enrolled in will appear here."
                    />
                )}
            </Section>

            <div className="dashboard-columns">
                <Section
                    title="Upcoming activities"
                    action={
                        <span className="muted">
                            Sorted by due date
                        </span>
                    }
                >
                    <ActivityTable
                        activities={upcomingActivities}
                        courses={enrolledCourses}
                        submissions={studentSubmissions}
                        userId={user.id}
                        showCourse
                        emptyMessage="You have no activities assigned."
                    />
                </Section>

                <Section title="Recent submissions">
                    {recentSubmissions.length > 0 ? (
                        <Card className="submission-list">
                            {recentSubmissions.map(
                                ({ submission, activity }) => {
                                    const course = activity
                                        ? coursesById.get(activity.courseId)
                                        : undefined;

                                    return (
                                        <div
                                            className="submission-item"
                                            key={submission.id}
                                        >
                                            <div className="submission-info">
                                                <span className="submission-title">
                                                    {activity?.title}
                                                </span>
                                                <span className="submission-meta">
                                                    {course?.code ?? "Course"}
                                                    {" · "}
                                                    {submission.submittedAt
                                                        ? formatDate(
                                                              submission.submittedAt,
                                                          )
                                                        : "Not submitted"}
                                                </span>
                                            </div>
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
                                    );
                                },
                            )}
                        </Card>
                    ) : (
                        <EmptyState
                            title="No submissions yet"
                            description="Submit an activity to see it here."
                        />
                    )}
                </Section>
            </div>
        </div>
    );
}
