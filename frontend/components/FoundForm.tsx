import React, { Fragment, useEffect, useState } from "react";
import { View, Image } from "react-native";
import {
  Button,
  Modal,
  FormControl,
  Input,
  Select,
  Spinner,
  WarningOutlineIcon,
} from "native-base";
import DatePicker from "react-native-datepicker";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useStore } from "../store";
import { pickImage } from "../utils/imagePicker";
import { FontAwesome } from "@expo/vector-icons";
import useColorScheme from "../hooks/useColorScheme";
import {
  formatInvalidState,
  formatValidState,
  INITIAL_VALIDATION_STATE,
} from "../utils/error";

interface FoundFormProps {
  refreshPosts: () => void;
}

export default function FoundForm(props: FoundFormProps) {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState(INITIAL_VALIDATION_STATE);
  const [date, setDate] = useState(INITIAL_VALIDATION_STATE);
  const [locationValue, setLocationValue] = useState(INITIAL_VALIDATION_STATE);
  const [categoryValue, setCategoryValue] = useState(INITIAL_VALIDATION_STATE);
  const [dropOffLocationValue, setDropOffLocationValue] = useState(
    INITIAL_VALIDATION_STATE
  );
  const [otherDropOffLocation, setOtherDropOffLocation] = useState(
    INITIAL_VALIDATION_STATE
  );
  const [description, setDescription] = useState(INITIAL_VALIDATION_STATE);
  const [imageUrl, setImageUrl] = useState(INITIAL_VALIDATION_STATE);

  // Use this to store the buildings (locations), categories, and drop off locations for the drop down selections
  const [locations, setLocations] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [dropOffLocations, setDropOffLocations] = useState<any[]>([]);

  const resetFields = () => {
    setTitle(INITIAL_VALIDATION_STATE);
    setDate(INITIAL_VALIDATION_STATE);
    setLocationValue(INITIAL_VALIDATION_STATE);
    setCategoryValue(INITIAL_VALIDATION_STATE);
    setDropOffLocationValue(INITIAL_VALIDATION_STATE);
    setOtherDropOffLocation(INITIAL_VALIDATION_STATE);
    setDescription(INITIAL_VALIDATION_STATE);
    setImageUrl(INITIAL_VALIDATION_STATE);
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
    setImageUrl(formatValidState(image));
    setIsImageLoading(false);
  };

  const validate = () => {
    let hasError = false;
    if (!title.value) {
      setTitle(formatInvalidState("Title is required"));
      hasError = true;
    }

    if (!date.value) {
      setDate(formatInvalidState("Date is required"));
      hasError = true;
    }

    if (!locationValue.value) {
      setLocationValue(formatInvalidState("Location is required"));
      hasError = true;
    }

    if (!categoryValue.value) {
      setCategoryValue(formatInvalidState("Category is required"));
      hasError = true;
    }

    if (!description.value) {
      setDescription(formatInvalidState("Description is required"));
      hasError = true;
    }

    return !hasError;
  };

  /* Creating the post */
  const CREATE_POST = gql`
    mutation (
      $title: String!
      $foundUserId: Int!
      $description: String!
      $buildingId: Int!
      $categoryId: Int!
      $dropOffLocationId: Int
      $otherDropOffLocation: String
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
      if (validate()) {
        const result = await executeMutation({
          variables: {
            title: title.value,
            foundUserId: Number(userID),
            description: description.value,
            buildingId: Number(locationValue.value),
            categoryId: Number(categoryValue.value),
            dropOffLocationId: dropOffLocationValue.value ? Number(dropOffLocationValue.value) : null,
            otherDropOffLocation: otherDropOffLocation.value,
            imageUrl: imageUrl.value,
            date: date.value,
          },
        });
        console.log("GOOD", result);
        props.refreshPosts();
        closeModal();
      }
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
            <FormControl isInvalid={title.isInvalid}>
              <FormControl.Label>Title</FormControl.Label>
              <Input
                onChangeText={(value) => setTitle(formatValidState(value))}
              />
              <FormControl.ErrorMessage
                fontSize="xl"
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {title.errorMessage}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl mt="1" isInvalid={date.isInvalid}>
              <FormControl.Label>Date</FormControl.Label>
              <DatePicker
                style={{ width: 200 }}
                date={date.value}
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
                  setDate(formatValidState(date));
                }}
              />
              <FormControl.ErrorMessage
                fontSize="xl"
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {date.errorMessage}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl mt="1" isInvalid={locationValue.isInvalid}>
              <FormControl.Label>Location</FormControl.Label>
              <Select
                selectedValue={locationValue.value}
                minWidth={200}
                accessibilityLabel="Select a Location"
                placeholder="Select a Location"
                onValueChange={(itemValue) => {
                  setLocationValue(formatValidState(itemValue));
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
                {locationValue.errorMessage}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl mt="1" isInvalid={categoryValue.isInvalid}>
              <FormControl.Label>Category</FormControl.Label>
              <Select
                selectedValue={categoryValue.value}
                minWidth={200}
                accessibilityLabel="Select a Category"
                placeholder="Select a Category"
                onValueChange={(itemValue) => {
                  setCategoryValue(formatValidState(itemValue));
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
                {categoryValue.errorMessage}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl mt="1" isInvalid={dropOffLocationValue.isInvalid}>
              <FormControl.Label>Drop-Off Location</FormControl.Label>
              <Select
                selectedValue={dropOffLocationValue.value}
                minWidth={200}
                accessibilityLabel="Select a Drop-Off Location"
                placeholder="Select a Drop-Off Location"
                onValueChange={(itemValue) => {
                  setDropOffLocationValue(formatValidState(itemValue));
                  // reset the other drop off location value when a value is selected
                  setOtherDropOffLocation(formatValidState(""));
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
                {dropOffLocationValue.errorMessage}
              </FormControl.ErrorMessage>
            </FormControl>
            {/* ONLY SHOW THE OTHER DROP OFF LOCATION INPUT IF OTHER IS SELECTED */}
            {Number(dropOffLocationValue) == 17 && (
              <FormControl isInvalid={otherDropOffLocation.isInvalid}>
                <FormControl.Label>Other Drop Off Location</FormControl.Label>
                <Input
                  onChangeText={(value) =>
                    setOtherDropOffLocation(formatValidState(value))
                  }
                />
                <FormControl.ErrorMessage
                  fontSize="xl"
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  {otherDropOffLocation.errorMessage}
                </FormControl.ErrorMessage>
              </FormControl>
            )}
            <FormControl mt="1" isInvalid={description.isInvalid}>
              <FormControl.Label>Description</FormControl.Label>
              <Input
                type="text"
                multiline={true}
                onChangeText={(value) =>
                  setDescription(formatValidState(value))
                }
              />
              <FormControl.ErrorMessage
                fontSize="xl"
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {description.errorMessage}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl mt="1" isInvalid={imageUrl.isInvalid}>
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
                    {imageUrl.value ? (
                      <Image
                        style={{
                          borderRadius: 15,
                          width: "100%",
                          height: "100%",
                        }}
                        source={{ uri: imageUrl.value }}
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
                {imageUrl.errorMessage}
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
