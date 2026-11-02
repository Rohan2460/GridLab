import type {
    ActivityType,
    CourseStatus,
    EditorLanguage,
    Role,
    Submission,
    SubmissionStatus,
    Tone,
} from "./types";

export function homeForRole(role: Role): string {
    switch (role) {
        case "instructor":
            return "/instructor";
        case "admin":
            return "/admin";
        default:
            return "/student";
    }
}

export function roleLabel(role: Role): string {
    return role.charAt(0).toUpperCase() + role.slice(1);
}

export function courseStatusLabel(status: CourseStatus): string {
    switch (status) {
        case "upcoming":
            return "Upcoming";
        case "live":
            return "Live";
        case "completed":
            return "Completed";
    }
}

export function courseStatusTone(status: CourseStatus): Tone {
    switch (status) {
        case "upcoming":
            return "warning";
        case "live":
            return "success";
        case "completed":
            return "neutral";
    }
}

export function activityTypeLabel(type: ActivityType): string {
    switch (type) {
        case "programming":
            return "Programming";
        case "exam":
            return "Exam";
        case "quiz":
            return "Quiz";
    }
}

export function activityTypeTone(type: ActivityType): Tone {
    switch (type) {
        case "programming":
            return "info";
        case "exam":
            return "danger";
        case "quiz":
            return "neutral";
    }
}

export function submissionStatusLabel(status: SubmissionStatus): string {
    switch (status) {
        case "draft":
            return "Draft";
        case "pending":
            return "Pending review";
        case "approved":
            return "Approved";
        case "rejected":
            return "Needs changes";
    }
}

export function submissionStatusTone(status: SubmissionStatus): Tone {
    switch (status) {
        case "draft":
            return "neutral";
        case "pending":
            return "warning";
        case "approved":
            return "success";
        case "rejected":
            return "danger";
    }
}

export function formatDate(value: string): string {
    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(value));
}

export function formatDateTime(value: string): string {
    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
}

export function isOverdue(value: string): boolean {
    return new Date(value).getTime() < Date.now();
}

export function findSubmission(
    submissions: Submission[],
    activityId: number,
    userId: number | undefined,
): Submission | undefined {
    if (userId === undefined) {
        return undefined;
    }

    return submissions.find(
        (submission) =>
            submission.activityId === activityId && submission.userId === userId,
    );
}

export function fileNameFor(language: EditorLanguage): string {
    switch (language) {
        case "c":
            return "main.c";
        case "cpp":
            return "main.cpp";
        case "python":
            return "main.py";
        case "javascript":
            return "main.js";
    }
}

export function languageLabel(language: EditorLanguage): string {
    switch (language) {
        case "c":
            return "C";
        case "cpp":
            return "C++";
        case "python":
            return "Python";
        case "javascript":
            return "JavaScript";
    }
}
