const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  workout_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Workout', required: true },
  average_weight_lifted: { type: Number, required: true },
  average_reps: { type: Number, required: true },
  duration: { type: Number, required: true }, //duration in minutes
  date: { type: Date, required: true },
});

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress;