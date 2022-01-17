import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import LostFoundForm from "../components/LostFoundForm";
import SettingsScreen from "../components/Test";

export default function Form() {
  return (
    <View style={styles.container}>
      <View>
        <LostFoundForm />
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
