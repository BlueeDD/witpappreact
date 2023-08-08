import React, {useEffect, useState, useContext} from 'react';
import { View, Text, TextInput, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import Toggle from 'react-native-toggle-input';
import ModalDropdown from 'react-native-modal-dropdown';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AuthContext } from '../navigation';


const CreatePubCrawlScreen = () => {
  const {user} = useContext(AuthContext);
  const [toggle, setToggle] = React.useState(false);
  const [serverData, setServerData] = useState([]);
  const [modalVisible, setModalVisible] = useState(-1);
  const [selectedValue, setSelectedValue] = useState('2');
  const options = ['2', '3', '4', '5', '6'];

  const [stops, setStops] = useState([
    { label: 'Meeting Point', id: '', name:'', duration: ''},
    { label: '1', id: '', name:'', duration: ''},
    { label: '2', id: '', name:'', duration: ''},
    { label: '3', id: '', name:'', duration: ''},
    { label: '4', id: '', name:'', duration: ''},
  ]);

  const handleSelect = (index) => {
    setSelectedValue(options[index]);
  };


  const handleSelectItem = (index, item) => {
    const updatedStops = [...stops];
    console.log('item',item);
    updatedStops[index].id = item.id;
    updatedStops[index].name = item.name;
    console.log('updatedStops'+index,updatedStops[index]);
    setStops(updatedStops);
    setModalVisible(-1);
  };

  const handleTimeChange = (index, text) => {
    const updatedStops = [...stops];
    updatedStops[index].duration = text;
    setStops(updatedStops);
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
    setServerData(dataRes.data.map((item) => ({name: item.stop, id: item.id})));
  };
  
  useEffect(() => {
    getStopsData();
  }, []);

  
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      behavior="padding"
      keyboardVerticalOffset={0}
    >
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible!== -1}
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
      {/* <View style={styles.container}> */}
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
            {index===0 ? <Text style={{color:'gray'}}>Meeting Point</Text> : <Text style={{color:'gray'}}>Stop {Stop.label}</Text>}
            <TouchableOpacity onPress={() => setModalVisible(index)}>
            {Stop.name !== '' ? <Text style={styles.stopText}> {serverData[(Stop.id)-1].name} </Text>
             : <Text style={[styles.stopText,{textAlign: 'center'}]}>Select a stop</Text>}
            </TouchableOpacity>
            {index !== 0 && (<Text style={{color: 'gray'}}>Duration: </Text>)}
            {index !== 0 && (<TextInput
              style={[styles.timeInput]}
              value={Stop.duration}
              onChangeText={(text) => handleTimeChange(index, text)}
            /> )} 
            {index !== 0 && ( <Text style={{color: 'gray'}}> minutes</Text> )}
          </View>
        ))}
        </View>
      </KeyboardAwareScrollView>
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
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
    padding: 10,
    margin: 4,
    width: 150,
    backgroundColor: 'white',
    borderColor: '#bbb',
    borderWidth: 1,
    borderRadius: 5,
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
    width: 40,
    height: 40,
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