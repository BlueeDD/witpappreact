import React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';

const MenuList = () => {
    // return 3 menu items, profile, settings, logout
    return (
        <View>
            <Text>Profile</Text>
            <TouchableOpacity>
            <Image  source={require('../assets/settings.png')}
            style={{ width: 30, height: 30, marginRight: 15, marginBottom: 5 }}
             />
            </TouchableOpacity>
            <Text>Logout</Text>
        </View>
    );
}

export default MenuList;

