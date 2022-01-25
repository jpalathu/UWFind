// import * as React from "react";
// import { Text, View, StyleSheet } from "react-native";
// import Colors from "../constants/Colors";
// import {
//   Avatar,
//   VStack,
//   Heading,
//   Center,
//   NativeBaseProvider,
//   HStack
// } from "native-base"

// export default function Profile() {
//   return (
//     // <View style={styles.container}>
//     //   <View>
//     //     <Text>
//     //       Fill in stuff here or create a new component and add it here
//     //     </Text>
//     //   </View>
//     // </View>

//     <VStack space={7} alignItems="center">
//       <Heading textAlign="center" mb="10">
//       <Avatar
//         bg="yellow.400" //need the code for the yellow?
//         size = "2xl"
//         source={{
//           uri: "https://pbs.twimg.com/profile_images/1188747996843761665/8CiUdKZW_400x400.jpg",
//         }}
//       >
//         SA
//       </Avatar>
//       </Heading>

//     </VStack>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: Colors.gold,
//   },
// });

// // export const Example = () => {
// //   return (
// //     <VStack space={4} alignItems="center">
// //       <Heading textAlign="center" mb="10">
// //       <Avatar
// //         bg="green.500"
// //         size = "2xl"
// //         source={{
// //           uri: "https://pbs.twimg.com/profile_images/1188747996843761665/8CiUdKZW_400x400.jpg",
// //         }}
// //       >
// //         SA
// //       </Avatar>
// //       </Heading>

// //     </VStack>

// //   )
// // }

// // export default () => {
// //   return (
// //     <NativeBaseProvider>
// //       <Center flex={1} px="3">
// //         <Example />
// //       </Center>
// //     </NativeBaseProvider>
// //   )
// // }

import React, { Component, useState } from "react";
import Colors from "../constants/Colors";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import {
  Heading,
  Text,
  VStack,
  Center,
  NativeBaseProvider,
  Container,
  Divider,
  Modal,
  FormControl,
  Input,
  Button,
  IconButton,
  Box,
} from "native-base";
import { Foundation } from "@expo/vector-icons";
import DatePicker from 'react-native-datepicker';
import { container } from "aws-amplify";

const initialState = {
  value: "",
  isInvalid: false,
  errorMessage: "",
};

export default class Profile extends Component {

  // const [inputValue, setInputValue] = React.useState(null);

  // const [inputValue, setInputValue] = React.useState("");
  // const [inputValue: any, setInputValue: any] = React.useState<ValidationState>(initialState: any);

  constructor(props: any) {
    super(props);
    this.state = {
      showEditInfo: false,
      showEmailModal: false,
      showPasswordModal: false,
      name: "James Palathunkal", 
      bio: "4th Year Engineering Student", 
      email: "James@email.com",
      password: "Thisisthepassword", 
      nameInput: "hello",
      bioInput: "hello",
      passwordInput: "hello",
      nameChange: false, 
      bioChange: false, 
      passwordchange: false
    };
  };

  updateBio = () => {
    this.setState({bio: this.state.input});
    this.setState({ showbioModal: false, showEmailModal: false, showPasswordModal: false});
    this.setState(
      {input : " "}
  );
    // this.setState({bio: this.state.input});
  }
  updateProfile = () => {
    if (this.state.nameChange){
      this.setState({name: this.state.nameInput});
    }
    if (this.state.bioChange){
      this.setState({bio: this.state.bioInput});
    }
    if (this.state.passwordChange){
      this.setState({password: this.state.passwordInput});
    }
    // this.setState({bio: this.state.input});
    this.setState({ showEditInfo: false, nameChange: false, bioChange: false, passwordChange: false});
    this.setState(
      {nameInput : " ", bioInput : " ", passwordInput: " "}
  );
    // this.setState({bio: this.state.input});
  }

  // updateEmail = () => {
  //   this.setState({email: this.state.input});
  //   this.setState({ showbioModal: false, showEmailModal: false, showPasswordModal: false});
  //   this.setState(
  //     {input : " "}
  // );
  // }

  // updatePassword = () => {

  //   this.setState({password: this.state.input});
  //   this.setState({ showbioModal: false, showEmailModal: false, showPasswordModal: false});
  //   this.setState(
  //     {input : " "}
  // );
  // }

  // UpdateField = () => {
   
  //    if (this.showbioModal = true){
  //     this.setState({bio: this.state.input});
  //   }
  //  if (this.showEmailModal = true){
  //     this.setState({email: this.state.input});
  //   }
  //   if (this.showPasswordlModal = true){
  //     this.setState({password: this.state.input});
  //   }
  //   this.setState({ showbioModal: false, showEmailModal: false, showPasswordModal: false});
    
