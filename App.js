import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, StatusBar, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import ForgotPasswordScreen from "./components/ForgotPasswordScreen";
import Footer from './components/Footer';
import FeedScreen from "./components/FeedScreen";
import DefaultScreen from "./components/DefaultScreen";
import HeaderMenu from "./headerMenu";
import ProfileScreen from "./components/ProfileScreen";
import AuthProvider, { AuthContext, Stack } from './navigation';

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

const ForgotPassword = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ForgotPasswordScreen />
      <Footer />
    </View>
  );
}

const Feed = () => {
  return (
    <FeedScreen />
  );
}

const Default = () => {
  return (
    <DefaultScreen />
  );
}

const Profile = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ProfileScreen />
      <Footer />
    </View>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AuthContext.Consumer>
          {(authContext) => (
            <Stack.Navigator
              screenOptions={{
                headerBackImage: () => (
                  <Image
                    source={require("./assets/back.png")}
                    style={{ width: 30, height: 30, marginLeft: 15 }}
                  />
                ),
                headerBackTitleVisible: false,
                headerTintColor: "white",
                headerTitleStyle: {
                  fontWeight: "bold",
                },
                headerRight: () => (
                  <HeaderMenu hasUser={authContext.hasUser} />
                ),
                headerStyle: {
                  backgroundColor: "#f48024",
                },
              }}
            >
              {authContext.hasUser ? (
                // If the user is logged in, show the Feed screen if there is a pubcrawl ongoing or planned today and the location is enabled
                (authContext.hasPubcrawl && authContext.isLocationEnabled) ? (
                <Stack.Screen
                  name="Feed"
                  component={Feed}
                  options={{
                    title: "Pub Crawl Malaga",
                  }}
                />
                ) : (
                  // If the user is logged in, show the Default screen if there is no pubcrawl ongoing or planned today or the location is disabled
                  <Stack.Screen
                    name="Default"
                    component={Default}
                    options={{
                      title: "Pub Crawl Malaga",
                    }}
                  />
                )
              ) : (
                <Stack.Screen
                  name="Login"
                  component={Login}
                  options={{
                    title: "Pub Crawl Malaga",
                  }}
                />
              )}
              <Stack.Screen
                name="Register"
                component={Register}
                options={{
                  title: "Pub Crawl Malaga",
                }}
              />
              <Stack.Screen
                name="Profile"
                component={Profile}
                options={{
                  title: "Pub Crawl Malaga",
                }}
              />
              <Stack.Screen
                name="ForgotPassword"
                component={ForgotPassword}
                options={{
                  title: "Pub Crawl Malaga",
                }}
              />
            </Stack.Navigator>
          )}
        </AuthContext.Consumer>
      </NavigationContainer>
    </AuthProvider>
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
