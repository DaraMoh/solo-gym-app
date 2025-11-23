from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import auth

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Solo Gym API",
    description="Backend API for Solo Leveling inspired gym tracking app",
    version="1.0.0"
)

# CORS middleware for React Native app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)

@app.get("/")
async def root():
    return {"message": "Solo Gym API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
