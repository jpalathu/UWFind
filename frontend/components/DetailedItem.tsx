import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import FoundForm from "./FoundForm";
import LostForm from "./LostForm";

import SettingsScreen from "./Test";

export default function DetailedItem() {
  return (
    <View style={styles.container}>
      <View>
        <FoundForm />
      </View>
      <View>
        <LostForm />
      </View>
      {/* <View>
        <SettingsScreen />
      </View> */}
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
