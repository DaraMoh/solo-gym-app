import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, Workout, Mission, Exercise, WorkoutTemplate } from '../types';

const KEYS = {
  USER_PROFILE: '@solo_gym_user_profile',
  WORKOUTS: '@solo_gym_workouts',
  MISSIONS: '@solo_gym_missions',
  EXERCISES: '@solo_gym_exercises',
  WORKOUT_TEMPLATES: '@solo_gym_workout_templates',
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

// Workout Templates Storage
export const saveWorkoutTemplate = async (template: WorkoutTemplate): Promise<void> => {
  try {
    const templates = await getWorkoutTemplates();

    // Limit to 7 templates
    if (templates.length >= 7 && !templates.find(t => t.id === template.id)) {
      throw new Error('Maximum of 7 workout templates reached. Delete an existing template to add a new one.');
    }

    // Update existing or add new
    const existingIndex = templates.findIndex(t => t.id === template.id);
    if (existingIndex !== -1) {
      templates[existingIndex] = template;
    } else {
      templates.push(template);
    }

    await AsyncStorage.setItem(KEYS.WORKOUT_TEMPLATES, JSON.stringify(templates));
  } catch (error) {
    console.error('Error saving workout template:', error);
    throw error;
  }
};

export const getWorkoutTemplates = async (): Promise<WorkoutTemplate[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.WORKOUT_TEMPLATES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting workout templates:', error);
    return [];
  }
};

export const deleteWorkoutTemplate = async (templateId: string): Promise<void> => {
  try {
    const templates = await getWorkoutTemplates();
    const filteredTemplates = templates.filter(t => t.id !== templateId);
    await AsyncStorage.setItem(KEYS.WORKOUT_TEMPLATES, JSON.stringify(filteredTemplates));
  } catch (error) {
    console.error('Error deleting workout template:', error);
    throw error;
  }
};

export const updateTemplateLastUsed = async (templateId: string): Promise<void> => {
  try {
    const templates = await getWorkoutTemplates();
    const template = templates.find(t => t.id === templateId);
    if (template) {
      template.lastUsed = new Date();
      await AsyncStorage.setItem(KEYS.WORKOUT_TEMPLATES, JSON.stringify(templates));
    }
  } catch (error) {
    console.error('Error updating template last used:', error);
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
      KEYS.WORKOUT_TEMPLATES,
    ]);
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};
