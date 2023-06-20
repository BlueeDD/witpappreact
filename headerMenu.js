import React, { useContext } from 'react';
import { TouchableOpacity, Image, View } from 'react-native';
import MenuList from './components/MenuList';
import { AuthContext } from './navigation';

const HeaderMenu = ({ hasUser }) => {

    const { isDropdownOpen, setIsDropdownOpen } = useContext(AuthContext);

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    if(hasUser) {
      if(!isDropdownOpen) {
        return (
          <TouchableOpacity onPress={handleDropdownToggle}>
            <Image
              source={require('./assets/profile.png')}
              style={{ width: 30, height: 30, marginRight: 15, marginBottom: 5 }}
            />
          </TouchableOpacity>
          );
      } else { // dropdown is already opened
        return (
          <View>
            <TouchableOpacity onPress={handleDropdownToggle}>
                <Image
                source={require('./assets/profile.png')}
                style={{ width: 30, height: 30, marginRight: 15, marginTop: 45 }}
                />
            </TouchableOpacity>
            <MenuList />
          </View>
      );
      }
    }
    return null;
  };

export default HeaderMenu;