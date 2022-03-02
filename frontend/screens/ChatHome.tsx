import React from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ChannelList } from "stream-chat-expo";
import { useStore } from "../store";

const ChatHome = () => {
  const navigation = useNavigation();
  const { userID } = useStore();

  const goToChatRoom = (channel: any) => {
    navigation.navigate("ChatRoom", { channelID: channel.id });
  };

  const filters = { members: { $in: [`${userID}`] } };

  return (
    <View style={styles.container}>
      <ChannelList onSelect={goToChatRoom} filters={filters} />
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
