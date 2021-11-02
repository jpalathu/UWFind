import * as React from "react";
import { StyleSheet, Text, View, Dimensions, Platform, Modal, Switch, TextInput } from "react-native";
import Button from "../components/shared/Button";
import DummyCategories from "../dummy/category.json";

export default function TabOneScreen() {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [isFoundItemForm, setIsFoundItemForm] = React.useState(true);
  const [location, setLocation] = React.useState(null);
  const [category, setCategory] = React.useState(null);
  const [dropOffLocation, setDropOffLocation] = React.useState(null);
  const [description, setDescription] = React.useState(null);
  const [image, setImage] = React.useState(null);

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => {
    setIsModalVisible(false);
    resetData();
  }
  const createPost = () => {
    if (isFoundItemForm) {
      console.log("found item", {
        location,
        dropOffLocation,
        category,
        description,
        image
      })
    }
    else {
      console.log("lost item", {
        location,
        category,
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

  return (
    <View style={styles.container}>
      <Button text="Post" color="#ad2ea3" onPress={openModal} />
      <Modal visible={isModalVisible}>
        <View style={styles.modal}>
          <View style={styles.modalContainer}>
            <ModalHeader isFoundItemForm={isFoundItemForm} changeForm={setIsFoundItemForm} />
            <ModalBody isFoundItemForm={isFoundItemForm} location={location} setLocation={setLocation} description={description} setDescription={setDescription} dropOffLocation={dropOffLocation} setDropOffLocation={setDropOffLocation} category={category} setCategory={setCategory} />
            <ModalFooter closeModal={closeModal} createPost={createPost} />
          </View>
        </View>
      </Modal>
    </View>
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
    <TextInput placeholder={props.isFoundItemForm ? "Location Found" : "Location Lost"} value={props.location} style={styles.input} onChangeText={props.setLocation} />
    <TextInput placeholder="Description" value={props.description} style={styles.input} onChangeText={props.setDescription} />
    {props.isFoundItemForm && <TextInput placeholder="Drop-Off Location" value={props.dropOffLocation} style={styles.input} onChangeText={props.setDropOffLocation} />}
    <TextInput placeholder="Category" value={props.category} style={styles.input} onChangeText={props.setCategory} />
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
    borderRadius: 10
  }
});
