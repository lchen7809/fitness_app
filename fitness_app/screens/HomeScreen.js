import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { LOCAL_IP } from '../backend/ipLocal';
import UserContext from '../context/UserContext';
import { useFocusEffect } from '@react-navigation/native'; 

const HomeScreen = ({ navigation }) => {
  const [quote, setQuote] = useState('');
  const [loading, setLoading] = useState(true);
  const [markedDates, setMarkedDates] = useState({});
  const { theme } = useContext(UserContext);

  const fetchWorkouts = async () => {
    try {
      const response = await fetch('http://'+LOCAL_IP+':4000/all-workouts');
      const data = await response.json();
      const dates = {};
      data.forEach((workout) => {
        const date = new Date(workout.date).toISOString().split('T')[0]; 
        dates[date] = { selected: true, selectedColor: 'red' };
      });
      setMarkedDates(dates);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchWorkouts();
    }, [])
  );

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch('https://api.api-ninjas.com/v1/quotes?category=fitness', {
          headers: {
            'X-Api-Key': '7jwc35WbpDNbCTD+yMNaqA==h6u8til5LaDlqcdY',
          },
        });
        const data = await response.json();
        if (data.length > 0) {
          setQuote(data[0].quote); 
        } else {
          setQuote('Stay motivated and keep pushing forward!');
        }
      } catch (error) {
        console.error('Error fetching quote:', error);
        setQuote('Stay motivated and keep pushing forward!');
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <Text style={[styles.title, { color: theme.textColor }]} allowFontScaling={true}>
        Welcome, user1!
      </Text>
      <View style={styles.calendarContainer}>
        <Calendar
          markedDates={markedDates}
          markingType={'simple'}
          style={[styles.calendar, { backgroundColor: theme.calendarBackground }]} 
          theme={theme.calendarTheme}
          accessible={true}
          accessibilityLabel="Workout Calendar"
        />
      </View>
      <View style={[styles.quoteContainer, { backgroundColor: theme.quoteContainerBackground }]} accessible={true} accessibilityLabel="Daily motivational quote">
        {loading ? (
          <ActivityIndicator size="large" color="#00adf5" accessibilityLabel="Loading quote" />
        ) : (
          <Text style={[styles.quoteText, { color: theme.quoteTextColor }]} allowFontScaling={true}>
            {quote}
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.logWorkoutButton}
        onPress={() => navigation.navigate('LogWorkout')}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Log Workout"
      >
        <Text style={styles.logWorkoutButtonText} allowFontScaling={true}>Log Workout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  calendarContainer: {
    width: '100%',
  },
  calendar: {
    borderRadius: 10,
    paddingVertical: 10,
  },
  quoteContainer: {
    marginTop: 20,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    width: '100%',
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  logWorkoutButton: {
    backgroundColor: '#FC2247',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 5,
    marginTop: 20,
  },
  logWorkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;
