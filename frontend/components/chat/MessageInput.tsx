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
import { gql, useMutation } from "@apollo/client";
import { useStore } from "../../store";

const MessageInput = ({ chatRoomID, reloadMessages }) => {
  const [message, setMessage] = useState("");

  const SEND_MESSAGE = gql`
    mutation ($chatRoomId: Int!, $senderId: Int!, $content: String!) {
      sendMessage(
        input: {
          chatRoomId: $chatRoomId
          senderId: $senderId
          content: $content
        }
      ) {
        message {
          messageId
        }
      }
    }
  `;
  const [executeMutation] = useMutation(SEND_MESSAGE);
  const [isMutationLoading, setIsMutationLoading] = useState(false);
  const { userID } = useStore();
  const sendMessage = async () => {
    setIsMutationLoading(true);
    try {
      const result = await executeMutation({
        variables: {
          chatRoomId: chatRoomID,
          senderId: userID,
          content: message,
        },
      });
      reloadMessages();
      setMessage("");
      console.log("GOOD", result);
    } catch (error) {
      console.error("ERROR", JSON.stringify(error, null, 2));
    }
    setIsMutationLoading(false);
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
