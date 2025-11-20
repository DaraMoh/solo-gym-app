import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';
import { WorkoutExercise, Workout, UserProfile } from '../types';
import {
  saveWorkout,
  getUserProfile,
  saveUserProfile,
  getMissions,
  saveMissions,
} from '../services/storage';
import {
  calculateWorkoutXP,
  addXPToProfile,
  calculateUserStats,
  calculateStreak,
} from '../services/levelingSystem';
import { updateMissionProgress } from '../services/missionSystem';
import { getWorkouts } from '../services/storage';

interface ActiveWorkoutScreenProps {
  route: any;
  navigation: any;
}

export const ActiveWorkoutScreen: React.FC<ActiveWorkoutScreenProps> = ({
  route,
  navigation,
}) => {
  const { title, exercises } = route.params;
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>(exercises);
  const [startTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleSetCompletion = (exerciseId: string, setNumber: number) => {
    setWorkoutExercises(
      workoutExercises.map(ex => {
        if (ex.id === exerciseId) {
          return {
            ...ex,
            sets: ex.sets.map(set => {
              if (set.setNumber === setNumber) {
                return {
                  ...set,
                  completed: !set.completed,
                };
              }
              return set;
            }),
          };
        }
        return ex;
      })
    );
  };

  const calculateTotalVolume = (): number => {
    return workoutExercises.reduce((total, exercise) => {
      const exerciseVolume = exercise.sets.reduce((sum, set) => {
        if (set.completed) {
          return sum + set.reps * set.weight;
        }
        return sum;
      }, 0);
      return total + exerciseVolume;
    }, 0);
  };

  const getCompletedSetsCount = (): number => {
    return workoutExercises.reduce((total, exercise) => {
      return total + exercise.sets.filter(s => s.completed).length;
    }, 0);
  };

  const finishWorkout = async () => {
    const completedSets = getCompletedSetsCount();

    if (completedSets === 0) {
      Alert.alert(
        'No Sets Completed',
        'You haven\'t completed any sets. Are you sure you want to finish?',
        [
          { text: 'Continue Workout', style: 'cancel' },
          { text: 'Finish Anyway', onPress: () => saveAndFinish() },
        ]
      );
      return;
    }

    saveAndFinish();
  };

  const saveAndFinish = async () => {
    try {
      const endTime = new Date();
      const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 60000); // minutes
      const totalVolume = calculateTotalVolume();

      const workout: Workout = {
        id: `workout_${Date.now()}`,
        userId: 'user_1',
        title,
        exercises: workoutExercises,
        startTime,
        endTime,
        duration,
        totalVolume,
        xpEarned: 0,
        completed: true,
        createdAt: new Date(),
      };

      // Calculate XP
      const xpEarned = calculateWorkoutXP(workout);
      workout.xpEarned = xpEarned;

      // Save workout
      await saveWorkout(workout);

      // Update user profile
      const profile = await getUserProfile();
      if (profile) {
        const { updatedProfile, leveledUp, newLevel, oldLevel } = addXPToProfile(
          profile,
          xpEarned
        );

        // Update stats
        const allWorkouts = await getWorkouts();
        const stats = calculateUserStats(allWorkouts);
        const streak = calculateStreak(allWorkouts);

        updatedProfile.stats = stats;
        updatedProfile.currentStreak = streak.current;
        updatedProfile.longestStreak = streak.longest;
        updatedProfile.totalWorkouts += 1;

        await saveUserProfile(updatedProfile);

        // Update missions
        const missions = await getMissions();
        const updatedMissions = updateMissionProgress(missions, workout);
        await saveMissions(updatedMissions);

        // Navigate to completion screen
        navigation.replace('WorkoutComplete', {
          workout,
          xpEarned,
          leveledUp,
          newLevel,
          oldLevel,
        });
      }
    } catch (error) {
      console.error('Error saving workout:', error);
      Alert.alert('Error', 'Failed to save workout. Please try again.');
    }
  };

  const cancelWorkout = () => {
    Alert.alert(
      'Cancel Workout',
      'Are you sure you want to cancel this workout? Your progress will be lost.',
      [
        { text: 'Continue Workout', style: 'cancel' },
        { text: 'Cancel Workout', style: 'destructive', onPress: () => navigation.goBack() },
      ]
    );
  };

  const completedSets = getCompletedSetsCount();
  const totalSets = workoutExercises.reduce((sum, ex) => sum + ex.sets.length, 0);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={cancelWorkout}>
            <Text style={styles.cancelButton}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{title}</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{formatTime(elapsedTime)}</Text>
            <Text style={styles.statLabel}>Time</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {completedSets}/{totalSets}
            </Text>
            <Text style={styles.statLabel}>Sets</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{calculateTotalVolume().toFixed(0)}</Text>
            <Text style={styles.statLabel}>lbs</Text>
          </View>
        </View>
      </View>

      {/* Exercises */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {workoutExercises.map((exercise, index) => (
          <View key={exercise.id} style={styles.exerciseCard}>
            <Text style={styles.exerciseName}>{exercise.exerciseName}</Text>

            {exercise.sets.map(set => (
              <TouchableOpacity
                key={set.setNumber}
                style={[styles.setRow, set.completed && styles.setRowCompleted]}
                onPress={() => toggleSetCompletion(exercise.id, set.setNumber)}
              >
                <View style={styles.setInfo}>
                  <Text style={[styles.setText, set.completed && styles.setTextCompleted]}>
                    Set {set.setNumber}
                  </Text>
                  <Text style={[styles.setText, set.completed && styles.setTextCompleted]}>
                    {set.reps} reps × {set.weight} lbs
                  </Text>
                </View>
                <View
                  style={[
                    styles.checkbox,
                    set.completed && styles.checkboxCompleted,
                  ]}
                >
                  {set.completed && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.finishButton} onPress={finishWorkout}>
          <Text style={styles.finishButtonText}>Finish Workout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    backgroundColor: colors.background.secondary,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  cancelButton: {
    color: colors.text.secondary,
    fontSize: typography.fontSize['2xl'],
  },
  title: {
    color: colors.text.primary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: colors.primary.main,
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  statLabel: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
  },
  contentContainer: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  exerciseCard: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  exerciseName: {
    color: colors.text.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.md,
  },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background.elevated,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  setRowCompleted: {
    backgroundColor: colors.primary.dark,
    borderColor: colors.primary.main,
  },
  setInfo: {
    flex: 1,
  },
  setText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.base,
  },
  setTextCompleted: {
    color: colors.text.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    borderColor: colors.border.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  checkmark: {
    color: colors.text.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.primary,
  },
  finishButton: {
    backgroundColor: colors.status.success,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  finishButtonText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
});
