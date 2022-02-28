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
import { FontAwesome, Foundation } from "@expo/vector-icons";
import DatePicker from "react-native-datepicker";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import ProfileImage from "./shared/ProfileImage";
import { useStore } from "../store";
import useColorScheme from "../hooks/useColorScheme";
import { pickImage } from "../utils/imagePicker";

export default function LostDetailedItem({ route }) {
  const navigation = useNavigation();
  const { userID } = useStore();

  const {
    itemPostId,
    itemTitle,
    itemDate,
    itemImage,
    itemCategory,
    itemLocation,
    itemDescription,
    itemLostUser,
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
    lostUser: itemLostUser,
  });

  // Used to show/hide the edit modal
  const [showEditInfo, setShowEditInfo] = useState(false);

  // Used to hold the data for the selection lists
  const [locations, setLocations] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const goToPublicProfile = () => {
    navigation.navigate("PublicProfile", { userID: post.lostUser.userId });
  };

  const [modalFields, setModalFields] = useState({
    title: "",
    date: "",
    imageUrl: "",
    categoryID: "",
    buildingID: "",
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

  /* Updating the post */
  const UPDATE_POST = gql`
    mutation (
      $postId: Int!
      $title: String!
      $description: String!
      $buildingId: Int!
      $categoryId: Int!
      $imageUrl: String!
      $date: String!
    ) {
      updateLostItemPost(
        id: $postId
        input: {
          title: $title
          description: $description
          buildingId: $buildingId
          categoryId: $categoryId
          imageUrl: $imageUrl
          date: $date
        }
      ) {
        lostItemPost {
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
        },
      });

      const { title, description, date, imageUrl, categoryId, buildingId } =
        result.data.updateLostItemPost.lostItemPost;
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
      });
      closeModal();
    } catch (error) {
      console.error("ERROR", JSON.stringify(error, null, 2));
    }
    setIsUpdatePostLoading(false);
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
    }
  };

  useEffect(() => {
    getFormData();
  }, []);

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
            {/* <Text style={styles.title}>{itemPostId}</Text> */}
            {userID == post.lostUser.userId && (
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
                  imageUrl={post.lostUser.imageUrl}
                  firstName={post.lostUser.firstName}
                  lastName={post.lostUser.lastName}
                  textSize={18}
                />
                <Text style={styles.news_text}>
                  {post.lostUser.firstName} {post.lostUser.lastName}
                </Text>
              </TouchableOpacity>

              <Text style={styles.news_text}>{post.categoryName}</Text>
              <Text style={styles.news_text}>{post.buildingName}</Text>
              <Text style={styles.news_text}>Lost on {post.date}</Text>
              <Text style={styles.news_text}>{post.description}</Text>
            </View>

            <View style={styles.news_photo}>
              <Image source={{ uri: post.imageUrl }} style={styles.photo} />
            </View>
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
});
