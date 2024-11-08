from fastapi import APIRouter, Depends
from models.User import User
import common.database as database
import common.auth as auth
from typing import List


router = APIRouter(
    prefix="/users"
)

@router.post("/", response_model=User)
async def create_user(user: User):
    user_doc = user.model_dump(by_alias=True)
    hashed_password = auth.get_password_hash(user_doc['password'])
    new_user = {"username": user_doc["username"], "password": hashed_password}
    await database.user_collection.insert_one(new_user)
    return user_doc

@router.get("/", response_model=List[User]) # type: ignore
async def get_users(current_user: User = Depends(auth.get_current_active_user)):
    users = await database.user_collection.find().to_list(100)
    return users

@router.get("/me", response_model=User)
async def get_me(current_user: User = Depends(auth.get_current_active_user)):
    return current_user