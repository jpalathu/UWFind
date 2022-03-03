/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from "@expo/vector-icons";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import {
  Button,
  Modal,
} from "native-base";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { Fragment, useEffect, useState } from "react";
// import * as React from "react";
import { ColorSchemeName, Pressable, View, StyleSheet, Text } from "react-native";

import Colors from "../constants/Colors";
import Home from "../screens/Home";
import Profile from "../screens/Profile";
import PublicProfile from "../screens/PublicProfile";
import Login from "../screens/Login";
import SignUp from "../screens/SignUp";
import { RootStackParamList, RootTabScreenProps } from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import ChatHome from "../screens/ChatHome";
import ChatRoom from "../screens/ChatRoom";
import CreateChatRoom from "../components/chat/CreateChatRoom";
import LostDetailedItem from "../components/LostDetailedItem";
import FoundDetailedItem from "../components/FoundDetailedItem";
import { useChatContext } from "stream-chat-expo";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const [showModal, setShowModal] = useState(false);
  const { client } = useChatContext();
  return (
    <View style={styles.container}>
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={() => ({
          headerShown: false,
        })}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={() => ({
          title: "",
          headerStyle: { backgroundColor: Colors.black },
          headerTitleStyle: { color: Colors.white },
        })}
      />

      <Stack.Screen
        name="LostDetailedItem"
        component={LostDetailedItem}
        options={({ navigation }: RootTabScreenProps<"LostDetailedItem">) => ({
          title: "Details",
          headerStyle: { backgroundColor: Colors.black },
          headerTitleStyle: { color: Colors.white },
          headerLeft: () => (
            <PressableIcon
              onPress={() => navigation.navigate("Home")}
              icon="caret-left"
              isLeft={false}
            />
          ),
        })}
      />
      <Stack.Screen
        name="FoundDetailedItem"
        component={FoundDetailedItem}
        options={({ navigation }: RootTabScreenProps<"FoundDetailedItem">) => ({
          title: "Details",
          headerStyle: { backgroundColor: Colors.black },
          headerTitleStyle: { color: Colors.white },
          headerLeft: () => (
            <PressableIcon
              onPress={() => navigation.navigate("Home")}
              icon="caret-left"
              isLeft={false}
            />
          ),
        })}
      />
      <Stack.Screen
        name="Home"
        component={Home}
        options={({ navigation }: RootTabScreenProps<"Home">) => ({
          title: "UWFind",
          headerStyle: { backgroundColor: Colors.black },
          headerTitleStyle: { color: Colors.white },
          headerLeft: () => (
            <PressableIcon
              onPress={() => {
                client.disconnectUser()
                navigation.navigate("Login");
              }}
              icon="sign-out"
              isLeft={false}
              style={{ transform: [{ rotateY: "180deg" }] }}
            />
          ),
          headerRight: () => (
            <View style={{ flexDirection: "row" }}>
              <PressableIcon
                onPress={() => navigation.navigate("Profile")}
                icon="user"
                isLeft={true}
              />
              {/* <PressableIcon
                onPress={() => navigation.navigate("PublicProfile")}
                icon="user"
                isLeft={false}
              /> */}
              <PressableIcon
                onPress={() => navigation.navigate("ChatHome")}
                icon="comment"
                isLeft={true}
              />
              <PressableIcon
                onPress={() => setShowModal(true)}                
                icon="circle-question"
                isLeft={true}
              />
            </View>
          ),
        })}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={({ navigation }: RootTabScreenProps<"Profile">) => ({
          headerStyle: { backgroundColor: Colors.black },
          headerTitleStyle: { color: Colors.white },
          headerLeft: () => (
            <PressableIcon
              onPress={() => navigation.navigate("Home")}
              icon="caret-left"
              isLeft={false}
            />
          ),
        })}
      />
      <Stack.Screen
        name="PublicProfile"
        component={PublicProfile}
        options={({ navigation }: RootTabScreenProps<"PublicProfile">) => ({
          title: "User's Profile",
          headerStyle: { backgroundColor: Colors.black },
          headerTitleStyle: { color: Colors.white },
          headerLeft: () => (
            <PressableIcon
              onPress={() => navigation.navigate("Home")}
              icon="caret-left"
              isLeft={false}
            />
          ),
        })}
      />
      <Stack.Screen
        name="ChatHome"
        component={ChatHome}
        options={({ navigation }: RootTabScreenProps<"ChatHome">) => ({
          title: "Chat",
          headerRight: () => <CreateChatRoom />,
          headerStyle: { backgroundColor: Colors.black },
          headerTitleStyle: { color: Colors.white },
          headerLeft: () => (
            <PressableIcon
              onPress={() => navigation.navigate("Home")}
              icon="caret-left"
              isLeft={false}
            />
          ),
        })}
      />
      <Stack.Screen
        name="ChatRoom"
        component={ChatRoom}
        options={({ navigation, route }: RootTabScreenProps<"ChatRoom">) => ({
          title: route.params?.title,
          headerStyle: { backgroundColor: Colors.black },
          headerTitleStyle: { color: Colors.white },
          headerLeft: () => (
            <PressableIcon
              onPress={() => navigation.navigate("ChatHome")}
              icon="caret-left"
              isLeft={false}
            />
          ),
        })}
      />
    </Stack.Navigator>

    <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="600px">
          <Modal.CloseButton />
          <Modal.Header>Help</Modal.Header>
          <Modal.Body>

          <Text
          style={{
            textAlign: 'center',
            fontWeight: "bold",
            color: '#000000',
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            textAlignVertical: 'center',
            alignContent: 'center',
          }}>
               What is the difference between the “Lost Items” and “Found Items” feed?
        </Text>
        <Text
          style={{
            textAlign: 'center',
            color: '#000000',
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            textAlignVertical: 'center',
            alignContent: 'center',
          }}>
               The “Lost Items” feed shows items that students/faculty members are currently looking for. The “Found Items” feed shows items that have already been found by students/faculty members. 
               {"\n"}
        </Text>
        <Text
          style={{
            textAlign: 'center',
            fontWeight: "bold",
            color: '#000000',
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            textAlignVertical: 'center',
            alignContent: 'center',
          }}>
              How do I navigate between the “Lost Items” and “Found Items” feed?
        </Text>
        <Text
          style={{
            textAlign: 'center',
            color: '#000000',
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            textAlignVertical: 'center',
            alignContent: 'center',
          }}>
              On the home page, you can swipe left for the “Found Items” feed and swipe right for the “Lost Items” feed.{"\n"}
         </Text>
        <Text
          style={{
            textAlign: 'center',
            fontWeight: "bold",
            color: '#000000',
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            textAlignVertical: 'center',
            alignContent: 'center',
          }}>
            Where can I find more details about a specific post?  
        </Text>
        <Text
          style={{
            textAlign: 'center',
            color: '#000000',
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            textAlignVertical: 'center',
            alignContent: 'center',
          }}>
            If you wish to know more details about a post such as the author of the post or the location of the item, simply click on the photo attached to the post. This will take you to the “details” section where you can see additional information such as the category, location, date posted and a description of the post.            {"\n"}
        </Text>
        <Text
          style={{
            textAlign: 'center',
            fontWeight: "bold",
            color: '#000000',
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            textAlignVertical: 'center',
            alignContent: 'center',
          }}>
            I lost an item, what do I do now?               
        </Text>
        <Text
          style={{
            textAlign: 'center',
            color: '#000000',
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            textAlignVertical: 'center',
            alignContent: 'center',
          }}>
            If you have lost an item, you have two options:{"\n"}
            1) Look for your lost item on the “Found Items” feed to see if someone has already found your item. You can do this by either scrolling through the feed, by filtering the feed based on the category of your item using the “Filter” button, or by searching for your item using the search engine. If you have found the item  that you are looking for, you can click on the author’s profile and message them.                {"\n"}
            2) Create a new post on the “Lost Items” feed by clicking on the “Lost Item?” button. This will allow other users to see your post and message you in case they know where your item is.               {"\n"}
      </Text>
        <Text
          style={{
            textAlign: 'center',
            fontWeight: "bold",
            color: '#000000',
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            textAlignVertical: 'center',
            alignContent: 'center',
          }}>
            I found an item, what do I do now?
        </Text>
        <Text
          style={{
            textAlign: 'center',
            color: '#000000',
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            textAlignVertical: 'center',
            alignContent: 'center',
          }}>
            If you have found an item, you have two options:{"\n"}
            1) Look for the found item on the “Lost Items” feed to see if someone is looking for the item that you have found. You can do this by either scrolling through the feed, by filtering the feed based on the category of the item using the “Filter” button, or by searching for the item using the search engine. If you have found the item that you are looking for, you can click on the author’s profile and message them. {"\n"}
            2) Create a new post on the “Found Items” feed by clicking on the “Found Item?” button. This will allow other users to see your post and message you in case they are looking for the item you have found. {"\n"}
        </Text>
        <Text
          style={{
            textAlign: 'center',
            fontWeight: "bold",
            color: '#000000',
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            textAlignVertical: 'center',
            alignContent: 'center',
          }}>
            I forgot my password, what do I do?       
        </Text>
        <Text
          style={{
            textAlign: 'center',
            color: '#000000',
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            textAlignVertical: 'center',
            alignContent: 'center',
          }}>
            To reset your password, click on the “Forgot Password” link on the login page and follow the steps.       
        </Text>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" colorScheme="blueGray" onPress={() => {
              setShowModal(false);
            }}>
                Cancel
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </View>
  );
}

