from pydantic import BaseModel, Field
from typing import List, Optional
from models.PyObjectId import PyObjectId
from datetime import datetime

class Post(BaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")  # Ensure it's optional and has a default
    user_id: Optional[PyObjectId] = Field(default=None)
    username: Optional[str] = Field(default=None)
    content: str = Field(..., max_length=128)
    timestamp: datetime = Field(default_factory=datetime.now)
    replies: List[PyObjectId] = []
    parent: Optional[PyObjectId] = Field(default=None)
    private: Optional[bool] = Field(default=False)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {PyObjectId: str}

class PostWithReplies(Post):
    replies: List[Post] = []  # This will allow replies to be full Post objects, not just ObjectId