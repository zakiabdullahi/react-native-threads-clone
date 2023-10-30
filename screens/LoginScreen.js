import { StyleSheet, Text, SafeAreaView, View, Image, KeyboardAvoidingView, TextInput, Pressable, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigation = useNavigation()

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const token = await AsyncStorage.getItem("authToken");

                if (token) {
                    setTimeout(() => {
                        navigation.replace("Main");
                    }, 400);
                }
            } catch (error) {
                console.log("error", error);
            }
        };

        checkLoginStatus();
    }, []);
    const handleLogin = () => {

        const user = {
            email: email,
            password: password
        }

        axios.post("http://10.0.2.2:3000/login", user)

            .then((response) => {
                console.log(response)
                const token = response.data.token
                AsyncStorage.setItem("authToken", token)
                navigation.navigate('Main')


            })
            .catch((error) => {
                Alert.alert("Login error");
                console.log("error ", error);
            })
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
                    <Text style={{ fontSize: 17, fontWeight: "bold", marginTop: 25 }}>Login To your Account</Text>
                </View>
            </KeyboardAvoidingView>

            <View style={{ marginTop: 50 }}>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, borderColor: '#D8D8D8', borderWidth: 1, paddingVertical: 5, borderRadius: 10 }}>
                    <MaterialIcons style={{ marginLeft: 10 }} name="email" size={24} color="black" />
                    <TextInput
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                        style={{ color: 'gray', marginVertical: 5, width: 300, }}
                        placeholder='enter your Email' />
                </View>
            </View>
            <View style={{ marginTop: 30 }}>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, borderColor: '#D8D8D8', borderWidth: 1, paddingVertical: 5, borderRadius: 10 }}>
                    <AntDesign style={{ marginLeft: 10 }} name="lock" size={24} color="black" />
                    <TextInput
                        value={password}
                        secureTextEntry={true}
                        onChangeText={(text) => setPassword(text)}
                        style={{
                            color: 'gray', marginVertical: 5, width: 300,
                            fontSize: password ? 16 : 16,

                        }}
                        placeholder='enter your Password' />
                </View>

                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: 12,
                    }}
                >
                    <Text>Keep me logged in</Text>
                    <Text style={{ fontWeight: "500", color: "#007FFF" }}>
                        Forgot Passwords
                    </Text>

                </View>
            </View>

            <Pressable
                onPress={handleLogin}
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
                }}>Login</Text>

            </Pressable>

            <Pressable
                onPress={() => navigation.navigate("Register")}
                style={{ marginTop: 10 }}
            >
                <Text style={{ textAlign: "center", fontSize: 16 }}>
                    Don't have an account? Sign up
                </Text>
            </Pressable>


        </SafeAreaView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({})