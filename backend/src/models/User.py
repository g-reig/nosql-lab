from pydantic import BaseModel, Field
from typing import List, Optional
from models.PyObjectId import PyObjectId
from datetime import datetime
from bson import ObjectId
from models.Post import Post

class User(BaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")  # Ensure it's optional and has a default
    username: str = Field(..., max_length=50)
    password: str = Field(..., min_length=8, exclude=True)
    created_at: datetime = Field(default_factory=datetime.now)
    incorrect_attempts: Optional[int] = Field(default=0, exclude=True)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class UserWithPosts(User):
    posts: List[Post] = []
