import type {
    Activity,
    Course,
    CourseMembership,
    Role,
    Submission,
    User,
} from "../types";

export const starterCode: Record<Activity["language"], string> = {
    c: `#include <stdio.h>

int main(void) {
    printf("Hello, World!\\n");
    return 0;
}
`,
    cpp: `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
`,
    python: `def main():
    print("Hello, World!")


if __name__ == "__main__":
    main()
`,
    javascript: `function main() {
    console.log("Hello, World!");
}

main();
`,
};

export const users: User[] = [
    {
        id: 1,
        username: "student01",
        fullName: "Alex Student",
        email: "student@gridlab.local",
        role: "student",
    },
    {
        id: 2,
        username: "instructor01",
        fullName: "Dr. Grace Hopper",
        email: "instructor@gridlab.local",
        role: "instructor",
    },
    {
        id: 3,
        username: "admin",
        fullName: "Admin User",
        email: "admin@gridlab.local",
        role: "admin",
    },
];

export const courses: Course[] = [
    {
        id: 1,
        code: "CS101",
        title: "Programming Fundamentals",
        description:
            "Introduction to C programming, control flow, functions, and problem solving.",
        status: "live",
        instructorId: 2,
    },
    {
        id: 2,
        code: "CS102",
        title: "Databases",
        description:
            "Relational modelling, SQL queries, transactions, and database design.",
        status: "upcoming",
        instructorId: 2,
    },
    {
        id: 3,
        code: "CS201",
        title: "Java Programming",
        description:
            "Object-oriented design and the Java standard library through practical labs.",
        status: "completed",
        instructorId: 2,
    },
];

export const memberships: CourseMembership[] = [
    { courseId: 1, userId: 1 },
    { courseId: 2, userId: 1 },
    { courseId: 3, userId: 1 },
    { courseId: 1, userId: 2 },
    { courseId: 2, userId: 2 },
    { courseId: 3, userId: 2 },
];

export const activities: Activity[] = [
    {
        id: 1,
        courseId: 1,
        type: "programming",
        title: "Hello World",
        description: "Write a C program that prints Hello, World! to the terminal.",
        dueOn: "2026-11-08T23:59:00",
        language: "c",
        starterCode: starterCode.c,
    },
    {
        id: 2,
        courseId: 1,
        type: "programming",
        title: "Add Two Numbers",
        description:
            "Read two integers from standard input and print their sum.",
        dueOn: "2026-11-12T23:59:00",
        language: "c",
        starterCode: `#include <stdio.h>

int main(void) {
    int a, b;
    scanf("%d %d", &a, &b);

    printf("%d\\n", a + b);
    return 0;
}
`,
    },
    {
        id: 3,
        courseId: 1,
        type: "quiz",
        title: "C Basics Quiz",
        description: "Short quiz covering variables, types, and operators.",
        dueOn: "2026-11-05T23:59:00",
        language: "c",
        starterCode: starterCode.c,
    },
    {
        id: 4,
        courseId: 1,
        type: "exam",
        title: "Midterm Exam",
        description: "In-class practical exam covering weeks 1 to 5.",
        dueOn: "2026-11-18T09:00:00",
        language: "c",
        starterCode: starterCode.c,
    },
    {
        id: 5,
        courseId: 2,
        type: "programming",
        title: "SQL Queries",
        description:
            "Write SQL queries to answer the questions in the activity brief.",
        dueOn: "2026-11-20T23:59:00",
        language: "python",
        starterCode: `# Use the provided SQLite database to answer each question.
# Print one result per question.


def main():
    print("Your queries here")


if __name__ == "__main__":
    main()
`,
    },
    {
        id: 6,
        courseId: 3,
        type: "programming",
        title: "Final Project",
        description:
            "Build a small Java application that manages a library catalogue.",
        dueOn: "2026-10-15T23:59:00",
        language: "javascript",
        starterCode: `function main() {
    console.log("Library catalogue");
}

main();
`,
    },
];

export const submissions: Submission[] = [
    {
        id: 1,
        activityId: 1,
        userId: 1,
        status: "approved",
        submittedAt: "2026-10-28T14:12:00",
        language: "c",
        content: starterCode.c,
    },
    {
        id: 2,
        activityId: 2,
        userId: 1,
        status: "draft",
        submittedAt: null,
        language: "c",
        content: `#include <stdio.h>

int main(void) {
    int a, b;
    scanf("%d %d", &a, &b);

    printf("%d\\n", a + b);
    return 0;
}
`,
    },
    {
        id: 3,
        activityId: 3,
        userId: 1,
        status: "pending",
        submittedAt: "2026-10-30T18:40:00",
        language: "c",
        content: `#include <stdio.h>

int main(void) {
    int score = 0;
    int value = 10;

    score += value * 2;
    printf("Quiz score: %d\\n", score);
    return 0;
}
`,
    },
    {
        id: 4,
        activityId: 6,
        userId: 1,
        status: "approved",
        submittedAt: "2026-10-14T11:05:00",
        language: "javascript",
        content: `const catalogue = [];

function addBook(title, author) {
    catalogue.push({ title, author, available: true });
}

addBook("The C Programming Language", "Kernighan and Ritchie");
addBook("Structure and Interpretation of Computer Programs", "Abelson and Sussman");

console.log(catalogue);
`,
    },
];

export interface DemoAccount {
    role: Role;
    username: string;
    password: string;
    label: string;
}

export const demoAccounts: DemoAccount[] = [
    {
        role: "student",
        username: "student01",
        password: "student123",
        label: "Student",
    },
    {
        role: "instructor",
        username: "instructor01",
        password: "instructor123",
        label: "Instructor",
    },
    {
        role: "admin",
        username: "admin",
        password: "admin123",
        label: "Admin",
    },
];
