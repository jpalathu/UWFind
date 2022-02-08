// import * as React from "react";
// import { Text, View, StyleSheet } from "react-native";
// import Colors from "../constants/Colors";
// import {
//   Avatar,
//   VStack,
//   Heading,
//   Center,
//   NativeBaseProvider,
//   HStack
// } from "native-base"

// export default function Profile() {
//   return (
//     // <View style={styles.container}>
//     //   <View>
//     //     <Text>
//     //       Fill in stuff here or create a new component and add it here
//     //     </Text>
//     //   </View>
//     // </View>

//     <VStack space={7} alignItems="center">
//       <Heading textAlign="center" mb="10">
//       <Avatar
//         bg="yellow.400" //need the code for the yellow?
//         size = "2xl"
//         source={{
//           uri: "https://pbs.twimg.com/profile_images/1188747996843761665/8CiUdKZW_400x400.jpg",
//         }}
//       >
//         SA
//       </Avatar>
//       </Heading>

//     </VStack>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: Colors.gold,
//   },
// });

// // export const Example = () => {
// //   return (
// //     <VStack space={4} alignItems="center">
// //       <Heading textAlign="center" mb="10">
// //       <Avatar
// //         bg="green.500"
// //         size = "2xl"
// //         source={{
// //           uri: "https://pbs.twimg.com/profile_images/1188747996843761665/8CiUdKZW_400x400.jpg",
// //         }}
// //       >
// //         SA
// //       </Avatar>
// //       </Heading>

// //     </VStack>

// //   )
// // }

// // export default () => {
// //   return (
// //     <NativeBaseProvider>
// //       <Center flex={1} px="3">
// //         <Example />
// //       </Center>
// //     </NativeBaseProvider>
// //   )
// // }

import React, { useEffect, useState } from "react";
import Colors from "../constants/Colors";
import { StyleSheet, View, Image } from "react-native";
import {
  Text,
  Container,
  Divider,
  Modal,
  FormControl,
  Input,
  Button,
  IconButton,
} from "native-base";
import { Foundation } from "@expo/vector-icons";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useStore } from "../store";
import ProfileImage from "../components/shared/ProfileImage";


export default function Login() {
  const [showEditInfo, setShowEditInfo] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    email: "",
    imageUrl: ""
  });
  // creating another variable to hold the fields or else the values in the profile screen will
  // change as we type in the modal fields
  const [modalFields, setModalFields] = useState({
    firstName: "",
    lastName: "",
    bio: "",
  });

  const openModal = () => {
    setShowEditInfo(true);
    setModalFields({
      firstName: profile.firstName,
      lastName: profile.lastName,
      bio: profile.bio,
    });
  };

  const closeModal = () => {
    setShowEditInfo(false);
    setModalFields({
      firstName: profile.firstName,
      lastName: profile.lastName,
      bio: profile.bio,
    });
  };

  const validate = () => {
    return true;
  };

  /* Updating the user */
  const UPDATE_USER_MUTATION = gql`
    mutation (
      $id: Int!
      $firstName: String!
      $lastName: String!
      $bio: String!
    ) {
      updateUser(
        id: $id
        input: { firstName: $firstName, lastName: $lastName, bio: $bio }
      ) {
        user {
          userId
          firstName
          lastName
          bio
          email
        }
      }
    }
  `;
  const [executeMutation] = useMutation(UPDATE_USER_MUTATION);
  const [isMutationLoading, setIsMutationLoading] = useState(false);
  const updateProfile = async () => {
    setIsMutationLoading(true);
    if (validate()) {
      try {
        const result = await executeMutation({
          variables: {
            id: userID,
            firstName: modalFields.firstName,
            lastName: modalFields.lastName,
            bio: modalFields.bio,
          },
        });
        console.log("GOOD", result);
        const { bio, firstName, lastName, email, imageUrl } = result.data.updateUser.user;
        setProfile({ firstName, lastName, bio, email, imageUrl });
        closeModal();
      } catch (error) {
        console.error("ERROR", JSON.stringify(error, null, 2));
      }
    }
    setIsMutationLoading(false);
  };

  /* Getting the user data initially */
  const USER_BY_ID_QUERY = gql`
    query ($id: Int!) {
      userById(id: $id) {
        firstName
        lastName
        bio
        email
        imageUrl
      }
    }
  `;
  const [executeQuery] = useLazyQuery(USER_BY_ID_QUERY);
  const { userID } = useStore();
  const loadProfile = async () => {
    const { data, error } = await executeQuery({
      variables: { id: userID },
    });
    if (error) {
      console.error("ERROR", JSON.stringify(error, null, 2));
    } else {
      setProfile(data.userById);
      console.log("GOOD", data);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <View>
      <View style={styles.header}>
      <ProfileImage
        style={styles.avatar}
        imageUrl={profile.imageUrl}
        firstName={profile.firstName}
        lastName={profile.lastName}
      />
        
      </View>
      {/* <Image
        style={styles.avatar}
        source={{ uri: "https://bootdey.com/img/Content/avatar/avatar6.png" }}
      /> */}
      <Modal isOpen={showEditInfo} onClose={closeModal}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Edit</Modal.Header>
          <Modal.Body>
            <FormControl>
              <FormControl.Label>First Name</FormControl.Label>
              <Input
                type="text"
                onChangeText={(v) =>
                  setModalFields({ ...modalFields, firstName: v })
                }
                defaultValue={modalFields.firstName}
              />
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>Last Name</FormControl.Label>
              <Input
                type="text"
                onChangeText={(v) =>
                  setModalFields({ ...modalFields, lastName: v })
                }
                defaultValue={modalFields.lastName}
              />
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>Bio</FormControl.Label>
              <Input
                type="text"
                onChangeText={(v) => setModalFields({ ...modalFields, bio: v })}
                defaultValue={modalFields.bio}
              />
            </FormControl>
            {/* <FormControl mt="3">
              <FormControl.Label>Password</FormControl.Label>
              <Input
                type="text"
                onChangeText={(v) => setProfile({ ...profile, password: v })}
                defaultValue={profile.password}
              />
            </FormControl> */}
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
              <Button isLoading={isMutationLoading} onPress={updateProfile}>
                Update
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      <View style={styles.body}>
        <View>
          <Text style={styles.name}>
            {profile.firstName} {profile.lastName}
          </Text>
          <Text style={styles.info}>{profile.bio}</Text>
          <Container style={{ alignSelf: "flex-end" }}>
            <Container style={{ alignSelf: "stretch" }}>
              <IconButton
                variant="solid"
                _icon={{
                  as: Foundation,
                  name: "pencil",
                }}
                onPress={openModal}
              />
            </Container>
          </Container>

          <Divider my="2" />
          <Text style={styles.name}>Email </Text>
          <Text style={styles.info}>{profile.email}</Text>

          {/* <Divider my="2" />
          <Text style={styles.name}>Password</Text>
          <Text style={styles.info}>{profile.password}</Text> */}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.gold,
    height: 200,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10,
    alignSelf: "center",
    position: "absolute",
    marginTop: 130,
  },
  name: {
    fontSize: 22,
    color: Colors.white,
    fontWeight: "600",
  },
  body: {
    marginTop: 70,
    marginHorizontal: 10,
  },
  info: {
    fontSize: 16,
    color: "#00BFFF",
    marginTop: 10,
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: "#696969",
    marginTop: 10,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
    backgroundColor: Colors.gold,
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 30,
    marginRight: 10
  }
});
