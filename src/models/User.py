from pydantic import BaseModel, Field
from typing import List, Optional
from models.PyObjectId import PyObjectId
from datetime import datetime
from bson import ObjectId

class User(BaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")  # Ensure it's optional and has a default
    username: str = Field(..., max_length=50)
    password: str = Field(..., min_length=8, exclude=True)
    full_name: Optional[str] = Field(None, max_length=100)
    bio: Optional[str] = Field(None, max_length=160)
    followers: List[PyObjectId] = []
    following: List[PyObjectId] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
