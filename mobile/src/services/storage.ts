import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, Workout, Mission, Exercise } from '../types';

const KEYS = {
  USER_PROFILE: '@solo_gym_user_profile',
  WORKOUTS: '@solo_gym_workouts',
  MISSIONS: '@solo_gym_missions',
  EXERCISES: '@solo_gym_exercises',
};

// User Profile Storage
export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.USER_PROFILE);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Workouts Storage
export const saveWorkout = async (workout: Workout): Promise<void> => {
  try {
    const workouts = await getWorkouts();
    const updatedWorkouts = [workout, ...workouts];
    await AsyncStorage.setItem(KEYS.WORKOUTS, JSON.stringify(updatedWorkouts));
  } catch (error) {
    console.error('Error saving workout:', error);
    throw error;
  }
};

export const getWorkouts = async (): Promise<Workout[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.WORKOUTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting workouts:', error);
    return [];
  }
};

export const updateWorkout = async (workoutId: string, updatedWorkout: Workout): Promise<void> => {
  try {
    const workouts = await getWorkouts();
    const index = workouts.findIndex(w => w.id === workoutId);
    if (index !== -1) {
      workouts[index] = updatedWorkout;
      await AsyncStorage.setItem(KEYS.WORKOUTS, JSON.stringify(workouts));
    }
  } catch (error) {
    console.error('Error updating workout:', error);
    throw error;
  }
};

export const deleteWorkout = async (workoutId: string): Promise<void> => {
  try {
    const workouts = await getWorkouts();
    const filteredWorkouts = workouts.filter(w => w.id !== workoutId);
    await AsyncStorage.setItem(KEYS.WORKOUTS, JSON.stringify(filteredWorkouts));
  } catch (error) {
    console.error('Error deleting workout:', error);
    throw error;
  }
};

// Missions Storage
export const saveMissions = async (missions: Mission[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.MISSIONS, JSON.stringify(missions));
  } catch (error) {
    console.error('Error saving missions:', error);
    throw error;
  }
};

export const getMissions = async (): Promise<Mission[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.MISSIONS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting missions:', error);
    return [];
  }
};

export const updateMission = async (missionId: string, updatedMission: Mission): Promise<void> => {
  try {
    const missions = await getMissions();
    const index = missions.findIndex(m => m.id === missionId);
    if (index !== -1) {
      missions[index] = updatedMission;
      await AsyncStorage.setItem(KEYS.MISSIONS, JSON.stringify(missions));
    }
  } catch (error) {
    console.error('Error updating mission:', error);
    throw error;
  }
};

// Exercises Storage
export const saveExercises = async (exercises: Exercise[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.EXERCISES, JSON.stringify(exercises));
  } catch (error) {
    console.error('Error saving exercises:', error);
    throw error;
  }
};

export const getExercises = async (): Promise<Exercise[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.EXERCISES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting exercises:', error);
    return [];
  }
};

export const addExercise = async (exercise: Exercise): Promise<void> => {
  try {
    const exercises = await getExercises();
    const updatedExercises = [...exercises, exercise];
    await AsyncStorage.setItem(KEYS.EXERCISES, JSON.stringify(updatedExercises));
  } catch (error) {
    console.error('Error adding exercise:', error);
    throw error;
  }
};

// Clear all data (for testing/reset)
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      KEYS.USER_PROFILE,
      KEYS.WORKOUTS,
      KEYS.MISSIONS,
      KEYS.EXERCISES,
    ]);
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};
