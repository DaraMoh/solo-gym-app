import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';
import { Exercise, WorkoutExercise, WorkoutSet } from '../types';
import { getExercises } from '../services/storage';

interface CreateWorkoutScreenProps {
  navigation: any;
}

export const CreateWorkoutScreen: React.FC<CreateWorkoutScreenProps> = ({ navigation }) => {
  const [workoutTitle, setWorkoutTitle] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<WorkoutExercise[]>([]);
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    const exercises = await getExercises();
    console.log('Loaded exercises count:', exercises.length);
    if (exercises.length > 0) {
      console.log('First exercise:', exercises[0]);
    }
    setAvailableExercises(exercises);
  };

  const addExercise = (exercise: Exercise) => {
    const isCardio = exercise.category === 'CARDIO';
    const workoutExercise: WorkoutExercise = {
      id: `we_${Date.now()}_${Math.random()}`,
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      sets: isCardio
        ? [{ setNumber: 1, duration: 0, calories: 0, completed: false }]
        : [
            { setNumber: 1, reps: 0, weight: 0, completed: false },
            { setNumber: 2, reps: 0, weight: 0, completed: false },
            { setNumber: 3, reps: 0, weight: 0, completed: false },
          ],
    };
    setSelectedExercises([...selectedExercises, workoutExercise]);
    setShowExercisePicker(false);
    setSearchQuery('');
  };

  const removeExercise = (exerciseId: string) => {
    setSelectedExercises(selectedExercises.filter(e => e.id !== exerciseId));
  };

  const addSet = (exerciseId: string) => {
    setSelectedExercises(
      selectedExercises.map(ex => {
        if (ex.id === exerciseId) {
          const newSetNumber = ex.sets.length + 1;
          const isCardio = ex.sets[0]?.duration !== undefined;
          return {
            ...ex,
            sets: [
              ...ex.sets,
              isCardio
                ? { setNumber: newSetNumber, duration: 0, calories: 0, completed: false }
                : { setNumber: newSetNumber, reps: 0, weight: 0, completed: false },
            ],
          };
        }
        return ex;
      })
    );
  };

  const removeSet = (exerciseId: string, setNumber: number) => {
    setSelectedExercises(
      selectedExercises.map(ex => {
        if (ex.id === exerciseId && ex.sets.length > 1) {
          return {
            ...ex,
            sets: ex.sets.filter(s => s.setNumber !== setNumber),
          };
        }
        return ex;
      })
    );
  };

  const updateSet = (
    exerciseId: string,
    setNumber: number,
    field: 'reps' | 'weight' | 'duration' | 'calories',
    value: string
  ) => {
    setSelectedExercises(
      selectedExercises.map(ex => {
        if (ex.id === exerciseId) {
          return {
            ...ex,
            sets: ex.sets.map(set => {
              if (set.setNumber === setNumber) {
                return {
                  ...set,
                  [field]: field === 'duration' ? parseFloat(value) || 0 : parseInt(value) || 0,
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

  const startWorkout = () => {
    if (!workoutTitle.trim()) {
      alert('Please enter a workout title');
      return;
    }

    if (selectedExercises.length === 0) {
      alert('Please add at least one exercise');
      return;
    }

    navigation.navigate('ActiveWorkout', {
      title: workoutTitle,
      exercises: selectedExercises,
    });
  };

  const filteredExercises = availableExercises.filter(ex =>
    ex.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Title Input */}
        <View style={styles.section}>
          <Text style={styles.label}>Workout Title</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Upper Body Day"
            placeholderTextColor={colors.text.tertiary}
            value={workoutTitle}
            onChangeText={setWorkoutTitle}
          />
        </View>

        {/* Exercises */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Exercises</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowExercisePicker(true)}
            >
              <Text style={styles.addButtonText}>+ Add Exercise</Text>
            </TouchableOpacity>
          </View>

          {selectedExercises.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No exercises added yet</Text>
            </View>
          ) : (
            selectedExercises.map((exercise) => {
              const isCardio = exercise.sets[0]?.duration !== undefined;
              return (
                <View key={exercise.id} style={styles.exerciseCard}>
                  <View style={styles.exerciseHeader}>
                    <Text style={styles.exerciseName}>{exercise.exerciseName}</Text>
                    <TouchableOpacity onPress={() => removeExercise(exercise.id)}>
                      <Text style={styles.removeButton}>✕</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Sets */}
                  {exercise.sets.map(set => (
                    <View key={set.setNumber} style={styles.setRow}>
                      <Text style={styles.setNumber}>Set {set.setNumber}</Text>
                      <View style={styles.setInputs}>
                        {isCardio ? (
                          <>
                            <View style={styles.inputGroup}>
                              <TextInput
                                style={styles.setInput}
                                keyboardType="decimal-pad"
                                placeholder="Time"
                                placeholderTextColor={colors.text.tertiary}
                                value={set.duration && set.duration > 0 ? set.duration.toString() : ''}
                                onChangeText={value =>
                                  updateSet(exercise.id, set.setNumber, 'duration', value)
                                }
                              />
                              <Text style={styles.inputLabel}>min</Text>
                            </View>
                            <View style={styles.inputGroup}>
                              <TextInput
                                style={styles.setInput}
                                keyboardType="numeric"
                                placeholder="Cal (opt)"
                                placeholderTextColor={colors.text.tertiary}
                                value={set.calories && set.calories > 0 ? set.calories.toString() : ''}
                                onChangeText={value =>
                                  updateSet(exercise.id, set.setNumber, 'calories', value)
                                }
                              />
                              <Text style={styles.inputLabel}>cal</Text>
                            </View>
                          </>
                        ) : (
                          <>
                            <View style={styles.inputGroup}>
                              <TextInput
                                style={styles.setInput}
                                keyboardType="numeric"
                                placeholder="Reps"
                                placeholderTextColor={colors.text.tertiary}
                                value={set.reps && set.reps > 0 ? set.reps.toString() : ''}
                                onChangeText={value =>
                                  updateSet(exercise.id, set.setNumber, 'reps', value)
                                }
                              />
                              <Text style={styles.inputLabel}>reps</Text>
                            </View>
                            <View style={styles.inputGroup}>
                              <TextInput
                                style={styles.setInput}
                                keyboardType="numeric"
                                placeholder="Weight"
                                placeholderTextColor={colors.text.tertiary}
                                value={set.weight && set.weight > 0 ? set.weight.toString() : ''}
                                onChangeText={value =>
                                  updateSet(exercise.id, set.setNumber, 'weight', value)
                                }
                              />
                              <Text style={styles.inputLabel}>lbs</Text>
                            </View>
                          </>
                        )}
                      </View>
                      {exercise.sets.length > 1 && (
                        <TouchableOpacity
                          onPress={() => removeSet(exercise.id, set.setNumber)}
                        >
                          <Text style={styles.removeSetButton}>−</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}

                <TouchableOpacity
                  style={styles.addSetButton}
                  onPress={() => addSet(exercise.id)}
                >
                  <Text style={styles.addSetButtonText}>+ Add Set</Text>
                </TouchableOpacity>
              </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Start Workout Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.startButton} onPress={startWorkout}>
          <Text style={styles.startButtonText}>Start Workout</Text>
        </TouchableOpacity>
      </View>

      {/* Exercise Picker Modal */}
      <Modal
        visible={showExercisePicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowExercisePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Exercise</Text>
              <TouchableOpacity onPress={() => setShowExercisePicker(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Search exercises..."
              placeholderTextColor={colors.text.tertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            <ScrollView style={styles.exerciseList}>
              {filteredExercises.map(exercise => (
                <TouchableOpacity
                  key={exercise.id}
                  style={styles.exerciseItem}
                  onPress={() => addExercise(exercise)}
                >
                  <Text style={styles.exerciseItemName}>{exercise.name}</Text>
                  <Text style={styles.exerciseItemCategory}>{exercise.category}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  contentContainer: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  section: {
    marginBottom: spacing.lg,
  },
  label: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.text.primary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
  },
  addButton: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  addButtonText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  emptyState: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.base,
  },
  exerciseCard: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  exerciseName: {
    color: colors.text.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
  },
  removeButton: {
    color: colors.status.error,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  setNumber: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.base,
    width: 50,
  },
  setInputs: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  inputGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  setInput: {
    flex: 1,
    backgroundColor: colors.background.elevated,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  inputLabel: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.sm,
  },
  removeSetButton: {
    color: colors.status.error,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    paddingHorizontal: spacing.sm,
  },
  addSetButton: {
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
  },
  addSetButtonText: {
    color: colors.primary.light,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
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
  startButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  startButtonText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.effects.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background.secondary,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingTop: spacing.md,
    height: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },
  modalTitle: {
    color: colors.text.primary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
  },
  modalClose: {
    color: colors.text.secondary,
    fontSize: typography.fontSize['2xl'],
  },
  searchInput: {
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    margin: spacing.md,
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  exerciseList: {
    flex: 1,
  },
  exerciseItem: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
    marginHorizontal: spacing.md,
  },
  exerciseItemName: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing.xs,
  },
  exerciseItemCategory: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.sm,
  },
});
