import React, {useEffect,useContext,useState} from 'react';
import { View, StyleSheet, Text, StatusBar } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Footer from './Footer';
import * as Location from 'expo-location';
import { AuthContext } from '../navigation';


const DefaultScreen = () => {
   
  const {isLocationEnabled, setIsLocationEnabled, hasPubcrawl, setHasPubcrawl} = useContext(AuthContext);
  const [isVisible, setIsVisible] = useState(false);
  
  // Show the text after 500ms (avoid seeing it if you don't stay on the screen for long)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    
    // Cleanup the timer when the component unmounts or the state changes
    return () => clearTimeout(timer);
  }, []);

  // check location permission
  const checkLocationPermission = async () => {
    try {
      // Check foreground location permission
      const foregroundPermission = await Location.requestForegroundPermissionsAsync();
      if (foregroundPermission.status === 'granted') {
        try {
            // Check background location permission
          const backgroundPermission = await Location.requestBackgroundPermissionsAsync();
          if (backgroundPermission.status === 'granted') {
            console.log('Background location permission is granted');
            if (!isLocationEnabled) {
              setIsLocationEnabled(true);
            }
          } else {
            if (isLocationEnabled) {
              setIsLocationEnabled(false);
            }
          }

        } catch (error) {
          console.log('Error checking location permission:', error);
        }
      } else {
        console.log('Foreground location permission is denied');
        if (isLocationEnabled) {
          setIsLocationEnabled(false);
        }
      }
    } catch (error) {
      console.log('Error checking location permission:', error);
    }
  };
    
    //check location with a timer of 5 seconds
    const checkLocation = () => {
      if (!isLocationEnabled) {
      setTimeout(() => {
        checkLocationPermission();
        checkLocation(); // Call checkLocation recursively
      }, 5000);
      }
    };


    //check pubcrawl and location
    useEffect(() => {
      getPubcrawlData();
      checkLocation();
    }, []);
    
    //get pubcrawl data
    const getPubcrawlData = async () => {
      try {
        const response = await fetch('https://whereisthepubcrawl.com/API/getStopsTodayByCityId.php', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            city_id: 1,
          }),
        });
        const dataRes = await response.json();
        if (dataRes.code === 0 || dataRes.code === 6) {
          setHasPubcrawl(true);
        }
      } catch (error) {
        console.log('Error fetching data from API', error);
      }
    };
      

    return (
    <View style={styles.container}>
        <StatusBar barStyle="light-content" />
            {!isLocationEnabled && (
            <View style={styles.banner}>
              <MaterialCommunityIcons name="crosshairs-gps" size={20} color={"white"} marginRight={10}/>
              <Text style={{ color: 'white'}}>
                The access to your location should be "Always" to use the app
              </Text>
            </View>
            )}
            {!hasPubcrawl && isVisible && (
            <View style={styles.textContainer}>
                <View style={styles.innerContainer}>
                    <Text style={styles.text}>There is no Pubcrawl planned today</Text>
                </View>
            </View>
            )}
        <Footer />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1, // Set flex to 1 to take up all available space
      backgroundColor: 'white',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 70,
      },
      innerContainer: {
        backgroundColor: '#f48024',
        opacity: 0.9,
        borderColor: 'black',
        borderRadius: 20,
        padding: 10,
      },
      text: {
        color: 'black',
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
      },
      banner: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
        padding: 8,
      },
      underlined: {
        textDecorationLine: 'underline',
        color: 'white',
      },
  });
  
  export default DefaultScreen;
  