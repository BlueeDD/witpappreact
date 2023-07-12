import React, { useState, useContext, useEffect, useRef } from 'react';
import { View, Text, StatusBar, TouchableOpacity, Animated, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import { AuthContext } from '../navigation';
import Footer from './Footer';


const FeedScreen = () => {
  // set the checkboxes
  const initialCheckboxes = {};
  const initialDisabled = {};
  const {hasPubcrawl, setHasPubcrawl, isLocationEnabled, setIsLocationEnabled, user} = useContext(AuthContext);
  const [checkboxes, setCheckboxes] = useState({});
  const [disabled, setDisabled] = useState({});
  const [currentStop, setCurrentStop] = useState(-1);
  const [pubcrawlID, setPubcrawlID] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);

  const [currentLocation, setCurrentLocation] = useState({ latitude: 0, longitude: 0 });
  const [distance, setDistance] = useState(null);

  const [meetingPoint, setMeetingPoint] = useState(""); // string of meeting point
  const [stops, setStops] = useState([]); // array of stops [ {place_order: 1, place_name: "The first stop"}, ...

  const animatedDots = useRef(new Animated.Value(0)).current;
  const animatedSeparator = useRef(new Animated.Value(0)).current;

  const [timer, setTimer] = useState(0);

  const startTimer = () => {
    setTimer(100000); // Set the timer duration in milliseconds
  };
  
  const formatTimerValue = (timer) => {
    const minutes = Math.floor(timer / 60000); // Convert milliseconds to minutes
    const seconds = Math.floor((timer % 60000) / 1000); // Remaining seconds
  
    if (minutes > 0) {
      return `${minutes} min`;
    } else {
      return `${seconds} sec`;
    }
  };
  

  /**
   * toggle the checkbox status
   * @param {*} checkboxName
   */
  const handleCheckboxToggle = (checkboxName) => {
    startTimer(); // Reset the timer when a checkbox is clicked
    setCheckboxes((prevValue) => {
      const newState = { ...prevValue };
      newState[checkboxName] = !newState[checkboxName];
  
      // Update the currentStop based on the checkboxName
      const checkboxIndex = parseInt(checkboxName.slice(-1));
      if (newState[checkboxName]) {
        setCurrentStop(checkboxIndex);
      } else {
        if (currentStop === checkboxIndex) {
          // Find the new currentStop when unchecking the last checked checkbox
          for (let i = checkboxIndex - 1; i >= 0; i--) {
            if (newState["checkbox" + i]) {
              setCurrentStop(i);
              break;
            }
          }
        }
      }
  
      // Update the disabled property based on the currentStop
      if (currentStop !== -1) {
        for (let i = 0; i < currentStop; i++) {
          setDisabled((prevValue) => {
            const newState = { ...prevValue };
            newState["checkbox" + i] = true;
            return newState;
          }
          );
        }
      }
      return newState;
    });
  };
  

  useEffect(() => {
    getPubcrawlData();
    checkLocation();
  }, []);

  useEffect(() => {
    animateDots();
    animateSeparator();
    startTimer();
  }, [stops]);
  
  useEffect(() => {
    const intervalId = setInterval(getCurrentLocation, 5000); // Update location every 5 seconds  
    return () => {
      clearInterval(intervalId); // Clear the interval when the component unmounts
    };
  }, []);

  useEffect(() => {
    setNextStop();
  }, [currentLocation]);  

  useEffect(() => {
    if (timer === 0) {
      // Timer is up, check the first unchecked checkbox
      const firstUncheckedCheckbox = Object.entries(checkboxes).find(([key, value]) => !value);
      if (firstUncheckedCheckbox) {
        setCheckboxes((prevValue) => {
          const newState = { ...prevValue };
          newState[firstUncheckedCheckbox[0]] = true;
          return newState;
        });
        startTimer(); // Start the timer again if there are still unchecked checkboxes
      }
    } else {
      // Timer is still running, decrease the timer value every second
      const intervalId = setInterval(() => {
        setTimer((prevValue) => prevValue - 1000);
      }
      , 1000);
      return () => clearInterval(intervalId); // This is important to clear the interval when the component unmounts
    }
  }, [timer, checkboxes]);

  const checkLocationPermission = async () => {
    try {
      // Check foreground location permission
      const foregroundPermission = await Location.requestForegroundPermissionsAsync();
      if (foregroundPermission.status === 'granted') {
        try {
            // Check background location permission
          const backgroundPermission = await Location.requestBackgroundPermissionsAsync();
          if (backgroundPermission.status === 'granted') {
            if (!isLocationEnabled) {
              setIsLocationEnabled(true);
            }
          } else {
            console.log('Background location permission is denied');
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


  const getCurrentLocation = async () => {
    try {
      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude, longitude } = coords;
      //coordinates should be rounded to 2 decimals
      setCurrentLocation({ latitude, longitude });
    } catch (error) {
      console.warn(error);
    }
  };

  //check location with a timer of 5 seconds
  const checkLocation = () => {
    if (isLocationEnabled) {
    setTimeout(() => {
      checkLocationPermission();
      checkLocation(); // Call checkLocation recursively
    }, 5000);
    }
  };

  const setNextStop = async () => {
    // TODO : replace with // 'https://whereisthepubcrawl.com/API/setNextStop.php' 
    const response = await fetch('http://192.168.1.21/witp/API/setNextStop.php', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "pubcrawl_id": pubcrawlID,
        "last_visited_place": currentStop,
        "latitude": currentLocation.latitude,
        "longitude": currentLocation.longitude
      }),
    });
    const dataRes = await response.json();
    if (dataRes.code == 0) {
      console.log("Successfully updated the next stop");
      setCurrentStop(dataRes.data.next_stop.place_order);
      setDistance(Math.round(dataRes.data.distance));
      setCheckboxes((prevValue) => {
        const newState = { ...prevValue };
        newState["checkbox" + dataRes.last_visited_place] = true;
        return newState;
      });
      setDisabled((prevValue) => {
        const newState = { ...prevValue };
        newState["checkbox" + dataRes.last_visited_place] = true;
        return newState;
      });      
    } else  if (dataRes.code == 2) {
      //console.log("The next stop is not close enough");
      //console.log("distance: " + dataRes.data.distance + " m")
      setDistance(Math.round(dataRes.data.distance));
    } else {
      console.log("Error updating the next stop");
    }
  };

  const animateDots = () => {
    animatedDots.setValue(0); // Reset animation value

    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedDots, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(animatedDots, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    ).start();
  };

  const animateSeparator = () => {
    animatedSeparator.setValue(0); // Reset animation value

      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedSeparator, {
            toValue: 1,
            duration: 1500, // Duration for each state (0 and 1)
            useNativeDriver: false,
          }),
          Animated.timing(animatedSeparator, {
            toValue: 0,
            duration: 1500, // Duration for each state (0 and 1)
            useNativeDriver: false,
          }),
        ])
      ).start();
  };
  

  const getPubcrawlData = async () => {
    //console.log("agent id : " + user.agentCityId);

    // TODO : replace with // 'https://whereisthepubcrawl.com/API/getStopsTodayByCityId.php' 
    const response = await fetch('http://192.168.1.21/witp/API/getStopsTodayByCityId.php', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // pass the email and password from the form to the API
        city_id: 1, // we use user's city ID
      }),
    });
    const dataRes = await response.json();
    if (dataRes.code === 0 || dataRes.code === 6) {
      // if no error (user found)
      if (dataRes.code === 6) {
        setIsDisabled(true);
      } else {
        setIsDisabled(false);
      }
      if (dataRes.data.pubcrawl.last_visited_place < 0) {
        initialCheckboxes["checkbox0"] = false;
      } else {
        initialCheckboxes["checkbox0"] = true;
      }
      dataRes.data.stops.forEach((item) => {
        if (item.place_order <= dataRes.data.pubcrawl.last_visited_place) {
          initialCheckboxes["checkbox" + item.place_order] = true; // Set initial state to true for the first checkbox (using place order)
          initialDisabled["checkbox" + (item.place_order - 1)] = true;
        } else {
        initialCheckboxes["checkbox" + item.place_order] = false; // Set initial state to false for each checkbox (using place order)
        initialDisabled["checkbox" + (item.place_order -1)] = false;
      }});
      initialDisabled["checkbox" + (dataRes.data.stops.length)] = false;
      setCheckboxes(initialCheckboxes);
      setDisabled(initialDisabled);
      console.log("initialCheckboxes : " + JSON.stringify(initialCheckboxes));
      console.log("initialDisabled : " + JSON.stringify(initialDisabled));
      setMeetingPoint(dataRes.data.pubcrawl.meeting_point);
      setStops(dataRes.data.stops);
      setCurrentStop(dataRes.data.pubcrawl.last_visited_place);
      setPubcrawlID(dataRes.data.pubcrawl.id);
      setHasPubcrawl(true);
    } else if (dataRes.code == 2) {
      setHasPubcrawl(false);
    } else {
        alert("We encountered a problem to get the pubcrawl data. Please try again later.");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        {currentLocation && (
          <Text>
              Next Stop is {distance} meters away
          </Text>
        )}
          <ScrollView contentContainerStyle={styles.row}>
            <View style={styles.column}>
              <TouchableOpacity
                style={[styles.checkbox, checkboxes["checkbox0"] && styles.checkboxChecked]}
                onPress={() => handleCheckboxToggle("checkbox0")}
                disabled={isDisabled ? isDisabled : disabled["checkbox0"]}
                >
                {!checkboxes["checkbox0"] && timer > 0 && (
                  <Text style={styles.checkboxTimer}>
                  {/* {formatTimerValue(timer)} */}
                  </Text>
                )}
              </TouchableOpacity>
              {stops.map((stop) => (
                <View key={stop.place_order} style={{ alignItems: "center" }}>
                  {checkboxes["checkbox" + (stop.place_order - 1)] &&
                  !checkboxes["checkbox" + stop.place_order] ? (
                    <Animated.Text
                      style={[
                        styles.separator,
                        {
                          opacity: animatedSeparator,
                        },
                      ]}
                    />
                  ) : (
                    <Text style={[styles.separator, !checkboxes["checkbox" + (stop.place_order - 1)] && styles.hiddenSeparator]} />
                  )}
                  <TouchableOpacity
                    style={[styles.checkbox, checkboxes["checkbox" + stop.place_order] && styles.checkboxChecked]}
                    onPress={() => handleCheckboxToggle("checkbox" + stop.place_order)}
                    disabled={isDisabled ? isDisabled : disabled["checkbox" + (stop.place_order - 1)]}
                    >
                    {!checkboxes["checkbox" + stop.place_order] && checkboxes["checkbox" + (stop.place_order -1)] && timer > 0 && (
                      <Text style={styles.checkboxTimer}>
                    {/* {formatTimerValue(timer)} */}
                    </Text>
                    )}
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <View style={[styles.column, { marginLeft: -50 }]}>
              <Text style={styles.title}>{meetingPoint}</Text>
              {stops.map((stop) => (
                <View key={stop.place_order}>
                  {checkboxes["checkbox" + (stop.place_order - 1)] &&
                  !checkboxes["checkbox" + stop.place_order] ? (
                    <Animated.Text
                      style={[
                        styles.text,
                        {
                          opacity: animatedDots,
                        },
                      ]}
                    >
                      walking to the next stop...
                    </Animated.Text>
                  ) : (
                    <Text style={styles.hiddenText}>hidden</Text>
                  )}
                  <Text style={styles.title}>{stop.place_name}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        <Footer />
      </View>
    </View>
  );
};

const styles = {
  title: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center",
    marginVertical: 12,
  },
  text: {
    fontSize: 13,
    color: "grey",
    textAlign: "center",
    textAlignVertical: "center",
    marginVertical: 23,
  },
  hiddenText: {
    fontSize: 13,
    color: "white",
    textAlign: "center",
    textAlignVertical: "center",
    marginVertical: 23,
  },
  container: {
    flexDirection: "column",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  row: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 70,
    marginTop: 20,
  },
  column: {
    flexDirection: "column",
    alignItems: "center",
    width: "50%",
    justifyContent: "center",
    marginLeft: -180,
  },
  separator: {
    width: 8,
    height: 75,
    backgroundColor: "green",
    borderColor: "darkgreen",
    borderWidth: 2,
  },
  hiddenSeparator: {
    opacity: 0,
  },
  checkbox: {
    height: 50,
    width: 50,
    borderWidth: 4,
    borderColor: "darkgreen",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "green",
    borderColor: "darkgreen",
  },
  checkboxTimer: {
    fontSize: 12,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center",
  },  
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 70,
  },
};

export default FeedScreen;
