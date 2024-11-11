from fastapi import APIRouter, Depends, Query, HTTPException
from models.User import User
from models.Post import Post, PostWithReplies
from models.PyObjectId import PyObjectId
import common.database as database
import common.auth as auth
from typing import List


router = APIRouter(
    prefix="/posts"
)

@router.post("/", response_model=Post) # type: ignore
async def create_post(post: Post, current_user: User = Depends(auth.get_current_active_user)):
    post.user_id = current_user.id
    post.username = current_user.username
    post_data = post.model_dump()

    # Insert the post into the database
    inserted_post = await database.post_collection.insert_one(post_data)
    new_post = await database.post_collection.find_one({"_id": inserted_post.inserted_id})
    return new_post

@router.get("/", response_model=List[Post]) # type: ignore
async def get_posts(current_user: User = Depends(auth.get_current_active_user), original: bool = Query(True, description="Fetch only original posts (without parent)")):
    if original:
        posts = await database.post_collection.find({"parent": None}).to_list(100)
    else:
        posts = await database.post_collection.find().to_list(100)
    return posts

@router.get("/{post_id}", response_model=PostWithReplies)
async def get_post(post_id: PyObjectId, current_user: User = Depends(auth.get_current_active_user)):
    # Fetch the post by its ID
    post = await database.post_collection.find_one({"_id": post_id})
    
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Fetch details for each reply using the reply IDs
    replies = []
    for reply_id in post.get("replies", []):
        reply = await database.post_collection.find_one({"_id": reply_id})
        if reply:
            replies.append(reply)
    
    # Return the post along with detailed replies
    post["replies"] = replies
    return post

@router.post("/{post_id}/reply", response_model=Post)
async def reply_to_post(post_id: PyObjectId, reply: Post, current_user: User = Depends(auth.get_current_active_user)):
    reply.user_id = current_user.id
    reply.username = current_user.username
    reply.parent = post_id
    reply_data = reply.model_dump()
    reply_data.pop("replies")
    result = await database.post_collection.insert_one(reply_data)
    
    await database.post_collection.update_one(
        {"_id": post_id},
        {"$push": {"replies": result.inserted_id}}  # Push the reply ID to the 'replies' array
    )
    
    reply.id = result.inserted_id
    return reply