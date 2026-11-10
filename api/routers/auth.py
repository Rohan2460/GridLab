from typing import Annotated
from fastapi import Depends, APIRouter, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from api.auth import create_access_token, Token, TokenData, password_hash
from api.auth import authenticate_user, get_current_user, get_user, CreateUserRequest

from api.db.session import db_dependency

from api.models.Model import User as UserModel
from datetime import datetime, timedelta, timezone


router = APIRouter()


@router.post("/token")
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: db_dependency) -> Token:

    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(
        data={"username": user.username, "user_id": user.id, "role": user.role, "name": user.full_name}, 
    )
    return Token(access_token=access_token, token_type="bearer")


@router.get("/users/me/")
async def read_users_me(current_user: Annotated[TokenData, Depends(get_current_user)],) -> TokenData:
    return current_user


@router.post("/create_user")
async def create_user(data: CreateUserRequest, db: db_dependency) -> Token:
    
    if get_user(db, data.username):
       raise HTTPException(status_code=400, detail="User already exists")

    # if len(data.password) < 5:
    #     raise HTTPException( status_code=400, detail="Weak password")

    user = UserModel(
        username=data.username,
        hashed_password=password_hash.hash(data.password),
        full_name=data.full_name,
        email=data.email,
        role=data.role,
        created_at=datetime.now()
    )

    db.add(user)
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        print(e)
        raise HTTPException(409)
    db.refresh(user)

    access_token = create_access_token(
        {"username": user.username, "user_id": user.id, "role": user.role, "name": user.full_name}
    )

    return Token(access_token=access_token, token_type="bearer")
