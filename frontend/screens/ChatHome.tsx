import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
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
