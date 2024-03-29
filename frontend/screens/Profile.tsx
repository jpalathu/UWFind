import React, { Fragment, useEffect, useState } from "react";
import Colors from "../constants/Colors";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import {
  Text,
  Divider,
  Modal,
  FormControl,
  Input,
  Button,
  IconButton,
  WarningOutlineIcon,
  Spinner,
} from "native-base";
import { FlatList } from "react-native";
import { FontAwesome, Foundation } from "@expo/vector-icons";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useStore } from "../store";
import ProfileImage from "../components/shared/ProfileImage";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Tab, TabView } from "react-native-elements";
import { useChatContext } from "stream-chat-expo";
import {
  INITIAL_VALIDATION_STATE,
  formatValidState,
  formatInvalidState,
} from "../utils/error";
import { pickImage } from "../utils/imagePicker";

const defaultImage = require("../photos/glass.png");

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
    firstName: INITIAL_VALIDATION_STATE,
    lastName: INITIAL_VALIDATION_STATE,
    bio: INITIAL_VALIDATION_STATE,
    imageUrl: INITIAL_VALIDATION_STATE,
  });

  const resetFields = () => {
    setModalFields({
      firstName: formatValidState(profile.firstName),
      lastName: formatValidState(profile.lastName),
      bio: formatValidState(profile.bio),
      imageUrl: formatValidState(profile.imageUrl),
    });
  };

  const openModal = () => {
    setShowEditInfo(true);
    resetFields();
  };

  const closeModal = () => {
    setShowEditInfo(false);
    resetFields();
  };

  const [isImageLoading, setIsImageLoading] = useState(false);
  const handlePickedImage = async () => {
    setIsImageLoading(true);
    const image = await pickImage();
    setModalFields({ ...modalFields, imageUrl: formatValidState(image) });
    setIsImageLoading(false);
  };

  const validate = () => {
    let hasError = false;
    const { firstName, lastName, bio } = modalFields;
    if (!firstName.value) {
      setModalFields({
        ...modalFields,
        firstName: formatInvalidState("First Name is required"),
      });
      hasError = true;
    }

    if (!lastName.value) {
      setModalFields({
        ...modalFields,
        lastName: formatInvalidState("Last Name is required"),
      });
      hasError = true;
    }

    if (!bio.value) {
      setModalFields({
        ...modalFields,
        bio: formatInvalidState("Bio is required"),
      });
      hasError = true;
    }

    return !hasError;
  };

  /* Updating the user */
  const UPDATE_USER_MUTATION = gql`
    mutation(
      $id: Int!
      $firstName: String!
      $lastName: String!
      $bio: String!
      $imageUrl: String
    ) {
      updateUser(
        id: $id
        input: {
          firstName: $firstName
          lastName: $lastName
          bio: $bio
          imageUrl: $imageUrl
        }
      ) {
        user {
          userId
          firstName
          lastName
          bio
          email
          imageUrl
        }
      }
    }
  `;
  const [executeMutation] = useMutation(UPDATE_USER_MUTATION);
  const [isMutationLoading, setIsMutationLoading] = useState(false);
  const updateProfile = async () => {
    setIsMutationLoading(true);
    try {
      if (validate()) {
        const result = await executeMutation({
          variables: {
            id: userID,
            firstName: modalFields.firstName.value,
            lastName: modalFields.lastName.value,
            bio: modalFields.bio.value,
            imageUrl: modalFields.imageUrl.value,
          },
        });
        const {
          bio,
          firstName,
          lastName,
          email,
          imageUrl,
        } = result.data.updateUser.user;
        setProfile({ firstName, lastName, bio, email, imageUrl });
        await client.upsertUser({
          id: userID,
          name: firstName + " " + lastName,
          image: imageUrl,
        });
        closeModal();
      }
    } catch (error) {
      console.error("ERROR", JSON.stringify(error, null, 2));
    }
    setIsMutationLoading(false);
  };

  /* Getting the user data initially */
  const USER_BY_ID_QUERY = gql`
    query($id: Int!) {
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
      <Modal isOpen={showEditInfo} onClose={closeModal}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Edit</Modal.Header>
          <Modal.Body>
            <FormControl isRequired isInvalid={modalFields.firstName.isInvalid}>
              <FormControl.Label>First Name</FormControl.Label>
              <Input
                type="text"
                onChangeText={(v) =>
                  setModalFields({
                    ...modalFields,
                    firstName: formatValidState(v),
                  })
                }
                defaultValue={modalFields.firstName.value}
              />
              <FormControl.ErrorMessage
                fontSize="xl"
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {modalFields.firstName.errorMessage}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl
              mt="3"
              isRequired
              isInvalid={modalFields.lastName.isInvalid}
            >
              <FormControl.Label>Last Name</FormControl.Label>
              <Input
                type="text"
                onChangeText={(v) =>
                  setModalFields({
                    ...modalFields,
                    lastName: formatValidState(v),
                  })
                }
                defaultValue={modalFields.lastName.value}
              />
              <FormControl.ErrorMessage
                fontSize="xl"
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {modalFields.lastName.errorMessage}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl
              mt="3"
              isRequired
              isInvalid={modalFields.bio.isInvalid}
            >
              <FormControl.Label>Bio</FormControl.Label>
              <Input
                type="text"
                onChangeText={(v) =>
                  setModalFields({
                    ...modalFields,
                    bio: formatValidState(v),
                  })
                }
                defaultValue={modalFields.bio.value}
              />
              <FormControl.ErrorMessage
                fontSize="xl"
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {modalFields.bio.errorMessage}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl mt="1" isInvalid={modalFields.imageUrl.isInvalid}>
              <FormControl.Label>Image</FormControl.Label>
              <View
                style={{
                  width: "100%",
                  height: 100,
                  borderStyle: "dashed",
                  borderRadius: 15,
                  borderWidth: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {isImageLoading ? (
                  <Spinner size="sm" />
                ) : (
                  <Fragment>
                    {modalFields.imageUrl.value ? (
                      <Image
                        style={{
                          borderRadius: 15,
                          width: "100%",
                          height: "100%",
                        }}
                        source={{ uri: modalFields.imageUrl.value }}
                        resizeMode="stretch"
                      />
                    ) : (
                      <FontAwesome name="image" size={40} color="black" />
                    )}
                  </Fragment>
                )}
              </View>
              <FormControl.ErrorMessage
                fontSize="xl"
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {modalFields.imageUrl.errorMessage}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl mt="2">
              <Button onPress={handlePickedImage}>Upload a photo</Button>
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
    query($id: Int!) {
      lostItemPostsByUserId(userId: $id) {
        postId
        title
        description
        date
        imageUrl
        buildingId {
          buildingId
          name
        }
        categoryId {
          categoryId
          name
        }
        lostUserId {
          userId
          firstName
          lastName
          email
          imageUrl
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
              itemCategory: item.categoryId,
              itemLocation: item.buildingId,
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
                <Text style={styles.label_text}>
                  Category:{" "}
                  <Text style={styles.news_text}>{item.categoryId.name}</Text>
                </Text>
                <Text style={styles.label_text}>
                  Lost in:{" "}
                  <Text style={styles.news_text}>{item.buildingId.name}</Text>
                </Text>
                <Text style={styles.label_text}>
                  Lost on: <Text style={styles.news_text}>{item.date}</Text>
                </Text>
              </View>
            </View>
            <View style={styles.news_photo}>
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.photo} />
              ) : (
                <Image source={defaultImage} style={styles.photo} />
              )}
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
    query($id: Int!) {
      foundItemPostsByUserId(userId: $id) {
        postId
        title
        description
        imageUrl
        date
        categoryId {
          categoryId
          name
        }
        buildingId {
          buildingId
          name
        }
        otherDropOffLocation
        dropOffLocationId {
          locationId
          name
        }
        foundUserId {
          userId
          firstName
          lastName
          email
          imageUrl
        }
        claimedUserId {
          userId
          firstName
          lastName
          email
          imageUrl
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
              itemCategory: item.categoryId,
              itemLocation: item.buildingId,
              itemDropOffLocation: item.dropOffLocationId,
              itemOtherDropOffLocation: item.otherDropOffLocation,
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
                <Text style={styles.label_text}>
                  Category:{" "}
                  <Text style={styles.news_text}>{item.categoryId.name}</Text>
                </Text>
                <Text style={styles.label_text}>
                  Found in:{" "}
                  <Text style={styles.news_text}>{item.buildingId.name}</Text>
                </Text>
                <Text style={styles.label_text}>
                  Found on: <Text style={styles.news_text}>{item.date}</Text>
                </Text>
              </View>
            </View>
            <View style={styles.news_photo}>
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.photo} />
              ) : (
                <Image source={defaultImage} style={styles.photo} />
              )}
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
  label_text: {
    flex: 2,
    flexDirection: "row",
    padding: 10,
    color: "#FFD54F",
  },
  news_photo: {
    marginLeft: 10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text_container: {
    flex: 3,
    marginRight: 20,
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
