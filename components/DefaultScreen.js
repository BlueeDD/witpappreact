import React from 'react';
import { View, ImageBackground, StyleSheet, Text, StatusBar } from 'react-native';
import Footer from './Footer';

const DefaultScreen = () => {
    return (
    <View style={styles.container}>
        <StatusBar barStyle="light-content" />
            <View style={styles.textContainer}>
                <View style={styles.innerContainer}>
                    <Text style={styles.text}>There is no Pubcrawl planned today</Text>
                </View>
            </View>
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
  });
  
  export default DefaultScreen;
  