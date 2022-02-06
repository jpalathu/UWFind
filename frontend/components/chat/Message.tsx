import React from "react";
import moment from "moment";

import { View, Text, StyleSheet } from "react-native";
import { useStore } from "../../store";

const Message = ({ message }) => {
  const { userID } = useStore();
  const isMe = message.senderId.userId == userID;

  const formatDateTime = (dateTime: String) => {
    const current = moment(dateTime);
    const today = moment();
    // if today, show timestamp
    if (current.isSame(today, "day")) {
      return moment(current).format("h:mm a");
    }
    // else if less than a week ago, then show day
    else if (current.clone().add(1, "weeks").isSameOrAfter(today)) {
      return moment(current).format("ddd h:mm a");
    }
    // else show month and day
    return moment(current).format("MMM D h:mm a").toString();
  };

  return (
    <View>
      <View
        style={[
          styles.container,
          isMe ? styles.rightContainer : styles.leftContainer,
        ]}
      >
        <Text style={{ color: isMe ? "white" : "black" }}>
          {message.content}
        </Text>
      </View>
      <Text style={[styles.date, isMe ? styles.rightDate : styles.leftDate]}>
        {formatDateTime(message.createdAt)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#3777f0",
    padding: 10,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
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
  date: {
    color: "lightgrey",
    fontSize: 11,
  },
  leftDate: {
    alignSelf: "flex-start",
    marginLeft: 10
  },
  rightDate: {
    alignSelf: "flex-end",
    marginRight: 10
  },
});

export default Message;
