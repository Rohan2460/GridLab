import { Link } from "react-router";

import type { Course } from "../types";
import { courseStatusLabel, courseStatusTone } from "../utils";
import { buttonClass } from "./buttonStyles";
import { Badge, Card } from "./ui";

interface CourseCardProps {
    course: Course;
    activityCount: number;
}

export default function CourseCard({ course, activityCount }: CourseCardProps) {
    return (
        <Card className="course-card">
            <div className="course-card-top">
                <span className="course-card-code">{course.code}</span>
                <Badge tone={courseStatusTone(course.status)}>
                    {courseStatusLabel(course.status)}
                </Badge>
            </div>

            <h3 className="course-card-title">
                <Link to={`/courses/${course.id}`}>{course.title}</Link>
            </h3>

            <p className="course-card-description">{course.description}</p>

            <div className="course-card-footer">
                <span className="muted">
                    {activityCount}{" "}
                    {activityCount === 1 ? "activity" : "activities"}
                </span>
                <Link
                    to={`/courses/${course.id}`}
                    className={buttonClass("secondary", "sm")}
                >
                    View course
                </Link>
            </div>
        </Card>
    );
}
