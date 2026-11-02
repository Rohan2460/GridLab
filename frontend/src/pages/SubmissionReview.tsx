import { useState } from "react";
import { Link, useParams } from "react-router";

import { buttonClass } from "../components/buttonStyles";
import CodeEditor from "../components/Editor";
import {
    Badge,
    Button,
    Card,
    EmptyState,
    PageHeader,
    Section,
} from "../components/ui";
import { useAuth } from "../context/auth";
import { useData } from "../context/data";
import {
    activityTypeLabel,
    activityTypeTone,
    fileNameFor,
    formatDate,
    formatDateTime,
    languageLabel,
    submissionStatusLabel,
    submissionStatusTone,
} from "../utils";
import "./SubmissionReview.css";

export default function SubmissionReview() {
    const { submissionId } = useParams();
    const { user } = useAuth();
    const {
        users,
        courses,
        activities,
        submissions,
        updateSubmissionStatus,
    } = useData();
    const [notice, setNotice] = useState("");

    if (!user) {
        return null;
    }

    const submission = submissions.find(
        (item) => item.id === Number(submissionId),
    );
    const activity = submission
        ? activities.find((item) => item.id === submission.activityId)
        : undefined;
    const course = activity
        ? courses.find((item) => item.id === activity.courseId)
        : undefined;

    if (
        !submission ||
        !activity ||
        !course ||
        course.instructorId !== user.id
    ) {
        return (
            <div className="page">
                <EmptyState
                    title="Submission not found"
                    description="This submission may have been removed, or it does not belong to one of your courses."
                    action={
                        <Link
                            to="/instructor"
                            className={buttonClass("secondary", "sm")}
                        >
                            Back to dashboard
                        </Link>
                    }
                />
            </div>
        );
    }

    const reviewSubmission = submission;
    const reviewActivity = activity;
    const reviewCourse = course;
    const student = users.find((item) => item.id === reviewSubmission.userId);

    function handleDecision(status: "approved" | "rejected") {
        updateSubmissionStatus(
            reviewSubmission.activityId,
            reviewSubmission.userId,
            status,
        );
        setNotice(
            status === "approved"
                ? "Submission approved."
                : "Submission returned for changes.",
        );
    }

    return (
        <div className="page stack">
            <div>
                <Link to="/instructor" className="submission-review-back">
                    Back to dashboard
                </Link>

                <PageHeader
                    title={reviewActivity.title}
                    subtitle={`Submitted by ${
                        student?.fullName ?? "a student"
                    } for ${reviewCourse.code}.`}
                    actions={
                        <Badge
                            tone={submissionStatusTone(
                                reviewSubmission.status,
                            )}
                        >
                            {submissionStatusLabel(reviewSubmission.status)}
                        </Badge>
                    }
                />
            </div>

            <Card className="review-summary">
                <div className="review-summary-item">
                    <span className="review-summary-label">Student</span>
                    <span className="review-summary-value">
                        {student?.fullName ?? "Unknown student"}
                    </span>
                    {student?.username && (
                        <span className="review-summary-meta">
                            @{student.username}
                        </span>
                    )}
                </div>

                <div className="review-summary-item">
                    <span className="review-summary-label">Course</span>
                    <span className="review-summary-value">
                        {reviewCourse.code}
                    </span>
                    <span className="review-summary-meta">
                        {reviewCourse.title}
                    </span>
                </div>

                <div className="review-summary-item">
                    <span className="review-summary-label">Activity type</span>
                    <span className="review-summary-value">
                        <Badge tone={activityTypeTone(reviewActivity.type)}>
                            {activityTypeLabel(reviewActivity.type)}
                        </Badge>
                    </span>
                </div>

                <div className="review-summary-item">
                    <span className="review-summary-label">Submitted</span>
                    <span className="review-summary-value">
                        {reviewSubmission.submittedAt
                            ? formatDateTime(reviewSubmission.submittedAt)
                            : "Not submitted"}
                    </span>
                </div>

                <div className="review-summary-item">
                    <span className="review-summary-label">Due</span>
                    <span className="review-summary-value">
                        {formatDate(reviewActivity.dueOn)}
                    </span>
                </div>

                <div className="review-summary-item">
                    <span className="review-summary-label">Language</span>
                    <span className="review-summary-value">
                        {languageLabel(reviewSubmission.language)}
                    </span>
                </div>
            </Card>

            {notice && (
                <div className="review-notice" role="status">
                    {notice}
                </div>
            )}

            <Section
                title="Submitted code"
                action={
                    <Badge tone="info">
                        {languageLabel(reviewSubmission.language)}
                    </Badge>
                }
            >
                {reviewSubmission.content.trim() ? (
                    <div className="submission-code-panel">
                        <div className="submission-code-header">
                            <span>
                                {fileNameFor(reviewSubmission.language)}
                            </span>
                            <span>Read only</span>
                        </div>
                        <CodeEditor
                            value={reviewSubmission.content}
                            language={reviewSubmission.language}
                            readOnly
                        />
                    </div>
                ) : (
                    <EmptyState
                        title="No code submitted"
                        description="This submission does not contain any code."
                    />
                )}
            </Section>

            <div className="review-decision">
                <div>
                    <span className="review-decision-label">
                        Review decision
                    </span>
                    <p className="review-decision-hint">
                        Approve the submission or return it for changes.
                    </p>
                </div>

                <div className="review-decision-actions">
                    <Button
                        variant="secondary"
                        disabled={reviewSubmission.status === "approved"}
                        onClick={() => handleDecision("approved")}
                    >
                        Approve
                    </Button>
                    <Button
                        variant="danger"
                        disabled={reviewSubmission.status === "rejected"}
                        onClick={() => handleDecision("rejected")}
                    >
                        Reject
                    </Button>
                </div>
            </div>
        </div>
    );
}
