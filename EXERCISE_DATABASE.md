# Exercise Database

The app now uses a comprehensive exercise database with **800+ exercises** from the [Free Exercise DB](https://github.com/yuhonas/free-exercise-db) project.

## Exercise Coverage

The database includes exercises across multiple categories:

### Categories
- **Strength Training** (primary focus)
- **Cardio**
- **Stretching/Flexibility**
- **Plyometrics**
- **Powerlifting**
- **Strongman**
- **Olympic Weightlifting**

### Equipment Types
- Body weight exercises
- Barbell
- Dumbbell
- Cable machines
- Kettlebells
- Resistance bands
- Medicine ball
- Exercise ball
- Foam roller
- And more specialty equipment

### Muscle Groups Covered
- Chest
- Back (lats, middle back, lower back)
- Shoulders
- Arms (biceps, triceps, forearms)
- Legs (quadriceps, hamstrings, glutes, calves)
- Core (abdominals)
- Full body

### Difficulty Levels
- Beginner
- Intermediate
- Expert

## Implementation

The exercise database is loaded from `src/data/exerciseDatabase.json` and converted to our internal format in `src/services/exerciseDatabase.ts`.

### Features Available

- **Search**: Find exercises by name
- **Filter by Category**: Browse exercises by type
- **Filter by Muscle Group**: Find exercises targeting specific muscles
- **Popular Exercises**: Curated list of recommended exercises for beginners

### Using the Exercise Database

The database is automatically loaded when you:
1. Launch the app for the first time
2. Create a new workout
3. Browse the exercise library

All exercises are stored locally using AsyncStorage for fast access and offline functionality.

## Data Source

Exercise data is sourced from the [yuhonas/free-exercise-db](https://github.com/yuhonas/free-exercise-db) repository, which is an open-source, public domain exercise dataset.
