export const seedExercises = [
  // Chest
  { name: 'Bench Press', muscleGroup: 'Chest', category: 'Barbell', isCustom: false },
  { name: 'Incline Bench Press', muscleGroup: 'Chest', category: 'Barbell', isCustom: false },
  { name: 'Dumbbell Fly', muscleGroup: 'Chest', category: 'Dumbbell', isCustom: false },
  { name: 'Cable Fly', muscleGroup: 'Chest', category: 'Cable', isCustom: false },
  { name: 'Chest Press Machine', muscleGroup: 'Chest', category: 'Machine', isCustom: false },
  { name: 'Pec Deck', muscleGroup: 'Chest', category: 'Machine', isCustom: false },
  { name: 'Push-up', muscleGroup: 'Chest', category: 'Bodyweight', isCustom: false },

  // Back
  { name: 'Lat Pulldown', muscleGroup: 'Back', category: 'Cable', isCustom: false },
  { name: 'Seated Row', muscleGroup: 'Back', category: 'Cable', isCustom: false },
  { name: 'Deadlift', muscleGroup: 'Back', category: 'Barbell', isCustom: false },
  { name: 'Barbell Row', muscleGroup: 'Back', category: 'Barbell', isCustom: false },
  { name: 'Dumbbell Row', muscleGroup: 'Back', category: 'Dumbbell', isCustom: false },
  { name: 'Pull-up', muscleGroup: 'Back', category: 'Bodyweight', isCustom: false },
  { name: 'T-Bar Row', muscleGroup: 'Back', category: 'Machine', isCustom: false },

  // Shoulders
  { name: 'Overhead Press', muscleGroup: 'Shoulders', category: 'Barbell', isCustom: false },
  { name: 'Dumbbell Shoulder Press', muscleGroup: 'Shoulders', category: 'Dumbbell', isCustom: false },
  { name: 'Lateral Raise', muscleGroup: 'Shoulders', category: 'Dumbbell', isCustom: false },
  { name: 'Front Raise', muscleGroup: 'Shoulders', category: 'Dumbbell', isCustom: false },
  { name: 'Cable Lateral Raise', muscleGroup: 'Shoulders', category: 'Cable', isCustom: false },
  { name: 'Shoulder Press Machine', muscleGroup: 'Shoulders', category: 'Machine', isCustom: false },

  // Arms
  { name: 'Dumbbell Curl', muscleGroup: 'Arms', category: 'Dumbbell', isCustom: false },
  { name: 'Barbell Curl', muscleGroup: 'Arms', category: 'Barbell', isCustom: false },
  { name: 'Hammer Curl', muscleGroup: 'Arms', category: 'Dumbbell', isCustom: false },
  { name: 'Cable Curl', muscleGroup: 'Arms', category: 'Cable', isCustom: false },
  { name: 'Tricep Pushdown', muscleGroup: 'Arms', category: 'Cable', isCustom: false },
  { name: 'Skull Crusher', muscleGroup: 'Arms', category: 'Barbell', isCustom: false },
  { name: 'Overhead Tricep Extension', muscleGroup: 'Arms', category: 'Dumbbell', isCustom: false },
  { name: 'Preacher Curl', muscleGroup: 'Arms', category: 'Machine', isCustom: false },

  // Legs
  { name: 'Squat', muscleGroup: 'Legs', category: 'Barbell', isCustom: false },
  { name: 'Leg Press', muscleGroup: 'Legs', category: 'Machine', isCustom: false },
  { name: 'Leg Extension', muscleGroup: 'Legs', category: 'Machine', isCustom: false },
  { name: 'Leg Curl', muscleGroup: 'Legs', category: 'Machine', isCustom: false },
  { name: 'Romanian Deadlift', muscleGroup: 'Legs', category: 'Barbell', isCustom: false },
  { name: 'Lunges', muscleGroup: 'Legs', category: 'Dumbbell', isCustom: false },
  { name: 'Calf Raise', muscleGroup: 'Legs', category: 'Machine', isCustom: false },
  { name: 'Hip Thrust', muscleGroup: 'Legs', category: 'Barbell', isCustom: false },

  // Core
  { name: 'Plank', muscleGroup: 'Core', category: 'Bodyweight', isCustom: false },
  { name: 'Cable Crunch', muscleGroup: 'Core', category: 'Cable', isCustom: false },
  { name: 'Ab Wheel', muscleGroup: 'Core', category: 'Bodyweight', isCustom: false },
  { name: 'Hanging Leg Raise', muscleGroup: 'Core', category: 'Bodyweight', isCustom: false },

  // Cardio
  { name: 'Treadmill', muscleGroup: 'Cardio', category: 'Machine', isCustom: false, exerciseType: 'cardio', cardioFields: ['duration', 'speed', 'incline'], prField: 'speed' },
  { name: 'Outdoor Run', muscleGroup: 'Cardio', category: 'Other', isCustom: false, exerciseType: 'cardio', cardioFields: ['duration', 'distance', 'speed'], prField: 'distance' },
  { name: 'Stationary Bike', muscleGroup: 'Cardio', category: 'Machine', isCustom: false, exerciseType: 'cardio', cardioFields: ['duration', 'speed', 'resistance'], prField: 'speed' },
  { name: 'Rowing Machine', muscleGroup: 'Cardio', category: 'Machine', isCustom: false, exerciseType: 'cardio', cardioFields: ['duration', 'distance'], prField: 'distance' },
  { name: 'Elliptical', muscleGroup: 'Cardio', category: 'Machine', isCustom: false, exerciseType: 'cardio', cardioFields: ['duration', 'resistance', 'incline'], prField: 'duration' },
  { name: 'Stair Climber', muscleGroup: 'Cardio', category: 'Machine', isCustom: false, exerciseType: 'cardio', cardioFields: ['duration', 'level'], prField: 'duration' },
  { name: 'Swimming', muscleGroup: 'Cardio', category: 'Other', isCustom: false, exerciseType: 'cardio', cardioFields: ['duration', 'distance'], prField: 'distance' },
  { name: 'Jump Rope', muscleGroup: 'Cardio', category: 'Bodyweight', isCustom: false, exerciseType: 'cardio', cardioFields: ['duration'], prField: 'duration' },
]
