import React, { useState } from "react";
import { StyleSheet, View, StatusBar, Image, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import Footer from './components/Footer';
import FeedScreen from "./components/FeedScreen";
import HeaderMenu from "./headerMenu";
import { AuthContext, Stack } from './navigation';



const Login = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LoginScreen />
      <Footer />
    </View>
  );
}

const Register = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <RegisterScreen />
      <Footer />
    </View>
  );
}

const Feed = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FeedScreen />
      <Footer />
    </View>
  );
}

export default function App() {

  const [hasUser, setUser] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <AuthContext.Provider value={{ hasUser, setUser, isDropdownOpen, setIsDropdownOpen }}>
    <NavigationContainer>
      <Stack.Navigator
      screenOptions={
        {headerBackImage: () => <Image source={require('./assets/back.png')} style={{width: 30, height: 30, marginLeft: 15}}/>,
        headerBackTitleVisible: false,
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerRight: () => (
          <HeaderMenu hasUser={hasUser} />
        ),  
        headerStyle: {
          backgroundColor: '#f48024',
        },
      }
      }>
      {hasUser ? (
        <Stack.Screen 
        name="Feed" 
        component={Feed}
        options={{
          title: 'Pub Crawl Malaga',
        }} />
      ) : (
        <Stack.Screen 
        name="LoginScreen" 
        component={Login}
        options={{
          title: 'Pub Crawl Malaga',
        }} />
      )}
        <Stack.Screen 
        name="Register" 
        component={Register}
        options={{
          title: 'Pub Crawl Malaga',
        }} />
      </Stack.Navigator>
    </NavigationContainer>
    </AuthContext.Provider>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 70,
  },
});
