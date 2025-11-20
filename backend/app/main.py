from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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

@app.get("/")
async def root():
    return {"message": "Solo Gym API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
