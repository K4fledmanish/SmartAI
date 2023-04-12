import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Header } from "react-native-elements";
import { GiftedChat } from "react-native-gifted-chat";

export default function ChatWindow() {

  const [messages,setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState("");
  const [outputMessage, setOutputMessage] = useState("results will be shown here");

  const handleSend = () => {
    console.log(inputMessage);
      // Send the message
    console.log(inputMessage);
    //setting up time and date
    const message = {
      _id:Math.random().toString(36).substring(7),
      text:inputMessage,
      createdAt:new Date(),
      user:{_id:1, name:"User"}
    }
    setMessages((previousMessages) => 
      GiftedChat.append(previousMessages,[message])
    )
    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "apenai api"
      },
      body: JSON.stringify({
        "model": "gpt-3.5-turbo",
        "messages": [{ "role": "user", "content": inputMessage }]
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setOutputMessage(data.choices[0].message.content)
        console.log(data.choices[0].message.content.trim())
        const message = {
          _id:Math.random().toString(36).substring(7),
          text:data.choices[0].message.content.trim(),
          createdAt:new Date(),
          user:{_id:2}
        }
        setMessages((previousMessages) => 
          GiftedChat.append(previousMessages,[message])
        )
      });
  };

  const generateImages = () => {
    // Send the message
    console.log(inputMessage);
    fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "openai api"
      },
      body: JSON.stringify({
        // "model": "gpt-3.5-turbo",
        // "messages": [{"role": "user", "content": inputMessage}]
        prompt: inputMessage,
        n: 2,
        size: "1024x1024",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setOutputMessage(data.data[0].url);
        console.log(data.data[0].url);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        placement="center"
        centerComponent={{
          text: "Smart AI",
          style: { color: "#fff", fontSize: 20, padding: 5 },
        }}
        containerStyle={{ backgroundColor: "#00bfff" }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -100}
        style={styles.chatContainer}
      >
        <View style={{flex: 1}}>
          {/* <Text style={styles.message}>{outputMessage}</Text> */}
            <GiftedChat messages={messages} renderInputToolbar={() =>{ } } user={{_id:1}}  minInputToolbarHeight={0} />
        </View>
        
      </KeyboardAvoidingView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputMessage}
          onChangeText={(text) => setInputMessage(text)}
          placeholder="Type your message here..."
          placeholderTextColor="#b2b2b2"
          autoFocus={true}
          autoCorrect={false}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity onPress={handleSend}>
          <View style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Send</Text>
          </View>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  chatContainer: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    alignSelf: "flex-start",
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: "80%",
    padding: 10,
  },
  message: {
    fontSize: 16,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  input: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 16,
    color: "#333",
  },
  sendButton: {
    backgroundColor: "#00bfff",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginLeft: 10,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
