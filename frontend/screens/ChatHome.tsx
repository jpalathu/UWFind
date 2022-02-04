import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import ChatRoomItem from "../components/chat/ChatRoomItem";
import { useStore } from "../store";

import { gql, useLazyQuery } from "@apollo/client";

const ChatHome = () => {
  const [chatRooms, setChatRooms] = useState<any[]>([]);

  const CHAT_ROOMS = gql`
    query ($userId: Int!) {
      chatRooms(userId: $userId) {
        name
        chatRoomId
        imageUrl
        lastMessage
        lastModified
      }
    }
  `;
  const [executeQuery] = useLazyQuery(CHAT_ROOMS);
  const { userID } = useStore();
  const loadChatRooms = async () => {
    const { data, error } = await executeQuery({
      variables: { userId: userID },
    });
    if (error) {
      console.error("ERROR", JSON.stringify(error, null, 2));
    } else {
      setChatRooms(data.chatRooms);
      console.log("GOOD", data);
    }
  };

  useEffect(() => {
    loadChatRooms();
  }, []);
  
  return (
    <View style={styles.container}>
      <FlatList
        data={chatRooms}
        renderItem={({ item }) => <ChatRoomItem chatRoom={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 90,
    backgroundColor: "white",
    flex: 1,
  },
});

export default ChatHome;
