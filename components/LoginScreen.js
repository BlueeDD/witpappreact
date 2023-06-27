import React, { useContext, useState } from "react";
import { View, TextInput, Image, StyleSheet, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";

import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../navigation';

const LoginForm = () => {
    const navigation = useNavigation();
    const { user, setHasUser, setUser } = useContext(AuthContext);
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [isValid, setIsValid] = useState(true);

    const handleEmailChange = (email) => {
        setEmail(email);
        const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        setIsValid(emailPattern.test(email));
        if (email == "") {
            setIsValid(true);
        }
    };

    const handleRegisterPress = () => {
        navigation.navigate('Register');
    };

    const handleForgotPasswordPress = () => {
        navigation.navigate('ForgotPassword');
    };

    const handleLoginPress = async () => {
        if (!isValid) {
            alert("Please enter a valid email address.");
        } else {
            if (email !== "" && password !== "") {
                const response = await fetch('http://192.168.1.14/witp/API/login.php', { // 'https://whereisthepubcrawl.com/API/login.php'
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ // pass the email and password from form to the API
                        email: email,
                        password: password,
                    }),
                });
                const dataRes = await response.json();
                if (dataRes.code == 0) { // if no error (user found)
                    setHasUser(true);
                    setUser({
                        id: dataRes.data.id,
                        email: dataRes.data.email,
                        name: dataRes.data.name,
                        role: dataRes.data.role,
                        agentCityId: dataRes.data.agent_city_id,
                    });
                } else {
                    alert(dataRes.message);
                    setHasUser(false);
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
                <TextInput style={styles.textInput}
                    placeholder="Password"
                    placeholderTextColor={"white"}
                    onChangeText={text => setPassword(text)}
                    value={password}
                    secureTextEntry={true}
                    selectionColor={"grey"}
                />
                <View style={{ width: 200 }}>
                    <Text
                        underlineColor="#f48024"
                        style={styles.registerText}>Have forgotten your password ?
                        <TouchableOpacity
                            onPress={handleForgotPasswordPress} >
                            <Text style={[styles.registerText, styles.underline]}>
                                Reset it here
                            </Text>
                        </TouchableOpacity>
                    </Text>
                </View>
                <TouchableOpacity
                    style={[styles.button, { marginBottom: 30 }]}
                    onPress={handleLoginPress}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <View style={{ width: 200 }}>
                    <Text
                        underlineColor="#f48024"
                        style={styles.registerText}>You don't have an account ?
                        <TouchableOpacity onPress={handleRegisterPress} >
                            <Text style={[styles.registerText, styles.underline]}>
                                Register here
                            </Text>
                        </TouchableOpacity>
                    </Text>
                </View>
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

export default LoginForm;