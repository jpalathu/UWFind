import React, { Fragment, useEffect, useState } from "react";
import { View, Image } from "react-native";
import { pickImage } from "../utils/imagePicker";

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
import { FontAwesome } from "@expo/vector-icons";

interface LostFormProps {
  refreshPosts: () => void;
}

export default function LostForm(props: LostFormProps) {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [locationValue, setLocationValue] = useState("");
  const [categoryValue, setCategoryValue] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Use this to store the buildings (locations) and categories for the drop down selections
  const [locations, setLocations] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const resetFields = () => {
    setTitle("");
    setDate("");
    setLocationValue("");
    setCategoryValue("");
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
      $lostUserId: Int!
      $description: String!
      $buildingId: Int!
      $categoryId: Int!
      $imageUrl: String!
      $date: String!
    ) {
      createLostItemPost(
        input: {
          title: $title
          lostUserId: $lostUserId
          description: $description
          buildingId: $buildingId
          categoryId: $categoryId
          imageUrl: $imageUrl
          date: $date
        }
      ) {
        lostItemPost {
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
          lostUserId: Number(userID),
          description,
          buildingId: Number(locationValue),
          categoryId: Number(categoryValue),
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
        LOST ITEM?
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
          {/* <Image
            source={{ uri: "https://bootdey.com/img/Content/avatar/avatar6.png" }}
          /> */}
          <Modal.Body>
            <FormControl>
              <FormControl.Label>Title</FormControl.Label>
              <Input onChangeText={(value) => setTitle(value)} />
            </FormControl>

            {/* <FormControl>
<Image source={{ uri: 'https://uwfind53028-staging.s3.us-east-2.amazonaws.com/public/84C05669-2526-4BF7-A06B-D93710EFFA9C.png'}} />

</FormControl> */}

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
              <FormControl.Label>Description</FormControl.Label>
              <Input onChangeText={(value) => setDescription(value)} />
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
