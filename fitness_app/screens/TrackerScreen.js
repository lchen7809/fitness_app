import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { addDays, subDays, format, isBefore, isAfter } from 'date-fns';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { LOCAL_IP } from '../backend/ipLocal.js';
import UserContext from '../context/UserContext';

const screenWidth = Dimensions.get('window').width;

const TrackerScreen = () => {
  const navigation = useNavigation();
  const { theme } = useContext(UserContext);

  const [chartData, setChartData] = useState({
    labels: ['No data'],
    datasets: [{ data: [0] }],
  });

  const [startDate, setStartDate] = useState(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState(new Date());
  const [firstDate, setFirstDate] = useState(null);
  const [lastDate, setLastDate] = useState(null);

  const fetchData = useCallback(async (start, end) => {
    try {
      const response = await fetch(
        `http://${LOCAL_IP}:4000/average-weight?startDate=${start.toISOString()}&endDate=${end.toISOString()}`
      );
      const data = await response.json();

      const sanitizedData = data.map(item => ({
        ...item,
        averageWeight: isFinite(item.averageWeight) && item.averageWeight !== null ? item.averageWeight : 0,
      }));

      if (sanitizedData.length === 0) {
        setChartData({
          labels: ['No data'],
          datasets: [{ data: [0] }],
        });
        return;
      }

   
      const labels = sanitizedData.map(item => format(new Date(item._id), 'MM-dd'));
      const weights = sanitizedData.map(item => {
        const weight = item.averageWeight;
        return isFinite(weight) && !isNaN(weight) ? weight : 0;  
      });

      console.log("Sanitized chart data:", { labels, weights });  

      setChartData({
        labels,
        datasets: [{ data: weights }],
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData(startDate, endDate);  
    }, [startDate, endDate, fetchData])
  );


  useEffect(() => {
    const fetchDateRange = async () => {
      try {
        const response = await fetch(`http://${LOCAL_IP}:4000/workout-date-range`);
        const { firstDate, lastDate } = await response.json();

        setFirstDate(new Date(firstDate));
        setLastDate(new Date(lastDate));

        setStartDate(subDays(new Date(lastDate), 7));
        setEndDate(new Date(lastDate));
      } catch (error) {
        console.error('Error fetching date range:', error);
      }
    };

    fetchDateRange();
  }, []);

  const goToPreviousWeek = () => {
    const newStartDate = subDays(startDate, 7);
    const newEndDate = subDays(endDate, 7);

    if (isBefore(newStartDate, firstDate)) {
      return;
    }

    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  const goToNextWeek = () => {
    const newStartDate = addDays(startDate, 7);
    const newEndDate = addDays(endDate, 7);

    if (isAfter(newEndDate, lastDate)) {
      return;
    }

    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <Text style={[styles.title, { color: theme.textColor }]}>Average Weight Lifted Over the Selected Week</Text>
      <LineChart
        data={chartData}
        width={screenWidth}
        height={220}
        yAxisLabel=""
        yAxisSuffix="kg"
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 0, 
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#ffa726',
          },
        }}
        bezier={true}  
        style={{
          marginVertical: 10,
          borderRadius: 15,  
        }}
      />
      <View style={styles.trackerButtonContainer}>
        <TouchableOpacity
          style={[
            styles.trackerButton,
            {
              backgroundColor: theme.mode === 'dark' ? '#505050' : '#fff',
            },
          ]}
          onPress={goToPreviousWeek}
          disabled={!firstDate || isBefore(startDate, firstDate)}
        >
          <Text
            style={[
              styles.trackerButtonText,
              { color: theme.mode === 'dark' ? '#fff' : '#000' },
            ]}
          >
            Previous Week
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.trackerButton,
            {
              backgroundColor: theme.mode === 'dark' ? '#505050' : '#fff',
            },
          ]}
          onPress={goToNextWeek}
          disabled={!lastDate || isAfter(endDate, lastDate)}
        >
          <Text
            style={[
              styles.trackerButtonText,
              { color: theme.mode === 'dark' ? '#fff' : '#000' },
            ]}
          >
            Next Week
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.dateRange, { color: theme.textColor }]}>
        {format(startDate, 'yyyy-MM-dd')} to {format(endDate, 'yyyy-MM-dd')}
      </Text>
      <TouchableOpacity
        style={[
          styles.viewWorkoutsButton,
          { backgroundColor: theme.mode === 'dark' ? '#505050' : '#fff' },
        ]}
        onPress={() => navigation.navigate('WorkoutList')}
      >
        <Text
          style={[
            styles.viewWorkoutsButtonText,
            { color: theme.mode === 'dark' ? '#fff' : '#000' },
          ]}
        >
          View All Workouts
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  trackerButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginVertical: 16,
  },
  trackerButton: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  trackerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateRange: {
    fontSize: 16,
    marginTop: 10,
  },
  viewWorkoutsButton: {
    marginTop: 20,
    padding: 12,
    width: '80%',
    borderRadius: 8,
    alignItems: 'center',
  },
  viewWorkoutsButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TrackerScreen;
