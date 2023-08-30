import React, { useEffect, useContext, useState } from 'react';
import { View, StyleSheet, Text, StatusBar, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Footer from './Footer';
import * as Location from 'expo-location';
import { AuthContext } from '../navigation';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';


const DefaultScreen = () => {

  const { isLocationEnabled, setIsLocationEnabled, hasPubcrawl, setHasPubcrawl, cityName, setCityName, isVisible, setIsVisible, user, timerDuration, setTimerDuration } = useContext(AuthContext);
  const [loop, setLoop] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({ latitude: 0, longitude: 0 });
  const options = ['1','2', '3', '4', '5', '6'];
  const [selectedDuration, setSelectedDuration] = useState('1');
  const navigation = useNavigation();

  // Show the text after 500ms (avoid seeing it if you don't stay on the screen for long)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    // Cleanup the timer when the component unmounts or the state changes
    return () => clearTimeout(timer);
  }, []);

  //check pubcrawl and location
  useEffect(() => {
    getPubcrawlData();
    checkLocation();
    if (timerDuration > 0) {
      updateUserLocation();
    }
  }, [loop]);

  
  // Additional configuration for DefaultScreen
  useEffect(() => {
    // Function to set the default header options when transitioning from FeedScreen to DefaultScreen
    const setFeedScreenHeaderOptions = () => {
      navigation.setOptions({
        headerLeft: () => null, // Hide the back arrow
      });
    };

      // Disable the gesture to prevent sliding back
      navigation.setOptions({
        gestureEnabled: false,
      });

    // Subscribe to the focus event of DefaultScreen
    const unsubscribeFeedScreen = navigation.addListener('focus', setFeedScreenHeaderOptions);

    // Clean up the subscription when the component unmounts
    return () => unsubscribeFeedScreen();
  }, [navigation]);
  
  // if the time is active, reduce the timer duration by 1 every second like a countdown
  useEffect(() => {
    let timerInterval;

    if (timerDuration > 0) {
      timerInterval = setInterval(() => {
        setTimerDuration((prevDuration) => prevDuration - 1);
      }, 1000);
    }

    return () => clearInterval(timerInterval);
  }, [timerDuration]);

  // change the format of the timer for display purposes
  const formatTime = (durationInSeconds) => {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds % 60;
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

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
    if (!isLocationEnabled) {
      setTimeout(() => {
        checkLocationPermission();
        setLoop(!loop); // Call checkLocation recursively
      }, 5000);
    } else if (isLocationEnabled && !hasPubcrawl){
      setTimeout(() => {
        getCurrentLocation();
        setLoop(!loop); // Call checkLocation recursively
      }, 5000);
    }
  };

  const handleCreatePubCrawlPress = () => {
    navigation.navigate('CreatePubCrawl');
  };

  const handleSelect = (index) => {
    setSelectedDuration(options[index]);
  };

  const getCurrentLocation = async () => {
    try {
      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude, longitude } = coords;
      console.log('Current location:', latitude, longitude);
      setCurrentLocation({ latitude, longitude });
  
    } catch (error) {
      console.warn(error);
    }
  };


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

  const updateUserLocation = async () => {
    try {
      const response = await fetch('https://whereisthepubcrawl.com/API/updateLocationUser.php', {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_user: user.id,
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        }),
      });
      const dataRes = await response.json();
      console.log(dataRes);
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
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View style={styles.textContainer}>
          {!hasPubcrawl && isLocationEnabled && isVisible && (
            timerDuration === 0 ? (
              <View>
                <Text
                    style={[styles.registerText, { marginTop: -80, marginBottom: 10, fontSize:18 }]}>Wishing to share your location?
                </Text>
                <View style={[styles.row, { marginBottom: 10 }]}>
                  <Text style={{ color: '#f48024', fontSize:18, fontWeight: 'bold' }}>Share it for</Text>
                  <ModalDropdown
                    options={options}
                    onSelect={handleSelect}
                    style={styles.dropdown}
                    textStyle={styles.dropdownText}
                    defaultValue={selectedDuration}
                    dropdownStyle={[styles.dropdownContainer]}
                  />
                  <Text style={{ color: '#f48024', fontSize:18, fontWeight: 'bold' }}> hour(s)</Text>
                </View>
                <TouchableOpacity
                    style={[styles.button,{alignItems: 'center', marginBottom: 20}]}
                    onPress={() => setTimerDuration(selectedDuration * 60 * 60)}>
                    <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>
                <View style={styles.innerContainer}>
                  <Text style={styles.text}>There is no Pubcrawl planned today in {cityName}</Text>
                </View>
              </View>
              ) : (
                <View>
                  <View style={{ marginBottom: 50, marginTop: -80, alignItems: 'center' }}>
                    <Text style={{ color: '#f48024', fontSize:15, fontWeight: 'bold' }}>You're sharing your location for {formatTime(timerDuration)}</Text>
                  <TouchableOpacity
                    style={[styles.button,{width: 150, marginTop: 15, marginBottom: 19}]}
                    onPress={() => setTimerDuration(0)}>
                    <Text style={styles.buttonText}>Stop sharing</Text>
                  </TouchableOpacity>
                  </View>
                  <View style={styles.innerContainer}>
                    <Text style={styles.text}>There is no Pubcrawl planned today in {cityName}</Text>
                  </View>
                </View>
              )
          )}
          {!hasPubcrawl && isLocationEnabled && isVisible && (user.role !== 'Agent') && (
            <View>
              <Text
                style={[styles.registerText, { marginTop: 50 }]}>You want to create one?
              </Text>
              <TouchableOpacity
                onPress={handleCreatePubCrawlPress} >
                <Text style={[styles.registerText, styles.underlined, { marginTop: 2 }]}>
                  Do it here
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
      <Footer />
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Set flex to 1 to take up all available space
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
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
  dropdown: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#f48024',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
  },
  dropdownText: {
    color: '#f48024',
    fontSize: 16,
  },
  dropdownContainer: {
    width: 41,
    alignItems: 'center',
  },
  button: {
    width: 100,
    marginLeft: 10,
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 15,
    borderColor: "#f48024",
    shadowRadius: 4,
    alignSelf: "center",
  },
  buttonText: {
    color: "#f48024",
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 8,
    paddingHorizontal: 5,
    fontSize: 20,
  },
});

export default DefaultScreen;
