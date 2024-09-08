import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Button,
} from 'react-native';
import UserContext from '../context/UserContext'; 

const LibraryScreen = ({ navigation }) => {
  const { theme } = useContext(UserContext); 

  const [exercises, setExercises] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [loading, setLoading] = useState(true);

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
        setFilteredExercises(data);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      } finally {
        setLoading(false);
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
      setFilteredExercises(exercises);
    }
  };

  const clearSearch = () => {
    setSearchText('');
    setFilteredExercises(exercises);
    Keyboard.dismiss();
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.backgroundColor }]}>
        <ActivityIndicator testID="loading-indicator" size="large" color="#0000ff" />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.item, { backgroundColor: theme.quoteContainerBackground }]}
      onPress={() => navigation.navigate('Exercise Details', { exercise: item })}
    >
      <Text style={[styles.title, { color: theme.textColor }]}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.header}>
          <TextInput
            style={[
              styles.searchInput,
              {
                backgroundColor: theme.quoteContainerBackground,
                color: theme.textColor,
                borderColor: '#ccc',
              },
            ]}
            placeholder="Search exercises..."
            placeholderTextColor={theme.quoteTextColor} 
            value={searchText}
            onChangeText={handleSearch}
          />
          {searchText ? (
            <Button title="X" onPress={clearSearch} color={theme.buttonColor} />
          ) : null}
        </View>
      </TouchableWithoutFeedback>
      <FlatList
        data={filteredExercises}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => (
          <Text style={[styles.noResults, { color: theme.textColor }]}>No results found</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  item: {
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
  },
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LibraryScreen;
