const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const mongoURI = 'mongodb+srv://lchen044:D1feO3qOMgvW4zIx@cluster0.xoh5n5k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

const User = require('./models/User');
const Workout = require('./models/Workout');
const Exercise = require('./models/Exercise');
const Progress = require('./models/Progress');

//fetch average weight lifted over the last 3 months
app.get('/average-weight', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const workouts = await Workout.aggregate([
      {
        $match: {
          date: {
            $gte: start,
            $lte: end,
          },
        },
      },
      {
        $unwind: '$exercises',
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          averageWeight: { $avg: '$exercises.weight' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.json(workouts);
  } catch (error) {
    console.error('Error fetching average weight data:', error);
    res.status(500).send('Server Error');
  }
});


app.get('/workout-date-range', async (req, res) => {
  try {
    const firstWorkout = await Workout.findOne().sort({ date: 1 }).select('date').exec();
    const lastWorkout = await Workout.findOne().sort({ date: -1 }).select('date').exec();

    if (firstWorkout && lastWorkout) {
      res.json({
        firstDate: firstWorkout.date,
        lastDate: lastWorkout.date,
      });
    } else {
      res.status(404).json({ error: 'No workout data found' });
    }
  } catch (error) {
    console.error('Error fetching workout date range:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});



//route to log workout
app.post('/workouts', async (req, res) => {
  try {
    const date = new Date(req.body.date);
    date.setHours(0, 0, 0, 0);

    let workout = await Workout.findOne({ date: date });

    if (workout) {
      workout.exercises.push(...req.body.exercises);
    } else {
      workout = new Workout({
        exercises: req.body.exercises,
        date: date,
      });
    }

    await workout.save();
    res.status(201).send(workout);
  } catch (error) {
    console.error('Error logging workout:', error);
    res.status(400).send(error);
  }
});

//fetch all workouts
app.get('/all-workouts', async (req, res) => {
  try {
    const workouts = await Workout.find(); 
    res.status(200).json(workouts); 
  } catch (error) {
    console.error('Error fetching workouts:', error);
    res.status(500).json({ error: 'Failed to fetch workouts' }); 
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
