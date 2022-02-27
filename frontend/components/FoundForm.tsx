import React, { Fragment, useEffect, useState } from "react";
import { View, Image } from "react-native";
import {
  Button,
  Modal,
  FormControl,
  Input,
  Select,
  Spinner,
} from "native-base";
import DatePicker from "react-native-datepicker";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useStore } from "../store";
import { pickImage } from "../utils/imagePicker";
import { FontAwesome } from "@expo/vector-icons";
import useColorScheme from "../hooks/useColorScheme";

interface FoundFormProps {
  refreshPosts: () => void;
}

export default function FoundForm(props: FoundFormProps) {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [locationValue, setLocationValue] = useState("");
  const [categoryValue, setCategoryValue] = useState("");
  const [dropOffLocationValue, setDropOffLocationValue] = useState("");
  const [otherDropOffLocation, setOtherDropOffLocation] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Use this to store the buildings (locations), categories, and drop off locations for the drop down selections
  const [locations, setLocations] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [dropOffLocations, setDropOffLocations] = useState<any[]>([]);

  const resetFields = () => {
    setTitle("");
    setDate("");
    setLocationValue("");
    setCategoryValue("");
    setDropOffLocationValue("");
    setOtherDropOffLocation("");
    setDescription("");
    setImageUrl("");
  };

  const closeModal = () => {
    setShowModal(false);
    resetFields();
  };

  const openModal = () => {
    setShowModal(true);
  };

  const [isImageLoading, setIsImageLoading] = useState(false);
  const handlePickedImage = async () => {
    setIsImageLoading(true);
    const image = await pickImage();
    setImageUrl(image);
    setIsImageLoading(false);
  };

  /* Creating the post */
  const CREATE_POST = gql`
    mutation (
      $title: String!
      $foundUserId: Int!
      $description: String!
      $buildingId: Int!
      $categoryId: Int!
      $dropOffLocationId: Int!
      $otherDropOffLocation: String!
      $imageUrl: String!
      $date: String!
    ) {
      createFoundItemPost(
        input: {
          title: $title
          foundUserId: $foundUserId
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
        }
      }
    }
  `;
  const [executeMutation] = useMutation(CREATE_POST);
  const { userID } = useStore();
  const [isMutationLoading, setIsMutationLoading] = useState(false);
  const createPost = async () => {
    setIsMutationLoading(true);
    try {
      const result = await executeMutation({
        variables: {
          title,
          foundUserId: Number(userID),
          description,
          buildingId: Number(locationValue),
          categoryId: Number(categoryValue),
          dropOffLocationId: Number(dropOffLocationValue),
          otherDropOffLocation,
          imageUrl,
          date,
        },
      });
      console.log("GOOD", result);
      props.refreshPosts();
      closeModal();
    } catch (error) {
      console.error("ERROR", JSON.stringify(error, null, 2));
    }
    setIsMutationLoading(false);
  };

  /* Retrieving the data for the form */
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

  const colorScheme = useColorScheme();
  return (
    <Fragment>
      <Button
        onPress={() => {
          openModal();
        }}
        size="lg"
        my="0"
        style={{
          backgroundColor: "#ffc50b",
          borderColor: "#000",
          borderWidth: 1,
          shadowOpacity: 0.3,
          shadowRadius: 10,
          shadowOffset: { width: 1, height: 10 },
        }}
        borderRadius="20"
        _text={{ color: "#000" }}
      >
        FOUND ITEM?
      </Button>

      <Modal
        isOpen={showModal}
        onClose={() => {
          closeModal();
        }}
      >
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Create a Post</Modal.Header>
          <Modal.Body>
            <FormControl>
              <FormControl.Label>Title</FormControl.Label>
              <Input onChangeText={(value) => setTitle(value)} />
            </FormControl>
            <FormControl mt="1">
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
                  datePicker: {
                    backgroundColor: colorScheme === "dark" ? "#222" : "white",
                  },
                }}
                onDateChange={(date) => {
                  setDate(date);
                }}
              />
            </FormControl>
            <FormControl mt="1">
              <FormControl.Label>Location</FormControl.Label>
              <Select
                selectedValue={locationValue}
                minWidth={200}
                accessibilityLabel="Select a Location"
                placeholder="Select a Location"
                onValueChange={(itemValue) => {
                  setLocationValue(itemValue);
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
                selectedValue={categoryValue}
                minWidth={200}
                accessibilityLabel="Select a Category"
                placeholder="Select a Category"
                onValueChange={(itemValue) => {
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
            </FormControl>
            <FormControl mt="1">
              <FormControl.Label>Drop-Off Location</FormControl.Label>
              <Select
                selectedValue={dropOffLocationValue}
                minWidth={200}
                accessibilityLabel="Select a Drop-Off Location"
                placeholder="Select a Drop-Off Location"
                onValueChange={(itemValue) => {
                  setDropOffLocationValue(itemValue);
                  // reset the other drop off location value when a value is selected
                  setOtherDropOffLocation("");
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
            {Number(dropOffLocationValue) == 17 && (
              <FormControl>
                <FormControl.Label>Other Drop Off Location</FormControl.Label>
                <Input
                  onChangeText={(value) => setOtherDropOffLocation(value)}
                />
              </FormControl>
            )}
            <FormControl mt="1">
              <FormControl.Label>Description</FormControl.Label>
              <Input
                multiline={true}
                onChangeText={(value) => setDescription(value)}
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
                    {imageUrl ? (
                      <Image
                        style={{
                          borderRadius: 15,
                          width: "100%",
                          height: "100%",
                        }}
                        source={{ uri: imageUrl }}
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
                onPress={() => {
                  closeModal();
                }}
              >
                Cancel
              </Button>
              <Button
                isLoading={isMutationLoading}
                onPress={() => {
                  createPost();
                }}
              >
                Post
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Fragment>
  );
}
