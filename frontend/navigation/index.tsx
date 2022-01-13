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
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { ColorSchemeName, Pressable, View } from "react-native";

import Colors from "../constants/Colors";
import Home from "../screens/Home";
import Profile from "../screens/Profile";
import Login from "../screens/Login";
import SignUp from "../screens/SignUp";
import ForgotPassword from "../screens/ForgotPassword";
import Form from "../screens/Form";
import { RootStackParamList, RootTabScreenProps } from "../types";
import LinkingConfiguration from "./LinkingConfiguration";

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
  return (
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
          title: "Sign Up",
          headerStyle: { backgroundColor: Colors.black },
          headerTitleStyle: { color: Colors.white },
        })}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={() => ({
          title: "Forgot Password",
          headerStyle: { backgroundColor: Colors.black },
          headerTitleStyle: { color: Colors.white },
        })}
      />
      <Stack.Screen
        name="Home"
        component={Home}
        options={({ navigation }: RootTabScreenProps<"Home">) => ({
          title: "UWFind",
          headerStyle: { backgroundColor: Colors.black },
          headerTitleStyle: { color: Colors.white },
          headerRight: () => (
            <View style={{flexDirection: "row"}}>
              <PressableIcon
                onPress={() => navigation.navigate("Profile")}
                icon="user"
                isLeft={false}
              />
              <PressableIcon
                onPress={() => navigation.navigate("Form")}
                icon="envelope"
                isLeft={false}
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
              isLeft={true}
            />
          ),
        })}
      />
      {/* Adding this screen to test the form stuff */}
      <Stack.Screen
        name="Form"
        component={Form}
        options={({ navigation }: RootTabScreenProps<"Form">) => ({
          headerStyle: { backgroundColor: Colors.black },
          headerTitleStyle: { color: Colors.white },
          headerLeft: () => (
            <PressableIcon
              onPress={() => navigation.navigate("Home")}
              icon="caret-left"
              isLeft={true}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
}

type PressableIconProps = {
  icon: any;
  onPress: () => void;
  isLeft: boolean;
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
      style={props.isLeft ? { marginLeft: 15 } : { marginRight: 15 }}
    />
  </Pressable>
);
