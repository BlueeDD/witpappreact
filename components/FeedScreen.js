import React, { useState, useContext, useEffect, useRef } from 'react';
import { View, Text, StatusBar, TouchableOpacity, Animated, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import { AuthContext } from '../navigation';
import Footer from './Footer';
import Popup from './PopUp';


const FeedScreen = () => {
  // set the checkboxes
  const initialCheckboxes = {};
  const initialDisabled = {};
  const {hasPubcrawl, setHasPubcrawl, isLocationEnabled, setIsLocationEnabled, user} = useContext(AuthContext);
  const [checkboxes, setCheckboxes] = useState({});
  const [disabled, setDisabled] = useState({});
  const [currentStop, setCurrentStop] = useState(-2);
  const [pubcrawlID, setPubcrawlID] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isStopFinished, setIsStopFinished] = useState(false);
  const manual = useRef(false);
  const checked = useRef(false);

  const [popupState, setPopupState] = useState({
    popup1Open: false,
    popup2Open: false,
    popup3Open: false,
    popup4Open: false,
  });

  const [countIn, setCountIn] = useState(0);
  const [countOut, setCountOut] = useState(0);

  const [currentLocation, setCurrentLocation] = useState({ latitude: 0, longitude: 0 });
  const [distance, setDistance] = useState(null);

  const [meetingPoint, setMeetingPoint] = useState(""); // string of meeting point
  const [stops, setStops] = useState([]); // array of stops [ {place_order: 1, place_name: "The first stop"}, ...

  const animatedDots = useRef(new Animated.Value(0)).current;
  const animatedSeparator = useRef(new Animated.Value(0)).current;

  const [timer, setTimer] = useState(0);

  //-----------------------------------TIMER-----------------------------------

  const startTimer = () => {
    setTimer(1000000); // Set the timer duration in milliseconds
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
  
  //-----------------------------------CHECKBOXES-----------------------------------

  /**
   * toggle the checkbox status
   * @param {*} checkboxName
   */
  const handleCheckboxToggle = (checkboxName) => {
    startTimer(); // Reset the timer when a checkbox is clicked
    manual.current = true;
    setCheckboxes((prevValue) => {
      const newState = { ...prevValue };
      const checkboxIndex = parseInt(checkboxName.slice(-1));
      if (newState[checkboxName]) {
        setCountOut(0);
      } else {
        setCountIn(0);
      }
      setIsStopFinished(false);
      const disabledState = {};
      newState[checkboxName] = !newState[checkboxName];
      checked.current = newState[checkboxName];
      // if we checked the checkbox we need to disable the previous one and enable the next one
      if (newState[checkboxName]) {
        setCurrentStop(checkboxIndex);
        for (let i = 0; i < checkboxIndex; i++) {
          newState["checkbox" + i] = true;
        }
        for (let i = 0; i < stops.length + 1; i++) {
          if (i === checkboxIndex) {
            disabledState["checkbox" + i] = false;
          } else {
            disabledState["checkbox" + i] = i === (checkboxIndex + 1) ? false : true; 
          }
        }
        // if we unchecked the checkbox we need to enable the previous one and disable the next one
      } else {
        setCurrentStop(checkboxIndex - 1);
        for (let i = checkboxIndex + 1; i <= stops.length; i++) {
          newState["checkbox" + i] = false;
        }
        for (let i = 0; i < stops.length + 1; i++) {
          if (i === checkboxIndex) {
            disabledState["checkbox" + i] = false;
          } else {
            disabledState["checkbox" + i] = i === (checkboxIndex - 1) ? false : true; 
          }
        }
      }
      setNextStop();
  
      
      setDisabled(disabledState);
      manual.current = false;
      return newState;
    });
  };

  //----------------------------------------POPUP---------------------------------------------------------
  
  const handleOpenPopup = (popupNumber) => {
    setPopupState((prevState) => ({
      ...prevState,
      [`popup${popupNumber}Open`]: true,
    }));
  };

  const handleClosePopup = (popupNumber) => {
    setPopupState((prevState) => ({
      ...prevState,
      [`popup${popupNumber}Open`]: false,
    }));
  };
  const handleButtonOneClick = () => {
    if (!popupState.popup4Open) {
      handleCheckboxToggle("checkbox" + (currentStop + 1));
    } else {
      setCountOut(0);
      setIsStopFinished(true);
    }
  };

  const handleButtonTwoClick = () => {
    // Handle button two click action
    if (popupState.popup4Open) {
      setCountOut(0);
    }
  };

  //----------------------------------------USE EFFECTS---------------------------------------------------------

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

  // useEffect(() => {
  //   setNextStop();
  //   console.log("------------");
  //   console.log("countOut: " + countOut);
  //   console.log("countIn: " + countIn);
  // }, [currentLocation]);  

  useEffect(() => {
    if (countIn === 1) {
      handleClosePopup(4);
      handleOpenPopup(1);
    } else if (countIn === 4) {
      handleClosePopup(1);
      handleOpenPopup(2);
    } else if (countIn === 8) {
      handleClosePopup(2);
      handleOpenPopup(3);
      handleCheckboxToggle("checkbox" + (currentStop + 1));
      setIsStopFinished(true);
      setCountOut(0);
    } else if (countOut === 3) {
      handleClosePopup(3);
      handleOpenPopup(4);
    }
  }, [countOut,countIn]);

  /*
  The next useEffect is to use if the agent wants to update the stops using a timer and not location
  */

  // useEffect(() => {
  //   if (timer === 0) {
  //     // Timer is up, check the first unchecked checkbox
  //     const firstUncheckedCheckbox = Object.entries(checkboxes).find(([key, value]) => !value);
  //     if (firstUncheckedCheckbox) {
  //       setCheckboxes((prevValue) => {
  //         const newState = { ...prevValue };
  //         newState[firstUncheckedCheckbox[0]] = true;
  //         return newState;
  //       });
  //       startTimer(); // Start the timer again if there are still unchecked checkboxes
  //     }
  //   } else {
  //     // Timer is still running, decrease the timer value every second
  //     const intervalId = setInterval(() => {
  //       setTimer((prevValue) => prevValue - 1000);
  //     }
  //     , 1000);
  //     return () => clearInterval(intervalId); // This is important to clear the interval when the component unmounts
  //   }
  // }, [timer, checkboxes]);

  //----------------------------------------LOCATION---------------------------------------------------------

  // const checkLocationPermission = async () => {
  //   try {
  //     // Check foreground location permission
  //     const foregroundPermission = await Location.requestForegroundPermissionsAsync();
  //     if (foregroundPermission.status === 'granted') {
  //       try {
  //           // Check background location permission
  //         const backgroundPermission = await Location.requestBackgroundPermissionsAsync();
  //         if (backgroundPermission.status === 'granted') {
  //           if (!isLocationEnabled) {
  //             setIsLocationEnabled(true);
  //           }
  //         } else {
  //           console.log('Background location permission is denied');
  //           if (isLocationEnabled) {
  //             setIsLocationEnabled(false);
  //           }
  //         }

  //       } catch (error) {
  //         console.log('Error checking location permission:', error);
  //       }
  //     } else {
  //       console.log('Foreground location permission is denied');
  //       if (isLocationEnabled) {
  //         setIsLocationEnabled(false);
  //       }
  //     }
  //   } catch (error) {
  //     console.log('Error checking location permission:', error);
  //   }
  // };


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
      // checkLocationPermission();
      checkLocation(); // Call checkLocation recursively
    }, 5000);
    }
  };

  //----------------------------------------API CALLS---------------------------------------------------------

  
  const getPubcrawlData = async () => {
    // TODO : replace with // 'https://whereisthepubcrawl.com/API/getStopsTodayByCityId.php' 
    const response = await fetch('http://192.168.0.36/witp/API/getStopsTodayByCityId.php', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // pass city and user ids to the API
        city_id: user.agentCityId, // we use user's city ID
        user_id: user.id // we use user's ID
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
        if (item.place_order < dataRes.data.pubcrawl.last_visited_place) {
          initialCheckboxes["checkbox" + item.place_order] = true; // Set initial state to true for the first checkbox (using place order)
          initialDisabled["checkbox" + (item.place_order - 1)] = true;
        } else if (item.place_order == dataRes.data.pubcrawl.last_visited_place) {
          initialCheckboxes["checkbox" + item.place_order] = true; // Set initial state to true for the current checkbox (using place order)
          initialDisabled["checkbox" + (item.place_order -1)] = false;
          initialDisabled["checkbox" + (item.place_order)] = false;
        } else {
        initialCheckboxes["checkbox" + item.place_order] = false; // Set initial state to false for each checkbox (using place order)
        initialDisabled["checkbox" + (item.place_order)] = true;
      }});
      setCheckboxes(initialCheckboxes);
      setDisabled(initialDisabled);
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

  const setNextStop = async () => {
    // TODO : replace with // 'https://whereisthepubcrawl.com/API/setNextStop.php' 
    const response = await fetch('http://192.168.0.36/witp/API/setNextStop.php', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pubcrawl_id: pubcrawlID,
        last_visited_place: currentStop,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        is_stop_finished: isStopFinished,
        manual: manual.current,
        checked : checked.current,
      }),
    });
    const dataRes = await response.json();
    console.log(dataRes);
    // if we're close enough to the next stop
    if (dataRes.code == 0) {
      if (!isStopFinished) {
      console.log("Successfully updated the next stop");
      setCurrentStop(dataRes.data.next_stop.place_order);
      }
      setDistance(Math.round(dataRes.data.distance));
      // if we finished the previous stop we reset the countOut,
      // set this stop as the current stop and update the checkboxes display
      if (isStopFinished) {
        // if we're at the next stop we count each time we're at the next stop to manage the popup alerts
        setCountIn(countIn + 1);
        // if the previous stop is finished we reset the countOut
        setCountOut(0);
        setCheckboxes((prevValue) => {
          const newState = { ...prevValue };
          newState["checkbox" + dataRes.data.next_stop.place_order] = true;
          return newState;
        });
      }
      // if we're at the next stop for 10 minutes, it means we don't need to go backward ,
      // so we disable the previous checkbox and don't need to check if we're still in the stop area
      if (countIn == 120) {
        setIsStopFinished(false);
        setCountIn(0);
        setDisabled((prevValue) => {
          const newState = { ...prevValue };
          newState["checkbox" + dataRes.last_visited_place] = true;
          return newState;
        }); 
      } 
    } 
    // if we're not close enough to the next stop
    else  if (dataRes.code == 2) {
      // if the current stop is not finished we count each time the user leaves the stop area
      if (!isStopFinished){
        setCountOut(countOut + 1);
      }
      // we update the distance to the next stop
      setDistance(Math.round(dataRes.data.distance));
    } else {
      console.log("Error updating the next stop");
    }
  };


  //----------------------------------------ANIMATIONS---------------------------------------------------------

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
  
