from datetime import datetime, timezone

from api.db.session import Session
from api.models import (
    User,
    Course,
    CourseMembership,
    Activity,
    Submission,
    UserRole,
    CourseStatus,
    ActivityType,
    SubmissionStatus,
)


def seed_database():
    with Session() as db:
        # Avoid inserting duplicates when the script is run again.
        if db.query(User).filter_by(username="admin").first():
            print("Dummy data already exists.")
            return

        now = datetime.now(timezone.utc)

        # Users
        admin = User(
            username="admin",
            password_hash="dummy_hash_not_for_authentication",
            full_name="Admin User",
            email="admin@example.com",
            role=UserRole.ADMIN,
            created_at=now,
        )

        instructor = User(
            username="instructor01",
            password_hash="dummy_hash_not_for_authentication",
            full_name="Test Instructor",
            email="instructor@example.com",
            role=UserRole.INSTRUCTOR,
            created_at=now,
        )

        student = User(
            username="student01",
            password_hash="dummy_hash_not_for_authentication",
            full_name="Test Student",
            email="student@example.com",
            role=UserRole.STUDENT,
            created_at=now,
        )

        db.add_all([admin, instructor, student])
        db.flush()

        # Course
        course = Course(
            code="CS101",
            title="Programming",
            status=CourseStatus.LIVE,
        )

        db.add(course)
        db.flush()

        # Memberships
        memberships = [
            CourseMembership(
                course_id=course.id,
                user_id=instructor.id,
            ),
            CourseMembership(
                course_id=course.id,
                user_id=student.id,
            ),
        ]

        db.add_all(memberships)
        db.flush()

        # Activity
        activity = Activity(
            course_id=course.id,
            created_by=instructor.id,
            type=ActivityType.PROGRAMMING,
            title="Hello World",
            description="Write a program that prints Hello World.",
            due_on=now,
        )

        db.add(activity)
        db.flush()

        # Submission
        submission = Submission(
            activity_id=activity.id,
            user_id=student.id,
            status=SubmissionStatus.PENDING,
            path="submissions/1/attempt-1",
            submitted_at=now,
        )

        db.add(submission)
        db.commit()

        print("Dummy data inserted successfully.")


if __name__ == "__main__":
    seed_database()