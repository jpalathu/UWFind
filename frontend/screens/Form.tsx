import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import FoundForm from "../components/FoundForm";
import LostForm from "../components/LostForm";

import SettingsScreen from "../components/Test";

export default function Form() {
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
