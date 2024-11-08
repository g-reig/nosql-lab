from pydantic import BaseModel, Field
from typing import List, Optional
from models.PyObjectId import PyObjectId
from datetime import datetime
from bson import ObjectId

class Post(BaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")  # Ensure it's optional and has a default
    user_id: PyObjectId = Field(...)
    content: str = Field(..., max_length=128)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    replies: List[PyObjectId] = []

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}