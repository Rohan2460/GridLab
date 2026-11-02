import { createContext, useContext } from "react";

import type {
    Activity,
    ActivityType,
    Course,
    CourseStatus,
    EditorLanguage,
    Submission,
    SubmissionStatus,
    User,
} from "../types";

export interface NewCourseInput {
    code: string;
    title: string;
    description: string;
    status: CourseStatus;
    instructorId: number;
}

export interface NewActivityInput {
    courseId: number;
    type: ActivityType;
    title: string;
    description: string;
    dueOn: string;
    language: EditorLanguage;
    starterCode: string;
}

export interface DataContextValue {
    users: User[];
    courses: Course[];
    activities: Activity[];
    submissions: Submission[];
    addCourse: (input: NewCourseInput) => void;
    updateCourseStatus: (courseId: number, status: CourseStatus) => void;
    addActivity: (input: NewActivityInput) => void;
    submitActivity: (
        activityId: number,
        userId: number,
        content: string,
        language: EditorLanguage,
    ) => void;
    updateSubmissionStatus: (
        activityId: number,
        userId: number,
        status: SubmissionStatus,
    ) => void;
}

export const DataContext = createContext<DataContextValue | undefined>(
    undefined,
);

export function useData(): DataContextValue {
    const context = useContext(DataContext);

    if (!context) {
        throw new Error("useData must be used within a DataProvider");
    }

    return context;
}
