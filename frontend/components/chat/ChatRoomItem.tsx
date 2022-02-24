import React from "react";
import { Text, Image, View, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import ProfileImage from "../shared/ProfileImage";

const ChatRoomItem = ({ chatRoom }) => {
  const navigation = useNavigation();
  const goToChatRoom = () => {
    navigation.navigate("ChatRoom", {
      chatRoomID: chatRoom.chatRoomId,
      name: chatRoom.firstName + " " + chatRoom.lastName,
    });
  };

  const formatDateTime = (dateTime: String) => {
    const current = moment(dateTime);
    const today = moment();
    // if today, show timestamp
    if (current.isSame(today, "day")) {
      return moment(current).format("h:mm a");
    }
    // else if less than a week ago, then show day
    else if (current.clone().add(1, "weeks").isSameOrAfter(today)) {
      return moment(current).format("ddd");
    }
    // else show month and day
    return moment(current).format("MMM D").toString();
  };

  return (
    <TouchableOpacity onPress={goToChatRoom} style={styles.container}>
      <ProfileImage
        style={styles.image}
        imageUrl={chatRoom.imageUrl}
        firstName={chatRoom.firstName}
        lastName={chatRoom.lastName}
        textSize={18}
      />
      {/* {chatRoom.newMessages ? (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{chatRoom.newMessages}</Text>
        </View>
      ) : null} */}
      <View style={styles.rightContainer}>
        <View style={styles.row}>
          <Text style={styles.name}>{chatRoom.firstName} {chatRoom.lastName}</Text>
          <Text style={styles.date}>
            {formatDateTime(chatRoom.lastModified)}
          </Text>
        </View>
        <Text style={styles.text} numberOfLines={1}>
          {chatRoom.lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 30,
    marginRight: 10
  },
  badgeContainer: {
    backgroundColor: "#3872E9",
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    left: 45,
    top: 10,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
  },
  rightContainer: {
    flex: 1,
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 3,
  },
  text: {
    color: "grey",
  },
  date: {
    color: "grey",
    marginRight: 5,
  },
});

export default ChatRoomItem;
