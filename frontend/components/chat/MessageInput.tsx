import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const MessageInput = () => {
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    console.log(message);
    setMessage("");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={(value) => setMessage(value)}
          placeholder="Send a message..."
        />
      </View>
      <TouchableOpacity onPress={sendMessage} style={styles.buttonContainer}>
        <Ionicons name="send" size={24} color="white" />
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
  },
  inputContainer: {
    backgroundColor: "#ebe8e8",
    flex: 1,
    marginRight: 10,
    borderColor: "#dedede",
    borderRadius: 25,
    borderWidth: 1,
    alignItems: "center",
    flexDirection: "row",
  },
  input: {
    flex: 1,
    marginHorizontal: 10,
  },
  buttonContainer: {
    width: 50,
    height: 50,
    backgroundColor: "#3777f0",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MessageInput;
