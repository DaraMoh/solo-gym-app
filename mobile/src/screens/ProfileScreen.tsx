import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { colors, typography, spacing, borderRadius, responsiveSpacing, responsiveVerticalSpacing } from '../theme';
import { UserProfile } from '../types';
import { getUserProfile, clearAllData } from '../services/storage';
import { initializeApp } from '../services/initialization';

export const ProfileScreen = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const userProfile = await getUserProfile();
    setProfile(userProfile);
  };

  const handleResetData = async () => {
    Alert.alert(
      'Reset App Data',
      'This will clear all data and reinitialize the app. Your workouts and progress will be lost. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            await initializeApp();
            await loadProfile();
            Alert.alert('Success', 'App data has been reset and reinitialized');
          },
        },
      ]
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
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={[styles.rankBadge, { borderColor: colors.rank[profile.rank] }]}>
          <Text style={[styles.rankText, { color: colors.rank[profile.rank] }]}>
            {profile.rank}
          </Text>
        </View>
        <Text style={styles.username}>{profile.username}</Text>
        <Text style={styles.levelText}>Level {profile.level}</Text>
      </View>

      {/* Stats Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stats</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Strength</Text>
            <View style={styles.statBar}>
              <View style={[styles.statBarFill, { width: `${profile.stats.strength}%` }]} />
            </View>
            <Text style={styles.statValue}>{profile.stats.strength}/100</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Endurance</Text>
            <View style={styles.statBar}>
              <View style={[styles.statBarFill, { width: `${profile.stats.endurance}%` }]} />
            </View>
            <Text style={styles.statValue}>{profile.stats.endurance}/100</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Consistency</Text>
            <View style={styles.statBar}>
              <View style={[styles.statBarFill, { width: `${profile.stats.consistency}%` }]} />
            </View>
            <Text style={styles.statValue}>{profile.stats.consistency}/100</Text>
          </View>
        </View>
      </View>

      {/* Achievements Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <View style={styles.achievementsGrid}>
          <View style={styles.achievementCard}>
            <Text style={styles.achievementValue}>{profile.totalWorkouts}</Text>
            <Text style={styles.achievementLabel}>Total Workouts</Text>
          </View>
          <View style={styles.achievementCard}>
            <Text style={styles.achievementValue}>{profile.currentStreak}</Text>
            <Text style={styles.achievementLabel}>Current Streak</Text>
          </View>
          <View style={styles.achievementCard}>
            <Text style={styles.achievementValue}>{profile.longestStreak}</Text>
            <Text style={styles.achievementLabel}>Longest Streak</Text>
          </View>
          <View style={styles.achievementCard}>
            <Text style={styles.achievementValue}>
              {profile.stats.totalVolumeLifted.toFixed(0)}
            </Text>
            <Text style={styles.achievementLabel}>Total kg Lifted</Text>
          </View>
          <View style={styles.achievementCard}>
            <Text style={styles.achievementValue}>{profile.stats.totalWorkoutTime}</Text>
            <Text style={styles.achievementLabel}>Total Minutes</Text>
          </View>
        </View>
      </View>

      {/* Debug Section */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.resetButton} onPress={handleResetData}>
          <Text style={styles.resetButtonText}>Reset & Reinitialize App Data</Text>
        </TouchableOpacity>
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
  loadingText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.lg,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginBottom: spacing.lg,
  },
  rankBadge: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.xl,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    marginBottom: spacing.md,
  },
  rankText: {
    fontSize: typography.fontSize['5xl'],
    fontWeight: typography.fontWeight.extrabold,
  },
  username: {
    color: colors.text.primary,
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  levelText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    color: colors.text.primary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.md,
  },
  statsGrid: {
    gap: spacing.md,
  },
  statItem: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  statLabel: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.base,
    marginBottom: spacing.sm,
  },
  statBar: {
    height: 12,
    backgroundColor: colors.background.elevated,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  statBarFill: {
    height: '100%',
    backgroundColor: colors.primary.main,
  },
  statValue: {
    color: colors.text.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  achievementCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  achievementValue: {
    color: colors.primary.main,
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  achievementLabel: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
  },
  resetButton: {
    backgroundColor: colors.status.warning,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  resetButtonText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
});
