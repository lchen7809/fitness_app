import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import { LOCAL_IP } from '../backend/ipLocal.js';
import UserContext from '../context/UserContext'; 

const LogWorkoutScreen = ({ navigation }) => {
  const { theme } = useContext(UserContext); 

  const [exerciseName, setExerciseName] = useState('');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [reps, setReps] = useState('');
  const [sets, setSets] = useState('');
  const [weight, setWeight] = useState('');
  const [duration, setDuration] = useState('');
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [searchText, setSearchText] = useState('');

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
        setExercises(data);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      }
    };

    fetchExercises();
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);
    if (text) {
      const filteredData = exercises.filter((exercise) =>
        exercise.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredExercises(filteredData);
    } else {
      setFilteredExercises([]);
    }
  };

  const handleSelectExercise = (exercise) => {
    setSelectedExercise(exercise);
    setExerciseName(exercise.name);
    setSearchText('');
    setFilteredExercises([]);
  };

  const logWorkout = async () => {
    if (!selectedExercise) {
      alert('Please select an exercise.');
      return;
    }
  
    const newExercise = {
      exercise_id: selectedExercise.id,
      reps: parseInt(reps),
      sets: parseInt(sets),
      weight: parseFloat(weight),
      duration: parseInt(duration),
    };
  
    const date = new Date();
    
  
    try {
      const response = await fetch('http://' + LOCAL_IP + ':4000/workouts', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exercises: [newExercise],
          date: date.toISOString(), 
        }),
      });
  
      if (response.ok) {
        alert('Workout logged!');
        navigation.goBack();
      } else {
        const errorData = await response.json();
        console.error('Error logging workout:', errorData);
        alert('Error logging workout');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error');
    }
  
    //reset fields
    setSelectedExercise(null);
    setExerciseName('');
    setReps('');
    setSets('');
    setWeight('');
    setDuration('');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <TextInput
        style={[styles.input, { backgroundColor: theme.quoteContainerBackground, color: theme.textColor }]}
        placeholder="Search Exercise... (eg. Squat, Curl, Barbell)"
        placeholderTextColor={theme.quoteTextColor}
        value={searchText}
        onChangeText={handleSearch}
      />
      {searchText && (
        <FlatList
          data={filteredExercises}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelectExercise(item)}>
              <Text style={[styles.item, { backgroundColor: theme.quoteContainerBackground, color: theme.textColor }]}>{item.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
      )}
      <TextInput
        style={[styles.exerciseNameInput, { color: theme.textColor, fontWeight: 'bold' }]}  
        placeholder="Exercise Name"
        placeholderTextColor={theme.mode === 'dark' ? '#ffffff' : '#808080'} 
        value={exerciseName}
        editable={false}
      />
      <TextInput
        style={[styles.input, { backgroundColor: theme.quoteContainerBackground, color: theme.textColor }]}
        placeholder="Reps"
        placeholderTextColor={theme.mode === 'dark' ? '#ffffff' : '#808080'} 
        keyboardType="numeric"
        value={reps}
        onChangeText={setReps}
      />
      <TextInput
        style={[styles.input, { backgroundColor: theme.quoteContainerBackground, color: theme.textColor }]}
        placeholder="Sets"
        placeholderTextColor={theme.mode === 'dark' ? '#ffffff' : '#808080'} 
        keyboardType="numeric"
        value={sets}
        onChangeText={setSets}
      />
      <TextInput
        style={[styles.input, { backgroundColor: theme.quoteContainerBackground, color: theme.textColor }]}
        placeholder="Weight"
        placeholderTextColor={theme.mode === 'dark' ? '#ffffff' : '#808080'} 
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />
      <TextInput
        style={[styles.input, { backgroundColor: theme.quoteContainerBackground, color: theme.textColor }]}
        placeholder="Duration"
        placeholderTextColor={theme.mode === 'dark' ? '#ffffff' : '#808080'} 
        keyboardType="numeric"
        value={duration}
        onChangeText={setDuration}
      />
      <TouchableOpacity 
        style={[styles.logWorkoutButton, { backgroundColor: theme.buttonColor }]} 
        onPress={logWorkout}
      >
        <Text style={[styles.logWorkoutButtonText, { color: theme.buttonTextColor }]}>Log Workout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: '100%',
    padding: 10,
    borderRadius: 8,
  },
  exerciseNameInput: {  
    height: 40,
    marginBottom: 10,
    width: '100%',
    padding: 10,
    backgroundColor: 'transparent',  
    borderWidth: 0,  
  },
  item: {
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  logWorkoutButton: {
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 5,
    marginTop: 20,
  },
  logWorkoutButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default LogWorkoutScreen;
