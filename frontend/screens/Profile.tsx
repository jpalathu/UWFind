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

import React, { Component } from 'react';
import Colors from "../constants/Colors";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity
} from 'react-native';
import { Heading, Text, VStack, Center, NativeBaseProvider, Container, Divider, Modal, FormControl, Input, Button } from "native-base"

export default class Profile extends Component {

  render() {
    return (
      
      <View >


        <View style={styles.header}></View>

        <Modal>
        <Modal.Content maxWidth="400px">
        
          <Modal.Header>Contact Us</Modal.Header>
          
        </Modal.Content>
      </Modal>

        
        <Image style={styles.avatar} source={{uri: 'https://bootdey.com/img/Content/avatar/avatar6.png'}}/>
        
          <View style={styles.body}>

            <View>
              <Text style={styles.name}>Hi James</Text>
              <Text style={styles.info} >4th Year Computer Engineering Student </Text>
         

              <Divider my="2" />
              <Text style={styles.name}>Email </Text>
              <Text style={styles.info} >James@email.com</Text>

              <Divider my="2" />
              <Text style={styles.name}>Password</Text>
              <Text style={styles.info} >********</Text>

              <TouchableOpacity style={styles.buttonContainer}>
                <Text>Change Password</Text>  
              </TouchableOpacity>              
            </View>
            
        </View>
      </View>

      
      
    );
  }
}

const styles = StyleSheet.create({
  header:{
    backgroundColor: Colors.gold,
    height:200,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom:10,
    alignSelf:'center',
    position: 'absolute',
    marginTop:130
  },
  name:{
    fontSize:22,
    color: Colors.white,
    fontWeight:'600',
  },
  body:{
    marginTop:40,
  },
  info:{
    fontSize:16,
    color: "#00BFFF",
    marginTop:10,
    marginBottom: 15
  },
  description:{
    fontSize:16,
    color: "#696969",
    marginTop:10,
    textAlign: 'center'
  },
  buttonContainer: {
    marginTop:10,
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
    backgroundColor: Colors.gold,
  },
});
