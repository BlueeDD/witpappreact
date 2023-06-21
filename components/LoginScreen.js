import React, { useContext, useState } from "react";
import { View, TextInput, Image, StyleSheet, Text, TouchableOpacity, KeyboardAvoidingView, Platform} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../navigation';


const LoginForm = () => {
    const navigation = useNavigation();
    const { setUser } = useContext(AuthContext);
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [isValid, setIsValid] = useState(true);

    const handleEmailChange = (email) => {
        setEmail(email);
        const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        setIsValid(emailPattern.test(email));
    };

    const handleRegisterPress = () => {
        navigation.navigate('Register');
    };

    // on login, set hasUser to true if email and password are not empty and correct format
    const handleLoginPress = () => {
        if (!isValid) {
            alert("Please enter a valid email address.");
        }
        else {
            if (email !== "" && password !== "") {
                setUser(true);
            } else {
                alert("Please fill in all fields");
            }
        }
      };

    return (
        <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 100}>
            <View style={styles.view}>
                <Image style={{ alignSelf: "center", marginBottom: 20 }}
                source={require('../assets/logo.webp')} />
                {/* email input is required and should fit email format */}
                <TextInput style={styles.textInput}
                    placeholder="Email"
                    placeholderTextColor={"white"}
                    onChangeText={text => handleEmailChange(text)}
                    value={email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    required={true}
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
                />
                <TouchableOpacity 
                style={styles.button}
                /* on login, set hasUser to true */
                onPress={handleLoginPress}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={{width: 200}} 
                onPress={handleRegisterPress} >
                    <Text 
                    underlineColor="#f48024"
                    style={styles.registerText}>You don't have an account? 
                    <Text style={styles.underline}> Register here.</Text>
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


export default LoginForm;