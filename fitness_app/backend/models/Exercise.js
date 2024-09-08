const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  demo: { type: String },  //gif url 
  instructions: { type: String, required: true },
  muscle_group: { type: String, required: true },
  video_url: { type: String }, //youtube video url
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;
