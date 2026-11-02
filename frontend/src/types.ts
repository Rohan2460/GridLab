export type Role = "student" | "instructor" | "admin";

export type CourseStatus = "upcoming" | "live" | "completed";

export type ActivityType = "programming" | "exam" | "quiz";

export type SubmissionStatus = "draft" | "pending" | "approved" | "rejected";

export type EditorLanguage = "c" | "cpp" | "python" | "javascript";

export type Tone = "neutral" | "info" | "success" | "warning" | "danger";

export interface User {
    id: number;
    username: string;
    fullName: string;
    email: string;
    role: Role;
}

export interface Course {
    id: number;
    code: string;
    title: string;
    description: string;
    status: CourseStatus;
    instructorId: number;
}

export interface CourseMembership {
    courseId: number;
    userId: number;
}

export interface Activity {
    id: number;
    courseId: number;
    type: ActivityType;
    title: string;
    description: string;
    dueOn: string;
    language: EditorLanguage;
    starterCode: string;
}

export interface Submission {
    id: number;
    activityId: number;
    userId: number;
    status: SubmissionStatus;
    submittedAt: string | null;
    language: EditorLanguage;
    content: string;
}
