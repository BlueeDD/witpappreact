import React from "react";
import { StyleSheet, View, Text } from 'react-native';

const Footer = () => {
    return (
      <View style={styles.footer}>
        <Text style={{color:"white"}}>© 2023 WhereIsThePubCrawl. All rights reserved.</Text>
      </View>
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
    }
);

export default Footer;
  