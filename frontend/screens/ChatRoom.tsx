import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { useEffect } from "react";
import { FlatList, View, StyleSheet, SafeAreaView } from "react-native";
import Message from "../components/chat/Message";
import MessageInput from "../components/chat/MessageInput";
import chatRoomData from "../dummy/chat.json";

const ChatRoom = () => {
  const route = useRoute();
  const navigation = useNavigation();
  console.log("params", route.params);
  useEffect(() => {
    navigation.setOptions({ title: "Test Title" });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={chatRoomData.messages}
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
