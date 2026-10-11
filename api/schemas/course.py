from pydantic import BaseModel, ConfigDict, Field
from api.models import CourseMembership, Course, CourseStatus


class CourseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    code: str
    title: str
    status: CourseStatus


class CourseCreate(BaseModel):
    code: str
    title: str
    status: CourseStatus
    