import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TrackerScreen from './TrackerScreen';
import WorkoutListScreen from './WorkoutListScreen';

const Stack = createStackNavigator();

const TrackerStackScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Progress Tracker" component={TrackerScreen} />
      <Stack.Screen name="WorkoutList" component={WorkoutListScreen} options={{ title: 'All Workouts' }} />
    </Stack.Navigator>
  );
};

export default TrackerStackScreen;
