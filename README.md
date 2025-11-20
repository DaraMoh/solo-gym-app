# Solo Gym - Leveling System for Gym Enthusiasts

A Solo Leveling inspired mobile app for gym-goers who want to track their workouts while progressing through missions and milestones. Transform your fitness journey into an RPG-like experience!

## Features

### MVP Features (Current)
- **Workout Tracking**: Log exercises with sets, reps, and weight
- **Leveling System**: Gain XP from workouts and level up from E to S rank
- **Missions System**: Daily and weekly challenges to keep you motivated
- **Dark Theme**: Solo Leveling inspired UI with blue/purple aesthetics
- **Stats Dashboard**: Track strength, endurance, consistency, and more
- **Streak System**: Build and maintain workout streaks

### Planned Features
- **Milestones**: Long-term achievements and goals
- **Social Features**: Compete with friends and share progress
- **Custom Workout Templates**: Save and reuse your favorite routines
- **Advanced Analytics**: Detailed insights into your progress

## Tech Stack

### Frontend (Mobile)
- **React Native** with Expo
- **TypeScript** for type safety
- **React Navigation** for routing
- **AsyncStorage** for local data persistence

### Backend
- **Python** with FastAPI
- **SQLAlchemy** for database ORM
- **JWT** for authentication (future)

## Project Structure

```
solo-gym-app/
├── mobile/                 # React Native app
│   ├── src/
│   │   ├── screens/       # App screens (Home, Workout, Missions, Profile)
│   │   ├── navigation/    # Navigation setup
│   │   ├── components/    # Reusable components
│   │   ├── services/      # Business logic and storage
│   │   ├── theme/         # Theme configuration (colors, typography, spacing)
│   │   └── types/         # TypeScript type definitions
│   ├── App.tsx           # Main app entry point
│   └── package.json
│
├── backend/               # Python FastAPI backend
│   ├── app/
│   │   ├── models/       # Data models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── main.py       # FastAPI app
│   └── requirements.txt
│
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Python 3.11+ (for backend, optional for now)
- Expo Go app on your phone (for testing)

### Mobile App Setup

1. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Scan the QR code with:
   - **iOS**: Camera app
   - **Android**: Expo Go app

### Backend Setup (Optional - for future use)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - **Windows**: `venv\Scripts\activate`
   - **Mac/Linux**: `source venv/bin/activate`

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```

## How It Works

### Leveling System
- Complete workouts to earn XP
- XP is calculated based on:
  - Base workout XP: 50
  - Sets completed: 5 XP per set
  - Weight lifted: 0.5 XP per kg
  - Duration: 2 XP per minute
  - Completion bonus: 25 XP

### Rank Progression
- **E Rank**: Level 1-9
- **D Rank**: Level 10-24
- **C Rank**: Level 25-49
- **B Rank**: Level 50-74
- **A Rank**: Level 75-99
- **S Rank**: Level 100+

### Missions
- **Daily Missions**: Reset every 24 hours
  - Complete 1 workout
  - Complete 15 sets
  - Lift 1000kg total
- **Weekly Missions**: Reset every 7 days
  - Complete 5 workouts
  - Train for 300 minutes
  - Lift 10,000kg total

### Stats Calculation
- **Strength**: Based on total volume lifted
- **Endurance**: Based on total workout time
- **Consistency**: Based on number of workouts completed

## Current State

The app currently has:
- ✅ Complete data models and type definitions
- ✅ Local storage implementation
- ✅ Leveling and XP calculation system
- ✅ Mission generation and tracking
- ✅ Four main screens (Home, Workout, Missions, Profile)
- ✅ Dark theme with Solo Leveling aesthetics
- ✅ Bottom tab navigation

### Next Steps for Development
1. Implement workout creation and tracking UI
2. Add exercise library browser
3. Create workout session screen with timer
4. Add mission completion notifications
5. Implement level-up animations
6. Add workout history and details screens

## Contributing

This is a personal project, but suggestions and feedback are welcome!

## License

MIT License

## Acknowledgments

Inspired by the Solo Leveling manhwa and anime series.
