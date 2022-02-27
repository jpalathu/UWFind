import React, { useEffect, useState } from "react";
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
} from "native-base";
import { Foundation } from "@expo/vector-icons";
import DatePicker from "react-native-datepicker";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import ProfileImage from "./shared/ProfileImage";
import { useStore } from "../store";

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
  const [showEditInfo, setShowEditInfo] = useState(false);
  const [date, setDate] = useState(itemDate);
  const [locationValue, setLocationValue] = useState(itemLocation);
  const [categoryValue, setCategoryValue] = useState("");

  const [locations, setLocations] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const goToPublicProfile = () => {
    navigation.navigate("PublicProfile", { userID: itemLostUser.userId });
  };

  const [post, setpost] = useState({
    title: "",
    date: "",
    image: "",
    category: "",
    location: "",
    description: "",
  });

  const [modalFields, setModalFields] = useState({
    title: "",
    date: "",
    image: "",
    category: "",
    location: "",
    description: "",
  });

  const openModal = () => {
    setShowEditInfo(true);
    setModalFields({
      title: itemTitle,
      date: itemDate,
      image: itemImage,
      category: itemCategory,
      location: itemLocation,
      description: itemDescription,
    });
  };

  const closeModal = () => {
    setShowEditInfo(false);
    setModalFields({
      title: itemTitle,
      date: itemDate,
      image: itemImage,
      category: itemCategory,
      location: itemLocation,
      description: itemDescription,
    });
  };

  const validate = () => {
    return true;
  };

  /* Updating the user */
  //    const UPDATE_USER_MUTATION = gql`
  //    mutation (
  //      $title: String!
  //      $date: String!
  //      $category: String!
  //      $location: String!
  //      $description: String!
  //    ) {
  //      updatePost(
  //       postId: $postId
  //        input: { title: $title, date: $date, category: $category, location: $location, description: $description}
  //      ) {
  //        post {
  //          title
  //          date
  //          category
  //          location
  //          description
  //        }
  //      }
  //    }
  //  `;

  // const [executeMutation] = useMutation(UPDATE_USER_MUTATION);
  // const [isMutationLoading, setIsMutationLoading] = useState(false);
  // const updateProfile = async () => {
  //   setIsMutationLoading(true);
  //   if (validate()) {
  //     try {
  //       const result = await executeMutation({
  //         variables: {
  //           title: modalFields.title,
  //           date: modalFields.date,
  //           image: modalFields.image,
  //           category: modalFields.category,
  //           location: modalFields.location,
  //           description: modalFields.description,
  //         },
  //       });
  //       console.log("GOOD", result);
  //       const { title, date, image, category, location, description } = result.data.updatePost.post;
  //       setPost({ title, date, image, category, location, description });
  //       closeModal();
  //     } catch (error) {
  //       console.error("ERROR", JSON.stringify(error, null, 2));
  //     }
  //   }
  //   setIsMutationLoading(false);
  // };

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
            <FormControl mt="3">
              <FormControl.Label>Date</FormControl.Label>

              <DatePicker
                style={{ width: 200 }}
                date={date}
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
                }}
                onDateChange={(v) => {
                  setModalFields({ ...modalFields, date: v });
                  setDate(v);
                }}
              />
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>Location</FormControl.Label>
              <Select
                selectedValue={locationValue}
                minWidth={200}
                accessibilityLabel="Select a Location"
                placeholder="Select a Location"
                onValueChange={(v) => {
                  setModalFields({ ...modalFields, location: v });
                  setLocationValue(v);
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
              {/* <Input
                type="text"
                onChangeText={(v) => setModalFields({ ...modalFields, location: v })}
                defaultValue={modalFields.location}
              /> */}
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>Category</FormControl.Label>

              <Select
                selectedValue={categoryValue}
                minWidth={200}
                accessibilityLabel="Select a Category"
                placeholder="Select a Category"
                onValueChange={(itemValue) => {
                  setModalFields({ ...modalFields, location: itemValue });
                  setCategoryValue(itemValue);
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
              {/* <Input
                type="text"
                onChangeText={(v) => setModalFields({ ...modalFields, category: v })}
                defaultValue={modalFields.category}
              /> */}
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>Description</FormControl.Label>
              <Input
                type="text"
                onChangeText={(v) =>
                  setModalFields({ ...modalFields, description: v })
                }
                defaultValue={modalFields.description}
              />
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>Image</FormControl.Label>
              <Input
                type="text"
                onChangeText={(v) =>
                  setModalFields({ ...modalFields, image: v })
                }
                defaultValue={modalFields.image}
              />
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
              {/* <Button isLoading={isMutationLoading} onPress={updateProfile}>
                Update
              </Button> */}
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
            {userID == itemLostUser.userId && (
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
            <Text style={styles.title}>{itemTitle}</Text>

            <View style={styles.text_container}>
              <TouchableOpacity
                style={styles.found_user_profile}
                onPress={goToPublicProfile}
              >
                <ProfileImage
                  style={styles.profile_pic}
                  imageUrl={itemLostUser.imageUrl}
                  firstName={itemLostUser.firstName}
                  lastName={itemLostUser.lastName}
                  textSize={18}
                />
                <Text style={styles.news_text}>
                  {itemLostUser.firstName} {itemLostUser.lastName}
                </Text>
              </TouchableOpacity>

              <Text style={styles.news_text}>{itemCategory}</Text>
              <Text style={styles.news_text}>{itemLocation}</Text>
              <Text style={styles.news_text}>Lost on {itemDate}</Text>
              <Text style={styles.news_text}>{itemDescription}</Text>
            </View>

            <View style={styles.news_photo}>
              <Image source={{ uri: itemImage }} style={styles.photo} />
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
