import { NavigatorScreenParams } from '@react-navigation/native';
import { WorkoutExercise, Workout } from '../types';

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  WorkoutDetail: { workoutId: string };
  CreateWorkout: undefined;
  ActiveWorkout: { title: string; exercises: WorkoutExercise[] };
  WorkoutComplete: {
    workout: Workout;
    xpEarned: number;
    leveledUp: boolean;
    newLevel?: number;
    oldLevel?: number;
  };
  ExerciseLibrary: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Workout: undefined;
  Missions: undefined;
  Profile: undefined;
};
