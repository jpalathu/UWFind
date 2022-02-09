import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import FoundForm from "./FoundForm";
import LostForm from "./LostForm";
import {Button} from "native-base";
import { Alert } from 'react-native';
import SettingsScreen from "./Test";

export default function DetailedItem() {
  return (
    <View style={styles.container}>
     <Button
        title="Press me"
        onPress={() => Alert.alert('Simple Button pressed')}
      />
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
