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
  WarningOutlineIcon,
} from "native-base";
import { Foundation, AntDesign, FontAwesome } from "@expo/vector-icons";
import DatePicker from "react-native-datepicker";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import ProfileImage from "./shared/ProfileImage";
import { useNavigation } from "@react-navigation/native";
import { useStore } from "../store";
import useColorScheme from "../hooks/useColorScheme";
import { pickImage } from "../utils/imagePicker";
import {
  formatInvalidState,
  formatValidState,
  INITIAL_VALIDATION_STATE,
} from "../utils/error";

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
    dropOffLocationID: itemDropOffLocation
      ? itemDropOffLocation.locationId
      : "",
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
    title: INITIAL_VALIDATION_STATE,
    date: INITIAL_VALIDATION_STATE,
    imageUrl: INITIAL_VALIDATION_STATE,
    categoryID: INITIAL_VALIDATION_STATE,
    buildingID: INITIAL_VALIDATION_STATE,
    dropOffLocationID: INITIAL_VALIDATION_STATE,
    otherDropOffLocation: INITIAL_VALIDATION_STATE,
    description: INITIAL_VALIDATION_STATE,
  });

  const resetFields = () => {
    setModalFields({
      title: formatValidState(post.title),
      date: formatValidState(post.date),
      imageUrl: formatValidState(post.imageUrl),
      categoryID: formatValidState(post.categoryID),
      buildingID: formatValidState(post.buildingID),
      dropOffLocationID: formatValidState(post.dropOffLocationID),
      otherDropOffLocation: formatValidState(post.otherDropOffLocation),
      description: formatValidState(post.description),
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

  const validate = () => {
    let hasError = false;
    const {
      title,
      date,
      categoryID,
      buildingID,
      dropOffLocationID,
      otherDropOffLocation,
      description,
      imageUrl,
    } = modalFields;

    if (!title.value) {
      setModalFields({
        ...modalFields,
        title: formatInvalidState("Title is required"),
      });
      hasError = true;
    }

    if (!date.value) {
      setModalFields({
        ...modalFields,
        date: formatInvalidState("Date is required"),
      });
      hasError = true;
    }

    if (!categoryID.value) {
      setModalFields({
        ...modalFields,
        categoryID: formatInvalidState("Category is required"),
      });
      hasError = true;
    }

    if (!buildingID.value) {
      setModalFields({
        ...modalFields,
        buildingID: formatInvalidState("Location is required"),
      });
      hasError = true;
    }

    if (!description.value.trim()) {
      setModalFields({
        ...modalFields,
        description: formatInvalidState("Description is required"),
      });
      hasError = true;
    }

    // Other drop off location is required if the drop off location is Other
    if (Number(dropOffLocationID.value) == 17 && !otherDropOffLocation.value) {
      setModalFields({
        ...modalFields,
        otherDropOffLocation: formatInvalidState(
          "Drop-Off Location is required"
        ),
      });
      hasError = true;
    }

    return !hasError;
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
      if (validate()) {
        const result = await executeUpdatePost({
          variables: {
            postId: post.postID,
            title: modalFields.title.value,
            description: modalFields.description.value,
            date: modalFields.date.value,
            imageUrl: modalFields.imageUrl.value,
            categoryId: Number(modalFields.categoryID.value),
            buildingId: Number(modalFields.buildingID.value),
            dropOffLocationId: modalFields.dropOffLocationID.value
              ? Number(modalFields.dropOffLocationID.value)
              : null,
            otherDropOffLocation: modalFields.otherDropOffLocation.value,
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
          dropOffLocationID: dropOffLocationId
            ? dropOffLocationId.locationId
            : "",
          dropOffLocationName: dropOffLocationId ? dropOffLocationId.name : "",
          otherDropOffLocation,
        });
        closeModal();
      }
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
            <FormControl isRequired isInvalid={modalFields.title.isInvalid}>
              <FormControl.Label>Title</FormControl.Label>
              <Input
                type="text"
                onChangeText={(v) =>
                  setModalFields({ ...modalFields, title: formatValidState(v) })
                }
                defaultValue={modalFields.title.value}
              />
              <FormControl.ErrorMessage
                fontSize="xl"
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {modalFields.title.errorMessage}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl
              mt="1"
              isRequired
              isInvalid={modalFields.date.isInvalid}
            >
              <FormControl.Label>Date</FormControl.Label>
              <DatePicker
                style={{ width: 200 }}
                date={modalFields.date.value}
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
                  setModalFields({ ...modalFields, date: formatValidState(v) });
                }}
              />
              <FormControl.ErrorMessage
                fontSize="xl"
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {modalFields.date.errorMessage}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl
              mt="1"
              isRequired
              isInvalid={modalFields.buildingID.isInvalid}
            >
              <FormControl.Label>Location</FormControl.Label>
              <Select
                selectedValue={modalFields.buildingID.value}
                minWidth={200}
                accessibilityLabel="Select a Location"
                placeholder="Select a Location"
                onValueChange={(v) => {
                  setModalFields({
                    ...modalFields,
                    buildingID: formatValidState(v),
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
              <FormControl.ErrorMessage
                fontSize="xl"
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {modalFields.buildingID.errorMessage}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl
              mt="1"
              isRequired
              isInvalid={modalFields.categoryID.isInvalid}
            >
              <FormControl.Label>Category</FormControl.Label>

              <Select
                selectedValue={modalFields.categoryID.value}
                minWidth={200}
                accessibilityLabel="Select a Category"
                placeholder="Select a Category"
                onValueChange={(v) => {
                  setModalFields({
                    ...modalFields,
                    categoryID: formatValidState(v),
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
              <FormControl.ErrorMessage
                fontSize="xl"
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {modalFields.categoryID.errorMessage}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl
              mt="1"
              isInvalid={modalFields.dropOffLocationID.isInvalid}
            >
              <FormControl.Label>Drop-Off Location</FormControl.Label>
              <Select
                selectedValue={modalFields.dropOffLocationID.value}
                minWidth={200}
                accessibilityLabel="Select a Drop-Off Location"
                placeholder="Select a Drop-Off Location"
                onValueChange={(v) => {
                  setModalFields({
                    ...modalFields,
                    dropOffLocationID: formatValidState(v),
                    // reset the other drop off location value when a value is selected
                    otherDropOffLocation: formatValidState(""),
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
              <FormControl.ErrorMessage
                fontSize="xl"
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {modalFields.dropOffLocationID.errorMessage}
              </FormControl.ErrorMessage>
            </FormControl>
            {/* ONLY SHOW THE OTHER DROP OFF LOCATION INPUT IF OTHER IS SELECTED */}
            {Number(modalFields.dropOffLocationID.value) == 17 ? (
              <FormControl
                mt="1"
                isInvalid={modalFields.otherDropOffLocation.isInvalid}
              >
                <FormControl.Label isRequired>
                  Other Drop-Off Location
                </FormControl.Label>
                <Input
                  onChangeText={(v) =>
                    setModalFields({
                      ...modalFields,
                      otherDropOffLocation: formatValidState(v),
                    })
                  }
                  defaultValue={modalFields.otherDropOffLocation.value}
                />
                <FormControl.ErrorMessage
                  fontSize="xl"
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  {modalFields.otherDropOffLocation.errorMessage}
                </FormControl.ErrorMessage>
              </FormControl>
            ) : null}
            <FormControl
              mt="1"
              isRequired
              isInvalid={modalFields.description.isInvalid}
            >
              <FormControl.Label>Description</FormControl.Label>
              <Input
                type="text"
                multiline={true}
                onChangeText={(v) =>
                  setModalFields({
                    ...modalFields,
                    description: formatValidState(v),
                  })
                }
                defaultValue={modalFields.description.value}
              />
              <FormControl.ErrorMessage
                fontSize="xl"
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {modalFields.description.errorMessage}
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
            {userID == post.foundUser.userId ? (
              <View style={{ flexDirection: "row", alignSelf: "flex-end" }}>
                <IconButton
                  mr="3"
                  px="2"
                  variant="solid"
                  _icon={{
                    as: Foundation,
                    name: "pencil",
                  }}
                  onPress={openModal}
                />
                <DeletePost postID={post.postID} navigation={navigation} />
              </View>
            ) : null}
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
                <Text style={styles.label_text}>
                  {post.foundUser.firstName} {post.foundUser.lastName}
                </Text>
              </TouchableOpacity>

              <Text style={styles.label_text}>Category: <Text style={styles.news_text}>{post.categoryName}</Text></Text>
              <Text style={styles.label_text}>Found in: <Text style={styles.news_text}>{post.buildingName}</Text></Text>
              {/* Display the other drop off location if the drop off location is Other */}
              {post.dropOffLocationID && post.dropOffLocationID == 17 ? (
                <Text style={styles.label_text}>Drop-off Location: <Text style={styles.news_text}>
                  {post.otherDropOffLocation}
                </Text></Text>
              ) : null}
              {post.dropOffLocationID && post.dropOffLocationID != 17 ? (
                <Text style={styles.label_text}>Drop-off Location: <Text style={styles.news_text}>{post.dropOffLocationName}</Text></Text>
              ) : null}

              <Text style={styles.label_text}>Found on: <Text style={styles.news_text}>{post.date}</Text></Text>
              <Text style={styles.label_text}>Description:{"\n"}<Text style={styles.news_text}>{post.description}</Text></Text>
            </View>

            {/* Only show the image if the url exists */}
            {post.imageUrl ? (
              <View style={styles.news_photo}>
                <Image source={{ uri: post.imageUrl }} style={styles.photo} />
              </View>
            ) : null}

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
                mt="5"
                style={{
                  backgroundColor: "#ffc50b",
                  borderColor: "#000",
                  borderWidth: 1,
                  shadowOpacity: 0.3,
                  shadowRadius: 10,
                  shadowOffset: { width: 1, height: 10 },
                  alignSelf: "center"
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

interface DeletePostProps {
  postID: Number;
  navigation: any;
}

const DeletePost = (props: DeletePostProps) => {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const DELETE_POST = gql`
    mutation ($id: Int!) {
      deleteFoundItemPost(id: $id) {
        foundItemPost {
          postId
        }
      }
    }
  `;
  const [executeDeletePost] = useMutation(DELETE_POST);
  const [isDeleting, setIsDeleting] = useState(false);
  const deletePost = async () => {
    setIsDeleting(true);
    try {
      const result = await executeDeletePost({
        variables: {
          id: Number(props.postID),
        },
      });
      props.navigation.navigate("Home");
    } catch (error) {
      console.error("ERROR", JSON.stringify(error, null, 2));
    }
    setIsDeleting(false);
  };

  return (
    <View>
      <Modal isOpen={showModal} onClose={closeModal}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Delete</Modal.Header>
          <Modal.Body>Are you sure you want to delete this post?</Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={closeModal}
              >
                No
              </Button>
              <Button
                isLoading={isDeleting}
                onPress={deletePost}
                bgColor="red.400"
              >
                Yes
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      <IconButton
        pl="3"
        variant="solid"
        _icon={{
          as: FontAwesome,
          name: "trash",
          alignItems: "flex-end",
        }}
        bg="red.400"
        _pressed={{
          bg: "red.400",
        }}
        onPress={openModal}
      />
    </View>
  );
};

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
  label_text: {
    flex: 2,
    flexDirection: "row",
    padding: 10,
    color: "#FFD54F",
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
    width: 310,
    height: 310,
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
