from fastapi import APIRouter, Depends, HTTPException
from models.User import User, UserWithPosts
import common.database as database
import common.auth as auth
from typing import List
from models.PyObjectId import PyObjectId

router = APIRouter(
    prefix="/users"
)

@router.post("/", response_model=User)
async def create_user(user: User):
    hashed_password = auth.get_password_hash(user.password)
    new_user = {"username": user.username, "password": hashed_password}
    inserted_user = await database.user_collection.insert_one(new_user)
    created_user = await database.user_collection.find_one({"_id": inserted_user.inserted_id})

    return created_user

@router.get("/", response_model=List[User]) # type: ignore
async def get_users(current_user: User = Depends(auth.get_current_active_user)):
    users = await database.user_collection.find().to_list(100)
    return users

@router.get("/me", response_model=User)
async def get_me(current_user: User = Depends(auth.get_current_active_user)):
    return current_user

@router.get("/{user_id}", response_model=UserWithPosts)
async def get_user(user_id: PyObjectId, current_user: User = Depends(auth.get_current_active_user)):
    user = await database.user_collection.find_one({"_id": user_id})
    posts = await database.post_collection.find({"user_id": user_id}).to_list(length=100)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    print(posts)
    user["posts"] = posts
    return user