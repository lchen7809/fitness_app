import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserContext from '../context/UserContext';

const ProfileScreen = () => {
  const { user, updateUserPreferences } = useContext(UserContext);
  const [profileImage, setProfileImage] = useState(null);
  const isDarkMode = user.preferences.theme === 'dark';

  useEffect(() => {
 
    const loadProfileImage = async () => {
      try {
        const savedImage = await AsyncStorage.getItem('profileImage');
        if (savedImage) {
          setProfileImage(savedImage);
        }
      } catch (error) {
        console.log('Error loading profile image from storage', error);
      }
    };

    loadProfileImage();
  }, []);

  const toggleTheme = () => {
    const newTheme = user.preferences.theme === 'light' ? 'dark' : 'light';
    updateUserPreferences({ theme: newTheme });
  };

  const pickImage = async () => {

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Denied", "You need to grant permission to access the media library.");
      return;
    }


    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], 
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      setProfileImage(uri);
      saveProfileImage(uri); 
    }
  };

  const saveProfileImage = async (uri) => {
    try {
      await AsyncStorage.setItem('profileImage', uri);
      console.log('Profile image saved');
    } catch (error) {
      console.log('Error saving profile image to storage', error);
    }
  };

  const styles = getStyles(isDarkMode);

  return (
    <View style={styles.container}>
      <Image
        source={profileImage ? { uri: profileImage } : require('../assets/default-profile.png')} 
        style={styles.profileImage}
      />

      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Text style={styles.uploadButtonText}>Upload Profile Picture</Text>
      </TouchableOpacity>

      <Text style={styles.username}>{user.username}</Text>
      <Text style={styles.email}>{user.email}</Text>

      <Text style={styles.themeText}>Current Theme: {user.preferences.theme}</Text>

      <TouchableOpacity style={styles.toggleButton} onPress={toggleTheme}>
        <Text style={styles.toggleButtonText}>Toggle Theme</Text>
      </TouchableOpacity>
    </View>
  );
};

const getStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
      padding: 20,
    },
    profileImage: {
      width: 150,
      height: 150,
      borderRadius: 75,
      marginBottom: 20,
      backgroundColor: '#e0e0e0',
    },
    username: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDarkMode ? '#ffffff' : '#000000',
      marginBottom: 5,
    },
    email: {
      fontSize: 16,
      color: isDarkMode ? '#bbbbbb' : 'gray',
      marginBottom: 20,
    },
    themeText: {
      fontSize: 18,
      color: isDarkMode ? '#ffffff' : '#000000',
      marginBottom: 20,
    },
    toggleButton: {
      backgroundColor: isDarkMode ? '#fff' : '#000',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    toggleButtonText: {
      color: isDarkMode ? '#000000' : '#ffffff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    uploadButton: {
      backgroundColor: isDarkMode ? '#e1e1e1' : '#868686',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      marginBottom: 20,
    },
    uploadButtonText: {
      color: isDarkMode ? '#000000' : '#ffffff',
      fontSize: 16,
      fontWeight: 'light',
    },
  });

export default ProfileScreen;
