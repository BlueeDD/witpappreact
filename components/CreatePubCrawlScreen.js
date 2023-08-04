import React, {useEffect, useState} from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView } from 'react-native';
import SearchableDropdown from 'react-native-searchable-dropdown';
import Toggle from 'react-native-toggle-input';
import ModalDropdown from 'react-native-modal-dropdown';

const CreatePubCrawlScreen = () => {
  const [toggle, setToggle] = React.useState(false);
  const [serverData, setServerData] = useState([]);
  const [selectedValue, setSelectedValue] = useState('2');
  const options = ['2', '3', '4', '5', '6'];

  const [stops, setStops] = useState([
    { label: 'Stop 1', duration: ''},
    { label: 'Stop 2', duration: ''},
    { label: 'Stop 3', duration: ''},
    { label: 'Stop 4', duration: ''},
  ]);

  const handleSelect = (index) => {
    setSelectedValue(options[index]);
  };

  const handleTimeChange = (index, text) => {
    const updatedStops = [...stops];
    updatedStops[index].duration = text;
    setStops(updatedStops);
  };

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => response.json())
      .then((responseJson) => {
        //Successful response from the API Call
        setServerData(responseJson);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  
  return (
    <KeyboardAvoidingView
      behavior={"padding"}
      keyboardVerticalOffset={0}>
      <View style={styles.container}>
        <Text style={styles.title}>Create Pub Crawl</Text>
        <View style={{borderColor: '#f48204', borderWidth: 2, width: 380, alignItems: 'center', padding: 5}}>
        <View style={[styles.row,{marginBottom: 30}]}>
          <Text style={{color: 'gray'}}>Duration (in hours):</Text>
          <ModalDropdown
            options={options}
            onSelect={handleSelect}
            style={styles.dropdown}
            textStyle={styles.dropdownText}
            defaultValue={selectedValue}
            dropdownStyle={[styles.dropdownContainer,{position: 'absolute', left: 237}]}
          />
        </View>
        <View style={[styles.row,{marginBottom: 30}]}>
          <Text style={{color: "gray", marginRight: 15}}>Enable Timeline </Text>
          <Toggle toggle={toggle} setToggle={setToggle} />
        </View>
        {stops.map((Stop, index) => (
          <View key={index} style={styles.row}>
            <Text style={{color:'gray'}}>{Stop.label}</Text>
            <SearchableDropdown
              onTextChange={(text) => console.log(text)}
              //On text change listner on the searchable input
              onItemSelect={(item) => alert(JSON.stringify(item))}
              //onItemSelect called after the selection from the dropdown
              containerStyle={{ flex: 2, padding: 5 }}
              //suggestion container style
              textInputStyle={styles.textInput}
              itemStyle={styles.itemStyle}
              // itemTextStyle={}
              itemsContainerStyle={{
                //items container style you can pass maxHeight
                //to restrict the items dropdown hieght
                maxHeight: '50%',
              }}
              items={serverData}
              //mapping of item array
              defaultIndex={2}
              //default selected item index
              placeholder="placeholder"
              //place holder for the search input
              resetValue={false}
              //reset textInput Value with true and false state
              underlineColorAndroid="transparent"
              //To remove the underline from the android input
            />
            <Text style={{color: 'gray'}}>Duration: </Text>
            <TextInput
              style={[styles.timeInput]}
              value={Stop.duration}
              onChangeText={(text) => handleTimeChange(index, text)}
            />
            <Text style={{color: 'gray'}}> minutes</Text>
          </View>
        ))}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems:'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#f48024',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#f48024',
    paddingHorizontal: 10,
    width: 50,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  textInput: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#FAF7F6',
  },
  itemStyle: {
    padding: 10,
    marginTop: 2,
    backgroundColor: '#FAF9F8',
    borderColor: '#bbb',
    borderWidth: 1,
  },
  timeInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#f48024',
    borderRadius: 5,
    textAlign: 'center',
    width: 40,
  },
  dropdown: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  dropdownText: {
    color: 'black',
  },
  dropdownContainer: {
    width: 51,
    alignItems: 'center',
  },
});

export default CreatePubCrawlScreen;