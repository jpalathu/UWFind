import React, { useEffect, useState } from "react";
import Colors from "../constants/Colors";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
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
import { FlatList } from "react-native";
import { Foundation } from "@expo/vector-icons";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useStore } from "../store";
import ProfileImage from "../components/shared/ProfileImage";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Tab, TabView } from "react-native-elements";
import { useChatContext } from "stream-chat-expo";

export default function Profile() {
  const { client } = useChatContext();
  const [showEditInfo, setShowEditInfo] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    email: "",
    imageUrl: "",
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
      const { bio, firstName, lastName, email, imageUrl } =
        result.data.updateUser.user;
      setProfile({ firstName, lastName, bio, email, imageUrl });
      await client.upsertUser({
        id: userID,
        name: firstName + " " + lastName,
        image: imageUrl,
      });
      closeModal();
    } catch (error) {
      console.error("ERROR", JSON.stringify(error, null, 2));
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
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const [tabIndex, setTabIndex] = React.useState(0);
  return (
    <View>
      <View style={styles.header}>
        <ProfileImage
          style={styles.avatar}
          imageUrl={profile.imageUrl}
          firstName={profile.firstName}
          lastName={profile.lastName}
          textSize={30}
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
        <View style={{ alignSelf: "flex-end" }}>
          <IconButton
            variant="solid"
            _icon={{
              as: Foundation,
              name: "pencil",
            }}
            onPress={openModal}
          />
        </View>

        <View style={{ marginTop: 10 }}>
          <Text style={styles.name}>
            {profile.firstName} {profile.lastName}
          </Text>
          <Text
            style={[
              styles.info,
              {
                color: "white",
              },
            ]}
          >
            {profile.bio}
          </Text>
          <Text
            style={[
              styles.info,
              {
                color: "#00BFFF",
              },
            ]}
          >
            {profile.email}
          </Text>
        </View>
      </View>

      <View>
        <Divider mt="4" mb="1" />
        <Tab
          value={tabIndex}
          onChange={setTabIndex}
          indicatorStyle={{
            backgroundColor: "white",
            height: 3,
          }}
        >
          <Tab.Item
            title="Lost"
            titleStyle={{ fontSize: 12, color: "white" }}
            icon={{ name: "help-outline", type: "ionicon", color: "white" }}
            buttonStyle={{
              backgroundColor: tabIndex === 0 ? "#00BFFF" : "#00bfffb2",
            }}
          />
          <Tab.Item
            title="Found"
            titleStyle={{ fontSize: 12, color: "white" }}
            icon={{ name: "search-outline", type: "ionicon", color: "white" }}
            buttonStyle={{
              backgroundColor: tabIndex === 1 ? "#00BFFF" : "#00bfffb2",
            }}
          />
        </Tab>

        {/* Ignore any errors from the onMoveShouldSetResponder. It's needed to make things scrollable*/}
        <TabView value={tabIndex} onChange={setTabIndex}>
          <TabView.Item
            onMoveShouldSetResponder={(e) => e.stopPropagation()}
            style={{ width: "100%", height: 400 }}
          >
            <LostItemTabContent />
          </TabView.Item>
          <TabView.Item
            onMoveShouldSetResponder={(e) => e.stopPropagation()}
            style={{ width: "100%", height: 400 }}
          >
            <FoundItemTabContent />
          </TabView.Item>
        </TabView>
      </View>
    </View>
  );
}

const LostItemTabContent = () => {
  const navigation = useNavigation();
  const { userID } = useStore();
  const [items, setItems] = useState<any[]>([]);
  const LOST_ITEM_POSTS = gql`
    query ($id: Int!) {
      lostItemPostsByUserId(userId: $id) {
        postId
        title
        description
        date
        imageUrl
        buildingId {
          name
        }
        categoryId {
          name
        }
        lostUserId {
          userId
          firstName
          lastName
          email
        }
      }
    }
  `;
  const [executeQuery] = useLazyQuery(LOST_ITEM_POSTS);
  const getItems = async () => {
    const { data, error } = await executeQuery({
      variables: {
        id: userID,
      },
    });
    if (error) {
      console.error("ERROR", JSON.stringify(error, null, 2));
    } else {
      setItems(data.lostItemPostsByUserId);
    }
  };
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      console.log("focused again");
      getItems();
    }
  }, [isFocused]);

  return (
    <FlatList
      data={items}
      contentContainerStyle={{
        paddingBottom: 30,
      }}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("LostDetailedItem", {
              itemPostId: item.postId,
              itemTitle: item.title,
              itemCategory: item.categoryId.name,
              itemLocation: item.buildingId.name,
              itemDate: item.date,
              itemDescription: item.description,
              itemImage: item.imageUrl,
              itemLostUser: item.lostUserId,
            });
          }}
        >
          <View key={item.postId} style={styles.news_item}>
            <View style={styles.text_container}>
              <Text style={styles.title}>{item.title}</Text>
              <View style={styles.text_container}>
                <Text style={styles.news_text}>{item.categoryId.name}</Text>
                <Text style={styles.news_text}>{item.buildingId.name}</Text>
                <Text style={styles.news_text}>Lost on {item.date}</Text>
              </View>
            </View>
            <View style={styles.news_photo}>
              <Image source={{ uri: item.imageUrl }} style={styles.photo} />
            </View>
          </View>
        </TouchableOpacity>
      )}
      ItemSeparatorComponent={() => (
        <View
          style={{
            height: 1,
            width: "100%",
            backgroundColor: "#607D8B",
          }}
        />
      )}
    />
  );
};

