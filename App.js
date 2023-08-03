import React, { useEffect } from "react";
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
import * as Notifications from 'expo-notifications';


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
  useEffect(() => {
    registerForPushNotifications();

    // Handle incoming push notifications
    Notifications.addNotificationReceivedListener(handleNotification);

    return () => {
      Notifications.removeNotificationReceivedListener(handleNotification);
    };
  }, []);

  const registerForPushNotifications = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== 'granted') {
        return;
      }
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    // Store the token in your backend for sending push notifications
    console.log('Expo Push Token:', token);
  };

  const handleNotification = (notification) => {
    // Handle the received push notification
    console.log('Received push notification:', notification);
  };

  return (
    <AuthProvider>
      <NavigationContainer>
        <AuthContext.Consumer>
          {(authContext) =>
            authContext.hasUser ? (
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
                {authContext.hasPubcrawl && authContext.isLocationEnabled ? (
                  <Stack.Screen
                    name="Feed"
                    component={Feed}
                    options={{
                      title: "Pub Crawl " + authContext.cityName,
                    }}
                  />
                ) : (
                  <Stack.Screen
                    name="Default"
                    component={Default}
                    options={{
                      title: "Pub Crawl " + authContext.cityName,
                    }}
                  />
                )}
                <Stack.Screen
                  name="Profile"
                  component={Profile}
                  options={{
                    title: "Pub Crawl " + authContext.cityName,
                  }}
                />
              </Stack.Navigator>
            ) : (
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
                <Stack.Screen
                  name="Login"
                  component={Login}
                  options={{
                    title: "Pub Crawl " + authContext.cityName,
                  }}
                />
                <Stack.Screen
                  name="Register"
                  component={Register}
                  options={{
                    title: "Pub Crawl " + authContext.cityName,
                  }}
                />
                <Stack.Screen
                  name="ForgotPassword"
                  component={ForgotPassword}
                  options={{
                    title: "Pub Crawl " + authContext.cityName,
                  }}
                />
              </Stack.Navigator>
            )
          }
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
