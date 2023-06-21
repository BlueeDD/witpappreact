import React, { useContext } from 'react';
import { TouchableOpacity, Image, View, StyleSheet } from 'react-native';
import MenuList from './components/MenuList';
import { AuthContext } from './navigation';


const HeaderMenu = () => {

    const { hasUser } = useContext(AuthContext);
    const { isDropdownOpen, setIsDropdownOpen } = useContext(AuthContext);

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    if(hasUser) {
      if(!isDropdownOpen) {
        return (
            <View style={styles.view}>
                <TouchableOpacity onPress={handleDropdownToggle} style={styles.imageContainer}>
                    <Image
                    source={require('./assets/profile.png')}
                    style={styles.image}
                    />
                </TouchableOpacity>
            </View>
          );
      } else { // dropdown is already opened
        return (
          <View style={styles.view}>
            <TouchableOpacity onPress={handleDropdownToggle} style={styles.imageContainer}>
                <Image
                source={require('./assets/profile.png')}
                style={styles.image}
                />
            </TouchableOpacity>
            <MenuList />
          </View>
      );
      }
    }
    return null;
  }
  
  const styles = StyleSheet.create({
    imageContainer: {
      position: 'absolute',
      top: 7, 
      right: 10,
      zIndex: 1, 
    },
    image: {
      width: 30,
      height: 30,
      backgroundColor: '#f48024',
      borderRadius: 30,
      borderColor: 'white',
        borderWidth: 1,
      paddingTop: 5,
      marginRight: 10
    },
    view: {
      marginTop: -20,
      marginBottom: 25
    }
        
})
  ;



export default HeaderMenu;