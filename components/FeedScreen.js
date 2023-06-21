import React, { useContext } from "react";
import { View, Text } from "react-native";
import { AuthContext } from '../navigation';

const FeedScreen = () => {
  const { user, setHasUser, setUser } = useContext(AuthContext);

  return (
    <View style={styles.view}>
      <Text style={styles.title}>Feed</Text>
      {/* {user} && <Text>{user.name}</Text> */}
    </View>
  );
}

const styles = {
  button: {
    width: 180,
    backgroundColor: "#f48024",
    marginTop: 15,
    borderWidth: 1,
    borderRadius: 30,
    shadowColor: "grey",
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,

  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 15,
    fontSize: 18,
  },
  title: {
    fontSize: 32,
    marginBottom: 16,
  },
  view: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  }
};

export default FeedScreen;
