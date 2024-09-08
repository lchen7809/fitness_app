//User Model
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  preferences: {
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
  },
  created_at: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

module.exports = User;

