import React, { Fragment, useState } from "react";
import {
  StyleSheet,
  View,
  Switch,
  TextInput,
  ScrollView,
} from "react-native";
import { Picker } from "react-native-woodpicker";
// import Button from "./shared/Button";
import { Button, Text, Modal, FormControl, Input, Box, Actionsheet, Heading, Select } from "native-base";
import DummyCategories from "../dummy/category.json";
import DummyDropOffLocations from "../dummy/drop_off_location.json";
import DatePicker from 'react-native-datepicker';

  export default function LostFoundForm() {
  // const [isFoundItemForm, setIsFoundItemForm] = useState(true);
  // const [location, setLocation] = useState(null);
  // const [category, setCategory] = useState(null);
  // const [dropOffLocation, setDropOffLocation] = useState(null);
  // const [description, setDescription] = useState(null);
  // const [image, setImage] = useState(null);

  // const openModal = () => setIsModalVisible(true);
  // const closeModal = () => {
  //   setIsModalVisible(false);
  //   resetData();
  // };
  // const createPost = () => {
  //   if (isFoundItemForm) {
  //     console.log("found item", {
  //       location,
  //       dropOffLocation: dropOffLocation.value,
  //       category: category.value,
  //       description,
  //       image,
  //     });
  //   } else {
  //     console.log("lost item", {
  //       location,
  //       category: category.value,
  //       description,
  //       image,
  //     });
  //   }
  //   console.log("post created!");
  //   closeModal();
  // };

  // const resetData = () => {
  //   setLocation(null);
  //   setCategory(null);
  //   setDropOffLocation(null);
  //   setDescription(null);
  // };

  // const changeForm = (isFoundItemForm: boolean) => {
  //   setIsFoundItemForm(isFoundItemForm);
  //   resetData();
  // };

  const [date, setDate] = useState("2022-01-15");
  const [secondDate, setSecondDate] = useState("2022-01-15");

  const [showModal, setShowModal] = useState(false);
  const [showSecondModal, setShowSecondModal] = useState(false);

  const [locationValue, setLocationValue] = useState("cloth");
  const [categoryValue, setCategoryValue] = useState("l1");
  const [locationSecondValue, setLocationSecondValue] = useState("cloth");
  const [categorySecondValue, setCategorySecondValue] = useState("l1");



  return (
      <Fragment>
        <Button
          onPress={() => {setShowModal(true)}}
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
          borderRadius="20"
          _text={{ color: "#000" }}
        >
          FOUND ITEM?
        </Button>

        <Button
          onPress={() => {setShowSecondModal(true)}}
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
          borderRadius="20"
          _text={{ color: "#000" }}
        >
          LOST ITEM?
        </Button>
        
        <Modal isOpen={showModal} onClose={() => {setShowModal(false)}}>
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>Create a Post</Modal.Header>
            <Modal.Body>
              <FormControl>
                <FormControl.Label>Title</FormControl.Label>
                <Input />
              </FormControl>
              <FormControl mt="3">
                <FormControl.Label>Date</FormControl.Label>
                <DatePicker
          style={{width: 200}}
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
              position: 'absolute',
              left: 0,
              top: 4,
              marginLeft: 0
            },
            dateInput: {
              marginLeft: 36
            }
          }}
          onDateChange={(date) => {setDate(date)}}
        />
              </FormControl>
              <FormControl>
                <FormControl.Label>Location</FormControl.Label>
                  <Select selectedValue={locationValue} minWidth={200} accessibilityLabel="Select a Location" 
                          placeholder="Select a Location" 
                          onValueChange={itemValue => {setLocationValue(itemValue);}} _selectedItem={{bg: "yellow.400"}} mt={1}>
                            {/* ADD ALL LOCATIONS HERE */}
                            <Select.Item label="L1" value="l1" />
                            <Select.Item label="L2" value="l2" />
                            <Select.Item label="L3" value="l3" />
                            <Select.Item label="L4" value="l4" />
                            <Select.Item label="L5" value="l5" />
                            <Select.Item label="L6" value="l6" />
                  </Select>
              </FormControl>
              <FormControl>
                <FormControl.Label>Category</FormControl.Label>
                  <Select selectedValue={categoryValue} minWidth={200} accessibilityLabel="Select a Category" 
                          placeholder="Select a Category" 
                          onValueChange={itemValue => {setCategoryValue(itemValue);}} _selectedItem={{bg: "yellow.400"}} mt={1}>
                            <Select.Item label="Clothing Item" value="cloth" />
                            <Select.Item label="Electronics" value="elec" />
                            <Select.Item label="Footwear" value="foot" />
                            <Select.Item label="Jewellery" value="jwl" />
                            <Select.Item label="Keys" value="key" />
                            <Select.Item label="Stationary" value="stat" />
                            <Select.Item label="Wallet" value="walt" />
                            <Select.Item label="Other" value="other" />
                  </Select>
              </FormControl>
                 <FormControl>
                <FormControl.Label>Description</FormControl.Label>
                <Input />
              </FormControl>
              <FormControl>
                {/* NEED TO CHANGE THIS TO UPLOAD IMAGE */}
                <FormControl.Label>Image</FormControl.Label>
                <Input />
              </FormControl>
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button
                  variant="ghost"
                  colorScheme="blueGray"
                  onPress={() => {setShowModal(false)}}

                >
                  Cancel
                </Button>
                <Button
                  onPress={() => {setShowModal(false)}}
                  >
                  Post
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>

        <Modal isOpen={showSecondModal} onClose={() => {setShowSecondModal(false)}}>
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>Create a Post</Modal.Header>
            <Modal.Body>
              <FormControl>
                <FormControl.Label>Title</FormControl.Label>
                <Input />
              </FormControl>
              <FormControl mt="3">
                <FormControl.Label>Date</FormControl.Label>
                <DatePicker
          style={{width: 200}}
          date={secondDate}
          mode="date"
          placeholder="select date"
          format="YYYY-MM-DD"
          minDate="2022-01-15"
          maxDate="2025-06-01"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              position: 'absolute',
              left: 0,
              top: 4,
              marginLeft: 0
            },
            dateInput: {
              marginLeft: 36
            }
          }}
          onDateChange={(secondDate) => {setDate(secondDate)}}
        />
              </FormControl>
              <FormControl>
                <FormControl.Label>Location</FormControl.Label>
                  <Select selectedValue={locationSecondValue} minWidth={200} accessibilityLabel="Select a Location" 
                          placeholder="Select a Location" 
                          onValueChange={itemValue => {setLocationSecondValue(itemValue);}} _selectedItem={{bg: "yellow.400"}} mt={1}>
                            {/* ADD ALL LOCATIONS HERE */}
                            <Select.Item label="L1" value="l1" />
                            <Select.Item label="L2" value="l2" />
                            <Select.Item label="L3" value="l3" />
                            <Select.Item label="L4" value="l4" />
                            <Select.Item label="L5" value="l5" />
                            <Select.Item label="L6" value="l6" />
                  </Select>
              </FormControl>
              <FormControl>
                <FormControl.Label>Category</FormControl.Label>
                  <Select selectedValue={categorySecondValue} minWidth={200} accessibilityLabel="Select a Category" 
                          placeholder="Select a Category" 
                          onValueChange={itemValue => {setCategorySecondValue(itemValue);}} _selectedItem={{bg: "yellow.400"}} mt={1}>
                            <Select.Item label="Clothing Item" value="cloth" />
                            <Select.Item label="Electronics" value="elec" />
                            <Select.Item label="Footwear" value="foot" />
                            <Select.Item label="Jewellery" value="jwl" />
                            <Select.Item label="Keys" value="key" />
                            <Select.Item label="Stationary" value="stat" />
                            <Select.Item label="Wallet" value="walt" />
                            <Select.Item label="Other" value="other" />
                  </Select>
              </FormControl>
                 <FormControl>
                <FormControl.Label>Description</FormControl.Label>
                <Input />
              </FormControl>
              <FormControl>
                {/* NEED TO CHANGE THIS TO UPLOAD IMAGE */}
                <FormControl.Label>Image</FormControl.Label>
                <Input />
              </FormControl>
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button
                  variant="ghost"
                  colorScheme="blueGray"
                  onPress={() => {setShowSecondModal(false)}}

                >
                  Cancel
                </Button>
                <Button
                  onPress={() => {setShowSecondModal(false)}}
                  >
                  Post
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
  
        {/* <Modal visible={isModalVisible}>
          <View style={styles.modal}>
            <View style={styles.modalContainer}>
              <ModalHeader
                isFoundItemForm={isFoundItemForm}
                changeForm={changeForm}
              />
              <ModalBody
                isFoundItemForm={isFoundItemForm}
                location={location}
                setLocation={setLocation}
                description={description}
                setDescription={setDescription}
                dropOffLocation={dropOffLocation}
                setDropOffLocation={setDropOffLocation}
                category={category}
                setCategory={setCategory}
              />
              <ModalFooter closeModal={closeModal} createPost={createPost} />
            </View>
          </View>
        </Modal> */}
      </Fragment>
    );

  
  
}

