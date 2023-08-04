import React, { useEffect, useContext, useState } from 'react';
import { View, StyleSheet, Text, StatusBar, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Footer from './Footer';
import * as Location from 'expo-location';
import { AuthContext } from '../navigation';
import { useNavigation } from '@react-navigation/native';


const DefaultScreen = () => {

  const { isLocationEnabled, setIsLocationEnabled, hasPubcrawl, setHasPubcrawl, cityName, setCityName, isVisible, setIsVisible, user } = useContext(AuthContext);
  const [loop, setLoop] = useState(false);
  const navigation = useNavigation();

  // Show the text after 500ms (avoid seeing it if you don't stay on the screen for long)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    // Cleanup the timer when the component unmounts or the state changes
    return () => clearTimeout(timer);
  }, []);

  // check location permission
  const checkLocationPermission = async () => {
    try {
      // Check foreground location permission
      const foregroundPermission = await Location.requestForegroundPermissionsAsync();
      if (foregroundPermission.status === 'granted') {
        try {
          // Check background location permission
          const backgroundPermission = await Location.requestBackgroundPermissionsAsync();
          if (backgroundPermission.status === 'granted') {
            console.log('Background location permission is granted');
            if (!isLocationEnabled) {
              setIsLocationEnabled(true);
            }
          } else {
            if (isLocationEnabled) {
              setIsLocationEnabled(false);
            }
          }

        } catch (error) {
          console.log('Error checking location permission:', error);
        }
      } else {
        console.log('Foreground location permission is denied');
        if (isLocationEnabled) {
          setIsLocationEnabled(false);
        }
      }
    } catch (error) {
      console.log('Error checking location permission:', error);
    }
  };

  //check location with a timer of 5 seconds
  const checkLocation = () => {
    if (!isLocationEnabled || !hasPubcrawl) {
      setTimeout(() => {
        checkLocationPermission();
        setLoop(!loop); // Call checkLocation recursively
      }, 5000);
    }
  };

  const handleCreatePubCrawlPress = () => {
    navigation.navigate('CreatePubCrawl');
  };


  //check pubcrawl and location
  useEffect(() => {
    getPubcrawlData();
    checkLocation();
  }, [loop]);

  //get pubcrawl data
  const getPubcrawlData = async () => {
    try {
      const response = await fetch('https://whereisthepubcrawl.com/API/getStopsTodayByCityId.php', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          city_id: 1,
        }),
      });
      const dataRes = await response.json();
      console.log(dataRes);
      setCityName(dataRes.data.city_name);
      if (dataRes.code === 0) {
        setHasPubcrawl(true);
      }
    } catch (error) {
      console.log('Error fetching data from API', error);
    }
  };


  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {!isLocationEnabled && (
        <View style={styles.banner}>
          <MaterialCommunityIcons name="crosshairs-gps" size={20} color={"white"} marginRight={10} />
          <Text style={{ color: 'white' }}>
            The access to your location should be "Always" to use the app
          </Text>
        </View>
      )}
      <View style={styles.textContainer}>
      {!hasPubcrawl && isVisible && (
          <View style={styles.innerContainer}>
            <Text style={styles.text}>There is no Pubcrawl planned today in {cityName}</Text>
          </View> 
      )}
      {!hasPubcrawl && isVisible && (user.role!=='Agent') && (
        <View>
          <Text
            underlineColor="#f48024"
            style={[styles.registerText, {marginTop:20}]}>You want to create one?
          </Text>
          <TouchableOpacity
              onPress={handleCreatePubCrawlPress} >
              <Text style={[styles.registerText, styles.underlined, {marginTop: 2}]}>
                Do it here
              </Text>
          </TouchableOpacity>
        </View>
        )}
        <Footer />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Set flex to 1 to take up all available space
    backgroundColor: 'white',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    backgroundColor: '#f48024',
    opacity: 0.9,
    borderColor: 'black',
    borderRadius: 20,
    padding: 10,
  },
  text: {
    color: 'black',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  banner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    padding: 8,
    paddingLeft: 20,
    paddingRight: 20,
  },
  underlined: {
    textDecorationLine: 'underline',
    color: '#f48024',
  },
  registerText: {
    color: "#f48024",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
    marginTop: 0,
  },
});

export default DefaultScreen;
