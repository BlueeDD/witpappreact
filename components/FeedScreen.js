import React, { useState } from "react";
import { View, Text, StatusBar, TouchableOpacity } from "react-native";
import Footer from "./Footer";

const FeedScreen = () => {
  const [isChecked, setIsChecked] = useState(false);

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
        <View style={styles.column1}>
          <TouchableOpacity
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
          />
        </View>
        <View style={styles.column2}>
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
    flex: 1,
  },
  text: {
    fontSize: 15,
    color: "grey",
    textAlign: "center",
    textAlignVertical: "center",
    flex: 1,
  },
  hiddenText: {
    fontSize: 15,
    color: "white",
    textAlign: "center",
    textAlignVertical: "center",
    flex: 1,  },
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: 'white',
  },
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 60,
  },
  column1: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 90,
    marginTop: 20,
    marginRight: -30,
    marginLeft: -70,
  },
  column2: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 47,
    marginRight: 100,
    marginLeft: -20,
  },
  separator: {
    width: 15,
    height: 100,
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
