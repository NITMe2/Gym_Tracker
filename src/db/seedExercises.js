export const seedExercises = [
  // Chest
  { name: 'Bench Press', muscleGroup: 'Chest', category: 'Barbell', isCustom: false, description: 'Classic horizontal barbell press from chest to lockout. The primary compound builder for chest mass and strength.' },
  { name: 'Incline Bench Press', muscleGroup: 'Chest', category: 'Barbell', isCustom: false, description: 'Barbell press on an angled bench (30–45°) that shifts emphasis to the upper chest and front delts.' },
  { name: 'Dumbbell Fly', muscleGroup: 'Chest', category: 'Dumbbell', isCustom: false, description: 'Wide-arc chest isolation with dumbbells. Stretches and squeezes the pecs through a large range of motion.' },
  { name: 'Cable Fly', muscleGroup: 'Chest', category: 'Cable', isCustom: false, description: 'Constant-tension chest fly using a cable machine. Great for isolating the pecs at any angle.' },
  { name: 'Chest Press Machine', muscleGroup: 'Chest', category: 'Machine', isCustom: false, description: 'Guided horizontal press machine. A stable, joint-friendly alternative to the bench press.' },
  { name: 'Pec Deck', muscleGroup: 'Chest', category: 'Machine', isCustom: false, description: 'Seated machine fly with a fixed arc. Excellent finisher for isolating and squeezing the pecs.' },
  { name: 'Push-up', muscleGroup: 'Chest', category: 'Bodyweight', isCustom: false, description: 'Bodyweight horizontal push that builds chest, shoulders, and triceps with zero equipment.' },

  // Back
  { name: 'Lat Pulldown', muscleGroup: 'Back', category: 'Cable', isCustom: false, description: 'Pull a bar down to chin level on a cable machine. The go-to exercise for building lat width.' },
  { name: 'Seated Row', muscleGroup: 'Back', category: 'Cable', isCustom: false, description: 'Cable pull toward the midsection while seated, building thickness across the mid-back.' },
  { name: 'Deadlift', muscleGroup: 'Back', category: 'Barbell', isCustom: false, description: 'Compound pull from the floor that works the entire posterior chain — back, glutes, and hamstrings.' },
  { name: 'Barbell Row', muscleGroup: 'Back', category: 'Barbell', isCustom: false, description: 'Bent-over pull of a barbell to the lower chest. One of the best movements for back thickness.' },
  { name: 'Dumbbell Row', muscleGroup: 'Back', category: 'Dumbbell', isCustom: false, description: 'Single-arm dumbbell pull that allows a longer range of motion than a barbell row.' },
  { name: 'Pull-up', muscleGroup: 'Back', category: 'Bodyweight', isCustom: false, description: 'Bodyweight pull from a dead hang to chin-over-bar. A gold standard for lat width and back strength.' },
  { name: 'T-Bar Row', muscleGroup: 'Back', category: 'Machine', isCustom: false, description: 'Horizontal pull on a pivot-mounted bar combining the feel of barbell and machine rows.' },

  // Shoulders
  { name: 'Overhead Press', muscleGroup: 'Shoulders', category: 'Barbell', isCustom: false, description: 'Barbell pressed from shoulders to lockout overhead. The primary compound builder for shoulder mass.' },
  { name: 'Dumbbell Shoulder Press', muscleGroup: 'Shoulders', category: 'Dumbbell', isCustom: false, description: 'Seated or standing dumbbell press overhead, allowing a natural wrist path and unilateral work.' },
  { name: 'Lateral Raise', muscleGroup: 'Shoulders', category: 'Dumbbell', isCustom: false, description: 'Raises dumbbells out to the sides to shoulder height, directly targeting the lateral (side) deltoid.' },
  { name: 'Front Raise', muscleGroup: 'Shoulders', category: 'Dumbbell', isCustom: false, description: 'Lifts a weight straight forward to shoulder height, isolating the anterior (front) deltoid.' },
  { name: 'Cable Lateral Raise', muscleGroup: 'Shoulders', category: 'Cable', isCustom: false, description: 'Lateral raise with a cable pulley providing constant tension, especially at the bottom of the rep.' },
  { name: 'Shoulder Press Machine', muscleGroup: 'Shoulders', category: 'Machine', isCustom: false, description: 'Guided overhead press machine for stable, beginner-friendly shoulder development.' },

  // Arms
  { name: 'Dumbbell Curl', muscleGroup: 'Arms', category: 'Dumbbell', isCustom: false, description: 'Classic bicep curl with dumbbells, one or both arms at a time. The fundamental bicep builder.' },
  { name: 'Barbell Curl', muscleGroup: 'Arms', category: 'Barbell', isCustom: false, description: 'Bilateral bicep curl with a barbell, allowing heavier loads for maximum bicep mass.' },
  { name: 'Hammer Curl', muscleGroup: 'Arms', category: 'Dumbbell', isCustom: false, description: 'Neutral-grip curl targeting the brachialis and brachioradialis alongside the biceps for arm thickness.' },
  { name: 'Cable Curl', muscleGroup: 'Arms', category: 'Cable', isCustom: false, description: 'Bicep curl with a cable for continuous tension throughout the full range of motion.' },
  { name: 'Tricep Pushdown', muscleGroup: 'Arms', category: 'Cable', isCustom: false, description: 'Push a cable attachment down to full elbow extension, isolating all three heads of the triceps.' },
  { name: 'Skull Crusher', muscleGroup: 'Arms', category: 'Barbell', isCustom: false, description: 'Barbell lowered to the forehead then pressed back up. A heavy tricep isolator for mass.' },
  { name: 'Overhead Tricep Extension', muscleGroup: 'Arms', category: 'Dumbbell', isCustom: false, description: 'Dumbbell lowered behind the head to fully stretch the long head of the tricep.' },
  { name: 'Preacher Curl', muscleGroup: 'Arms', category: 'Machine', isCustom: false, description: 'Bicep curl on an angled pad that eliminates shoulder involvement for strict isolation.' },

  // Legs
  { name: 'Squat', muscleGroup: 'Legs', category: 'Barbell', isCustom: false, description: 'The king of leg exercises. Barbell on back, descend until thighs are parallel, drive back up.' },
  { name: 'Leg Press', muscleGroup: 'Legs', category: 'Machine', isCustom: false, description: 'Push a weighted sled with the legs on a machine — a stable, spine-friendly quad builder.' },
  { name: 'Leg Extension', muscleGroup: 'Legs', category: 'Machine', isCustom: false, description: 'Machine exercise isolating the quadriceps through seated knee extension.' },
  { name: 'Leg Curl', muscleGroup: 'Legs', category: 'Machine', isCustom: false, description: 'Machine exercise curling the lower leg to target and isolate the hamstrings.' },
  { name: 'Romanian Deadlift', muscleGroup: 'Legs', category: 'Barbell', isCustom: false, description: 'Hip-hinge lowering the bar along the legs, deeply stretching and loading the hamstrings.' },
  { name: 'Lunges', muscleGroup: 'Legs', category: 'Dumbbell', isCustom: false, description: 'Step forward and lower the knee toward the floor. Builds quads, glutes, and single-leg stability.' },
  { name: 'Calf Raise', muscleGroup: 'Legs', category: 'Machine', isCustom: false, description: 'Rise onto your toes under load to isolate the gastrocnemius and soleus muscles.' },
  { name: 'Hip Thrust', muscleGroup: 'Legs', category: 'Barbell', isCustom: false, description: 'Drive the hips upward with a barbell across the lap. The most effective glute isolation exercise.' },

  // Core
  { name: 'Plank', muscleGroup: 'Core', category: 'Bodyweight', isCustom: false, description: 'Hold a rigid body position on forearms and toes. Builds deep core stability and endurance.' },
  { name: 'Cable Crunch', muscleGroup: 'Core', category: 'Cable', isCustom: false, description: 'Kneel and pull a cable rope toward the floor in a crunching motion for weighted ab work.' },
  { name: 'Ab Wheel', muscleGroup: 'Core', category: 'Bodyweight', isCustom: false, description: 'Roll a wheel forward from a kneeling position, challenging the entire core under a long lever arm.' },
  { name: 'Hanging Leg Raise', muscleGroup: 'Core', category: 'Bodyweight', isCustom: false, description: 'Hang from a bar and raise the legs, targeting the lower abs and hip flexors under load.' },

  // Cardio
  { name: 'Treadmill', muscleGroup: 'Cardio', category: 'Machine', isCustom: false, exerciseType: 'cardio', cardioFields: ['duration', 'speed', 'incline', 'calories'], prField: 'speed', description: 'Indoor running or walking on a moving belt. Adjust speed and incline to vary intensity.' },
  { name: 'Outdoor Run', muscleGroup: 'Cardio', category: 'Other', isCustom: false, exerciseType: 'cardio', cardioFields: ['duration', 'distance', 'speed', 'calories'], prField: 'distance', description: 'Running outside on roads or trails. Builds cardiovascular endurance and mental toughness.' },
  { name: 'Stationary Bike', muscleGroup: 'Cardio', category: 'Machine', isCustom: false, exerciseType: 'cardio', cardioFields: ['duration', 'speed', 'resistance', 'calories'], prField: 'speed', description: 'Low-impact cycling machine. Great for conditioning without stress on the knees.' },
  { name: 'Rowing Machine', muscleGroup: 'Cardio', category: 'Machine', isCustom: false, exerciseType: 'cardio', cardioFields: ['duration', 'distance', 'calories'], prField: 'distance', description: 'Full-body cardio simulating rowing — works legs, back, and arms in one smooth pull.' },
  { name: 'Elliptical', muscleGroup: 'Cardio', category: 'Machine', isCustom: false, exerciseType: 'cardio', cardioFields: ['duration', 'resistance', 'incline', 'calories'], prField: 'duration', description: 'Low-impact cardio with a smooth oval stride that mimics running with minimal joint stress.' },
  { name: 'Stair Climber', muscleGroup: 'Cardio', category: 'Machine', isCustom: false, exerciseType: 'cardio', cardioFields: ['duration', 'level', 'calories'], prField: 'duration', description: 'Simulates climbing stairs for intense lower-body cardio and serious calorie burn.' },
  { name: 'Swimming', muscleGroup: 'Cardio', category: 'Other', isCustom: false, exerciseType: 'cardio', cardioFields: ['duration', 'distance', 'calories'], prField: 'distance', description: 'Full-body aquatic cardio that is highly effective and extremely gentle on the joints.' },
  { name: 'Jump Rope', muscleGroup: 'Cardio', category: 'Bodyweight', isCustom: false, exerciseType: 'cardio', cardioFields: ['duration', 'calories'], prField: 'duration', description: 'High-intensity skipping for cardiovascular fitness, coordination, and agility.' },
]
