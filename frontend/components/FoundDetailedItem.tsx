import React from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";

export default function FoundDetailedItem({ route }) {
  const { itemPostId } = route.params;
  const { itemTitle } = route.params;
  const { itemDate } = route.params;
  const { itemImage} = route.params;
  const { itemCategory} = route.params;
  const { itemLocation } = route.params;
  const { itemDescription } = route.params;
  const { itemOtherLocation } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.header_text}>
          
          <Text style={styles.header_text_label}>Details</Text>
        </View>
        <View style={styles.whitespace}></View>
      </View>

      <ScrollView style={styles.news_container}>
      <View style={styles.news_item}>
              <View style={styles.text_container}>
              {/* <Text style={styles.title}>{itemPostId}</Text> */}

                <Text style={styles.title}>{itemTitle}</Text>
                
                <View style={styles.text_container}>
                <Text style={styles.news_text}>*PLACEHOLDER FOR LINK TO PUBLIC PROFILE*</Text>

                  <Text style={styles.news_text}>{itemCategory}</Text>
                  <Text style={styles.news_text}>{itemLocation}</Text>
                  <Text style={styles.news_text}>{itemOtherLocation}</Text>

                  <Text style={styles.news_text}>Lost on {itemDate}</Text>
                  <Text style={styles.news_text}>{itemDescription}</Text>

                </View>

              <View style={styles.news_photo}>
                <Image source={{ uri: itemImage }} style={styles.photo} />
              </View>

              <Text style={styles.news_text}>*PLACEHOLDER FOR CLAIM ITEM*</Text>


              </View>
             
            </View>
      </ScrollView>
    </View>
  );
}

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
    color: "#000000",
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
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFD54F",
    // fontFamily: 'georgia'
  },
  news_photo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  photo: {
    width: 120,
    height: 120,
  },
});
