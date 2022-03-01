import React from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ChannelList } from "stream-chat-expo";

const ChatHome = () => {
  const navigation = useNavigation();

  const goToChatRoom = (channel) => {
    navigation.navigate("ChatRoom", { channelID: channel.id });
  };

  return (
    <View style={styles.container}>
      <ChannelList onSelect={goToChatRoom} />
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
