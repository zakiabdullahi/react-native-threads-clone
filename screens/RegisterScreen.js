import { StyleSheet, Text, View, SafeAreaView, Image, KeyboardAvoidingView, TextInput, Pressable, Alert } from 'react-native'
import React, { useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'

const RegisterScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const navigation = useNavigation()

    const handleRegister = () => {
        const user = {
            name: name,
            email: email,
            password: password
        }

        axios.post("http://10.0.2.2:3000/register", user)
            .then((response) => {
                console.log(response);
                Alert.alert(
                    "Registration successful",
                    "you have been registered successfully"
                );
                setName("");
                setEmail("");
                setPassword("");
            })
            .catch((error) => {
                Alert.alert(
                    "Registration failed",
                    "An error occurred during registration"
                );
                console.log("error", error);

            });


    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', }}>
            <View style={{ marginTop: 50 }}>
                <Image
                    style={{ width: 150, height: 100, resizeMode: "contain" }}
                    source={{
                        uri: "https://freelogopng.com/images/all_img/1688663386threads-logo-transparent.png",
                    }}
                />
            </View>
            <KeyboardAvoidingView>
                <View style={{ alignContent: "center", justifyContent: "center", }}>
                    <Text style={{ fontSize: 17, fontWeight: "bold", marginTop: 25 }}>Register To your Account</Text>
                </View>
            </KeyboardAvoidingView>


            <View style={{ marginTop: 30 }}>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, borderColor: '#D8D8D8', borderWidth: 1, paddingVertical: 5, borderRadius: 10 }}>

                    <Ionicons style={{ marginLeft: 5, color: 'gray' }} name="person" size={24} color="black" />
                    <TextInput
                        value={name}
                        onChangeText={(text) => setName(text)}
                        style={{
                            color: 'gray', marginVertical: 5, width: 300,
                            fontSize: password ? 16 : 16,

                        }}
                        placeholder='Name' />
                </View>
            </View>

            <View style={{ marginTop: 30 }}>



                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, borderColor: '#D8D8D8', borderWidth: 1, paddingVertical: 5, borderRadius: 10 }}>
                    <MaterialIcons style={{ marginLeft: 10, color: "gray" }} name="email" size={24} color="black" />
                    <TextInput

                        value={email}
                        onChangeText={(text) => setEmail(text)}
                        style={{ color: 'gray', marginVertical: 5, width: 300, }}
                        placeholder='enter your Email' />
                </View>
            </View>
            <View style={{ marginTop: 30 }}>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, borderColor: '#D8D8D8', borderWidth: 1, paddingVertical: 5, borderRadius: 10 }}>
                    <AntDesign style={{ marginLeft: 10, color: "gray" }} name="lock" size={24} color="black" />
                    <TextInput
                        secureTextEntry={true}
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                        style={{
                            color: 'gray', marginVertical: 5, width: 300,
                            fontSize: password ? 16 : 16,

                        }}
                        placeholder='enter your Password' />
                </View>


            </View>

            <Pressable
                onPress={handleRegister}
                style={{
                    width: 200,
                    backgroundColor: "black",
                    padding: 15,
                    marginTop: 40,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    borderRadius: 6,
                    cursor: 'pointer'

                }}

            >
                <Text style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: 16,
                    color: "white",
                }}>Register</Text>

            </Pressable>

            <Pressable
                onPress={() => navigation.navigate("Login")}
                style={{ marginTop: 10 }}
            >
                <Text style={{ textAlign: "center", fontSize: 16 }}>

                    Already have an account? Sign In
                </Text>
            </Pressable>


        </SafeAreaView>
    )
}

export default RegisterScreen

const styles = StyleSheet.create({})