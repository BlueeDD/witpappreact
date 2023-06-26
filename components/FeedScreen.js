import React, { useState, useContext, useEffect } from "react";
import { View, Text, StatusBar, TouchableOpacity } from "react-native";
import Footer from "./Footer";

import { AuthContext } from '../navigation';

const FeedScreen = () => {

  const [isChecked, setIsChecked] = useState(false);
  const { user } = useContext(AuthContext);

  // set the checkboxes
  const initialCheckboxes = {};
  const [checkboxes, setCheckboxes] = useState({});

  const [meetingPoint, setMeetingPoint] = useState(""); // string of meeting point
  const [stops, setStops] = useState([]); // array of stops [ {place_order: 1, place_name: "The first stop"}, ...

  /**
   * toogle the checbox status
   * @param {*} checkboxName 
   */
  const handleCheckboxToggle = (checkboxName) => {
    console.log("checkboxName : " + checkboxName);
    setCheckboxes((prevValue) => ({
      ...prevValue,
      [checkboxName]: !prevValue[checkboxName], // toggle the checkbox value
    }));
  };

  useEffect(() => {
    getPubcrawlData();
  }, []);

  const getPubcrawlData = async () => {
    console.log("agent id : " + user.agentCityId);

    // TODO : replace with // 'https://whereisthepubcrawl.com/API/getStopsTodayByCityId.php' 
    const response = await fetch('http://192.168.0.62/witp/API/getStopsTodayByCityId.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ // pass the email and password from form to the API
        city_id: 1, // we use user's city ID
      }),
    });
    const dataRes = await response.json();
    if (dataRes.code == 0) { // if no error (user found)
      initialCheckboxes["checkbox0"] = false;
      dataRes.data.stops.forEach((item) => {
        //console.log(item);
        initialCheckboxes["checkbox" + item.place_order] = false; // Set initial state to false for each checkbox (using place order)
      });
      setCheckboxes(initialCheckboxes);
      setMeetingPoint(dataRes.data.pubcrawl.meeting_point);
      setStops(dataRes.data.stops);
    } else {
      //console.log(dataRes.code);
      alert("We encountered a problem to get the pubcrawl data. Please try again later.");
    }
    //console.log(dataRes.data);
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
            <View key={stop.place_order}>
              <View style={[styles.separator, !initialCheckboxes["checkbox" + stop.place_order] && styles.hiddenSeparator]} />
              <TouchableOpacity
                style={[styles.checkbox, checkboxes["checkbox" + stop.place_order] && styles.checkboxChecked]}
                onPress={() => handleCheckboxToggle("checkbox" + stop.place_order)}
              />
            </View>
          ))}
          {/* <TouchableOpacity
            style={[styles.checkbox, checkboxes.checkbox1 && styles.checkboxChecked]}
            onPress={() => handleCheckboxToggle("checkbox1")}
          />
          <View style={[styles.separator, !checkboxes.checkbox1 && styles.hiddenSeparator]} />
          <TouchableOpacity
            style={[styles.checkbox, checkboxes.checkbox2 && styles.checkboxChecked]}
            onPress={() => handleCheckboxToggle("checkbox2")}
          />
          <View style={[styles.separator, !checkboxes.checkbox2 && styles.hiddenSeparator]} />
          <TouchableOpacity
            style={[styles.checkbox, checkboxes.checkbox3 && styles.checkboxChecked]}
            onPress={() => handleCheckboxToggle("checkbox3")}
          />
          <View style={[styles.separator, !checkboxes.checkbox3 && styles.hiddenSeparator]} />
          <TouchableOpacity
            style={[styles.checkbox, checkboxes.checkbox4 && styles.checkboxChecked]}
            onPress={() => handleCheckboxToggle("checkbox4")}
          />
          <View style={[styles.separator, !checkboxes.checkbox4 && styles.hiddenSeparator]} />
          <TouchableOpacity
            style={[styles.checkbox, checkboxes.checkbox5 && styles.checkboxChecked]}
            onPress={() => handleCheckboxToggle("checkbox5")}
          /> */}
        </View>
        <View style={[styles.column, { marginLeft: -50 }]}>
          <Text style={styles.title}>{meetingPoint}</Text>
          {stops.map((stop) => (
            <View key={stop.place_order}>
              <Text style={[styles.hiddenText, checkboxes["checkbox" + (stop.place_order - 1)] && !checkboxes["checkbox" + (stop.place_order)] && styles.text]}>
                walking to the next stop...</Text>
              <Text style={styles.title}>{stop.place_name}</Text>
            </View>
          ))}
          {/* <Text style={[styles.hiddenText, checkboxes.checkbox1 && !checkboxes.checkbox2 && styles.text]}>
        <View style={[styles.column, {marginLeft: -50}]}>
          <Text style={styles.title}>Meeting point</Text>
          <Text style={[styles.hiddenText, checkboxes.checkbox1 && !checkboxes.checkbox2 && styles.text]}>
            walking to the next stop...</Text>
          <Text style={styles.title}>Stop n°1</Text>
          <Text style={[styles.hiddenText, checkboxes.checkbox2 && !checkboxes.checkbox3 && styles.text]}>
            walking to the next stop...</Text>
          <Text style={styles.title}>Stop n°2</Text>
          <Text style={[styles.hiddenText, checkboxes.checkbox3 && !checkboxes.checkbox4 && styles.text]}>
            walking to the next stop...</Text>
          <Text style={styles.title}>Stop n°3</Text>
          <Text style={[styles.hiddenText, checkboxes.checkbox4 && !checkboxes.checkbox5 && styles.text]}>
            walking to the next stop...</Text>
          <Text style={styles.title}>Stop n°4</Text> */}
        </View>
      </View>
      <Footer />
    </View>
  );
};

const styles = {
  title: {
    fontSize: 20,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center",
    marginVertical: 12,
  },
  text: {
    fontSize: 15,
    color: "grey",
    textAlign: "center",
    textAlignVertical: "center",
    marginVertical: 30,
  },
  hiddenText: {
    fontSize: 15,
    color: "white",
    textAlign: "center",
    textAlignVertical: "center",
    marginVertical: 30,
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
    width: 15,
    height: 75,
    backgroundColor: "green",
    borderLeftColor: "darkgreen",
    borderRightColor: "darkgreen",
    borderBottomColor: "green",
    borderTopColor: "green",
    borderWidth: 4,
    borderLeftWidth: 4,
    borderRightWidth: 4,
  },
  hiddenSeparator: {
    backgroundColor: "white",
    borderLeftColor: "white",
    borderRightColor: "white",
    borderBottomColor: "white",
    borderTopColor: "white",
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
