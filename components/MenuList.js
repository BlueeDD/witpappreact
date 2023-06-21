import React, { useContext } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthContext } from '../navigation';

const MenuList = () => {

  const { setUser } = useContext(AuthContext);

  const handleLogout = () => {
    setUser(false);
    };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.item}>
        <View style={styles.imageContainer}>
          <Image 
            source={require('../assets/settings.png')} 
            style={styles.image} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.item}
        onPress={handleLogout}>
        <View style={styles.imageContainer}>
          <Image 
            source={require('../assets/logout.png')} 
            style={styles.image} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 37, 
    right: 5, 
    padding: 10,
    zIndex: 1,
  },
  item: {
    marginBottom: 5,
    textAlign: 'center',
    backgroundColor: '#f48024',
    borderRadius: 50,
    padding: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 20,
    height: 20,
  },
});

export default MenuList;
