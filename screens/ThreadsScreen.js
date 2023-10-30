import { StyleSheet, Text, View, Image, SafeAreaView, TextInput, Button } from 'react-native'
import React, { useContext, useState } from 'react'
import { UserType } from '../UserContext';
import axios from "axios";
const ThreadsScreen = () => {
    const [content, setContent] = useState("");
    const { userId, setUserId } = useContext(UserType);
    const handlePostSubmit = () => {
        const postData = {
            userId,
        };

        if (content) {
            postData.content = content;
        }

        axios
            .post("http://10.0.2.2:3000/create-post", postData)
            .then((response) => {
                setContent("");
            })
            .catch((error) => {
                console.log("error creating post", error);
            });
    };
    return (
        <SafeAreaView style={{ marginTop: 40, padding: 10 }} >
            <View

                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    padding: 10,
                }}
            >
                <Image
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        resizeMode: "contain",
                    }}
                    source={{
                        uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
                    }}
                />
                <Text>Zaki Abdullahi </Text>
            </View>

            <View style={{ flexDirection: "row", marginLeft: 10 }}>
                <TextInput
                    value={content}
                    onChangeText={(text) => setContent(text)}
                    placeholderTextColor={"black"}
                    placeholder="Type your message..."
                    multiline
                />

            </View>
            <View style={{ marginTop: 20 }} />
            <Button onPress={handlePostSubmit} title="Share Post" />

        </SafeAreaView>
    )
}

export default ThreadsScreen

const styles = StyleSheet.create({})