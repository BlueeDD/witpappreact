import React, { useState, useContext, useEffect, useRef } from "react";
import { View, Text, StatusBar, TouchableOpacity, Animated } from "react-native";
import Footer from "./Footer";

import { AuthContext } from "../navigation";

const FeedScreen = () => {
  const { user } = useContext(AuthContext);

  // set the checkboxes
  const initialCheckboxes = {};
  const [checkboxes, setCheckboxes] = useState({});

  const [meetingPoint, setMeetingPoint] = useState(""); // string of meeting point
  const [stops, setStops] = useState([]); // array of stops [ {place_order: 1, place_name: "The first stop"}, ...

  const animatedDots = useRef(new Animated.Value(0)).current;
  const animatedSeparator = useRef(new Animated.Value(0)).current;

  /**
   * toggle the checkbox status
   * @param {*} checkboxName
   * if the checkbox is checked, set every previous checkbox to checked
   * if the checkbox is unchecked, set every next checkbox to unchecked
   */
  const handleCheckboxToggle = (checkboxName) => {
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
  }, [stops]);

  const animateDots = () => {
    animatedDots.setValue(0); // Reset animation value

    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedDots, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedDots, {
          toValue: 0,
          duration: 1000,
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
            duration: 1000, // Duration for each state (0 and 1)
            useNativeDriver: false,
          }),
          Animated.timing(animatedSeparator, {
            toValue: 0,
            duration: 1000, // Duration for each state (0 and 1)
            useNativeDriver: false,
          }),
        ])
      ).start();
  };
  

  const getPubcrawlData = async () => {

    // TODO: replace with 'https://whereisthepubcrawl.com/API/getStopsTodayByCityId.php'
    const response = await fetch("http://192.168.0.70/witp/API/getStopsTodayByCityId.php", {
      method: "POST",
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
    } else {
      alert("We encountered a problem to get the pubcrawl data. Please try again later.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.row}>
        <View style={styles.column}>
          <TouchableOpacity
            style={[styles.checkbox, checkboxes["checkbox0"] && styles.checkboxChecked]}
            onPress={() => handleCheckboxToggle("checkbox0")}
          />
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
              <Text style={[styles.separator,!checkboxes["checkbox" + (stop.place_order - 1)] && styles.hiddenSeparator]}/>
              )}
              <TouchableOpacity
                style={[styles.checkbox, checkboxes["checkbox" + stop.place_order] && styles.checkboxChecked]}
                onPress={() => handleCheckboxToggle("checkbox" + stop.place_order)}
              />
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
      </View>
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
  },
  column: {
    flexDirection: "column",
    alignItems: "center",
    width: "50%",
    justifyContent: "center",
    marginLeft: -100,
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
};

export default FeedScreen;
