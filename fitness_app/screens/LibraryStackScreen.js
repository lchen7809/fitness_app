import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LibraryScreen from './LibraryScreen';
import ExerciseDetailsScreen from './ExerciseDetailsScreen';

const LibraryStack = createStackNavigator();

const LibraryStackScreen = () => (
  <LibraryStack.Navigator>
    <LibraryStack.Screen name="Exercise Library" component={LibraryScreen} />
    <LibraryStack.Screen name="Exercise Details" component={ExerciseDetailsScreen} />
  </LibraryStack.Navigator>
);

export default LibraryStackScreen;
