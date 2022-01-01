import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import Colors from "../constants/Colors";

export default function Profile() {
  return (
    <View style={styles.container}>
      <View>
        <Text>
          Fill in stuff here or create a new component and add it here
        </Text>
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
