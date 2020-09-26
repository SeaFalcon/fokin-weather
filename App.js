import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';

import Loading from './Loading';
import Weather from './Weather';

const API_KEY = 'bd20651f0d8fc6b40e13d67c3cb92f3b';

export default function App() {
  const [state, setState] = useState({
    isLoading: true,
    temp: null,
    condition: null,
  });

  const { isLoading, temp, condition } = state;

  const getWeather = async (latitude, longitude) => {
    const {
      data: {
        main: { temp },
        weather
      }
    } = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${API_KEY}&units=metric`
    );

    setState({
      isLoading: false,
      temp,
      condition: weather[0].main,
    });
  }

  useEffect(() => {
    async function getLocation() {
      try {
        await Location.requestPermissionsAsync();

        const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync();

        getWeather(latitude, longitude);
      } catch (error) {
        Alert.alert("Can't find you.", "So sad");
      }
    };

    getLocation();
  }, []);

  if (!isLoading) return <Weather temp={Math.round(temp)} condition={condition} />
  return <Loading />;
}