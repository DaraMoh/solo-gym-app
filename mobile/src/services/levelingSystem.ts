import { Rank, UserProfile, Workout } from '../types';

// XP calculation constants
const BASE_WORKOUT_XP = 50;
const XP_PER_SET = 5;
const XP_PER_LB = 0.2; // Adjusted for lbs (roughly 0.5 / 2.2)
const DURATION_BONUS_PER_MIN = 2;
const COMPLETION_BONUS = 25;

// Level progression constants
const BASE_XP_FOR_LEVEL_2 = 100;
const XP_MULTIPLIER = 1.5;

// Rank thresholds
const RANK_THRESHOLDS = {
  [Rank.E]: 1,
  [Rank.D]: 10,
  [Rank.C]: 25,
  [Rank.B]: 50,
  [Rank.A]: 75,
  [Rank.S]: 100,
};

/**
 * Calculate XP earned from a workout
 */
export const calculateWorkoutXP = (workout: Workout): number => {
  let xp = BASE_WORKOUT_XP;

  // Add XP for each set completed
  workout.exercises.forEach((exercise) => {
    exercise.sets.forEach((set) => {
      if (set.completed) {
        xp += XP_PER_SET;
        xp += set.weight * XP_PER_LB;
      }
    });
  });

  // Add duration bonus
  if (workout.duration) {
    xp += workout.duration * DURATION_BONUS_PER_MIN;
  }

  // Add completion bonus
  if (workout.completed) {
    xp += COMPLETION_BONUS;
  }

  return Math.floor(xp);
};

/**
 * Calculate XP required for next level
 */
export const calculateXPForNextLevel = (currentLevel: number): number => {
  return Math.floor(BASE_XP_FOR_LEVEL_2 * Math.pow(XP_MULTIPLIER, currentLevel - 1));
};

/**
 * Calculate total XP needed to reach a specific level
 */
export const calculateTotalXPForLevel = (level: number): number => {
  let totalXP = 0;
  for (let i = 1; i < level; i++) {
    totalXP += calculateXPForNextLevel(i);
  }
  return totalXP;
};

/**
 * Determine rank based on level
 */
export const getRankForLevel = (level: number): Rank => {
  if (level >= RANK_THRESHOLDS[Rank.S]) return Rank.S;
  if (level >= RANK_THRESHOLDS[Rank.A]) return Rank.A;
  if (level >= RANK_THRESHOLDS[Rank.B]) return Rank.B;
  if (level >= RANK_THRESHOLDS[Rank.C]) return Rank.C;
  if (level >= RANK_THRESHOLDS[Rank.D]) return Rank.D;
  return Rank.E;
};

/**
 * Add XP to user profile and handle level ups
 */
export const addXPToProfile = (
  profile: UserProfile,
  xpToAdd: number
): {
  updatedProfile: UserProfile;
  leveledUp: boolean;
  newLevel?: number;
  oldLevel?: number;
} => {
  const newXP = profile.currentXP + xpToAdd;
  let currentLevel = profile.level;
  let xpForNextLevel = profile.xpToNextLevel;
  let remainingXP = newXP;
  let leveledUp = false;
  const oldLevel = currentLevel;

  // Check for level ups
  while (remainingXP >= xpForNextLevel) {
    remainingXP -= xpForNextLevel;
    currentLevel += 1;
    xpForNextLevel = calculateXPForNextLevel(currentLevel);
    leveledUp = true;
  }

  const newRank = getRankForLevel(currentLevel);

  const updatedProfile: UserProfile = {
    ...profile,
    level: currentLevel,
    currentXP: remainingXP,
    xpToNextLevel: xpForNextLevel,
    rank: newRank,
  };

  return {
    updatedProfile,
    leveledUp,
    newLevel: leveledUp ? currentLevel : undefined,
    oldLevel: leveledUp ? oldLevel : undefined,
  };
};

/**
 * Calculate user stats based on workout history
 */
export const calculateUserStats = (workouts: Workout[]) => {
  const completedWorkouts = workouts.filter(w => w.completed);

  const totalVolumeLifted = completedWorkouts.reduce(
    (sum, workout) => sum + workout.totalVolume,
    0
  );

  const totalWorkoutTime = completedWorkouts.reduce(
    (sum, workout) => sum + (workout.duration || 0),
    0
  );

  // Calculate strength stat (based on total volume)
  const strength = Math.min(100, Math.floor(totalVolumeLifted / 1000));

  // Calculate endurance stat (based on total workout time)
  const endurance = Math.min(100, Math.floor(totalWorkoutTime / 100));

  // Calculate consistency stat (based on workout frequency)
  const consistency = Math.min(100, completedWorkouts.length * 2);

  return {
    strength,
    endurance,
    consistency,
    totalVolumeLifted,
    totalWorkoutTime,
  };
};

/**
 * Calculate workout streak
 */
export const calculateStreak = (workouts: Workout[]): { current: number; longest: number } => {
  if (workouts.length === 0) {
    return { current: 0, longest: 0 };
  }

  const completedWorkouts = workouts
    .filter(w => w.completed)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (completedWorkouts.length === 0) {
    return { current: 0, longest: 0 };
  }

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;
  let lastDate = new Date(completedWorkouts[0].createdAt);

  // Check if the most recent workout was today or yesterday
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastWorkoutDate = new Date(lastDate);
  lastWorkoutDate.setHours(0, 0, 0, 0);

  const daysDiff = Math.floor((today.getTime() - lastWorkoutDate.getTime()) / (1000 * 60 * 60 * 24));

  if (daysDiff <= 1) {
    currentStreak = 1;

    // Calculate streak
    for (let i = 1; i < completedWorkouts.length; i++) {
      const currentDate = new Date(completedWorkouts[i].createdAt);
      const prevDate = new Date(completedWorkouts[i - 1].createdAt);

      const dayDiff = Math.floor(
        (prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (dayDiff <= 1) {
        tempStreak++;
        currentStreak++;
      } else {
        break;
      }

      longestStreak = Math.max(longestStreak, tempStreak);
    }
  }

  // Calculate longest streak
  tempStreak = 1;
  for (let i = 1; i < completedWorkouts.length; i++) {
    const currentDate = new Date(completedWorkouts[i].createdAt);
    const prevDate = new Date(completedWorkouts[i - 1].createdAt);

    const dayDiff = Math.floor(
      (prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (dayDiff <= 1) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }

  longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

  return { current: currentStreak, longest: longestStreak };
};
