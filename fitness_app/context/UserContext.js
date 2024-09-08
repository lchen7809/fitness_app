// context/UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from '../utilis/theme';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    username: 'user1',
    email: 'user1@example.com',
    preferences: {
      theme: 'light',
    },
  });
  const [theme, setTheme] = useState(lightTheme);

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        updateUserPreferences({ theme: savedTheme });
      }
    };
    loadTheme();
  }, []);

  const updateUserPreferences = async (preferences) => {
    const newUser = { ...user, preferences };
    setUser(newUser);
    await AsyncStorage.setItem('theme', preferences.theme);
    setTheme(preferences.theme === 'light' ? lightTheme : darkTheme);
  };

  return (
    <UserContext.Provider value={{ user, theme, updateUserPreferences }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