// type HeaderProps = {
//   isFoundItemForm: boolean;
//   changeForm: any;
// };
// const ModalHeader = (props: HeaderProps) => (
//   <View style={styles.modalHeader}>
//     <View style={styles.header}>
//       <Text style={styles.title}>
//         {props.isFoundItemForm ? "Found Item" : "Lost Item"}
//       </Text>
//       <Switch
//         trackColor={{ false: "#767577", true: "#4ccbf2" }}
//         thumbColor={props.isFoundItemForm ? "#f4f3f4" : "#f4f3f4"}
//         ios_backgroundColor="#3e3e3e"
//         onValueChange={props.changeForm}
//         value={props.isFoundItemForm}
//       />
//     </View>
//     <View style={styles.divider}></View>
//   </View>
// );

// // setting these to "any" to avoid annoying error
// type BodyProps = {
//   isFoundItemForm: boolean;
//   location: any;
//   description: any;
//   dropOffLocation: any;
//   category: any;
//   setLocation: any;
//   setDescription: any;
//   setDropOffLocation: any;
//   setCategory: any;
// };
// const ModalBody = (props: BodyProps) => (
//   <View style={styles.modalBody}>
//     <ScrollView>
//       <TextInput
//         placeholder={props.isFoundItemForm ? "Location Found" : "Location Lost"}
//         value={props.location}
//         style={styles.input}
//         onChangeText={props.setLocation}
//       />
//       <TextInput
//         placeholder="Description"
//         value={props.description}
//         style={styles.input}
//         onChangeText={props.setDescription}
//       />
//       {props.isFoundItemForm && (
//         <Picker
//           title="Drop-Off Location"
//           placeholder="Drop-Off Location"
//           textInputStyle={
//             props.dropOffLocation
//               ? { fontSize: 14 }
//               : { color: "#cccccc", fontSize: 14 }
//           }
//           style={styles.input}
//           item={props.dropOffLocation}
//           items={DummyDropOffLocations.map((dropOffLocation) => ({
//             label: dropOffLocation.name,
//             value: dropOffLocation.location_id,
//           }))}
//           onItemChange={(item, index) => props.setDropOffLocation(item)}
//           isNullable={true}
//         />
//       )}
//       <Picker
//         title="Category"
//         placeholder="Category"
//         textInputStyle={
//           props.category ? { fontSize: 14 } : { color: "#cccccc", fontSize: 14 }
//         }
//         style={styles.input}
//         item={props.category}
//         items={DummyCategories.map((category) => ({
//           label: category.name,
//           value: category.category_id,
//         }))}
//         onItemChange={(item, index) => props.setCategory(item)}
//         isNullable={true}
//       />
//     </ScrollView>
//   </View>
// );

// type FooterProps = {
//   closeModal: () => void;
//   createPost: () => void;
// };
// const ModalFooter = (props: FooterProps) => (
//   <View style={styles.modalFooter}>
//     <View style={styles.divider}></View>
//     <View style={styles.actions}>
//       <Button text="Close" color="#db2828" onPress={props.closeModal} />
//       <Button text="Post" color="#ad2ea3" onPress={props.createPost} />
//     </View>
//   </View>
// );

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
