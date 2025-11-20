import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';
import { UserProfile, Workout } from '../types';
import { getUserProfile, getWorkouts } from '../services/storage';

export const HomeScreen = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recentWorkouts, setRecentWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const userProfile = await getUserProfile();
    const workouts = await getWorkouts();
    setProfile(userProfile);
    setRecentWorkouts(workouts.slice(0, 5));
  };

  const renderRankBadge = () => {
    if (!profile) return null;

    return (
      <View style={[styles.rankBadge, { borderColor: colors.rank[profile.rank] }]}>
        <Text style={[styles.rankText, { color: colors.rank[profile.rank] }]}>
          {profile.rank}
        </Text>
      </View>
    );
  };

  const renderXPBar = () => {
    if (!profile) return null;

    const progress = (profile.currentXP / profile.xpToNextLevel) * 100;

    return (
      <View style={styles.xpContainer}>
        <View style={styles.xpBarBackground}>
          <View style={[styles.xpBarFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.xpText}>
          {profile.currentXP} / {profile.xpToNextLevel} XP
        </Text>
      </View>
    );
  };

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.username}>{profile.username}</Text>
          </View>
          {renderRankBadge()}
        </View>

        {/* Level & XP */}
        <View style={styles.levelContainer}>
          <Text style={styles.levelText}>Level {profile.level}</Text>
          {renderXPBar()}
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{profile.totalWorkouts}</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{profile.currentStreak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{profile.stats.strength}</Text>
          <Text style={styles.statLabel}>Strength</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{profile.stats.endurance}</Text>
          <Text style={styles.statLabel}>Endurance</Text>
        </View>
      </View>

      {/* Recent Workouts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Workouts</Text>
        {recentWorkouts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No workouts yet</Text>
            <Text style={styles.emptySubtext}>Start your journey today!</Text>
          </View>
        ) : (
          recentWorkouts.map((workout) => (
            <TouchableOpacity key={workout.id} style={styles.workoutCard}>
              <View style={styles.workoutHeader}>
                <Text style={styles.workoutTitle}>{workout.title}</Text>
                <View style={styles.xpBadge}>
                  <Text style={styles.xpBadgeText}>+{workout.xpEarned} XP</Text>
                </View>
              </View>
              <View style={styles.workoutDetails}>
                <Text style={styles.workoutDetail}>
                  {workout.exercises.length} exercises
                </Text>
                <Text style={styles.workoutDetail}>•</Text>
                <Text style={styles.workoutDetail}>{workout.duration} min</Text>
                <Text style={styles.workoutDetail}>•</Text>
                <Text style={styles.workoutDetail}>{workout.totalVolume.toFixed(0)} lbs</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
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
    padding: spacing.md,
  },
  loadingText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.lg,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  header: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  welcomeText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.xs,
  },
  username: {
    color: colors.text.primary,
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
  },
  rankBadge: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.elevated,
  },
  rankText: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.extrabold,
  },
  levelContainer: {
    marginTop: spacing.sm,
  },
  levelText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.sm,
  },
  xpContainer: {
    marginTop: spacing.xs,
  },
  xpBarBackground: {
    height: 8,
    backgroundColor: colors.xp.background,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: colors.xp.bar,
  },
  xpText: {
    color: colors.xp.text,
    fontSize: typography.fontSize.sm,
    marginTop: spacing.xs,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
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
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    color: colors.text.primary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.md,
  },
  emptyState: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.base,
  },
  workoutCard: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  workoutTitle: {
    color: colors.text.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
  },
  xpBadge: {
    backgroundColor: colors.primary.dark,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  xpBadgeText: {
    color: colors.primary.light,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  workoutDetails: {
    flexDirection: 'row',
  },
  workoutDetail: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    marginRight: spacing.sm,
  },
});
