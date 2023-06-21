import React, { useContext } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../navigation';

const MenuList = () => {

  const { setHasUser } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleLogout = () => {
    setHasUser(false);
    };

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
      style={styles.item}
      onPress={handleProfilePress}>
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
    top: 45, 
    right: 5, 
    padding: 10,
    zIndex: 1,
  },
  item: {
    marginBottom: 10,
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
