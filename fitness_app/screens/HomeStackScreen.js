import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import LogWorkoutScreen from './LogWorkoutScreen';

const HomeStack = createStackNavigator();

const HomeStackScreen = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
    <HomeStack.Screen name="LogWorkout" component={LogWorkoutScreen} />
  </HomeStack.Navigator>
);

export default HomeStackScreen;
