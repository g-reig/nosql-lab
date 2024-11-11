from fastapi import FastAPI, Depends, HTTPException
import common.database as database
from fastapi.security import OAuth2PasswordRequestForm
import common.auth as auth
from routers import users, posts
from fastapi.middleware.cors import CORSMiddleware
import os

async def lifespan(app):
    # Create indexes on app startup
    await database.create_indexes()
    yield

app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.environ.get('FRONTEND_URL')],  # List of origins allowed to access the server
    # allow_origins=['http://localhost:8001'],
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (e.g., GET, POST)
    allow_headers=["*"],  # Allows all headers
)

app.include_router(users.router)
app.include_router(posts.router)


@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await database.get_user_by_username(form_data.username)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    if not auth.verify_password(form_data.password, user.password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}