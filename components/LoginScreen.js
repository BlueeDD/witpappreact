import React, { useContext } from "react";
import { View, TextInput, Image, StyleSheet, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../navigation';

const LoginForm = () => {
    const navigation = useNavigation();
    const { setHasUser, setUser } = useContext(AuthContext);

    const handleRegisterPress = () => {
        navigation.navigate('Register');
    };

    // on login, set hasUser to true
    const handleLoginPress = async () => {
        const response = await fetch('https://whereisthepubcrawl.com/API/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ // pass the email and password from form to the API
                email: email, // 'superadmin@gmail.com'
                password: password, // '12345678'
            }),
        });
        const dataRes = await response.json();
        //console.log(dataRes);
        if (dataRes.code == 0) { // if no error (user found)
            //console.log(dataRes.data);
            setHasUser(true);
            setUser({
                id: dataRes.data.id,
                email: dataRes.data.email,
                name: dataRes.data.name,
                role: dataRes.data.role,
                agentCityId: dataRes.data.agentCityId,
            });
        } else {
            setHasUser(false);
        }
    };

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

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
                    onChangeText={text => setEmail(text)}
                    value={email}
                />
                <TextInput style={styles.textInput}
                    placeholder="Password"
                    placeholderTextColor={"white"}
                    onChangeText={text => setPassword(text)}
                    value={password}
                    secureTextEntry={true}
                />
                <TouchableOpacity
                    style={styles.button}
                    /* on button press, check the credentials */
                    onPress={handleLoginPress}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ width: 200 }}
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
    }
}
);

export default LoginForm;