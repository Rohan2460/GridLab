from typing import List
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.orm import DeclarativeBase, relationship
from sqlalchemy import Integer, String, Text, DateTime, Enum as SAEnum
from sqlalchemy import ForeignKey
from datetime import datetime
from api.models.enums import UserRole, CourseStatus, ActivityType, SubmissionStatus


def enum_column(enum_class, name: str):
    return SAEnum(
        enum_class,
        name=name,
        native_enum=False,
        values_callable=lambda cls: [item.value for item in cls],
    )

class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(20), nullable=False)
    password_hash: Mapped[str] = mapped_column(String(72), nullable=False)
    full_name: Mapped[str] = mapped_column(String(20))
    email: Mapped[str] = mapped_column(String(20))
    role: Mapped[UserRole] = mapped_column(
        enum_column(UserRole, "user_role"),
        nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))

    membership: Mapped[List["CourseMembership"]] = relationship(back_populates="user")
    created_activities: Mapped[List["Activity"]] = relationship(back_populates="creator")
    submissions: Mapped[List["Submission"]] = relationship(back_populates="user")


class Course(Base):
    __tablename__ = "course"

    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(String(10), unique=True, nullable=False)
    title: Mapped[str] = mapped_column(String(20), nullable=False)
    status: Mapped[CourseStatus] = mapped_column(
        enum_column(CourseStatus, "course_status"),
        nullable=False
    )

    membership: Mapped[List["CourseMembership"]] = relationship(back_populates="course")
    activities: Mapped[List["Activity"]] = relationship(back_populates="course")


class CourseMembership(Base):
    __tablename__ = "course_membership"

    id: Mapped[int] = mapped_column(primary_key=True)
    course_id: Mapped[int] = mapped_column(
        ForeignKey("course.id", ondelete="CASCADE"),
        nullable=False
    )
    user_id: Mapped[int] = mapped_column(
        ForeignKey("user.id", ondelete="CASCADE"),
        nullable=False
    )

    course: Mapped["Course"] = relationship(back_populates="membership")
    user: Mapped["User"] = relationship(back_populates="membership")


class Activity(Base):
    __tablename__ = "activity"

    id: Mapped[int] = mapped_column(primary_key=True)
    course_id: Mapped[int] = mapped_column(
        ForeignKey("course.id", ondelete="CASCADE"),
        nullable=False
    )
    created_by: Mapped[int] = mapped_column(
        ForeignKey("user.id", ondelete="CASCADE"),
        nullable=False
    )
    type: Mapped[ActivityType] = mapped_column(
        enum_column(ActivityType, "activity_type"),
        nullable=False
    )
    title: Mapped[str] = mapped_column(String(20), nullable=False)
    description: Mapped[str] = mapped_column(Text)
    due_on: Mapped[datetime] = mapped_column(DateTime)

    course: Mapped["Course"] = relationship(back_populates="activities")
    creator: Mapped["User"] = relationship(back_populates="created_activities")
    submissions: Mapped[List["Submission"]] = relationship(back_populates="activity")


class Submission(Base):
    __tablename__ = "submission"

    id: Mapped[int] = mapped_column(primary_key=True)
    activity_id: Mapped[int] = mapped_column(
        ForeignKey("activity.id", ondelete="SET NULL")
    )
    user_id: Mapped[int] = mapped_column(
        ForeignKey("user.id", ondelete="CASCADE"),
        nullable=False
    )
    status: Mapped[SubmissionStatus] = mapped_column(
        enum_column(SubmissionStatus, "submission_status"),
        nullable=False
    )
    path:Mapped[str] = mapped_column(String(20), nullable=False)
    submitted_at: Mapped[datetime] = mapped_column(DateTime)

    activity: Mapped["Activity"] = relationship(back_populates="submissions")
    user: Mapped["User"] = relationship(back_populates="submissions")

    





