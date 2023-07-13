import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

const Popup = ({ isOpen, onClose, onButtonOneClick, onButtonTwoClick }) => {
  if (!isOpen) {
    return null;
  }

  const handleButtonOneClick = () => {
    onButtonOneClick();
    onClose();
  };

  const handleButtonTwoClick = () => {
    onButtonTwoClick();
    onClose();
  };

  return (
    <Modal visible={isOpen} animationType="slide" transparent>
      <View style={styles.popup}>
        <View style={styles.popupContent}>
          <Text style={styles.popupTitle}>You're arrived at the next stop</Text>
          <Text>Do you want to update the status of the pubcrawl ?</Text>
          <View style={styles.popupButtons}>
            <TouchableOpacity onPress={handleButtonOneClick} style={styles.button}>
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleButtonTwoClick} style={styles.button}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  popup: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popupContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '80%',
  },
  popupTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  popupButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#4287f5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 20,
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    color: '#666',
    fontSize: 16,
  },
});

export default Popup;
