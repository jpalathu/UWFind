import React from "react";
import { Text, Image, View, StyleSheet, FlatList } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import ChatRoomItem from "../components/chat/ChatRoomItem";

import chatRoomsData from "../dummy/chat_room.json";

const ChatHome = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={chatRoomsData}
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
