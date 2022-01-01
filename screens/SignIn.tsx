import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import Button from "../components/shared/Button";
import { RootTabScreenProps } from "../types";

export default function SignIn({ navigation }: RootTabScreenProps<"SignIn">) {
  console.log(navigation);
  const goToHome = () => {
    navigation.navigate("Home");
  };
  return (
    <View style={styles.container}>
      <View>
        <Text>
          Fill in stuff here or create a new component and add it here
        </Text>
        <Text>
          This button is here just to help us to get to the next page for now
        </Text>
        <Button text="Log In" color="#FFC50B" onPress={goToHome} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.gold,
  },
});
