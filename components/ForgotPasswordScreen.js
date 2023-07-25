import React, { useState } from "react";
import { View, TextInput, Image, StyleSheet, Text, TouchableOpacity, KeyboardAvoidingView } from "react-native";

import { useNavigation } from '@react-navigation/native';

const ForgotPasswordForm = () => {
    const navigation = useNavigation();
    const [email, setEmail] = React.useState("");
    const [isValid, setIsValid] = useState(true);

    const handleEmailChange = (email) => {
        setEmail(email);
        const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        setIsValid(emailPattern.test(email));
        if (email == "") {
            setIsValid(true);
        }
    };

    const handleLoginPress = () => {
        navigation.navigate('Login');
    };

    const handleForgotPasswordPress = async () => {
        if (!isValid) {
            alert("Please enter a valid email address.");
        } else {
            if (email !== "") {
                // API that sends an email to the user with a link to reset his password (must use the WEB site to reset it)
                const response = await fetch('http://192.168.0.19/witp/API/changePassword.php', { // 'https://whereisthepubcrawl.com/API/changePassword.php'
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ // pass the email and password from form to the API
                        email: email,
                    }),
                });
                const dataRes = await response.json();
                if (dataRes.code == 0) { // if no error (user found)
                    alert("An email has been sent to you with a link to reset your password. Please check your inbox and change your password on the website.");
                } else {
                    alert(dataRes.message);
                }
            } else {
                alert("Please fill in all fields");
            }
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={"padding"}
            keyboardVerticalOffset={0}>
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
                <TouchableOpacity
                    style={[styles.button, { marginBottom: 30 }]}
                    onPress={handleForgotPasswordPress}>
                    <Text style={styles.buttonText}>Send reset link</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ width: 200 }}
                    onPress={handleLoginPress} >
                    <Text
                        underlineColor="#f48024"
                        style={[styles.registerText,{marginTop: -30}]}>You finally remember your password ?
                        <Text style={styles.underline}> Login here</Text>
                    </Text>
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
    registerText: {
        color: "#f48024",
        fontWeight: "bold",
        textAlign: "center",
        paddingVertical: 15,
        fontSize: 12,
    },
    underline: {
        textDecorationLine: 'underline',
    },
    view: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        color: "red",
        marginBottom: 15,
        marginTop: -25,
        fontSize: 12,
    }
}
);

export default ForgotPasswordForm;