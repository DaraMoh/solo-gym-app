import { UserProfile, Rank } from '../types';
import {
  getUserProfile,
  saveUserProfile,
  getExercises,
  saveExercises,
  getMissions,
  saveMissions,
} from './storage';
import { generateDailyMissions, generateWeeklyMissions, shouldRefreshMissions } from './missionSystem';
import { getAllExercises } from './exerciseDatabase';

/**
 * Initialize a new user profile if one doesn't exist
 */
export const initializeUserProfile = async (): Promise<UserProfile> => {
  const existingProfile = await getUserProfile();

  if (existingProfile) {
    return existingProfile;
  }

  const newProfile: UserProfile = {
    id: `user_${Date.now()}`,
    username: 'Hunter',
    level: 1,
    currentXP: 0,
    xpToNextLevel: 100,
    rank: Rank.E,
    totalWorkouts: 0,
    currentStreak: 0,
    longestStreak: 0,
    stats: {
      strength: 0,
      endurance: 0,
      consistency: 0,
      totalVolumeLifted: 0,
      totalWorkoutTime: 0,
    },
    createdAt: new Date(),
  };

  await saveUserProfile(newProfile);
  return newProfile;
};

/**
 * Initialize exercise library from database
 */
export const initializeExercises = async (): Promise<void> => {
  const existingExercises = await getExercises();

  if (existingExercises.length > 0) {
    console.log('Exercises already initialized:', existingExercises.length);
    return;
  }

  console.log('Initializing exercises from database...');
  // Load all exercises from the comprehensive exercise database
  const exercises = getAllExercises();
  console.log('Loaded exercises from database:', exercises.length);
  await saveExercises(exercises);
  console.log('Exercises saved to storage');
};

/**
 * Initialize missions if needed
 */
export const initializeMissions = async (): Promise<void> => {
  const existingMissions = await getMissions();

  // Check if we need to refresh daily missions
  if (shouldRefreshMissions(existingMissions, 'DAILY' as any)) {
    const dailyMissions = generateDailyMissions();
    const weeklyMissions = existingMissions.filter(m => m.type === 'WEEKLY');
    await saveMissions([...dailyMissions, ...weeklyMissions]);
  }

  // Check if we need to refresh weekly missions
  if (shouldRefreshMissions(existingMissions, 'WEEKLY' as any)) {
    const weeklyMissions = generateWeeklyMissions();
    const dailyMissions = existingMissions.filter(m => m.type === 'DAILY');
    await saveMissions([...dailyMissions, ...weeklyMissions]);
  }

  // If no missions at all, generate both
  if (existingMissions.length === 0) {
    const dailyMissions = generateDailyMissions();
    const weeklyMissions = generateWeeklyMissions();
    await saveMissions([...dailyMissions, ...weeklyMissions]);
  }
};

/**
 * Initialize app data
 */
export const initializeApp = async (): Promise<void> => {
  await initializeUserProfile();
  await initializeExercises();
  await initializeMissions();
};
