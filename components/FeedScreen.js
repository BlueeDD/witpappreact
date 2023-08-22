import React, { useState, useContext, useEffect, useRef } from 'react';
import { View, Text, StatusBar, TouchableOpacity, Animated, ScrollView, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import Toggle from 'react-native-toggle-input';
import { AuthContext } from '../navigation';
import Footer from './Footer';
import Popup from './PopUp';
import { useNavigation } from '@react-navigation/native';


const FeedScreen = () => {
  // set the checkboxes
  const initialCheckboxes = {};
  const navigation = useNavigation();
  const initialDisabled = {};
  const { setHasPubcrawl, isLocationEnabled, setIsLocationEnabled, user, timerDuration, setTimerDuration } = useContext(AuthContext);
  const [checkboxes, setCheckboxes] = useState({});
  const [disabled, setDisabled] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentStop, setCurrentStop] = useState(-2);
  const [pubcrawlID, setPubcrawlID] = useState(null);
  const [leaderName, setLeaderName] = useState("");
  const [toggle, setToggle] = React.useState(false);
  const isLeader = useRef(false);
  const isStopFinished = useRef(false);
  const manual = useRef(false);
  const checked = useRef(false);

  const [popupState, setPopupState] = useState({
    popup1Open: false,
    popup2Open: false,
    popup3Open: false,
    popup4Open: false,
    popup5Open: false,
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
    // startTimer(); // Reset the timer when a checkbox is clicked
    manual.current = true;
    setCheckboxes((prevValue) => {
      const newState = { ...prevValue };
      const checkboxIndex = parseInt(checkboxName.slice(-1));
      setCountOut(0);
      setCountIn(0);
      isStopFinished.current = false;
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
        // if we unchecked the checkbox we need to disable the next one
      } else {
        setCurrentStop(checkboxIndex - 1);
        for (let i = checkboxIndex + 1; i <= stops.length; i++) {
          newState["checkbox" + i] = false;
        }
        for (let i = 0; i < stops.length + 1; i++) {
          if (i === checkboxIndex) {
            disabledState["checkbox" + i] = false;
          } else {
            disabledState["checkbox" + i] = true;
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
      setCountOut(0);
    } else {
      setCountOut(0);
      isStopFinished.current = true;
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
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    animateDots();
    animateSeparator();
    startTimer();
  }, [stops]);

  useEffect(() => {
    if (isLeader.current) {
      const intervalId = setInterval(getCurrentLocation, 5000); // Update location every 5 seconds  
      return () => {
        clearInterval(intervalId); // Clear the interval when the component unmounts
      };
    }
  }, [isLeader.current]);

  useEffect(() => {
    setNextStop();
    console.log("countOut: " + countOut);
    console.log("countIn: " + countIn);
  }, [currentLocation]);

  useEffect(() => {
    let timerInterval;

    if (timerDuration > 0) {
      timerInterval = setInterval(() => {
        setTimerDuration((prevDuration) => prevDuration - 1);
      }, 1000);
    }

    return () => clearInterval(timerInterval);
  }, [timerDuration]);

  useEffect(() => {
    // if 1 in, the "you reached the pub" popup will open
    if (countIn === 1) {
      handleClosePopup(4);
      handleOpenPopup(1);
      //after 2 minutes in, the "you're still here" popup will open
    } else if (countIn === 25) {
      handleClosePopup(1);
      handleOpenPopup(2);
      //after 4 minutes in, the "now it will update" popup will open
    } else if (countIn === 50) {
      handleClosePopup(2);
      handleOpenPopup(3);
      handleCheckboxToggle("checkbox" + (currentStop + 1));
      isStopFinished.current = true;
      setCountOut(0);
      //after 1 minute out, the "do you want to leave" popup will open
    } else if (countOut === 12) {
      handleClosePopup(3);
      handleOpenPopup(4);
    }
  }, [countOut, countIn]);

  useEffect(() => {
    // Function to set the header options when CreatePubCrawlScreen is focused
    const setCreatePubCrawlHeaderOptions = () => {
      navigation.setOptions({
        headerLeft: () => null, // Hide the back arrow
      });
    };

    // Disable the gesture to prevent sliding back
    navigation.setOptions({
      gestureEnabled: false,
    });

    // Subscribe to the focus event of CreatePubCrawlScreen
    const unsubscribe = navigation.addListener('focus', setCreatePubCrawlHeaderOptions);

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, [navigation]);

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

  //----------------------------------------API CALLS---------------------------------------------------------


  const getPubcrawlData = async () => {
    const response = await fetch('https://whereisthepubcrawl.com/API/getStopsTodayByCityId.php', {
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
    if (dataRes.code === 0) {
      if (dataRes.data.pubcrawl.last_visited_place == 0) {
        initialCheckboxes["checkbox0"] = true;
        initialDisabled["checkbox0"] = false;
        initialCheckboxes["checkbox1"] = false;
        initialDisabled["checkbox1"] = false;
        dataRes.data.stops.forEach((item) => {
          if (item.place_order != 1) {
            initialCheckboxes["checkbox" + item.place_order] = false; // Set initial state to true for the first checkbox (using place order)
            initialDisabled["checkbox" + item.place_order] = true;
          }
        });
      } else {
        if (dataRes.data.pubcrawl.last_visited_place == -1) {
          initialCheckboxes["checkbox0"] = false;
          initialDisabled["checkbox0"] = false;
        } else {
          initialCheckboxes["checkbox0"] = true;
        }
        dataRes.data.stops.forEach((item) => {
          if (item.place_order < dataRes.data.pubcrawl.last_visited_place) {
            initialCheckboxes["checkbox" + item.place_order] = true; // Set initial state to true for the first checkbox (using place order)
            initialDisabled["checkbox" + (item.place_order - 1)] = true;
          } else if (item.place_order == dataRes.data.pubcrawl.last_visited_place) {
            initialCheckboxes["checkbox" + item.place_order] = true; // Set initial state to true for the current checkbox (using place order)
            initialDisabled["checkbox" + (item.place_order - 1)] = false;
            initialDisabled["checkbox" + (item.place_order)] = false;
          } else {
            initialCheckboxes["checkbox" + item.place_order] = false; // Set initial state to false for each checkbox (using place order)
            initialDisabled["checkbox" + (item.place_order)] = true;
          }
        });
      }
      setCheckboxes(initialCheckboxes);
      setDisabled(initialDisabled);
      // console.log("disabled : " + JSON.stringify(initialDisabled));
      setMeetingPoint(dataRes.data.pubcrawl.meeting_point);
      setStops(dataRes.data.stops);
      setCurrentStop(dataRes.data.pubcrawl.last_visited_place);
      setPubcrawlID(dataRes.data.pubcrawl.id);
      setHasPubcrawl(true);
      setLeaderName(dataRes.data.pubcrawl.leader_name);
      isLeader.current = (dataRes.data.pubcrawl.leader_id == user.id);
      console.log("isLeader : " + isLeader.current);
      console.log("isLeaderID : " + dataRes.data.pubcrawl.leader_id);
      console.log("user id : " + user.id);
      { dataRes.data.pubcrawl.last_visited_place === -1 ? isStopFinished.current = true : isStopFinished.current = false; }
    } else if (dataRes.code == 2) {
      setHasPubcrawl(false);
    } else if (dataRes.code == 5) {
      setHasPubcrawl(false);
      console.log("You have already finished today pubcrawl.");
    } else {
      alert("We encountered a problem to get the pubcrawl data. Please try again later.");
    }
  };

  const setNextStop = async () => {
    // console.log("current stop : " + currentStop);
    // console.log("isStopFinished : " + isStopFinished.current);
    const response = await fetch('https://whereisthepubcrawl.com/API/setNextStop.php', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pubcrawl_id: pubcrawlID,
        last_visited_place: currentStop,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        is_stop_finished: isStopFinished.current,
        manual: manual.current,
        checked: checked.current,
      }),
    });
    const dataRes = await response.json();
    // if we're close enough to the next stop
    if (dataRes.code == 0) {
      if (!isStopFinished.current) {
        console.log("Successfully updated the next stop");
        setCurrentStop(dataRes.data.last_visited_place);
        { dataRes.data.pubcrawl.last_visited_place === -1 ? isStopFinished.current = true : isStopFinished.current = false; }
      }
      setDistance(Math.round(dataRes.data.distance));
      // if we finished the previous stop we reset the countOut,
      // set this stop as the current stop and update the checkboxes display
      if (isStopFinished.current) {
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
        isStopFinished.current = false;
        setCountIn(0);
        setDisabled((prevValue) => {
          const newState = { ...prevValue };
          newState["checkbox" + dataRes.last_visited_place] = true;
          return newState;
        });
      }
    }
    // if we're not close enough to the next stop
    else if (dataRes.code == 2) {
      // if the current stop is not finished we count each time the user leaves the stop area
      if (!isStopFinished.current) {
        setCountOut(countOut + 1);
      }
      // we update the distance to the next stop
      setDistance(Math.round(dataRes.data.distance));
    } else if (dataRes.code == 1) {
      isStopFinished.current = true;
    } else {
      console.log(dataRes.message);
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
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#f48024" />
          <Text style={{ fontSize: 30, marginTop: 15 }}>Loading...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <StatusBar barStyle="light-content" />
          <Popup
            isOpen={popupState.popup1Open}
            onClose={() => handleClosePopup(1)}
            onButtonOneClick={handleButtonOneClick}
            onButtonTwoClick={handleButtonTwoClick}
            popupTitle={currentStop === -1 ? "You seem to be at the meeting point" : "You reached the next stop"}
            popupText={currentStop === -1 ? "Do you want to start the pubcrawl ?" : "Do you want to update the status of the pubcrawl ?"}
            updateButton={true}
          />
          <Popup
            isOpen={popupState.popup2Open}
            onClose={() => handleClosePopup(2)}
            onButtonOneClick={handleButtonOneClick}
            onButtonTwoClick={handleButtonTwoClick}
            popupTitle={currentStop === -1 ? "You're still on the meeting point" : "You are still in the next stop"}
            popupText={currentStop === -1 ? "Do you want to start the pubcrawl now ?" : "Do you want to update the status of the pubcrawl now ?"}
            updateButton={true}
          />
          <Popup
            isOpen={popupState.popup3Open}
            onClose={() => handleClosePopup(3)}
            onButtonOneClick={handleButtonOneClick}
            onButtonTwoClick={handleButtonTwoClick}
            popupTitle={currentStop === -1 ? "You stayed long enough at the meeting point" : "You stayed long enough at the next stop"}
            popupText={currentStop === -1 ? "The pubcrawl will start now" : "The pubcrawl will be updated now."}
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
          <Popup
            isOpen={popupState.popup5Open}
            onClose={() => handleClosePopup(5)}
            onButtonOneClick={handleButtonOneClick}
            onButtonTwoClick={handleButtonTwoClick}
            popupTitle={currentStop === -1 ? "You clicked on the meeting point without reaching it yet" : "It hasn't been long since you changed stop"}
            popupText={currentStop === -1 ? "Do you want to start the pubcrawl manually ?" : "Do you still want to update the status of the pubcrawl ?"}
            updateButton={true}
          />
            {currentLocation && isStopFinished.current && isLeader.current && (
            <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 15, marginBottom:15, fontWeight: "bold", color: "darkgreen" }}>
              {currentStop === -1 ? "Meeting point" : "Next Stop"} is {distance} meters away
            </Text>
            <Toggle 
            toggle={toggle} 
            setToggle={setToggle}
            toggleText1="Automatic"
             />
            </View>
          )}
          {currentLocation && !isStopFinished.current && isLeader.current && (
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 15, marginBottom:15, fontWeight: "bold", color: "darkgreen" }}>
                You are {currentStop === 0 ? "at the Meeting point" : "in a stop"}
              </Text>
              <Toggle 
              toggle={toggle} 
              setToggle={setToggle}
              toggleText1="Automatic"
              />
            </View>
          )}
          {!isLeader.current && (
            <Text style={{ fontSize: 15, marginTop: 20, fontWeight: "bold", color: "darkgreen" }}>
              The leader of the pubcrawl is {leaderName}
            </Text>
          )}
          <View style={styles.row}>
            <View style={styles.column}>
              <TouchableOpacity
                style={[styles.checkbox, checkboxes["checkbox0"] && styles.checkboxChecked]}
                onPress={() => { isStopFinished.current && !checkboxes["checkbox0"] ? handleOpenPopup(5) : handleCheckboxToggle("checkbox0") }}
                disabled={isLeader.current ? disabled["checkbox0"] : true}
              >
                {!checkboxes["checkbox0"] && timer > 0 && (
                  <Text style={styles.checkboxTimer}>
                    {/* {formatTimerValue(timer)} */}
                  </Text>
                )}
              </TouchableOpacity>
              {stops.map((stop) => (
                <View key={stop.place_order} style={{ alignItems: "center" }}>
                  {checkboxes["checkbox" + (stop.place_order - 1)] && isStopFinished.current &&
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
                    <Text style={[styles.separator, (!checkboxes["checkbox" + (stop.place_order - 1)] || checkboxes["checkbox" + (stop.place_order - 1)] && !isStopFinished.current && !checkboxes["checkbox" + stop.place_order]) && styles.hiddenSeparator]} />
                  )}
                  <TouchableOpacity
                    style={[styles.checkbox, checkboxes["checkbox" + stop.place_order] && styles.checkboxChecked]}
                    onPress={() => { !isStopFinished.current && !checkboxes["checkbox" + stop.place_order] ? handleOpenPopup(5) : handleCheckboxToggle("checkbox" + stop.place_order) }}
                    disabled={isLeader.current ? disabled["checkbox" + stop.place_order] : true}
                  >
                    {!checkboxes["checkbox" + stop.place_order] && checkboxes["checkbox" + (stop.place_order - 1)] && timer > 0 && (
                      <Text style={styles.checkboxTimer}>
                        {/* {formatTimerValue(timer)} */}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <View style={[styles.column, { marginLeft: 0 }]}>
              <Text style={styles.title}>{meetingPoint}</Text>
              {stops.map((stop) => (
                <View key={stop.place_order}>
                  {checkboxes["checkbox" + (stop.place_order - 1)] && isStopFinished.current &&
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
          </View>
        </ScrollView>
      )}
    <Footer />
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
    marginLeft: -80,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    zIndex: 9999,
  },
};

export default FeedScreen;
