const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  exercises: [{
    exercise_id: { type: String, required: true }, 
    reps: { type: Number, required: true },
    sets: { type: Number, required: true },
    weight: { type: Number, required: true },
    duration: { type: Number, required: true },
  }],
  date: { type: Date, required: true },
});

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;
 