from enum import Enum
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class Rank(str, Enum):
    E = "E"
    D = "D"
    C = "C"
    B = "B"
    A = "A"
    S = "S"


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