  // }

//   setInputValue(event: string){
//     this.setState(
//         {input : event}
//     );
// }
// setName(event: string){
//   this.setState(
//       {name : event}
//   );
// }

findNameChanges(event: string){
  this.setState(
    {nameInput : event}
  );
this.setState(
  {nameChange : true}
);

}

findBioChanges(event: string){
  this.setState(
    {bioInput : event}
  );
this.setState(
  {bioChange : true}
);

}

findPasswordChanges(event: string){
  this.setState(
    {passwordInput : event}
  );
this.setState(
  {passwordChange : true}
);

}
  
  
  render() {
    return (
      <View>
        <View style={styles.header}></View>
        <Image
          style={styles.avatar}
          source={{ uri: "https://bootdey.com/img/Content/avatar/avatar6.png" }}
        />

        <Modal isOpen={this.state.showEditInfo } onClose={() => this.setState({showEditInfo: false})}>
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>Edit</Modal.Header>
            <Modal.Body>
              <FormControl>
              <FormControl.Label>Name</FormControl.Label>
              <Input 
                type="text"  
                onChangeText={(v) => this.findNameChanges(v)} 
                defaultValue={this.state.nameInput}
                />
              </FormControl>
              <FormControl mt="3">
                <FormControl.Label>Bio</FormControl.Label>
                <Input 
                type="text"  
                onChangeText={(v) => this.findBioChanges(v)} 
                defaultValue={this.state.input}
                />
              </FormControl>
              <FormControl mt="3">
                <FormControl.Label>Password</FormControl.Label>
                <Input 
                type="text"  
                onChangeText={(v) => this.findPasswordChanges(v)} 
                defaultValue={this.state.input}
                />
              </FormControl>
              


             
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button
                  variant="ghost"
                  colorScheme="blueGray"
                  onPress={() => this.setState({ showEditInfo: false, showEmailModal: false, showPasswordModal: false })}
                >
                  Cancel
                </Button>
                <Button
                  onPress={this.updateProfile}
                >
                  Update
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>

        {/* <Modal isOpen={this.state.showEmailModal } onClose={() => this.setState({showEmailModal: false})}>
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>Edit</Modal.Header>
            <Modal.Body>
              <FormControl>
                <Input 
                type="text"  
                onChangeText={(v) => this.setInputValue(v)} 
                defaultValue={this.state.input}
        
                />
              </FormControl>
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button
                  variant="ghost"
                  colorScheme="blueGray"
                  onPress={() => this.setState({ showbioModal: false, showEmailModal: false, showPasswordModal: false })}
                >
                  Cancel
                </Button>
                <Button
                  onPress={this.updateEmail}
                >
                  Update
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>

        <Modal isOpen={this.state.showPasswordModal } onClose={() => this.setState({showPasswordModal: false })}>
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>Edit</Modal.Header>
            <Modal.Body>
              <FormControl>
                <Input 
                type="text"  
                onChangeText={(v) => this.setInputValue(v)} 
                defaultValue={this.state.input}
        
                />
              </FormControl>
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button
                  variant="ghost"
                  colorScheme="blueGray"
                  onPress={() => this.setState({ showbioModal: false, showEmailModal: false, showPasswordModal: false })}
                >
                  Cancel
                </Button>
                <Button
                  onPress={this.updatePassword}
                >
                  Update
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal> */}


        <View style={styles.body}>
          <View>
            <Text style={styles.name}>{this.state.name}</Text>
            <Text style={styles.info}> 
              {this.state.bio}
  
            </Text>
            <Container style={{ alignSelf: "flex-end" }}>
                <Container style={{ alignSelf: "stretch" }} >
                  <IconButton
                    variant="solid"
                    _icon={{
                      as: Foundation,
                      name: "pencil",
                    }}
                    onPress={
                      () => this.setState({ showEditInfo: true })
                    }
                  />
                </Container>
              </Container>

            <Divider my="2" />
            <Text style={styles.name}>Email </Text>
            <Text style={styles.info}>
              {this.state.email}
            </Text>
            <Container style={{ alignSelf: "flex-end" }}>
                <Container style={{ alignSelf: "stretch" }}>
                  {/* <IconButton
                    variant="solid"
                    _icon={{
                      as: Foundation,
                      name: "pencil",
                    }}
                    onPress={() => this.setState({ showEmailModal: true })}
                  /> */}
                </Container>
              </Container>
            

            <Divider my="2" />
            <Text style={styles.name}>Password</Text>
            <Text style={styles.info}>
              {this.state.password}
            </Text>
            <Container style={{ alignSelf: "flex-end" }}>
                <Container marginLeft={300}>
                  {/* <IconButton
                    variant="solid"
                    _icon={{
                      as: Foundation,
                      name: "pencil"
                    }}
                    onPress={() => this.setState({ showPasswordModal: true })}
                  /> */}
                </Container>
              </Container>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.gold,
    height: 200,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10,
    alignSelf: "center",
    position: "absolute",
    marginTop: 130,
  },
  name: {
    fontSize: 22,
    color: Colors.white,
    fontWeight: "600",
  },
  body: {
    marginTop: 70,
  },
  info: {
    fontSize: 16,
    color: "#00BFFF",
    marginTop: 10,
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: "#696969",
    marginTop: 10,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
    backgroundColor: Colors.gold,
  },
});
