from motor.motor_asyncio import AsyncIOMotorClient
import os
from models.User import User
import common.auth as auth 
from datetime import datetime

db_user = os.environ.get('DB_USER','user')
db_pass = os.environ.get('DB_PASSWORD','pass')
db_host = os.environ.get('DB_HOST','localhost')

MONGO_DETAILS = f"mongodb://{db_user}:{db_pass}@{db_host}:27017"

client = AsyncIOMotorClient(MONGO_DETAILS)
db = client["twitter_clone"]

user_collection = db["users"]
post_collection = db["posts"]


async def close_db_connection():
    client.close()

async def create_indexes():
    await user_collection.create_index("username", unique=True)

async def get_user_by_username(username: str) -> User:
    user_doc = await user_collection.find_one({"$where": f"this.username === '{username}'"})
    if user_doc is None:
        return None
    
    return User(**user_doc)

async def populate_db():
    doc_count = await user_collection.count_documents({})
    if doc_count > 0:
        return
    sample_users = [
        {
            "username": "john_doe",
            "password": auth.generate_random_password(),  # Will be hashed
            "created_at": datetime.now(),
            "incorrect_attempts": 0
        },
        {
            "username": "jane_smith",
            "password": auth.generate_random_password(),  # Will be hashed
            "created_at": datetime.now(),
            "incorrect_attempts": 0
        },
        {
            "username": "admin",
            "password": os.environ.get('ADMIN_PASSWORD'),  # Will be hashed
            "created_at": datetime.now(),
            "incorrect_attempts": 0
        }
    ]

    # Insert users into the user_collection
    user_ids = {}
    for user_data in sample_users:
        user_data["password"] = auth.get_password_hash(user_data["password"])
        result = await user_collection.insert_one(user_data)
        user_ids[user_data['username']] = result.inserted_id
    print(f"Added users: {user_ids}")
    # Sample posts associated with the created users
    sample_posts = [
        {
            "user_id": user_ids['john_doe'],
            "username": "john_doe",
            "content": "Hello world, this is my first post!",
            "timestamp": datetime.now(),
            "replies": [],
            "private": False
        },
        {
            "user_id": user_ids['jane_smith'],
            "username": "jane_smith",
            "content": "Excited to join this platform!",
            "timestamp": datetime.now(),
            "replies": [],
            "private": False
        },
        {
            "user_id": user_ids['john_doe'],
            "username": "john_doe",
            "content": "Here's another update from me.",
            "timestamp": datetime.now(),
            "replies": [],
            "private": False
        },
        {
            "user_id": user_ids['admin'],
            "username": "admin",
            "content": "Check out our new functionality, private posts!",
            "timestamp": datetime.now(),
            "replies": [],
            "private": False
        },
        {
            "user_id": user_ids['admin'],
            "username": "admin",
            "content": "This post should be private, only I can see it :)",
            "timestamp": datetime.now(),
            "replies": [],
            "private": True
        },

    ]

    # Insert posts into the post_collection and store their IDs
    post_ids = []
    for post_data in sample_posts:
        result = await post_collection.insert_one(post_data)
        post_ids.append(result.inserted_id)

    # Sample replies to existing posts
    sample_replies = [
        {
            "user_id": user_ids['jane_smith'],
            "username": "jane_smith",
            "content": "Welcome, John! Glad to see your first post!",
            "timestamp": datetime.now(),
            "replies": [],
            "parent": post_ids[0],  # Reply to John's first post
            "private": False
        },
        {
            "user_id": user_ids['john_doe'],
            "username": "john_doe",
            "content": "Thanks, Jane!",
            "timestamp": datetime.now(),
            "replies": [],
            "parent": post_ids[1],  # Reply to Jane's post
            "private": False
        }
    ]

    # Insert replies and update the original posts to include reply IDs
    for reply_data in sample_replies:
        result = await post_collection.insert_one(reply_data)
        reply_id = result.inserted_id
        # Update the parent post to include this reply ID
        await post_collection.update_one(
            {"_id": reply_data["parent"]},
            {"$push": {"replies": reply_id}}
        )

