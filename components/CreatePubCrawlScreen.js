import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import Toggle from 'react-native-toggle-input';
import ModalDropdown from 'react-native-modal-dropdown';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AuthContext } from '../navigation';


const CreatePubCrawlScreen = () => {
  const { user } = useContext(AuthContext);
  const [toggle, setToggle] = React.useState(false);
  const [serverData, setServerData] = useState([]);
  const [modalVisible, setModalVisible] = useState(-1);
  const [selectedDuration, setSelectedDuration] = useState('2');
  const options = ['2', '3', '4', '5', '6'];

  const [stops, setStops] = useState([
    { label: 'Meeting Point', id: '', name: '' },
    { label: '1', id: '', name: '', duration: '' },
    { label: '2', id: '', name: '', duration: '' },
    { label: '3', id: '', name: '', duration: '' },
    { label: '4', id: '', name: '', duration: '' },
  ]);

  // Calculate the next starting hour
  // Calculate the next starting hour
  const now = new Date();
  const nextStartingHour = new Date(now);
  nextStartingHour.setMinutes(0, 0, 0);
  nextStartingHour.setHours(22);

  // State for datetime picker visibility and default date
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(nextStartingHour);

  const handleSelect = (index) => {
    setSelectedDuration(options[index]);
  };


  const handleSelectItem = (index, item) => {
    const updatedStops = [...stops];
    console.log('item', item);
    updatedStops[index].id = item.id;
    updatedStops[index].name = item.name;
    console.log('updatedStops' + index, updatedStops[index]);
    setStops(updatedStops);
    setModalVisible(-1);
  };

  const handleTimeChange = (index, text) => {
    const updatedStops = [...stops];
    updatedStops[index].duration = text;
    setStops(updatedStops);
  };


  // Function to handle datetime picker confirm
  const handleDateTimeConfirm = (date) => {
    setSelectedStartDate(date);
    setShowDateTimePicker(false);
  };

  // Function to handle datetime picker cancel
  const handleDateTimeCancel = () => {
    setShowDateTimePicker(false);
  };

  const handleCreatePress = () => {
    // if any of the fields is empty, alert the user
    if (stops.some(stop => stop.name === '' || stop.duration === '')) {
      alert('Please fill in all the fields.');
      // if the sum of the stops durations is greater than the total duration of the pub crawl, alert the user
    } else if (selectedDuration * 60 < stops.slice(1).reduce((acc, stop) => acc + parseInt(stop.duration), 0)) {
      alert('The total duration of the pub crawl cannot be less than the sum of the stops durations.');
    } else {
      console.log('stops', stops);
      console.log('selectedDuration', selectedDuration);
      console.log('toggle', toggle);
    }
  };

  const getStopsData = async () => {
    const response = await fetch('https://whereisthepubcrawl.com/API/getPlaces.php', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // pass city and user ids to the API
        city_id: user.agentCityId, // we use user's city ID
      }),
    });
    const dataRes = await response.json();
    //here is the content of dataRes: [{"city_id": "1", "id": "1", "latitude": "36.72371616684815", "longitude": "-4.417598247528076", "stop": "Merced 14. Plaza de la Merced 14"}, {"city_id": "1", "id": "2", "latitude": "36.72365219204769", "longitude": "-4.41709776603106", "stop": "Picasso Bar Tapas, Pl. de la Merced, 20"}, {"city_id": "1", "id": "3", "latitude": "36.7223829789638", "longitude": "-4.421585459408515", "stop": "Camden Lock Malaga, Calle Convalecientes"}, {"city_id": "1", "id": "4", "latitude": "36.72232749160218", "longitude": "-4.421705048630165", "stop": "Gallery Club, Calle Convalecientes"}, {"city_id": "1", "id": "5", "latitude": "36.72226183562587", "longitude": "-4.421773785371996", "stop": "The Museum, Calle Convalecientes"}, {"city_id": "1", "id": "6", "latitude": "36.722955203904306", "longitude": "-4.422135203429746", "stop": "Smile Inc, Calle Nosquera"}, {"city_id": "1", "id": "7", "latitude": "36.722829361712165", "longitude": "-4.421640370730702", "stop": "Seven O clock, Calle Comedias"}, {"city_id": "1", "id": "8", "latitude": "36.722162277629174", "longitude": "-4.422687147770784", "stop": "Sala Bubbles, Calle Martires"}, {"city_id": "1", "id": "9", "latitude": "36.72214151555827", 
    // "longitude": "-4.421288411859857", "stop": "Sala Gold, Calle Luis de Velazquez"}]
    //put the list of stops with their name in serverData
    setServerData(dataRes.data.map((item) => ({ name: item.stop, id: item.id })));
  };

  useEffect(() => {
    getStopsData();
  }, []);


  return (
    <ScrollView>
      <KeyboardAwareScrollView
        behavior={"padding"}
        keyboardVerticalOffset={0}
        contentContainerStyle={styles.container}
      >
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible !== -1}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {serverData.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.modalItem}
                  onPress={() => handleSelectItem(modalVisible, item)}
                >
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(-1)}
            >
              <Text style={{ color: 'white' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <DateTimePickerModal
          isVisible={showDateTimePicker}
          mode="datetime"
          date={selectedStartDate}
          onConfirm={handleDateTimeConfirm}
          onCancel={handleDateTimeCancel}
          style={styles.dateTimePickerModal}
        />
        {/* <View style={styles.container}> */}
        <Text style={styles.title}>Create Pub Crawl</Text>
        <View style={{ borderColor: '#f48204', borderWidth: 2, width: 380, alignItems: 'center', padding: 5 }}>
          <View style={[styles.row, { marginTop: 10, marginBottom: 15 }]}>
            <Text style={{ color: 'gray' }}>Starting at: </Text>
            <TouchableOpacity onPress={() => setShowDateTimePicker(true)}>
              <Text>{selectedStartDate.toLocaleString()}</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.row, { marginBottom: 15 }]}>
            <Text style={{ color: 'gray' }}>Duration (in hours):</Text>
            <ModalDropdown
              options={options}
              onSelect={handleSelect}
              style={styles.dropdown}
              textStyle={styles.dropdownText}
              defaultValue={selectedDuration}
              dropdownStyle={[styles.dropdownContainer, { position: 'absolute', left: 237 }]}
            />
          </View>
          <View style={[styles.row, { marginBottom: 15 }]}>
            <Text style={{ color: "gray", marginRight: 15 }}>Enable Timeline </Text>
            <Toggle toggle={toggle} setToggle={setToggle} />
          </View>
          {stops.map((Stop, index) => (
            <View key={index} style={styles.row}>
              {index === 0 ? <Text style={{ color: 'gray' }}>Meeting Point</Text> : <Text style={{ color: 'gray' }}>Stop {Stop.label}</Text>}
              {index === 0 ?
                <TouchableOpacity onPress={() => setModalVisible(index)}>
                  {Stop.name !== '' ?
                    <Text style={[styles.stopText, { width: 200 }]}> {serverData[(Stop.id) - 1].name} </Text>
                    : <Text style={[styles.stopText, { width: 200, textAlign: 'center' }]}>Select a stop</Text>}
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={() => setModalVisible(index)}>
                  {Stop.name !== '' ?
                    <Text style={styles.stopText}> {serverData[(Stop.id) - 1].name} </Text>
                    : <Text style={[styles.stopText, { textAlign: 'center' }]}>Select a stop</Text>}
                </TouchableOpacity>
              }
              {index !== 0 && (<Text style={{ color: 'gray' }}>Duration: </Text>)}
              {index !== 0 && (<TextInput
                style={[styles.timeInput]}
                value={Stop.duration}
                onChangeText={(text) => handleTimeChange(index, text)}
              />)}
              {index !== 0 && (<Text style={{ color: 'gray' }}> minutes</Text>)}
            </View>
          ))}
        </View>
        <TouchableOpacity
          style={[styles.button, { marginTop: 20 }]}
          onPress={handleCreatePress}>
          <Text style={styles.buttonText}>Create</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 15,
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
    marginBottom: 5,
  },
  dateTimePickerModal: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  textInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#FAF7F6',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  closeButton: {
    backgroundColor: '#f48024',
    alignItems: 'center',
    padding: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  stopText: {
    padding: 4,
    margin: 4,
    width: 150,
    backgroundColor: 'white',
    borderColor: '#bbb',
    borderWidth: 1,
    borderRadius: 5,
  },
  timeInput: {
    height: 35,
    borderWidth: 1,
    borderColor: '#f48024',
    borderRadius: 5,
    textAlign: 'center',
    width: 35,
  },
  dropdown: {
    width: 30,
    height: 30,
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
  button: {
    width: 180,
    backgroundColor: "#f48024",
    borderWidth: 1,
    borderRadius: 30,
    shadowColor: "grey",
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 15,
    fontSize: 18,
  },
});

export default CreatePubCrawlScreen;