import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Button, FormControl, Input, Modal, Select } from "native-base";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useStore } from "../../store";

const ChatHomeHeader = () => {
  const navigation = useNavigation();
  const { userID } = useStore();

  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
    setSelectedUser("");
  };

  const [users, setUsers] = useState<any[]>([]);
  const USERS = gql`
    query ($currentUserId: Int!) {
      users(currentUserId: $currentUserId) {
        userId
        firstName
        lastName
      }
    }
  `;
  const [executeQuery] = useLazyQuery(USERS);
  const getUsers = async () => {
    const { data, error } = await executeQuery({
      variables: { currentUserId: userID },
    });
    if (error) {
      console.error("ERROR", JSON.stringify(error, null, 2));
    } else {
      setUsers(data.users);
      console.log("GOOD", data);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const [selectedUser, setSelectedUser] = useState("");
  const CREATE_CHAT_ROOM = gql`
    mutation ($currentUserId: Int!, $otherUserId: Int!) {
      createChatRoom(currentUserId: $currentUserId, otherUserId: $otherUserId) {
        alreadyExists
        chatRoom {
          chatRoomId
        }
        user {
          firstName
          lastName
        }
      }
    }
  `;
  const [executeMutation] = useMutation(CREATE_CHAT_ROOM);
  const [isMutationLoading, setIsMutationLoading] = useState(false);
  const createChatRoom = async () => {
    setIsMutationLoading(true);
    try {
      console.log(selectedUser);
      const result = await executeMutation({
        variables: {
          currentUserId: userID,
          otherUserId: Number(selectedUser),
        },
      });
      console.log("GOOD", result);
      const { user, chatRoom } = result.data.createChatRoom;
      navigation.navigate("ChatRoom", {
        chatRoomID: chatRoom.chatRoomId,
        name: user.firstName + " " + user.lastName,
      });
      closeModal();
    } catch (error) {
      console.error("ERROR", JSON.stringify(error, null, 2));
    }
    setIsMutationLoading(false);
  };

  return (
    <View>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Chat with a User</Modal.Header>
          <Modal.Body>
            <FormControl>
              <Select
                selectedValue={selectedUser}
                minWidth={200}
                accessibilityLabel="Select a User"
                placeholder="Select a User"
                onValueChange={(value) => {
                  setSelectedUser(value);
                }}
                mt={1}
              >
                {users.map((user) => (
                  <Select.Item
                    key={user.userId}
                    label={user.firstName + " " + user.lastName}
                    value={user.userId}
                  />
                ))}
              </Select>
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={closeModal}
              >
                Cancel
              </Button>
              <Button isLoading={isMutationLoading} onPress={createChatRoom}>
                Chat
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      <View style={styles.container}>
        <Text style={styles.title}>Chat</Text>
        <TouchableOpacity onPress={() => openModal()}>
          <AntDesign name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ChatHomeHeader;
