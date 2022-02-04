import { gql, useLazyQuery } from "@apollo/client";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { useEffect } from "react";
import { FlatList, StyleSheet, SafeAreaView } from "react-native";
import Message from "../components/chat/Message";
import MessageInput from "../components/chat/MessageInput";

const ChatRoom = () => {
  const route = useRoute();
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({ title: route.params?.name });
  }, []);

  const [messages, setMessages] = useState<any[]>([]);
  const MESSAGES = gql`
    query ($chatRoomId: Int!) {
      messages(chatRoomId: $chatRoomId) {
        messageId
        content
        createdAt
        senderId {
          userId
        }
      }
    }
  `;
  const [executeQuery] = useLazyQuery(MESSAGES);
  const loadMessages = async () => {
    const { data, error } = await executeQuery({
      variables: { chatRoomId: route.params?.chatRoomID },
    });
    if (error) {
      console.error("ERROR", JSON.stringify(error, null, 2));
    } else {
      setMessages(data.messages);
      console.log("GOOD", data);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => <Message message={item} />}
        inverted
      />
      <MessageInput />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 90,
    flex: 1,
  },
});

export default ChatRoom;
