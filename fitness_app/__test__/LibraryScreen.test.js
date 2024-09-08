import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import LibraryScreen from '../screens/LibraryScreen';
import UserContext from '../context/UserContext';

jest.spyOn(global, 'fetch'); 

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

describe('LibraryScreen API Failure Handling', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle API request failure and remove the loading indicator', async () => {
    //simulate api failure 
    fetch.mockRejectedValueOnce(new Error('Failed to fetch exercises'));

    const { getByTestId, getByText } = render(
      <UserContext.Provider value={{ theme: mockTheme }}>
        <LibraryScreen navigation={{ navigate: jest.fn() }} />
      </UserContext.Provider>
    );

    expect(getByTestId('loading-indicator')).toBeTruthy();

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    await waitFor(() => expect(() => getByTestId('loading-indicator')).toThrow());

    expect(getByText('No results found')).toBeTruthy();
  });
});
