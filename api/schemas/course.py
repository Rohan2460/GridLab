from pydantic import BaseModel, ConfigDict, Field
from api.models import CourseStatus

class CourseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    code: str
    title: str
    status: CourseStatus
    