//----------------------------------------RENDER---------------------------------------------------------

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        {currentLocation && isStopFinished && (
          <Text>
              Next Stop is {distance} meters away
          </Text>
        )}
        {currentLocation && !isStopFinished && (
          <Text>
              You are in a stop
          </Text>
        )}
        <Popup
          isOpen={popupState.popup1Open}
          onClose={() => handleClosePopup(1)} 
          onButtonOneClick={handleButtonOneClick}
          onButtonTwoClick={handleButtonTwoClick} 
          popupTitle={"You reached the next stop"}
          popupText={"Do you want to update the status of the pubcrawl ?"}
          updateButton={true}
        />
        <Popup
          isOpen={popupState.popup2Open}
          onClose={() => handleClosePopup(2)} 
          onButtonOneClick={handleButtonOneClick} 
          onButtonTwoClick={handleButtonTwoClick}
          popupTitle={"You are still in the next stop"}
          popupText={"Do you want to update the status of the pubcrawl now ?"}
          updateButton={true}
        />
        <Popup
          isOpen={popupState.popup3Open}
          onClose={() => handleClosePopup(3)} 
          onButtonOneClick={handleButtonOneClick} 
          onButtonTwoClick={handleButtonTwoClick}
          popupTitle={"You stayed long enough at the next stop"}
          popupText={"The pubcrawl will be updated now."}
          updateButton={false}
        />
        <Popup
          isOpen={popupState.popup4Open}
          onClose={() => handleClosePopup(4)}
          onButtonOneClick={handleButtonOneClick}
          onButtonTwoClick={handleButtonTwoClick}
          popupTitle={"You seem to be leaving the current stop"}
          popupText={"Do you want to update the status of the pubcrawl now ?"}
          updateButton={true}
        />
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
                  {checkboxes["checkbox" + (stop.place_order - 1)] && isStopFinished &&
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
                    <Text style={[styles.separator, (!checkboxes["checkbox" + (stop.place_order - 1)] || checkboxes["checkbox" + (stop.place_order - 1)] && !isStopFinished && !checkboxes["checkbox" + stop.place_order] ) && styles.hiddenSeparator]} />
                  )}
                  <TouchableOpacity
                    style={[styles.checkbox, checkboxes["checkbox" + stop.place_order] && styles.checkboxChecked]}
                    onPress={() => handleCheckboxToggle("checkbox" + stop.place_order)}
                    disabled={isDisabled ? isDisabled : disabled["checkbox" + stop.place_order]}
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
                  {checkboxes["checkbox" + (stop.place_order - 1)] && isStopFinished &&
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
