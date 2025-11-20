import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';
import { Workout } from '../types';

interface WorkoutCompleteScreenProps {
  route: any;
  navigation: any;
}

export const WorkoutCompleteScreen: React.FC<WorkoutCompleteScreenProps> = ({
  route,
  navigation,
}) => {
  const { workout, xpEarned, leveledUp, newLevel, oldLevel } = route.params;

  const goHome = () => {
    navigation.navigate('MainTabs', { screen: 'Home' });
  };

  const totalSets = workout.exercises.reduce(
    (sum: number, ex: any) => sum + ex.sets.filter((s: any) => s.completed).length,
    0
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Success Header */}
        <View style={styles.header}>
          <View style={styles.successIcon}>
            <Text style={styles.successIconText}>✓</Text>
          </View>
          <Text style={styles.title}>Workout Complete!</Text>
          <Text style={styles.subtitle}>Great job, Hunter!</Text>
        </View>

        {/* Level Up Banner */}
        {leveledUp && (
          <View style={styles.levelUpBanner}>
            <Text style={styles.levelUpText}>🎉 LEVEL UP! 🎉</Text>
            <Text style={styles.levelUpSubtext}>
              Level {oldLevel} → Level {newLevel}
            </Text>
          </View>
        )}

        {/* XP Reward */}
        <View style={styles.xpCard}>
          <Text style={styles.xpLabel}>XP Earned</Text>
          <Text style={styles.xpValue}>+{xpEarned}</Text>
        </View>

        {/* Workout Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Workout Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Duration</Text>
            <Text style={styles.summaryValue}>{workout.duration} min</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Exercises</Text>
            <Text style={styles.summaryValue}>{workout.exercises.length}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Sets Completed</Text>
            <Text style={styles.summaryValue}>{totalSets}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Volume</Text>
            <Text style={styles.summaryValue}>{workout.totalVolume.toFixed(0)} lbs</Text>
          </View>
        </View>

        {/* Exercises Breakdown */}
        <View style={styles.exercisesCard}>
          <Text style={styles.exercisesTitle}>Exercises</Text>
          {workout.exercises.map((exercise: any, index: number) => (
            <View key={exercise.id} style={styles.exerciseItem}>
              <Text style={styles.exerciseName}>{exercise.exerciseName}</Text>
              <Text style={styles.exerciseSets}>
                {exercise.sets.filter((s: any) => s.completed).length} sets
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.doneButton} onPress={goHome}>
          <Text style={styles.doneButtonText}>Done</Text>
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
  contentContainer: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.status.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  successIconText: {
    color: colors.text.primary,
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
  },
  title: {
    color: colors.text.primary,
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.lg,
  },
  levelUpBanner: {
    backgroundColor: colors.secondary.dark,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.secondary.main,
  },
  levelUpText: {
    color: colors.text.primary,
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  levelUpSubtext: {
    color: colors.secondary.light,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
  },
  xpCard: {
    backgroundColor: colors.primary.dark,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: colors.primary.main,
  },
  xpLabel: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.base,
    marginBottom: spacing.sm,
  },
  xpValue: {
    color: colors.primary.light,
    fontSize: typography.fontSize['5xl'],
    fontWeight: typography.fontWeight.extrabold,
  },
  summaryCard: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  summaryTitle: {
    color: colors.text.primary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },
  summaryLabel: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.base,
  },
  summaryValue: {
    color: colors.text.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
  },
  exercisesCard: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  exercisesTitle: {
    color: colors.text.primary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.md,
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  exerciseName: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
  },
  exerciseSets: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
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
  doneButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  doneButtonText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
});
