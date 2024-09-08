import React, { useRef, useEffect, useContext } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Linking, Button } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import UserContext from '../context/UserContext';

const ExerciseDetailsScreen = ({ route }) => {
  const { exercise } = route.params;
  const { theme } = useContext(UserContext);
  const scrollViewRef = useRef(null);

  useFocusEffect(
    React.useCallback(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      }
    }, [])
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
      ref={scrollViewRef}
      accessible={true}
      accessibilityLabel="Exercise details screen"
    >
      <Image
        source={{ uri: exercise.gifUrl }}
        style={styles.image}
        accessibilityLabel={`${exercise.name} demonstration`}
        accessible={true}
      />

      <Text
        style={[styles.title, { color: theme.textColor }]}
        accessible={true}
        accessibilityRole="header"
        allowFontScaling={true}
      >
        {exercise.name}
      </Text>

      <View style={[styles.subtitleBox, { backgroundColor: theme.quoteContainerBackground }]}>
        <Text style={[styles.subtitle, { color: theme.textColor }]} allowFontScaling={true}>
          Target: {exercise.target}
        </Text>
        <Text style={[styles.subtitle, { color: theme.textColor }]} allowFontScaling={true}>
          Body Part: {exercise.bodyPart}
        </Text>
        <Text style={[styles.subtitle, { color: theme.textColor }]} allowFontScaling={true}>
          Equipment: {exercise.equipment}
        </Text>
      </View>

      <Text
        style={[styles.instructionsTitle, { color: theme.textColor }]}
        accessible={true}
        accessibilityRole="header"
        allowFontScaling={true}
      >
        Instructions:
      </Text>

      <View style={[styles.instructionsBox, { backgroundColor: theme.quoteContainerBackground }]}>
        {exercise.instructions.map((instruction, index) => (
          <Text
            key={index}
            style={[styles.instruction, { color: theme.textColor }]}
            accessible={true}
            accessibilityLabel={`Step ${index + 1}: ${instruction}`}
            allowFontScaling={true}
          >
            {index + 1}. {instruction}
          </Text>
        ))}
      </View>

      {exercise.video_url && (
        <Button
          title="Watch Video"
          onPress={() => Linking.openURL(exercise.video_url)}
          color={theme.buttonColor}
          accessibilityLabel="Watch exercise video"
          accessibilityRole="button"
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  image: {
    width: '100%',
    height: 400,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitleBox: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  instructionsBox: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  instruction: {
    fontSize: 16,
    marginBottom: 12,
  },
});

export default ExerciseDetailsScreen;
