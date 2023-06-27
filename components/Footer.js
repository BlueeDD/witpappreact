import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import NetInfo from "@react-native-community/netinfo";
import { AuthContext } from '../navigation';

const Footer = () => {
  const [isOffline, setIsOffline] = useState(false); // to prevent multiple alerts
  const { isConnected, setIsConnected } = useContext(AuthContext);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
      if (isOffline) {
        if (isConnected) { // if the context variable is not yet sets
          alert("You have lost internet connection. Please reconnect to continue.");
          setIsConnected(false);
        }
      } else {
        setIsConnected(state.isConnected);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isOffline, isConnected]);

  return (
    <>
      <View style={styles.bannerContainer}>
        {isOffline && (
          <>
            <View style={styles.banner}>
              <MaterialCommunityIcons name="wifi-off" size={24} color={"white"} />
              <Text style={styles.bannerText}>No Internet Connection (test)</Text>
            </View>
          </>
        )}
      </View>
      <View style={styles.footer}>
        <Text style={{ color: "white" }}>© 2023 WhereIsThePubCrawl. All rights reserved.</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    height: 70,
    width: "100%",
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  bannerContainer: {
    position: 'absolute',
    bottom: 70,
    width: '100%',
  },
  banner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    padding: 8,
  },
  bannerText: {
    marginLeft: 8,
    color: 'white',
  },
}
);

export default Footer;
