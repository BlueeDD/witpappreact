import React, { useState, useContext, useEffect, useRef } from "react";
import { View, Text, StatusBar, TouchableOpacity, Animated, ScrollView } from "react-native";
import Footer from "./Footer";
import DefaultScreen from "./DefaultScreen";

import { AuthContext } from "../navigation";

const FeedScreen = () => {
  const { user } = useContext(AuthContext);

  // set the checkboxes
  const initialCheckboxes = {};
  const [hasPubcrawl, setHasPubcrawl] = useState(false);
  const [checkboxes, setCheckboxes] = useState({});

  const [meetingPoint, setMeetingPoint] = useState(""); // string of meeting point
  const [stops, setStops] = useState([]); // array of stops [ {place_order: 1, place_name: "The first stop"}, ...

  const animatedDots = useRef(new Animated.Value(0)).current;
  const animatedSeparator = useRef(new Animated.Value(0)).current;

  const [timer, setTimer] = useState(0);
  const startTimer = () => {
    setTimer(10000); // Set the timer duration in milliseconds (5 seconds in this example)
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
   * if the checkbox is checked, set every previous checkbox to checked
   * if the checkbox is unchecked, set every next checkbox to unchecked
   */
  const handleCheckboxToggle = (checkboxName) => {
    startTimer(); // Reset the timer when a checkbox is clicked
    setCheckboxes((prevValue) => {
      const newState = { ...prevValue };
      newState[checkboxName] = !newState[checkboxName];
      if (newState[checkboxName]) {
        for (let i = 0; i < checkboxName.slice(-1); i++) {
          newState["checkbox" + i] = true;
        }
      } else {
        for (let i = parseInt(checkboxName.slice(-1)) + 1; i <= stops.length; i++) {
          newState["checkbox" + i] = false;
        }
      }
      return newState;
    });
  };


  useEffect(() => {
    getPubcrawlData();
  }, []);

  useEffect(() => {
    animateDots();
    animateSeparator();
    startTimer();
  }, [stops]);

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
    const response = await fetch('http://192.168.0.14/witp/API/getStopsTodayByCityId.php', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // pass the email and password from form to the API
        city_id: 1, // we use user's city ID
      }),
    });
    const dataRes = await response.json();
    if (dataRes.code == 0) {
      // if no error (user found)
      initialCheckboxes["checkbox0"] = false;
      dataRes.data.stops.forEach((item) => {
        initialCheckboxes["checkbox" + item.place_order] = false; // Set initial state to false for each checkbox (using place order)
      });
      setCheckboxes(initialCheckboxes);
      setMeetingPoint(dataRes.data.pubcrawl.meeting_point);
      setStops(dataRes.data.stops);
      setHasPubcrawl(true);
    } else if (dataRes.code == 2) {
      setHasPubcrawl(false);
    } else {
        alert("We encountered a problem to get the pubcrawl data. Please try again later.");
    }
  };

  return (
    <View style={{ flex: 1 }}>
    { hasPubcrawl ? (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
          <ScrollView contentContainerStyle={styles.row}>
            <View style={styles.column}>
              <TouchableOpacity
                style={[styles.checkbox, checkboxes["checkbox0"] && styles.checkboxChecked]}
                onPress={() => handleCheckboxToggle("checkbox0")}
              >
                {!checkboxes["checkbox0"] && timer > 0 && (
                  <Text style={styles.checkboxTimer}>{formatTimerValue(timer)}</Text>
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
                  >
                    {!checkboxes["checkbox" + stop.place_order] && checkboxes["checkbox" + (stop.place_order -1)] && timer > 0 && (
                     <Text style={styles.checkboxTimer}>{formatTimerValue(timer)}</Text>
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
    ) : (
      <DefaultScreen />
    )}
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
