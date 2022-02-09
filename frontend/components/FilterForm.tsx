import React, { Fragment, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Switch,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Picker } from "react-native-woodpicker";
// import Button from "./shared/Button";
import {
  Button,
  Text,
  Modal,
  FormControl,
  Input,
  Box,
  Actionsheet,
  Heading,
  Select,
} from "native-base";
import DummyCategories from "../dummy/category.json";
import DummyDropOffLocations from "../dummy/drop_off_location.json";
import DatePicker from "react-native-datepicker";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useStore } from "../store";
import { MaterialIcons } from "@expo/vector-icons";

interface FilterFormProps {
  isLost: boolean;
  items: any[];
  setFilteredItems: (filteredItems: any[]) => void;
}
export default function FilterForm(props: FilterFormProps) {
  const [showModal, setShowModal] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [locationValue, setLocationValue] = useState("");
  const [categoryValue, setCategoryValue] = useState("");

  // TODO: change default when image pop up is connected

  // Use this to store the buildings (locations) and categories for the drop down selections
  const [locations, setLocations] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const resetFields = () => {
    setStartDate("");
    setEndDate("");
    setLocationValue("");
    setCategoryValue("");
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const openModal = () => {
    setShowModal(true);
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

  /* Filter the items */
  const LOST_ITEM_POSTS = gql`
    query (
      $startDate: String
      $endDate: String
      $categoryId: Int
      $buildingId: Int
    ) {
      lostItemPosts(
        filter: {
          startDate: $startDate
          endDate: $endDate
          categoryId: $categoryId
          buildingId: $buildingId
        }
      ) {
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
      }
    }
  `;

  const FOUND_ITEM_POSTS = gql`
    query (
      $startDate: String
      $endDate: String
      $categoryId: Int
      $buildingId: Int
    ) {
      foundItemPosts(
        filter: {
          startDate: $startDate
          endDate: $endDate
          categoryId: $categoryId
          buildingId: $buildingId
        }
      ) {
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
      }
    }
  `;
  const [executeFilterQuery] = useLazyQuery(
    props.isLost ? LOST_ITEM_POSTS : FOUND_ITEM_POSTS
  );
  const filter = async () => {
    console.log(startDate, endDate, categoryValue, locationValue);
    const { data, error } = await executeFilterQuery({
      variables: {
        startDate: startDate ? startDate : null,
        endDate: endDate ? endDate : null,
        categoryId: categoryValue ? Number(categoryValue) : null,
        buildingId: locationValue ? Number(locationValue) : null,
      },
    });
    if (error) {
      console.error("ERROR", JSON.stringify(error, null, 2));
    } else {
      console.log(data.foundItemPosts)
      props.setFilteredItems(
        props.isLost ? data.lostItemPosts : data.foundItemPosts
      );
      closeModal();
    }
  };

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
        FILTER
      </Button>

      <Modal
        isOpen={showModal}
        onClose={() => {
          closeModal();
        }}
      >
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Filter Feed</Modal.Header>
          <Modal.Body>
            <TouchableOpacity
              onPress={resetFields}
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <MaterialIcons name="cancel" size={20} color="black" />
              <Text style={{ paddingLeft: 1 }}>Clear</Text>
            </TouchableOpacity>
            <FormControl>
              <FormControl.Label>Start Date</FormControl.Label>
              <DatePicker
                style={{ width: 200 }}
                date={startDate}
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
                  setStartDate(date);
                }}
              />
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>End Date</FormControl.Label>
              <DatePicker
                style={{ width: 200 }}
                date={endDate}
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
                  setEndDate(date);
                }}
              />
            </FormControl>
            <FormControl>
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
            <FormControl>
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
                onPress={() => {
                  filter();
                }}
              >
                Apply
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    backgroundColor: "#00000099",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    backgroundColor: "#f9fafb",
    width: "85%",
    borderRadius: 15,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "lightgray",
  },
  modalHeader: {},
  title: {
    fontWeight: "bold",
    fontSize: 20,
    padding: 15,
    color: "#000",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 15,
  },
  modalBody: {
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  modalFooter: {},
  actions: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  input: {
    margin: 10,
    height: 40,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
});
