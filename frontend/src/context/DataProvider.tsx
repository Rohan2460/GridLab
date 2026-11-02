import { useState, type ReactNode } from "react";

import {
    activities as initialActivities,
    courses as initialCourses,
    submissions as initialSubmissions,
    users,
} from "../data/mockData";
import type {
    Activity,
    Course,
    Submission,
    SubmissionStatus,
} from "../types";
import {
    DataContext,
    type NewActivityInput,
    type NewCourseInput,
} from "./data";

function nextId(items: { id: number }[]): number {
    return items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

export function DataProvider({ children }: { children: ReactNode }) {
    const [courses, setCourses] = useState<Course[]>(initialCourses);
    const [activities, setActivities] = useState<Activity[]>(initialActivities);
    const [submissions, setSubmissions] =
        useState<Submission[]>(initialSubmissions);

    function addCourse(input: NewCourseInput) {
        setCourses((current) => [
            ...current,
            { ...input, id: nextId(current) },
        ]);
    }

    function updateCourseStatus(courseId: number, status: Course["status"]) {
        setCourses((current) =>
            current.map((course) =>
                course.id === courseId ? { ...course, status } : course,
            ),
        );
    }

    function addActivity(input: NewActivityInput) {
        setActivities((current) => [
            ...current,
            { ...input, id: nextId(current) },
        ]);
    }

    function submitActivity(
        activityId: number,
        userId: number,
        content: string,
        language: Submission["language"],
    ) {
        const submittedAt = new Date().toISOString();

        setSubmissions((current) => {
            const existing = current.find(
                (submission) =>
                    submission.activityId === activityId &&
                    submission.userId === userId,
            );

            if (existing) {
                return current.map((submission) =>
                    submission.id === existing.id
                        ? {
                              ...submission,
                              status: "pending",
                              submittedAt,
                              content,
                              language,
                          }
                        : submission,
                );
            }

            return [
                ...current,
                {
                    id: nextId(current),
                    activityId,
                    userId,
                    status: "pending",
                    submittedAt,
                    content,
                    language,
                },
            ];
        });
    }

    function updateSubmissionStatus(
        activityId: number,
        userId: number,
        status: SubmissionStatus,
    ) {
        setSubmissions((current) =>
            current.map((submission) =>
                submission.activityId === activityId &&
                submission.userId === userId
                    ? { ...submission, status }
                    : submission,
            ),
        );
    }

    return (
        <DataContext.Provider
            value={{
                users,
                courses,
                activities,
                submissions,
                addCourse,
                updateCourseStatus,
                addActivity,
                submitActivity,
                updateSubmissionStatus,
            }}
        >
            {children}
        </DataContext.Provider>
    );
}
