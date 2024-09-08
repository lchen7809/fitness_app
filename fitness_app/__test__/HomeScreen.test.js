import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../screens/HomeScreen';
import UserContext from '../context/UserContext'; 

//mock navigation object
const mockNavigation = {
  navigate: jest.fn(),
};

//mock theme object
const mockTheme = {
  backgroundColor: '#fff',
  textColor: '#000',
  buttonColor: '#FC2247',
  buttonTextColor: '#fff',
  calendarBackground: '#fff',
  quoteContainerBackground: '#f0f0f0',
  quoteTextColor: '#333',
  calendarTheme: {
    selectedDayBackgroundColor: '#00adf5',
    todayTextColor: '#00adf5',
    dayTextColor: '#2d4150',
    arrowColor: 'orange',
    monthTextColor: 'black',
  },
};

describe('HomeScreen', () => {
  it('navigates to LogWorkout screen when "Log Workout" button is pressed', () => {
    const { getByText } = render(
      <UserContext.Provider value={{ theme: mockTheme }}>
        <HomeScreen navigation={mockNavigation} />
      </UserContext.Provider>
    );

    const logWorkoutButton = getByText('Log Workout');
    fireEvent.press(logWorkoutButton);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('LogWorkout');
  });
});