const FoundItemTabContent = () => {
  const navigation = useNavigation();
  const { userID } = useStore();
  const [items, setItems] = useState<any[]>([]);
  const FOUND_ITEM_POSTS = gql`
    query ($id: Int!) {
      foundItemPostsByUserId(userId: $id) {
        postId
        title
        description
        imageUrl
        date
        categoryId {
          name
        }
        buildingId {
          name
        }
        otherDropOffLocation
        dropOffLocationId {
          name
        }
        foundUserId {
          userId
          firstName
          lastName
          email
        }
        claimedUserId {
          userId
          firstName
          lastName
          email
        }
      }
    }
  `;
  const [executeQuery] = useLazyQuery(FOUND_ITEM_POSTS);
  const getItems = async () => {
    const { data, error } = await executeQuery({
      variables: {
        id: userID,
      },
    });
    if (error) {
      console.error("ERROR", JSON.stringify(error, null, 2));
    } else {
      setItems(data.foundItemPostsByUserId);
    }
  };
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      console.log("focused again");
      getItems();
    }
  }, [isFocused]);

  return (
    <FlatList
      data={items}
      contentContainerStyle={{
        paddingBottom: 30,
      }}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => {
            /* 1. Navigate to the Details route with params */
            navigation.navigate("FoundDetailedItem", {
              itemPostId: item.postId,
              itemTitle: item.title,
              itemCategory: item.categoryId.name,
              itemLocation: item.buildingId.name,
              itemOtherLocation: item.otherDropOffLocation,
              itemDate: item.date,
              itemDescription: item.description,
              itemImage: item.imageUrl,
              itemFoundUser: item.foundUserId,
              itemClaimedUser: item.claimedUserId,
            });
          }}
        >
          <View key={item.postId} style={styles.news_item}>
            <View style={styles.text_container}>
              <Text style={styles.title}>{item.title}</Text>
              <View style={styles.text_container}>
                <Text style={styles.news_text}>{item.categoryId.name}</Text>
                <Text style={styles.news_text}>{item.buildingId.name}</Text>
                <Text style={styles.news_text}>Found on {item.date}</Text>
              </View>
            </View>
            <View style={styles.news_photo}>
              <Image source={{ uri: item.imageUrl }} style={styles.photo} />
            </View>
          </View>
        </TouchableOpacity>
      )}
      ItemSeparatorComponent={() => (
        <View
          style={{
            height: 1,
            width: "100%",
            backgroundColor: "#607D8B",
          }}
        />
      )}
    />
  );
};

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
    marginTop: 10,
    marginHorizontal: 10,
  },
  info: {
    fontSize: 16,
    marginTop: 10,
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
    marginRight: 10,
  },
  news_container: {
    flex: 1,
    flexDirection: "column",
  },
  news_item: {
    flexDirection: "row",
    paddingRight: 40,
    paddingLeft: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },
  news_text: {
    flex: 2,
    flexDirection: "row",
    padding: 10,
    color: "#FFFFFF",
  },
  news_photo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text_container: {
    flex: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFD54F",
    // fontFamily: 'georgia'
  },
  photo: {
    width: 120,
    height: 120,
  },
  itemContainer: {
    backgroundColor: "#fff",
    margin: "5%",
    marginTop: 0,
    borderRadius: 5,
    width: "90%",
  },
  itemHeaderText: {
    //  height:'auto',
    color: "#333",
    fontSize: 23,
    fontWeight: "800",
  },
});
