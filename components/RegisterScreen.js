import React, { useEffect, useState } from "react";
import { View, Text } from 'react-native';
import { TextInput, Image, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";

const RegisterScreen = () => {

    const [email, setEmail] = React.useState("");
    const [name, setName] = React.useState("");
    const [cities, setCities] = React.useState([]);
    const [city_id, setCity_id] = React.useState("");
    const [isValid, setIsValid] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);

    const getCitiesData = async () => {

        const response = await fetch('http://192.168.0.70/witp/API/getCities.php', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
        });
        const dataRes = await response.json();
        if (dataRes.code == 0) {
            setCities(dataRes.data);
        } else {
            alert("We encountered a problem to get the cities data. Please try again later.");
        }
    };

    const handleItemPress = (item) => {
        setSelectedItem(item);
        setCity_id(item.id);
    };

    const handleEmailChange = (email) => {
        setEmail(email);
        const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        setIsValid(emailPattern.test(email));
    };

    const handleCreateAccountPress = async () => {
        if (!isValid) {
            alert("Please enter a valid email address.");
        } else {
            if (email !== "" && name !== "") {
                const response = await fetch('http://192.168.0.70/witp/API/register.php', { // 'https://whereisthepubcrawl.com/API/login.php'
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ // pass the email, name and city_id to the API
                        name: name,
                        email: email,
                        city_id: city_id,

                    }),
                });
                const dataRes = await response.json();
                if (dataRes.code == 0) { // if no error (user found)
                    alert("A request has been sent to the administrator. You will receive an email when your account is created.");
            } else if (dataRes.code !== 0) { 
                alert(dataRes.message);
            } else {
                alert("Please fill in all fields");
            }
        }
    
    }};

    useEffect(() => {
        getCitiesData();
    }, []);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 100}>
            <View style={styles.view}>
                <Image style={{ alignSelf: "center", marginBottom: 20 }}
                    source={require('../assets/logo.webp')} />
                <TextInput style={styles.textInput}
                    placeholder="Name"
                    placeholderTextColor={"white"}
                    onChangeText={text => setName(text)}
                    value={name}
                    selectionColor={"grey"}
                />
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
                <Text style={[styles.text, {}]}>Select your city :</Text>
                {cities.map((city) => (
                    <TouchableOpacity
                        key={city.id}
                        style={[
                            styles.item,
                            selectedItem === city && styles.selectedItem,
                        ]}
                        onPress={() => handleItemPress(city)}
                    >
                        <Text
                            style={[
                                styles.itemText,
                                selectedItem === city && styles.selectedItemText,
                            ]}
                        >
                            {city.name}
                        </Text>
                    </TouchableOpacity>
                ))}
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
        marginTop: 20,
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
    item: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    itemText: {
        fontSize: 16,
    },
    selectedItem: {
        backgroundColor: '#f48024',
    },
    selectedItemText: {
        color: 'white',
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});


export default RegisterScreen;
