from enum import Enum
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class MissionType(str, Enum):
    DAILY = "DAILY"
    WEEKLY = "WEEKLY"


class MissionStatus(str, Enum):
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"
    EXPIRED = "EXPIRED"


class MissionRequirement(BaseModel):
    type: str  # WORKOUT_COUNT, EXERCISE_COUNT, VOLUME, DURATION, SPECIFIC_EXERCISE
    target: int
    current: int = 0
    exercise_id: Optional[str] = None
    exercise_name: Optional[str] = None


class Mission(BaseModel):
    id: str
    title: str
    description: str
    type: MissionType
    requirement: MissionRequirement
    xp_reward: int
    status: MissionStatus = MissionStatus.ACTIVE
    expires_at: datetime
    created_at: datetime = Field(default_factory=datetime.now)
    completed_at: Optional[datetime] = None
