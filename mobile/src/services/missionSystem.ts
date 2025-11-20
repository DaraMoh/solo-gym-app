import { Mission, MissionType, MissionStatus, MissionRequirement, Workout } from '../types';

/**
 * Generate daily missions
 */
export const generateDailyMissions = (): Mission[] => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const missions: Mission[] = [
    {
      id: `daily_workout_${now.getTime()}`,
      title: 'Daily Grind',
      description: 'Complete a workout today',
      type: MissionType.DAILY,
      requirement: {
        type: 'WORKOUT_COUNT',
        target: 1,
        current: 0,
      },
      xpReward: 50,
      status: MissionStatus.ACTIVE,
      expiresAt: tomorrow,
      createdAt: now,
    },
    {
      id: `daily_sets_${now.getTime()}`,
      title: 'Push Your Limits',
      description: 'Complete 15 sets today',
      type: MissionType.DAILY,
      requirement: {
        type: 'EXERCISE_COUNT',
        target: 15,
        current: 0,
      },
      xpReward: 75,
      status: MissionStatus.ACTIVE,
      expiresAt: tomorrow,
      createdAt: now,
    },
    {
      id: `daily_volume_${now.getTime()}`,
      title: 'Strength Builder',
      description: 'Lift a total of 2500 lbs',
      type: MissionType.DAILY,
      requirement: {
        type: 'VOLUME',
        target: 2500,
        current: 0,
      },
      xpReward: 100,
      status: MissionStatus.ACTIVE,
      expiresAt: tomorrow,
      createdAt: now,
    },
  ];

  return missions;
};

/**
 * Generate weekly missions
 */
export const generateWeeklyMissions = (): Mission[] => {
  const now = new Date();
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);
  nextWeek.setHours(0, 0, 0, 0);

  const missions: Mission[] = [
    {
      id: `weekly_workouts_${now.getTime()}`,
      title: 'Consistency King',
      description: 'Complete 5 workouts this week',
      type: MissionType.WEEKLY,
      requirement: {
        type: 'WORKOUT_COUNT',
        target: 5,
        current: 0,
      },
      xpReward: 250,
      status: MissionStatus.ACTIVE,
      expiresAt: nextWeek,
      createdAt: now,
    },
    {
      id: `weekly_duration_${now.getTime()}`,
      title: 'Marathon Runner',
      description: 'Train for 300 minutes this week',
      type: MissionType.WEEKLY,
      requirement: {
        type: 'DURATION',
        target: 300,
        current: 0,
      },
      xpReward: 300,
      status: MissionStatus.ACTIVE,
      expiresAt: nextWeek,
      createdAt: now,
    },
    {
      id: `weekly_volume_${now.getTime()}`,
      title: 'Heavy Lifter',
      description: 'Lift a total of 25,000 lbs this week',
      type: MissionType.WEEKLY,
      requirement: {
        type: 'VOLUME',
        target: 25000,
        current: 0,
      },
      xpReward: 500,
      status: MissionStatus.ACTIVE,
      expiresAt: nextWeek,
      createdAt: now,
    },
  ];

  return missions;
};

/**
 * Check if missions need to be refreshed
 */
export const shouldRefreshMissions = (missions: Mission[], type: MissionType): boolean => {
  const now = new Date();
  const typedMissions = missions.filter(m => m.type === type);

  if (typedMissions.length === 0) {
    return true;
  }

  // Check if any mission has expired
  return typedMissions.some(mission => new Date(mission.expiresAt) <= now);
};

/**
 * Update mission progress based on completed workout
 */
export const updateMissionProgress = (
  missions: Mission[],
  workout: Workout
): Mission[] => {
  if (!workout.completed) {
    return missions;
  }

  return missions.map(mission => {
    if (mission.status !== MissionStatus.ACTIVE) {
      return mission;
    }

    // Check if mission has expired
    if (new Date(mission.expiresAt) <= new Date()) {
      return {
        ...mission,
        status: MissionStatus.EXPIRED,
      };
    }

    let updatedRequirement = { ...mission.requirement };
    let shouldComplete = false;

    switch (mission.requirement.type) {
      case 'WORKOUT_COUNT':
        updatedRequirement.current += 1;
        shouldComplete = updatedRequirement.current >= updatedRequirement.target;
        break;

      case 'EXERCISE_COUNT':
        const totalSets = workout.exercises.reduce(
          (sum, ex) => sum + ex.sets.filter(s => s.completed).length,
          0
        );
        updatedRequirement.current += totalSets;
        shouldComplete = updatedRequirement.current >= updatedRequirement.target;
        break;

      case 'VOLUME':
        updatedRequirement.current += workout.totalVolume;
        shouldComplete = updatedRequirement.current >= updatedRequirement.target;
        break;

      case 'DURATION':
        updatedRequirement.current += workout.duration || 0;
        shouldComplete = updatedRequirement.current >= updatedRequirement.target;
        break;

      case 'SPECIFIC_EXERCISE':
        const hasExercise = workout.exercises.some(
          ex => ex.exerciseId === mission.requirement.exerciseId
        );
        if (hasExercise) {
          updatedRequirement.current += 1;
          shouldComplete = updatedRequirement.current >= updatedRequirement.target;
        }
        break;
    }

    if (shouldComplete) {
      return {
        ...mission,
        requirement: updatedRequirement,
        status: MissionStatus.COMPLETED,
        completedAt: new Date(),
      };
    }

    return {
      ...mission,
      requirement: updatedRequirement,
    };
  });
};

/**
 * Get active missions
 */
export const getActiveMissions = (missions: Mission[]): Mission[] => {
  return missions.filter(m => m.status === MissionStatus.ACTIVE);
};

/**
 * Get completed missions
 */
export const getCompletedMissions = (missions: Mission[]): Mission[] => {
  return missions.filter(m => m.status === MissionStatus.COMPLETED);
};

/**
 * Calculate total XP from completed missions
 */
export const calculateMissionXP = (missions: Mission[]): number => {
  return missions
    .filter(m => m.status === MissionStatus.COMPLETED)
    .reduce((sum, m) => sum + m.xpReward, 0);
};

/**
 * Clean up expired missions
 */
export const cleanupExpiredMissions = (missions: Mission[]): Mission[] => {
  const now = new Date();
  return missions.map(mission => {
    if (mission.status === MissionStatus.ACTIVE && new Date(mission.expiresAt) <= now) {
      return {
        ...mission,
        status: MissionStatus.EXPIRED,
      };
    }
    return mission;
  });
};

/**
 * Remove expired and old completed missions
 */
export const removeOldMissions = (missions: Mission[]): Mission[] => {
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  return missions.filter(mission => {
    // Keep active missions
    if (mission.status === MissionStatus.ACTIVE) {
      return true;
    }

    // Remove expired missions older than 1 day
    if (mission.status === MissionStatus.EXPIRED) {
      return new Date(mission.expiresAt) > oneDayAgo;
    }

    // Keep completed missions from today
    if (mission.status === MissionStatus.COMPLETED && mission.completedAt) {
      return new Date(mission.completedAt) > oneDayAgo;
    }

    return false;
  });
};
