import React, { useState } from "react";
import { View, Text, StatusBar, TouchableOpacity } from "react-native";
import Footer from "./Footer";

const FeedScreen = () => {

  const [checkboxes, setCheckboxes] = useState({
    checkbox1: false,
    checkbox2: false,
    checkbox3: false,
    checkbox4: false,
    checkbox5: false,
  });

  const handleCheckboxToggle = (checkboxName) => {
    setCheckboxes((prevValue) => ({
      ...prevValue,
      [checkboxName]: !prevValue[checkboxName],
    }));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
        <View style={styles.row}>
        <View style={styles.column}>
          <TouchableOpacity
            style={[styles.checkbox, checkboxes.checkbox1 && styles.checkboxChecked]}
            onPress={() => handleCheckboxToggle("checkbox1")}
          />
          <View style={[styles.separator, !checkboxes.checkbox1 && styles.hiddenSeparator, checkboxes.checkbox1 && !checkboxes.checkbox2 && styles.separatorDotted]} />
          <TouchableOpacity
            style={[styles.checkbox, checkboxes.checkbox2 && styles.checkboxChecked]}
            onPress={() => handleCheckboxToggle("checkbox2")}
          />
          <View style={[styles.separator, !checkboxes.checkbox2 && styles.hiddenSeparator, checkboxes.checkbox2 && !checkboxes.checkbox3 && styles.separatorDotted]} />
          <TouchableOpacity
            style={[styles.checkbox, checkboxes.checkbox3 && styles.checkboxChecked]}
            onPress={() => handleCheckboxToggle("checkbox3")}
          />
          <View style={[styles.separator, !checkboxes.checkbox3 && styles.hiddenSeparator, checkboxes.checkbox3 && !checkboxes.checkbox4 && styles.separatorDotted]} />
          <TouchableOpacity
            style={[styles.checkbox, checkboxes.checkbox4 && styles.checkboxChecked]}
            onPress={() => handleCheckboxToggle("checkbox4")}
          />
          <View style={[styles.separator, !checkboxes.checkbox4 && styles.hiddenSeparator, checkboxes.checkbox4 && !checkboxes.checkbox5 && styles.separatorDotted]} />
          <TouchableOpacity
            style={[styles.checkbox, checkboxes.checkbox5 && styles.checkboxChecked]}
            onPress={() => handleCheckboxToggle("checkbox5")}
          />
        </View>
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
          <Text style={styles.title}>Stop n°4</Text>
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
    width: 8,
    height: 75,
    backgroundColor: "green",
    borderColor: "darkgreen",
    borderWidth: 2,
  },
  separatorDotted: {
    width: 0,
    height: 75,
    backgroundColor: "white",
    backgroundStyle: "dotted",
    borderColor: "darkgreen",
    borderWidth: 3,
    borderStyle: "dotted",
    marginTop: -1,
  },
  hiddenSeparator: {
    backgroundColor: "white",
    borderColor: "white",
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
