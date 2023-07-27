import React, { useContext } from "react";
import { View, Text } from "react-native";
import { AuthContext } from '../navigation';
import { TextInput } from "react-native-gesture-handler";

const ProfileScreen = () => {

    const { user } = useContext(AuthContext);


    return (
        <View style={styles.view}>
        <Text style={styles.title}>Profile Information</Text>
        {/* little text title at the left top of the name input */}
        <Text style={styles.fieldTitle}>Name</Text>
        <TextInput
            style={styles.input}
            value={user.name}
            editable={false}
        />
        <Text style={styles.fieldTitle}>Email</Text>
        <TextInput
            style={styles.input}
            value={user.email}
            editable={false}
        />
        <Text style={styles.fieldTitle}>Role</Text>
        <TextInput
            style={styles.input}
            value={user.role}
            editable={false}
        />
        </View>
    );
    }

const styles = {
    title: {
        fontSize: 32,
        marginBottom: 16,
      },
      view: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
        input: {
            height: 40,
            margin: 12,
            borderWidth: 1,
            padding: 10,
            width: 300,
            borderRadius: 10,
            borderColor: "#f48024",
        },
        fieldTitle: {
            fontSize: 12,
            color: "grey",
            textAlign: "left",
            width: 300,
            marginLeft: 22,
            marginBottom: -10,
            marginTop: 10,
        },
};

export default ProfileScreen;