import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius, responsiveSpacing, responsiveVerticalSpacing } from '../theme';
import { RootStackParamList } from '../navigation/types';

type WorkoutDetailScreenRouteProp = RouteProp<RootStackParamList, 'WorkoutDetail'>;

interface Props {
  route: WorkoutDetailScreenRouteProp;
}

export const WorkoutDetailScreen = ({ route }: Props) => {
  const { workout } = route.params;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const renderExercise = (exercise: typeof workout.exercises[0]) => {
    // Check if it's cardio by looking at the first set's properties
    const isCardio = exercise.sets.length > 0 && exercise.sets[0].duration !== undefined;

    return (
      <View key={exercise.id} style={styles.exerciseCard}>
        <View style={styles.exerciseHeader}>
          <Text style={styles.exerciseName}>{exercise.exerciseName}</Text>
        </View>

        <View style={styles.setsContainer}>
          {isCardio ? (
            <View style={styles.cardioInfo}>
              <View style={styles.cardioStat}>
                <Text style={styles.cardioLabel}>Duration</Text>
                <Text style={styles.cardioValue}>{exercise.sets[0]?.duration || 0} min</Text>
              </View>
              <View style={styles.cardioStat}>
                <Text style={styles.cardioLabel}>Calories</Text>
                <Text style={styles.cardioValue}>{exercise.sets[0]?.calories || 0}</Text>
              </View>
            </View>
          ) : (
            exercise.sets.map((set, index) => (
              <View key={index} style={styles.setRow}>
                <Text style={styles.setNumber}>Set {index + 1}</Text>
                <View style={styles.setDetails}>
                  <Text style={styles.setInfo}>
                    {set.reps} reps × {set.weight} lbs
                  </Text>
                  {set.completed && (
                    <Text style={styles.completedBadge}>✓</Text>
                  )}
                </View>
              </View>
            ))
          )}
        </View>

        {exercise.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>Notes:</Text>
            <Text style={styles.notesText}>{exercise.notes}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Workout Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{workout.title}</Text>
        <Text style={styles.date}>{formatDate(workout.startTime)}</Text>
        <Text style={styles.time}>{formatTime(workout.startTime)}</Text>
      </View>

      {/* Stats Summary */}
      <View style={styles.statsSection}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>+{workout.xpEarned}</Text>
          <Text style={styles.statLabel}>XP Earned</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{workout.duration}</Text>
          <Text style={styles.statLabel}>Minutes</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{workout.totalVolume.toFixed(0)}</Text>
          <Text style={styles.statLabel}>lbs Lifted</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{workout.exercises.length}</Text>
          <Text style={styles.statLabel}>Exercises</Text>
        </View>
      </View>

      {/* Exercises Section */}
      <View style={styles.exercisesSection}>
        <Text style={styles.sectionTitle}>Exercises</Text>
        {workout.exercises.map(renderExercise)}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  contentContainer: {
    padding: responsiveSpacing.md,
    paddingTop: responsiveVerticalSpacing['3xl'],
    paddingBottom: responsiveVerticalSpacing['5xl'],
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    marginBottom: spacing.lg,
  },
  title: {
    color: colors.text.primary,
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  date: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.base,
    marginBottom: spacing.xs,
  },
  time: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.sm,
  },
  statsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
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
    textAlign: 'center',
  },
  exercisesSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    color: colors.text.primary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.md,
  },
  exerciseCard: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  exerciseHeader: {
    marginBottom: spacing.md,
  },
  exerciseName: {
    color: colors.text.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
  },
  setsContainer: {
    gap: spacing.sm,
  },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background.elevated,
    borderRadius: borderRadius.md,
  },
  setNumber: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  setDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  setInfo: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
  },
  completedBadge: {
    color: colors.status.success,
    fontSize: typography.fontSize.base,
  },
  cardioInfo: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  cardioStat: {
    flex: 1,
    backgroundColor: colors.background.elevated,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  cardioLabel: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.xs,
  },
  cardioValue: {
    color: colors.text.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
  },
  notesContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.primary,
  },
  notesLabel: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.xs,
  },
  notesText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
  },
});
