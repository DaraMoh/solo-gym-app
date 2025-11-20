from enum import Enum
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class ExerciseCategory(str, Enum):
    STRENGTH = "STRENGTH"
    CARDIO = "CARDIO"
    FLEXIBILITY = "FLEXIBILITY"
    SPORTS = "SPORTS"


class MuscleGroup(str, Enum):
    CHEST = "CHEST"
    BACK = "BACK"
    SHOULDERS = "SHOULDERS"
    ARMS = "ARMS"
    LEGS = "LEGS"
    CORE = "CORE"
    FULL_BODY = "FULL_BODY"


class Exercise(BaseModel):
    id: str
    name: str
    category: ExerciseCategory
    muscle_groups: List[MuscleGroup]
    is_custom: bool = False


class WorkoutSet(BaseModel):
    set_number: int
    reps: int
    weight: float  # in kg
    completed: bool = False


class WorkoutExercise(BaseModel):
    id: str
    exercise_id: str
    exercise_name: str
    sets: List[WorkoutSet]
    notes: Optional[str] = None


class Workout(BaseModel):
    id: str
    user_id: str
    title: str
    exercises: List[WorkoutExercise]
    start_time: datetime
    end_time: Optional[datetime] = None
    duration: Optional[int] = None  # in minutes
    total_volume: float = 0.0  # total weight lifted
    xp_earned: int = 0
    completed: bool = False
    created_at: datetime = Field(default_factory=datetime.now)
