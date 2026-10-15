from pydantic import BaseModel, ConfigDict, Field
from api.models import Activity, ActivityType, SubmissionStatus
from datetime import datetime


class ActivityResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    title: str
    type: ActivityType
    description: str
    due_on: datetime


class WorkspaceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    activity_id: int
    status: SubmissionStatus
    path: str