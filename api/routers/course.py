from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from api.models import Course, User, CourseMembership
from api.schemas.course import CourseResponse, CourseCreate
from api.schemas.user import UserResponse
from api.db.session import get_db

DbSession = Annotated[Session, Depends(get_db)]

router = APIRouter()

@router.get("", response_model=list[CourseResponse])
def list_courses(db: DbSession):
    courses = db.scalars(select(Course)).all()
    return courses


@router.post("", response_model=CourseResponse)
def create_course(data: CourseCreate, db: DbSession):
    course = Course(**data.model_dump())
    db.add(course)

    try:
        db.commit()
    except Exception as e:
        db.rollback()
        print(e)
        raise HTTPException(409)
    db.refresh(course)

    return course


@router.get("/{course_id}", response_model=CourseResponse)
def get_course(course_id: int, db: DbSession):
    course = db.get(Course, course_id)

    if not course:
        raise HTTPException(404)

    return course


@router.get("/{course_id}/members", response_model=list[UserResponse])
def get_member(course_id: int, db:DbSession):
    stmt = (
        select(User)
        .join(CourseMembership)
        .where(CourseMembership.course_id == course_id)
    )
    
    return db.scalars(stmt).all()

