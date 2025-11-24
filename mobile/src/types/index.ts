// User and Progress Types
export enum Rank {
  E = 'E',
  D = 'D',
  C = 'C',
  B = 'B',
  A = 'A',
  S = 'S',
}

export interface UserProfile {
  id: string;
  username: string;
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  rank: Rank;
  totalWorkouts: number;
  currentStreak: number;
  longestStreak: number;
  stats: UserStats;
  createdAt: Date;
}

export interface UserStats {
  strength: number;
  endurance: number;
  consistency: number;
  totalVolumeLifted: number; // in lbs
  totalWorkoutTime: number; // in minutes
}

// Exercise and Workout Types
export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  muscleGroups: MuscleGroup[];
  isCustom: boolean;
}

export enum ExerciseCategory {
  STRENGTH = 'STRENGTH',
  CARDIO = 'CARDIO',
  FLEXIBILITY = 'FLEXIBILITY',
  SPORTS = 'SPORTS',
}

export enum MuscleGroup {
  CHEST = 'CHEST',
  BACK = 'BACK',
  SHOULDERS = 'SHOULDERS',
  ARMS = 'ARMS',
  LEGS = 'LEGS',
  CORE = 'CORE',
  FULL_BODY = 'FULL_BODY',
}

export interface WorkoutSet {
  setNumber: number;
  reps?: number; // for strength training
  weight?: number; // in lbs, for strength training
  duration?: number; // in minutes, for cardio
  calories?: number; // optional, for cardio
  completed: boolean;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutSet[];
  notes?: string;
}

export interface Workout {
  id: string;
  userId: string;
  title: string;
  exercises: WorkoutExercise[];
  startTime: Date;
  endTime?: Date;
  duration?: number; // in minutes
  totalVolume: number; // total weight lifted
  xpEarned: number;
  completed: boolean;
  createdAt: Date;
}

export interface WorkoutTemplate {
  id: string;
  userId: string;
  title: string;
  exercises: WorkoutExercise[];
  createdAt: Date;
  lastUsed?: Date;
}

// Mission Types
export enum MissionType {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
}

export enum MissionStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED',
}

export interface MissionRequirement {
  type: 'WORKOUT_COUNT' | 'EXERCISE_COUNT' | 'VOLUME' | 'DURATION' | 'SPECIFIC_EXERCISE';
  target: number;
  current: number;
  exerciseId?: string; // for specific exercise missions
  exerciseName?: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  type: MissionType;
  requirement: MissionRequirement;
  xpReward: number;
  status: MissionStatus;
  expiresAt: Date;
  createdAt: Date;
  completedAt?: Date;
}

// Milestone Types (for future implementation)
export interface Milestone {
  id: string;
  title: string;
  description: string;
  requirement: string;
  xpReward: number;
  completed: boolean;
  completedAt?: Date;
}
