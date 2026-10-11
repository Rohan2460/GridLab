from pydantic import BaseModel, ConfigDict, Field
from api.models import User, UserRole

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    full_name: str
    role: UserRole