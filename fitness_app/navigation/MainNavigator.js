import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import LogWorkoutScreen from '../screens/LogWorkoutScreen';
import ViewWorkoutsScreen from '../screens/ViewWorkoutsScreen'; 

const Stack = createStackNavigator();

const MainNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="LogWorkout" component={LogWorkoutScreen} />
      <Stack.Screen name="ViewWorkouts" component={ViewWorkoutsScreen} /> 
    </Stack.Navigator>
  </NavigationContainer>
);

export default MainNavigator;
