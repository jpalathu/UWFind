import React from "react";

import { View, Text, StyleSheet } from "react-native";

const myID = "u1";

const Message = ({ message }) => {
  const isMe = message.user.id == myID;

  return (
    <View
      style={[
        styles.container,
        isMe ? styles.rightContainer : styles.leftContainer,
      ]}
    >
      <Text style={{ color: isMe ? "white" : "black" }}>{message.content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#3777f0",
    padding: 10,
    margin: 10,
    borderRadius: 10,
    width: "75%",
  },
  leftContainer: {
    backgroundColor: "lightgrey",
    marginLeft: 10,
    marginRight: "auto",
  },
  rightContainer: {
    backgroundColor: "#3777f0",
    marginLeft: "auto",
    marginRight: 10,
  },
});

export default Message;
