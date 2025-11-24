import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, typography, spacing, borderRadius, responsiveSpacing, responsiveVerticalSpacing } from '../theme';
import { Mission, MissionType, MissionStatus } from '../types';
import { getMissions } from '../services/storage';

export const MissionsScreen = () => {
  const [missions, setMissions] = useState<Mission[]>([]);

  useEffect(() => {
    loadMissions();
  }, []);

  const loadMissions = async () => {
    const loadedMissions = await getMissions();
    setMissions(loadedMissions);
  };

  const renderMissionCard = (mission: Mission) => {
    const progress = (mission.requirement.current / mission.requirement.target) * 100;
    const isCompleted = mission.status === MissionStatus.COMPLETED;

    return (
      <View key={mission.id} style={[styles.missionCard, isCompleted && styles.completedCard]}>
        <View style={styles.missionHeader}>
          <View style={styles.missionInfo}>
            <Text style={styles.missionTitle}>{mission.title}</Text>
            <Text style={styles.missionDescription}>{mission.description}</Text>
          </View>
          <View style={[styles.typeBadge, mission.type === MissionType.DAILY ? styles.dailyBadge : styles.weeklyBadge]}>
            <Text style={styles.typeBadgeText}>{mission.type}</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.min(progress, 100)}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {mission.requirement.current} / {mission.requirement.target}
          </Text>
        </View>

        <View style={styles.missionFooter}>
          <View style={styles.xpReward}>
            <Text style={styles.xpRewardText}>+{mission.xpReward} XP</Text>
          </View>
          {isCompleted && (
            <View style={styles.completedBadge}>
              <Text style={styles.completedText}>✓ Completed</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const activeMissions = missions.filter(m => m.status === MissionStatus.ACTIVE);
  const completedMissions = missions.filter(m => m.status === MissionStatus.COMPLETED);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.pageTitle}>Missions</Text>

      {/* Active Missions */}
      {activeMissions.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Missions</Text>
          {activeMissions.map(renderMissionCard)}
        </View>
      )}

      {/* Completed Missions */}
      {completedMissions.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Completed</Text>
          {completedMissions.map(renderMissionCard)}
        </View>
      )}

      {/* Empty State */}
      {missions.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No missions available</Text>
          <Text style={styles.emptySubtext}>Check back later for new missions!</Text>
        </View>
      )}
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
  pageTitle: {
    color: colors.text.primary,
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.lg,
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
  missionCard: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  completedCard: {
    opacity: 0.7,
    borderColor: colors.status.success,
  },
  missionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  missionInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  missionTitle: {
    color: colors.text.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  missionDescription: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
  },
  typeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  dailyBadge: {
    backgroundColor: colors.primary.dark,
  },
  weeklyBadge: {
    backgroundColor: colors.secondary.dark,
  },
  typeBadgeText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
  progressContainer: {
    marginBottom: spacing.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.background.elevated,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary.main,
  },
  progressText: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.sm,
  },
  missionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  xpReward: {
    backgroundColor: colors.primary.dark,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  xpRewardText: {
    color: colors.xp.text,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  completedBadge: {
    backgroundColor: colors.status.success,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  completedText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  emptyState: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    marginTop: spacing.xl,
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
});
