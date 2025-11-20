import { Exercise, ExerciseCategory, MuscleGroup } from '../types';
import exerciseDatabaseRaw from '../data/exerciseDatabase.json';

// Mapping from the database categories to our categories
const categoryMap: Record<string, ExerciseCategory> = {
  'strength': ExerciseCategory.STRENGTH,
  'stretching': ExerciseCategory.FLEXIBILITY,
  'plyometrics': ExerciseCategory.CARDIO,
  'cardio': ExerciseCategory.CARDIO,
  'powerlifting': ExerciseCategory.STRENGTH,
  'strongman': ExerciseCategory.STRENGTH,
  'olympic weightlifting': ExerciseCategory.STRENGTH,
};

// Mapping from database muscle groups to our muscle groups
const muscleGroupMap: Record<string, MuscleGroup> = {
  'chest': MuscleGroup.CHEST,
  'middle back': MuscleGroup.BACK,
  'lats': MuscleGroup.BACK,
  'lower back': MuscleGroup.BACK,
  'shoulders': MuscleGroup.SHOULDERS,
  'biceps': MuscleGroup.ARMS,
  'triceps': MuscleGroup.ARMS,
  'forearms': MuscleGroup.ARMS,
  'quadriceps': MuscleGroup.LEGS,
  'hamstrings': MuscleGroup.LEGS,
  'glutes': MuscleGroup.LEGS,
  'calves': MuscleGroup.LEGS,
  'adductors': MuscleGroup.LEGS,
  'abductors': MuscleGroup.LEGS,
  'abdominals': MuscleGroup.CORE,
  'neck': MuscleGroup.SHOULDERS,
  'traps': MuscleGroup.SHOULDERS,
};

interface RawExercise {
  id: string;
  name: string;
  category: string;
  primaryMuscles: string[];
  secondaryMuscles?: string[];
  equipment: string | null;
  level: string;
}

/**
 * Convert raw exercise data to our Exercise type
 */
export const convertExercises = (rawExercises: RawExercise[]): Exercise[] => {
  return rawExercises.map((raw, index) => {
    const primaryMuscles = raw.primaryMuscles
      .map(muscle => muscleGroupMap[muscle.toLowerCase()])
      .filter((m): m is MuscleGroup => m !== undefined);

    const secondaryMuscles = (raw.secondaryMuscles || [])
      .map(muscle => muscleGroupMap[muscle.toLowerCase()])
      .filter((m): m is MuscleGroup => m !== undefined);

    const allMuscles = [...new Set([...primaryMuscles, ...secondaryMuscles])];

    return {
      id: raw.id || `exercise_${index}`,
      name: raw.name,
      category: categoryMap[raw.category.toLowerCase()] || ExerciseCategory.STRENGTH,
      muscleGroups: allMuscles.length > 0 ? allMuscles : [MuscleGroup.FULL_BODY],
      isCustom: false,
    };
  });
};

/**
 * Get all exercises from the database
 */
export const getAllExercises = (): Exercise[] => {
  return convertExercises(exerciseDatabaseRaw as RawExercise[]);
};

/**
 * Filter exercises by category
 */
export const getExercisesByCategory = (category: ExerciseCategory): Exercise[] => {
  const allExercises = getAllExercises();
  return allExercises.filter(ex => ex.category === category);
};

/**
 * Filter exercises by muscle group
 */
export const getExercisesByMuscleGroup = (muscleGroup: MuscleGroup): Exercise[] => {
  const allExercises = getAllExercises();
  return allExercises.filter(ex => ex.muscleGroups.includes(muscleGroup));
};

/**
 * Search exercises by name
 */
export const searchExercises = (query: string): Exercise[] => {
  const allExercises = getAllExercises();
  const lowerQuery = query.toLowerCase();
  return allExercises.filter(ex => ex.name.toLowerCase().includes(lowerQuery));
};

/**
 * Get popular/recommended exercises for beginners
 */
export const getPopularExercises = (): Exercise[] => {
  const popularNames = [
    'Barbell Squat',
    'Barbell Deadlift',
    'Barbell Bench Press - Medium Grip',
    'Pull-ups',
    'Barbell Shoulder Press',
    'Barbell Curl',
    'Dips - Triceps Version',
    'Barbell Lunge',
    'Plank',
    'Crunches',
    'Push-Ups',
    'Bent Over Barbell Row',
    'Dumbbell Bench Press',
    'Dumbbell Shoulder Press',
    'Leg Press',
  ];

  const allExercises = getAllExercises();
  return popularNames
    .map(name => allExercises.find(ex => ex.name === name))
    .filter((ex): ex is Exercise => ex !== undefined);
};
