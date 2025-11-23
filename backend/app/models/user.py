from enum import Enum
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from sqlalchemy import Column, Integer, String, DateTime, Float
from app.database import Base


class Rank(str, Enum):
    E = "E"
    D = "D"
    C = "C"
    B = "B"
    A = "A"
    S = "S"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    level = Column(Integer, default=1)
    current_xp = Column(Integer, default=0)
    xp_to_next_level = Column(Integer, default=100)
    rank = Column(String, default=Rank.E.value)
    total_workouts = Column(Integer, default=0)
    current_streak = Column(Integer, default=0)
    longest_streak = Column(Integer, default=0)
    strength = Column(Float, default=0.0)
    endurance = Column(Float, default=0.0)
    consistency = Column(Float, default=0.0)
    total_volume_lifted = Column(Float, default=0.0)
    total_workout_time = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)


class UserStats(BaseModel):
    strength: float = 0.0
    endurance: float = 0.0
    consistency: float = 0.0
    total_volume_lifted: float = 0.0  # in kg
    total_workout_time: int = 0  # in minutes


class UserProfile(BaseModel):
    id: str
    username: str
    level: int = 1
    current_xp: int = 0
    xp_to_next_level: int = 100
    rank: Rank = Rank.E
    total_workouts: int = 0
    current_streak: int = 0
    longest_streak: int = 0
    stats: UserStats = Field(default_factory=UserStats)
    created_at: datetime = Field(default_factory=datetime.now)
