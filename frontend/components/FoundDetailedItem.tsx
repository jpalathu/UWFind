import React, { Fragment, useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  Container,
  Modal,
  FormControl,
  Input,
  Button,
  IconButton,
  Select,
  Spinner,
} from "native-base";
import { Foundation, AntDesign, FontAwesome } from "@expo/vector-icons";
import DatePicker from "react-native-datepicker";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import ProfileImage from "./shared/ProfileImage";
import { useNavigation } from "@react-navigation/native";
import { useStore } from "../store";
import useColorScheme from "../hooks/useColorScheme";
import { pickImage } from "../utils/imagePicker";

export default function FoundDetailedItem({ route }) {
  const navigation = useNavigation();

  const {
    itemPostId,
    itemTitle,
    itemDate,
    itemImage,
    itemCategory,
    itemLocation,
    itemDescription,
    itemFoundUser,
    itemClaimedUser,
    itemDropOffLocation,
    itemOtherDropOffLocation,
  } = route.params;

  // Used to hold the data shown in the detailed item page
  const [post, setPost] = useState({
    postID: itemPostId,
    title: itemTitle,
    description: itemDescription,
    date: itemDate,
    imageUrl: itemImage,
    categoryID: itemCategory.categoryId,
    categoryName: itemCategory.name,
    buildingID: itemLocation.buildingId,
    buildingName: itemLocation.name,
    dropOffLocationID: itemDropOffLocation ? itemDropOffLocation.locationId : "",
    dropOffLocationName: itemDropOffLocation ? itemDropOffLocation.name : "",
    otherDropOffLocation: itemOtherDropOffLocation, //this will be shown if the drop off location is Other
    foundUser: itemFoundUser,
    claimedUser: itemClaimedUser,
  });

  // Used to show/hide the edit modal
  const [showEditInfo, setShowEditInfo] = useState(false);

  // Used to hold the data for the selection lists
  const [locations, setLocations] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [dropOffLocations, setDropOffLocations] = useState<any[]>([]);

  const goToPublicProfile = () => {
    navigation.navigate("PublicProfile", { userID: itemFoundUser.userId });
  };

  const [modalFields, setModalFields] = useState({
    title: "",
    date: "",
    imageUrl: "",
    categoryID: "",
    buildingID: "",
    dropOffLocationID: "",
    otherDropOffLocation: "",
    description: "",
  });

  const openModal = () => {
    setShowEditInfo(true);
    setModalFields({
      title: post.title,
      date: post.date,
      imageUrl: post.imageUrl,
      categoryID: post.categoryID,
      buildingID: post.buildingID,
      dropOffLocationID: post.dropOffLocationID,
      otherDropOffLocation: post.otherDropOffLocation,
      description: post.description,
    });
  };

  const closeModal = () => {
    setShowEditInfo(false);
    setModalFields({
      title: post.title,
      date: post.date,
      imageUrl: post.imageUrl,
      categoryID: post.categoryID,
      buildingID: post.buildingID,
      dropOffLocationID: post.dropOffLocationID,
      otherDropOffLocation: post.otherDropOffLocation,
      description: post.description,
    });
  };

  const [isImageLoading, setIsImageLoading] = useState(false);
  const handlePickedImage = async () => {
    setIsImageLoading(true);
    const image = await pickImage();
    setModalFields({ ...modalFields, imageUrl: image });
    setIsImageLoading(false);
  };

  const FORM_DATA = gql`
    query {
      categories {
        name
        categoryId
      }
      buildings {
        name
        buildingId
      }
      dropOffLocations {
        name
        locationId
      }
    }
  `;
  const [executeQuery] = useLazyQuery(FORM_DATA);
  const getFormData = async () => {
    const { data, error } = await executeQuery();
    if (error) {
      console.error("ERROR", JSON.stringify(error, null, 2));
    } else {
      setLocations(data.buildings);
      setCategories(data.categories);
      setDropOffLocations(data.dropOffLocations);
    }
  };

  useEffect(() => {
    getFormData();
  }, []);

  /******************* Claim an item ******************* */
  const CLAIM_ITEM = gql`
    mutation ($postId: Int!, $claimedUserId: Int!) {
      updateFoundItemPost(
        id: $postId
        input: { claimedUserId: $claimedUserId }
      ) {
        foundItemPost {
          postId
          claimedUserId {
            userId
            firstName
            lastName
            email
            imageUrl
          }
        }
      }
    }
  `;
  const [executeClaimItem] = useMutation(CLAIM_ITEM);
  const [isClaimItemLoading, setIsClaimItemLoading] = useState(false);
  const { userID } = useStore();
  const claimItem = async () => {
    setIsClaimItemLoading(true);
    try {
      const result = await executeClaimItem({
        variables: {
          postId: post.postID,
          claimedUserId: userID,
        },
      });
      console.log("GOOD", result);
      // update the claimed user
      setPost({
        ...post,
        claimedUser:
          result.data.updateFoundItemPost.foundItemPost.claimedUserId,
      });
    } catch (error) {
      console.error("ERROR", JSON.stringify(error, null, 2));
    }
    setIsClaimItemLoading(false);
  };

  /* Updating the post */
  const UPDATE_POST = gql`
    mutation (
      $postId: Int!
      $title: String!
      $description: String!
      $buildingId: Int!
      $categoryId: Int!
      $dropOffLocationId: Int
      $otherDropOffLocation: String
      $imageUrl: String!
      $date: String!
    ) {
      updateFoundItemPost(
        id: $postId
        input: {
          title: $title
          description: $description
          buildingId: $buildingId
          categoryId: $categoryId
          dropOffLocationId: $dropOffLocationId
          otherDropOffLocation: $otherDropOffLocation
          imageUrl: $imageUrl
          date: $date
        }
      ) {
        foundItemPost {
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
        }
      }
    }
  `;

  const [executeUpdatePost] = useMutation(UPDATE_POST);
  const [isUpdatePostLoading, setIsUpdatePostLoading] = useState(false);
  const updatePost = async () => {
    setIsUpdatePostLoading(true);
    try {
      console.log("MODAL", modalFields);
      const result = await executeUpdatePost({
        variables: {
          postId: post.postID,
          title: modalFields.title,
          description: modalFields.description,
          date: modalFields.date,
          imageUrl: modalFields.imageUrl,
          categoryId: Number(modalFields.categoryID),
          buildingId: Number(modalFields.buildingID),
          dropOffLocationId: Number(modalFields.dropOffLocationID),
          otherDropOffLocation: modalFields.otherDropOffLocation,
        },
      });

      const {
        title,
        description,
        date,
        imageUrl,
        categoryId,
        buildingId,
        dropOffLocationId,
        otherDropOffLocation,
      } = result.data.updateFoundItemPost.foundItemPost;
      console.log("GOOD", result);
      // Update the edited details for the detailed design page
      setPost({
        ...post,
        title,
        description,
        date,
        imageUrl,
        categoryID: categoryId.categoryId,
        categoryName: categoryId.name,
        buildingID: buildingId.buildingId,
        buildingName: buildingId.name,
        dropOffLocationID: dropOffLocationId.locationId,
        dropOffLocationName: dropOffLocationId.name,
        otherDropOffLocation,
      });
      closeModal();
    } catch (error) {
      console.error("ERROR", JSON.stringify(error, null, 2));
    }
    setIsUpdatePostLoading(false);
  };

  const colorScheme = useColorScheme();
  return (
    <View style={styles.container}>
      <Modal isOpen={showEditInfo} onClose={closeModal}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Edit</Modal.Header>
          <Modal.Body>
            <FormControl>
              <FormControl.Label>Title</FormControl.Label>
              <Input
                type="text"
                onChangeText={(v) =>
                  setModalFields({ ...modalFields, title: v })
                }
                defaultValue={modalFields.title}
              />
            </FormControl>
            <FormControl mt="1">
              <FormControl.Label>Date</FormControl.Label>

              <DatePicker
                style={{ width: 200 }}
                date={modalFields.date}
                mode="date"
                placeholder="select date"
                format="YYYY-MM-DD"
                minDate="2022-01-15"
                maxDate="2025-06-01"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: {
                    position: "absolute",
                    left: 0,
                    top: 4,
                    marginLeft: 0,
                  },
                  dateInput: {
                    marginLeft: 36,
                  },
                  datePicker: {
                    backgroundColor: colorScheme === "dark" ? "#222" : "white",
                  },
                }}
                onDateChange={(v) => {
                  setModalFields({ ...modalFields, date: v });
                }}
              />
            </FormControl>
            <FormControl mt="1">
              <FormControl.Label>Location</FormControl.Label>
              <Select
                selectedValue={modalFields.buildingID}
                minWidth={200}
                accessibilityLabel="Select a Location"
                placeholder="Select a Location"
                onValueChange={(v) => {
                  setModalFields({
                    ...modalFields,
                    buildingID: v,
                  });
                }}
                _selectedItem={{ bg: "yellow.400" }}
                mt={1}
              >
                {locations.map((location) => (
                  <Select.Item
                    key={location.buildingId}
                    label={location.name}
                    value={location.buildingId}
                  />
                ))}
              </Select>
            </FormControl>
            <FormControl mt="1">
              <FormControl.Label>Category</FormControl.Label>

              <Select
                selectedValue={modalFields.categoryID}
                minWidth={200}
                accessibilityLabel="Select a Category"
                placeholder="Select a Category"
                onValueChange={(v) => {
                  setModalFields({
                    ...modalFields,
                    categoryID: v,
                  });
                }}
                _selectedItem={{ bg: "yellow.400" }}
                mt={1}
              >
                {categories.map((category) => (
                  <Select.Item
                    key={category.categoryId}
                    label={category.name}
                    value={category.categoryId}
                  />
                ))}
              </Select>
            </FormControl>
            <FormControl mt="1">
              <FormControl.Label>Drop-Off Location</FormControl.Label>
              <Select
                selectedValue={modalFields.dropOffLocationID}
                minWidth={200}
                accessibilityLabel="Select a Drop-Off Location"
                placeholder="Select a Drop-Off Location"
                onValueChange={(v) => {
                  setModalFields({
                    ...modalFields,
                    dropOffLocationID: v,
                    // reset the other drop off location value when a value is selected
                    otherDropOffLocation: "",
                  });
                }}
                _selectedItem={{ bg: "yellow.400" }}
                mt={1}
              >
                {dropOffLocations.map((location) => (
                  <Select.Item
                    key={location.locationId}
                    label={location.name}
                    value={location.locationId}
                  />
                ))}
              </Select>
            </FormControl>
            {/* ONLY SHOW THE OTHER DROP OFF LOCATION INPUT IF OTHER IS SELECTED */}
            {Number(modalFields.dropOffLocationID) == 17 && (
              <FormControl>
                <FormControl.Label>Other Drop Off Location</FormControl.Label>
                <Input
                  onChangeText={(v) =>
                    setModalFields({
                      ...modalFields,
                      otherDropOffLocation: v,
                    })
                  }
                />
              </FormControl>
            )}
            <FormControl mt="1">
              <FormControl.Label>Description</FormControl.Label>
              <Input
                type="text"
                multiline={true}
                onChangeText={(v) =>
                  setModalFields({ ...modalFields, description: v })
                }
                defaultValue={modalFields.description}
              />
            </FormControl>
            <FormControl mt="1">
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
                    {modalFields.imageUrl ? (
                      <Image
                        style={{
                          borderRadius: 15,
                          width: "100%",
                          height: "100%",
                        }}
                        source={{ uri: modalFields.imageUrl }}
                        resizeMode="stretch"
                      />
                    ) : (
                      <FontAwesome name="image" size={40} color="black" />
                    )}
                  </Fragment>
                )}
              </View>
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
              <Button isLoading={isUpdatePostLoading} onPress={updatePost}>
                Update
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      <View style={styles.header}>
        <View style={styles.header_text}>
          <Text style={styles.header_text_label}>Details</Text>
        </View>
        <View style={styles.whitespace}></View>
      </View>

      <ScrollView style={styles.news_container}>
        <View style={styles.news_item}>
          <View style={styles.text_container}>
            {userID == itemFoundUser.userId && (
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
            )}
            <Text style={styles.title}>{post.title}</Text>

            <View style={styles.text_container}>
              <TouchableOpacity
                style={styles.found_user_profile}
                onPress={goToPublicProfile}
              >
                <ProfileImage
                  style={styles.profile_pic}
                  imageUrl={post.foundUser.imageUrl}
                  firstName={post.foundUser.firstName}
                  lastName={post.foundUser.lastName}
                  textSize={18}
                />
                <Text style={styles.news_text}>
                  {post.foundUser.firstName} {post.foundUser.lastName}
                </Text>
              </TouchableOpacity>

              <Text style={styles.news_text}>{post.categoryName}</Text>
              <Text style={styles.news_text}>{post.buildingName}</Text>
              {/* Display the other drop off location if the drop off location is Other */}
              {post.dropOffLocationID == 17 ? (
                <Text style={styles.news_text}>
                  {post.otherDropOffLocation}
                </Text>
              ) : (
                <Text style={styles.news_text}>{post.dropOffLocationName}</Text>
              )}

              <Text style={styles.news_text}>Lost on {post.date}</Text>
              <Text style={styles.news_text}>{post.description}</Text>
            </View>

            <View style={styles.news_photo}>
              <Image source={{ uri: post.imageUrl }} style={styles.photo} />
            </View>

            {post.claimedUser ? (
              <View style={styles.claimed_user}>
                <AntDesign name="checkcircle" size={24} color="#45fc03" />
                <Text style={styles.claimed_user_text}>
                  Claimed by {post.claimedUser.firstName}{" "}
                  {post.claimedUser.lastName} ({post.claimedUser.email})
                </Text>
              </View>
            ) : (
              <Button
                onPress={claimItem}
                isLoading={isClaimItemLoading}
                size="lg"
                my="6"
                style={{
                  backgroundColor: "#ffc50b",
                  borderColor: "#000",
                  borderWidth: 1,
                  shadowOpacity: 0.3,
                  shadowRadius: 10,
                  shadowOffset: { width: 1, height: 10 },
                }}
                width="40%"
                height="39px"
                borderRadius="20"
                _text={{ color: "#000" }}
              >
                Claim Item
              </Button>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    backgroundColor: "#FFD54F",
    padding: 20,
    justifyContent: "space-between",
    borderBottomColor: "#E1E1E1",
    borderBottomWidth: 1,
  },
  header_button: {
    flex: 1,
  },
  whitespace: {
    flex: 1,
  },
  found_user_profile: {
    marginTop: 10,
    marginBottom: 5,
    marginLeft: 10,
    flexDirection: "row",
  },
  profile_pic: {
    height: 35,
    width: 35,
    borderRadius: 30,
  },
  back_button: {
    flexDirection: "row",
    alignItems: "center",
  },
  back_button_label: {
    color: "#397CA9",
    fontSize: 20,
  },
  instruction: {
    alignSelf: "center",
    marginTop: 5,
  },
  instruction_text: {
    color: "#A3A3A3",
  },
  header_text: {
    flex: 1,
    alignSelf: "center",
  },
  header_text_label: {
    fontSize: 20,
    textAlign: "center",
  },
  news_container: {
    flex: 1,
    flexDirection: "column",
  },
  news_item: {
    flex: 1,
    flexDirection: "row",
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 30,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#E4E4E4",
  },
  news_text: {
    flex: 2,
    flexDirection: "row",
    padding: 10,
    color: "#FFFFFF",
  },
  number: {
    flex: 0.5,
  },
  text_container: {
    flex: 3,
  },
  pretext: {
    color: "#FFFFFF",
    fontSize: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFD54F",
    // fontFamily: 'georgia'
  },
  news_photo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  photo: {
    width: 120,
    height: 120,
  },
  claimed_user: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  claimed_user_text: {
    color: "#45fc03",
    paddingLeft: 10,
  },
});
