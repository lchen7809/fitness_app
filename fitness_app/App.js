import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeStackScreen from './screens/HomeStackScreen';
import TrackerStackScreen from './screens/TrackerStackScreen';
import LibraryStackScreen from './screens/LibraryStackScreen';
import ProfileScreen from './screens/ProfileScreen';
import { UserProvider } from './context/UserContext';
import { LOCAL_IP } from './backend/ipLocal.js';

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Home') {
            return <Ionicons name="barbell" size={size} color={color} />;
          } else if (route.name === 'Tracker') {
            return <AntDesign name="linechart" size={25} color={color} />;
          } else if (route.name === 'Library') {
            return <Fontisto name="nav-icon-list-a" size={20} color={color} />;
          } else if (route.name === 'Profile') {
            return <MaterialCommunityIcons name="account-circle" size={30} color={color} />;
          }
        },
        tabBarActiveTintColor: 'red',  
        tabBarInactiveTintColor: 'gray',  
      })}
    >
      <Tab.Screen name="Home" component={HomeStackScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Tracker" component={TrackerStackScreen} options={{ tabBarLabel: 'Tracker' }} />
      <Tab.Screen name="Library" component={LibraryStackScreen} options={{ tabBarLabel: 'Library' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  console.log(`Your local Wifi address is: ${LOCAL_IP}`);
  return (
    <UserProvider>
      <NavigationContainer>
        <MyTabs />
      </NavigationContainer>
    </UserProvider>
  );
}
