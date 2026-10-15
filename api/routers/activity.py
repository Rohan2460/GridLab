from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from api.models import Activity, ActivityType
from api.schemas.activity import ActivityResponse
from api.db.session import get_db

DbSession = Annotated[Session, Depends(get_db)]

router = APIRouter()

@router.get("", response_model=list[ActivityResponse])
def list_activity(db: DbSession):
    return db.scalars(select(Activity)).all()

