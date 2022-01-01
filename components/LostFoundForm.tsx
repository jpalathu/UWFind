import React, { Fragment, useState } from "react";
import { StyleSheet, Text, View, Modal, Switch, TextInput, ScrollView } from "react-native";
import { Picker } from 'react-native-woodpicker'
import Button from "./shared/Button";
import DummyCategories from "../dummy/category.json";
import DummyDropOffLocations from "../dummy/drop_off_location.json";

export default function LostFoundForm() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFoundItemForm, setIsFoundItemForm] = useState(true);
  const [location, setLocation] = useState(null);
  const [category, setCategory] = useState(null);
  const [dropOffLocation, setDropOffLocation] = useState(null);
  const [description, setDescription] = useState(null);
  const [image, setImage] = useState(null);

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => {
    setIsModalVisible(false);
    resetData();
  }
  const createPost = () => {
    if (isFoundItemForm) {
      console.log("found item", {
        location,
        dropOffLocation: dropOffLocation.value,
        category: category.value,
        description,
        image
      })
    }
    else {
      console.log("lost item", {
        location,
        category: category.value,
        description,
        image
      })
    }
    console.log("post created!");
    closeModal();
  }

  const resetData = () => {
    setLocation(null);
    setCategory(null);
    setDropOffLocation(null);
    setDescription(null);
  }

  const changeForm = (isFoundItemForm: boolean) => {
    setIsFoundItemForm(isFoundItemForm);
    resetData();
  }

  return (
    <Fragment >
      <Button text="Post" color="#ad2ea3" onPress={openModal} />
      <Modal visible={isModalVisible}>
        <View style={styles.modal}>
          <View style={styles.modalContainer}>
            <ModalHeader isFoundItemForm={isFoundItemForm} changeForm={changeForm} />
            <ModalBody isFoundItemForm={isFoundItemForm} location={location} setLocation={setLocation} description={description} setDescription={setDescription} dropOffLocation={dropOffLocation} setDropOffLocation={setDropOffLocation} category={category} setCategory={setCategory} />
            <ModalFooter closeModal={closeModal} createPost={createPost} />
          </View>
        </View>
      </Modal>
    </Fragment>
  );
}

type HeaderProps = {
  isFoundItemForm: boolean;
  changeForm: any;
}
const ModalHeader = (props: HeaderProps) => (
  <View style={styles.modalHeader}>
    <View style={styles.header}>
      <Text style={styles.title}>{props.isFoundItemForm ? "Found Item" : "Lost Item"}</Text>
      <Switch
        trackColor={{ false: "#767577", true: "#4ccbf2" }}
        thumbColor={props.isFoundItemForm ? "#f4f3f4" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={props.changeForm}
        value={props.isFoundItemForm}
      />
    </View>
    <View style={styles.divider}></View>
  </View>
)

// setting these to "any" to avoid annoying error
type BodyProps = {
  isFoundItemForm: boolean;
  location: any;
  description: any;
  dropOffLocation: any;
  category: any;
  setLocation: any;
  setDescription: any;
  setDropOffLocation: any;
  setCategory: any;
}
const ModalBody = (props: BodyProps) => (
  <View style={styles.modalBody}>
    <ScrollView>
      <TextInput placeholder={props.isFoundItemForm ? "Location Found" : "Location Lost"} value={props.location} style={styles.input} onChangeText={props.setLocation} />
      <TextInput placeholder="Description" value={props.description} style={styles.input} onChangeText={props.setDescription} />
      {props.isFoundItemForm && <Picker title="Drop-Off Location" placeholder="Drop-Off Location" textInputStyle={props.dropOffLocation ? {fontSize: 14} : {color: "#cccccc", fontSize: 14}} style={styles.input} item={props.dropOffLocation} items={DummyDropOffLocations.map(dropOffLocation =>({label: dropOffLocation.name, value: dropOffLocation.location_id}))} onItemChange={(item, index) => props.setDropOffLocation(item)} isNullable={true}/>}
      <Picker title="Category" placeholder="Category" textInputStyle={props.category ? {fontSize: 14} : {color: "#cccccc", fontSize: 14}} style={styles.input} item={props.category} items={DummyCategories.map(category =>({label: category.name, value: category.category_id}))} onItemChange={(item, index) => props.setCategory(item)} isNullable={true}/>
    </ScrollView>
  </View>
)

type FooterProps = {
  closeModal: () => void;
  createPost: () => void;
}
const ModalFooter = (props: FooterProps) => (
  <View style={styles.modalFooter}>
    <View style={styles.divider}></View>
    <View style={styles.actions}>
      <Button text="Close" color="#db2828" onPress={props.closeModal} />
      <Button text="Post" color="#ad2ea3" onPress={props.createPost} />
    </View>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: "#00000099",
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    backgroundColor: "#f9fafb",
    width: "85%",
    borderRadius: 15
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "lightgray"
  },
  modalHeader: {

  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    padding: 15,
    color: "#000"
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
    paddingHorizontal: 10
  },
  modalFooter: {

  },
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
  }
});
