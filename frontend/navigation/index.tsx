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
import { ColorSchemeName, Pressable } from "react-native";

import Colors from "../constants/Colors";
import Home from "../screens/Home";
import Profile from "../screens/Profile";
import SignIn from "../screens/SignIn";
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
        name="SignIn"
        component={SignIn}
        options={() => ({
          headerShown: false,
        })}
      />
      <Stack.Screen
        name="SignUp"
        component={Home}
        options={() => ({
          title: "",
          headerStyle: { backgroundColor: Colors.black },
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
            <PressableIcon
              onPress={() => navigation.navigate("Profile")}
              icon="user"
              isLeft={false}
            />
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