type PressableIconProps = {
  icon: any;
  onPress: () => void;
  isLeft: boolean;
  style?: any;
};
/**
 * Perform an action when pressing the icon (like navigate to a new screen).
 */
const PressableIcon = (props: PressableIconProps) => (
  <Pressable
    onPress={props.onPress}
    style={({ pressed }) => ({
      opacity: pressed ? 0.5 : 1,
    })}
  >
    <FontAwesome
      name={props.icon}
      size={30}
      color={Colors.white}
      style={[
        props.isLeft ? { marginLeft: 15 } : { marginRight: 15 },
        props.style,
      ]}
    />
  </Pressable>
);

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
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFD54F",
    alignSelf: "center",
    // fontFamily: 'georgia'
  },
  news_photo: {
    flex: 1,
    paddingTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  photo: {
    width: 170,
    height: 170,
  },
  gridView: {
    marginTop: 10,
    flex: 1,
  },
  // container: {
  //   flex: 1,
  //   alignItems: "center",
  //   justifyContent: "center",
  //   backgroundColor: Colors.gold,
  // },
  // buttonContainer: {
  //   marginTop:10,
  //   height:45,
  //   flexDirection: 'row',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginBottom:20,
  //   width:250,
  //   borderRadius:30,
  //   backgroundColor: Colors.gold,
  // },
});
