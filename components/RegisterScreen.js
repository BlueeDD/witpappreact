import React, { useState } from "react";
import { View, Text } from 'react-native';
import { TextInput, Image, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";

const RegisterScreen = () => {

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [isValid, setIsValid] = useState(true);


    const handleEmailChange = (email) => {
        setEmail(email);
        const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        setIsValid(emailPattern.test(email));
    };

    const handleCreateAccountPress = () => {
        if (email !== "" && password !== "" && confirmPassword !== "") {
            if (!isValid) {
                alert("Email address is not valid");
            } else if (password !== confirmPassword) {
                alert("Passwords do not match");
            } else {
                // do nothing at this time : see what we want exactly
                alert("Account Created");
            }
        } else { // minimum one of the field is empty
            alert("Please fill in all fields");
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 100}>
            <View style={styles.view}>
                <Image style={{ alignSelf: "center", marginBottom: 20 }}
                    source={require('../assets/logo.webp')} />
                <TextInput style={styles.textInput}
                    placeholder="Email"
                    placeholderTextColor={"white"}
                    onChangeText={text => handleEmailChange(text)}
                    value={email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    required={true}
                    selectionColor={"grey"}
                />
                {!isValid && (
                    <Text style={styles.errorText}>Please enter a valid email address.</Text>
                )}
                <TextInput style={styles.textInput}
                    placeholder="Password"
                    placeholderTextColor={"white"}
                    onChangeText={text => setPassword(text)}
                    value={password}
                    secureTextEntry={true}
                    selectionColor={"grey"}
                />
                <TextInput style={styles.textInput}
                    placeholder="Confirm Password"
                    placeholderTextColor={"white"}
                    onChangeText={text => setConfirmPassword(text)}
                    value={confirmPassword}
                    secureTextEntry={true}
                    selectionColor={"grey"}
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleCreateAccountPress}>
                    <Text style={styles.buttonText}>Create account</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    textInput: {
        height: 60,
        width: 300,
        borderRadius: 30,
        borderWidth: 1,
        backgroundColor: "#f48024",
        color: "black",
        paddingLeft: 30,
        marginBottom: 25,
    },
    button: {
        width: 180,
        backgroundColor: "#f48024",
        marginTop: 15,
        borderWidth: 1,
        borderRadius: 30,
        alignSelf: "center",
        shadowColor: "grey",
        shadowOpacity: 0.8,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    buttonText: {
        fontSize: 20,
        color: "black",
        alignSelf: "center",
        padding: 10,
        fontWeight: "bold",
    },
    view: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
    },
    errorText: {
        color: "red",
        marginBottom: 15,
        marginTop: -25,
        fontSize: 12,
    },
});


export default RegisterScreen;
