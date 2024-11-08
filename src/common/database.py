from motor.motor_asyncio import AsyncIOMotorClient
import os
from models.User import User

db_user = os.environ.get('DB_USER','user')
db_pass = os.environ.get('DB_PASSWORD','pass')
db_host = os.environ.get('DB_HOST','localhost')

MONGO_DETAILS = f"mongodb://{db_user}:{db_pass}@{db_host}:27017"

client = AsyncIOMotorClient(MONGO_DETAILS)
db = client["twitter_clone"]

user_collection = db["users"]


async def close_db_connection():
    client.close()

async def create_indexes():
    await user_collection.create_index("username", unique=True)

async def get_user_by_username(username: str) -> User:
    user_doc = await user_collection.find_one({"username": username})
    
    if user_doc is None:
        return None
    
    return User(**user_doc)
