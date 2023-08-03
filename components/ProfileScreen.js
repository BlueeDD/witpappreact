import React, { useContext, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import { AuthContext } from '../navigation';
import { TextInput } from "react-native-gesture-handler";

const ProfileScreen = () => {
    const { user } = useContext(AuthContext);
    const [isValid, setIsValid] = useState(true);

    const [initialFormValues, setInitialFormValues] = useState({
        name: user.name,
        email: user.email,
    });
    const [formData, setFormData] = useState(initialFormValues);
    const [formChanged, setFormChanged] = useState(false);

    useEffect(() => {
        const isFormChanged = Object.keys(formData).some(key => formData[key] !== initialFormValues[key]);
        setFormChanged(isFormChanged);
    }, [formData]);

    const handleInputChange = (name, value) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
        if (name == "email") {
            const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
            setIsValid(emailPattern.test(value)); // we test the given email string
        }
        setFormChanged(true);
    };

    const handleSavePress = async () => {
        if (!isValid) {
            alert("Please enter a valid email address.");
        } else {
            if (user.id !== undefined && formData.email !== "" && formData.name !== "") {
                const response = await fetch('https://whereisthepubcrawl.com/API/updateProfile.php', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ // pass the email and password from form to the API
                        id: user.id,
                        email: formData.email,
                        name: formData.name,
                    }),
                });
                const dataRes = await response.json();
                if (dataRes.code == 0) { // if no error (user found)
                    // set the new formData values
                    setInitialFormValues(formData);
                    setFormChanged(false);
                }
                alert(dataRes.message); // display the message from the API
            } else {
                alert("Please fill in all fields");
            }
        }
    };

    return (
        <View style={styles.view}>
            <Text style={styles.title}>Profile Information</Text>
            {/* little text title at the left top of the name input */}
            <Text style={styles.fieldTitle}>Name</Text>
            <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={value => handleInputChange('name', value)}
            />
            <Text style={styles.fieldTitle}>Email</Text>
            <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={value => handleInputChange('email', value)}
            />
            <Text style={styles.fieldTitle}>Role (cannot be changed)</Text>
            <TextInput
                style={styles.input}
                value={user.role}
                editable={false}
            />
            <View style={{ justifyContent: "center", alignItems: "center", width: 300, marginTop: 30, marginBottom: 20 }}>
                <Text>If you want to change your password, please log in to
                    <Text onPress={() => Linking.openURL('https://whereisthepubcrawl.com')} style={{ color: "#f48024" }}> https://whereisthepubcrawl.com </Text>
                    and go to profile page to do it.</Text>
            </View>
            <TouchableOpacity
                style={[styles.button, { marginBottom: 15, marginTop: 30 }]}
                disabled={!formChanged}
                onPress={handleSavePress}>
                <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
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