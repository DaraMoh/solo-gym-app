import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';
import { Exercise, WorkoutExercise, WorkoutSet, WorkoutTemplate, MuscleGroup, EquipmentType, DifficultyLevel } from '../types';
import { getExercises, saveWorkoutTemplate, getWorkoutTemplates, deleteWorkoutTemplate } from '../services/storage';

interface CreateWorkoutScreenProps {
  navigation: any;
}

export const CreateWorkoutScreen: React.FC<CreateWorkoutScreenProps> = ({ navigation }) => {
  const [workoutTitle, setWorkoutTitle] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<WorkoutExercise[]>([]);
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter states
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<MuscleGroup | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentType | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadExercises();
    loadTemplates();
  }, []);

  const loadExercises = async () => {
    const exercises = await getExercises();
    console.log('Loaded exercises count:', exercises.length);
    if (exercises.length > 0) {
      console.log('First exercise:', exercises[0]);
    }
    setAvailableExercises(exercises);
  };

  const loadTemplates = async () => {
    const loadedTemplates = await getWorkoutTemplates();
    setTemplates(loadedTemplates);
  };

  const loadFromTemplate = (template: WorkoutTemplate) => {
    setWorkoutTitle(template.title);
    // Reset set completion status for new workout
    const resetExercises = template.exercises.map(exercise => ({
      ...exercise,
      id: `we_${Date.now()}_${Math.random()}`, // New ID for this instance
      sets: exercise.sets.map(set => ({ ...set, completed: false })),
    }));
    setSelectedExercises(resetExercises);
    setShowTemplatePicker(false);
    Alert.alert('Template Loaded', `"${template.title}" has been loaded. You can modify it before starting.`);
  };

  const saveAsTemplate = async () => {
    if (!workoutTitle.trim()) {
      Alert.alert('Missing Title', 'Please enter a workout title before saving as template.');
      return;
    }

    if (selectedExercises.length === 0) {
      Alert.alert('No Exercises', 'Please add at least one exercise before saving as template.');
      return;
    }

    try {
      const template: WorkoutTemplate = {
        id: `template_${Date.now()}`,
        userId: 'user_1',
        title: workoutTitle,
        exercises: selectedExercises,
        createdAt: new Date(),
      };

      await saveWorkoutTemplate(template);
      await loadTemplates();
      Alert.alert('Template Saved', `"${workoutTitle}" has been saved as a template!`);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save template');
    }
  };

  const handleDeleteTemplate = (templateId: string, templateName: string) => {
    Alert.alert(
      'Delete Template',
      `Are you sure you want to delete "${templateName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteWorkoutTemplate(templateId);
              await loadTemplates();
              Alert.alert('Deleted', 'Template has been deleted');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete template');
            }
          },
        },
      ]
    );
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

  const resetFilters = () => {
    setSelectedMuscleGroup(null);
    setSelectedEquipment(null);
    setSelectedDifficulty(null);
    setSearchQuery('');
  };

  const filteredExercises = availableExercises.filter(ex => {
    // Search query filter
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());

    // Muscle group filter
    const matchesMuscleGroup = !selectedMuscleGroup ||
      ex.muscleGroups.includes(selectedMuscleGroup);

    // Equipment filter
    const matchesEquipment = !selectedEquipment ||
      ex.equipment === selectedEquipment;

    // Difficulty filter
    const matchesDifficulty = !selectedDifficulty ||
      ex.difficulty === selectedDifficulty;

    return matchesSearch && matchesMuscleGroup && matchesEquipment && matchesDifficulty;
  });

  const activeFilterCount = [selectedMuscleGroup, selectedEquipment, selectedDifficulty].filter(Boolean).length;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Load Template Button */}
        {templates.length > 0 && (
          <View style={styles.templateSection}>
            <TouchableOpacity
              style={styles.loadTemplateButton}
              onPress={() => setShowTemplatePicker(true)}
            >
              <Text style={styles.loadTemplateButtonText}>
                📋 Load from Saved Workouts ({templates.length}/7)
              </Text>
            </TouchableOpacity>
          </View>
        )}

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

      {/* Footer Buttons */}
      <View style={styles.footer}>
        {selectedExercises.length > 0 && templates.length < 7 && (
          <TouchableOpacity style={styles.saveTemplateButton} onPress={saveAsTemplate}>
            <Text style={styles.saveTemplateButtonText}>💾 Save as Template</Text>
          </TouchableOpacity>
        )}
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

            {/* Filter Toggle Button */}
            <TouchableOpacity
              style={styles.filterToggleButton}
              onPress={() => setShowFilters(!showFilters)}
            >
              <Text style={styles.filterToggleText}>
                🔍 Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
              </Text>
            </TouchableOpacity>

            {/* Filter Section */}
            {showFilters && (
              <View style={styles.filtersContainer}>
                {/* Muscle Group Filter */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterLabel}>Muscle Group</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterChips}>
                    {Object.values(MuscleGroup).map((muscle) => (
                      <TouchableOpacity
                        key={muscle}
                        style={[
                          styles.filterChip,
                          selectedMuscleGroup === muscle && styles.filterChipActive,
                        ]}
                        onPress={() => setSelectedMuscleGroup(selectedMuscleGroup === muscle ? null : muscle)}
                      >
                        <Text
                          style={[
                            styles.filterChipText,
                            selectedMuscleGroup === muscle && styles.filterChipTextActive,
                          ]}
                        >
                          {muscle.replace('_', ' ')}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Equipment Filter */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterLabel}>Equipment</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterChips}>
                    {Object.values(EquipmentType).map((equipment) => (
                      <TouchableOpacity
                        key={equipment}
                        style={[
                          styles.filterChip,
                          selectedEquipment === equipment && styles.filterChipActive,
                        ]}
                        onPress={() => setSelectedEquipment(selectedEquipment === equipment ? null : equipment)}
                      >
                        <Text
                          style={[
                            styles.filterChipText,
                            selectedEquipment === equipment && styles.filterChipTextActive,
                          ]}
                        >
                          {equipment.replace('_', ' ')}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Difficulty Filter */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterLabel}>Difficulty</Text>
                  <View style={styles.filterChips}>
                    {Object.values(DifficultyLevel).map((difficulty) => (
                      <TouchableOpacity
                        key={difficulty}
                        style={[
                          styles.filterChip,
                          selectedDifficulty === difficulty && styles.filterChipActive,
                        ]}
                        onPress={() => setSelectedDifficulty(selectedDifficulty === difficulty ? null : difficulty)}
                      >
                        <Text
                          style={[
                            styles.filterChipText,
                            selectedDifficulty === difficulty && styles.filterChipTextActive,
                          ]}
                        >
                          {difficulty}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Reset Filters Button */}
                {activeFilterCount > 0 && (
                  <TouchableOpacity style={styles.resetFiltersButton} onPress={resetFilters}>
                    <Text style={styles.resetFiltersText}>Clear All Filters</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Results Count */}
            <Text style={styles.resultsCount}>
              {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''} found
            </Text>

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

      {/* Template Picker Modal */}
      <Modal
        visible={showTemplatePicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTemplatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Saved Workouts</Text>
              <TouchableOpacity onPress={() => setShowTemplatePicker(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.templateList}>
              {templates.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No saved workouts yet</Text>
                </View>
              ) : (
                templates.map(template => (
                  <View key={template.id} style={styles.templateItem}>
                    <TouchableOpacity
                      style={styles.templateInfo}
                      onPress={() => loadFromTemplate(template)}
                    >
                      <Text style={styles.templateName}>{template.title}</Text>
                      <Text style={styles.templateDetails}>
                        {template.exercises.length} exercises
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteTemplateButton}
                      onPress={() => handleDeleteTemplate(template.id, template.title)}
                    >
                      <Text style={styles.deleteTemplateText}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
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
  // Template styles
  templateSection: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  loadTemplateButton: {
    backgroundColor: colors.secondary.dark,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  loadTemplateButtonText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  saveTemplateButton: {
    backgroundColor: colors.background.elevated,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary.main,
  },
  saveTemplateButtonText: {
    color: colors.primary.light,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  templateList: {
    paddingTop: spacing.md,
    flex: 1,
  },
  templateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  templateInfo: {
    flex: 1,
  },
  templateName: {
    color: colors.text.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  templateDetails: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
  },
  deleteTemplateButton: {
    padding: spacing.sm,
  },
  deleteTemplateText: {
    fontSize: typography.fontSize.xl,
  },
  filterToggleButton: {
    backgroundColor: colors.background.tertiary,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  filterToggleText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
  },
  filtersContainer: {
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.md,
  },
  filterSection: {
    marginBottom: spacing.md,
  },
  filterLabel: {
    color: colors.text.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.sm,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  filterChip: {
    backgroundColor: colors.background.tertiary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border.primary,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  filterChipActive: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  filterChipText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    textTransform: 'capitalize',
  },
  filterChipTextActive: {
    color: colors.text.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  resetFiltersButton: {
    backgroundColor: colors.background.elevated,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  resetFiltersText: {
    color: colors.primary.main,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
  },
  resultsCount: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
});
