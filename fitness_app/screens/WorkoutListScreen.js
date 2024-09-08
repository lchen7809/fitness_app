import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { format } from 'date-fns';
import { LOCAL_IP } from '../backend/ipLocal.js';
import UserContext from '../context/UserContext'; 

const WorkoutListScreen = () => {
  const [workouts, setWorkouts] = useState([]);
  const [exerciseLookup, setExerciseLookup] = useState({});
  const { theme } = useContext(UserContext); 

  //lookup table for exercise names
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch(
          'https://exercisedb.p.rapidapi.com/exercises/equipment/barbell?limit=200',
          {
            method: 'GET',
            headers: {
              'x-rapidapi-key': '8d07058bc0mshbcf3962110e00d5p10fb60jsn6596690a841e',
              'x-rapidapi-host': 'exercisedb.p.rapidapi.com',
            },
          }
        );
        const data = await response.json();
        const lookup = {};
        data.forEach(exercise => {
          lookup[exercise.id] = exercise.name;
        });
        setExerciseLookup(lookup);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      }
    };

    fetchExercises();
  }, []);

  //fetch workouts
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch('http://' + LOCAL_IP + ':4000/all-workouts');
        const data = await response.json();
        const sortedWorkouts = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setWorkouts(sortedWorkouts);
      } catch (error) {
        console.error('Error fetching workouts:', error);
      }
    };

    fetchWorkouts();
  }, []);

  const renderExercise = ({ item }) => (
    <View style={[styles.exerciseCard, { backgroundColor: theme.quoteContainerBackground }]}>
      <Text style={[styles.exerciseName, { color: theme.textColor }]}>
        {exerciseLookup[item.exercise_id] || 'Unknown Exercise'}
      </Text>
      <Text style={{ color: theme.textColor }}>Weight: {item.weight} kg</Text>
      <Text style={{ color: theme.textColor }}>Reps: {item.reps}</Text>
      <Text style={{ color: theme.textColor }}>Duration: {item.duration} mins</Text>
    </View>
  );

  const renderWorkout = ({ item }) => (
    <View style={[styles.workoutCard, { backgroundColor: theme.quoteContainerBackground }]}>
      <Text style={[styles.workoutDate, { color: theme.textColor }]}>
        {format(new Date(item.date), 'yyyy-MM-dd')}
      </Text>
      <FlatList
        data={item.exercises}
        renderItem={renderExercise}
        keyExtractor={(exercise) => exercise._id.toString()}
      />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <FlatList
        data={workouts}
        renderItem={renderWorkout}
        keyExtractor={(workout) => workout._id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  workoutCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
  },
  workoutDate: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  exerciseCard: {
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WorkoutListScreen;
