import { gql, useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
} from "react-native";
import { Tab, TabView } from 'react-native-elements';
import Colors from "../constants/Colors";

const arrayOfItems = [
  { category: "Electronics", location: "E7", image: "", key: "1" },
  { category: "Jewellery", location: "RCH", image: "", key: "2" },
  { category: "Clothing Item", location: "E2", image: "", key: "3" },
];

export default function Home() {

  const [index, setIndex] = React.useState(0);

  return (
    
    <View style={styles.container}>
      <Tab
        value={index}
        onChange={(e) => setIndex(e)}
        indicatorStyle={{
          backgroundColor: "#FFD54F",
          height: 3,
        }}
        variant="primary"
      >
        <Tab.Item
          title="Lost Items"
          titleStyle={{ fontSize: 12 }}
          icon={{ name: 'timer', type: 'ionicon', color: 'white' }}
        />
        <Tab.Item
          title="Found Items"
          titleStyle={{ fontSize: 12 }}
          icon={{ name: 'heart', type: 'ionicon', color: 'white' }}
        />
      </Tab>
      {/*
      <View style={styles.header}>
         <Button
          noDefaultStyles={true}
                    styles={{button: styles.header_button}} 
                    onPress={this.press.bind(this)}
        >
          <View style={styles.back_button}>
            <Icon name="chevron-left" size={20} color="#397CA9" />
                      <Text style={[styles.back_button_label]}> Sections</Text>
          </View>
        </Button> 

        <View style={styles.header_text}>
          <Text style={styles.header_text_label}>Lost Items</Text>
          <Text style={styles.header_text_label}>Found Items</Text>
        </View>
        <View style={styles.whitespace}></View>
      </View>
      <View style={styles.instruction}>
        <Text style={styles.instruction_text}>SWIPE ACROSS SECTIONS</Text>
      </View>
    */}
    
    <TabView value={index} onChange={setIndex} animationType="spring">
        <TabView.Item style={{ backgroundColor: 'red', width: '100%' }}>
          <LostFeed></LostFeed>
        </TabView.Item>
      </TabView>
    </View>
    
  );
}
const LostFeed = () => {
  const [items, setItems] = useState<any[]>([]);
  const [index, setIndex] = React.useState(0);

  const LOST_ITEM_POSTS = gql`
    query {
      lostItemPosts {
        postId
        title
        description
        date
        imageUrl
        buildingId {
          name
        }
        categoryId {
          name
        }
      }
    }
  `;
  const [executeQuery] = useLazyQuery(LOST_ITEM_POSTS);
  const getItems = async () => {
    const { data, error } = await executeQuery();
    if (error) {
      console.error("ERROR", JSON.stringify(error, null, 2));
    } else {
      setItems(data.lostItemPosts);
      console.log("ITEMS", items);
    }
  };

  useEffect(() => {
    getItems();
  }, []);
  return(
    <View>
    <ScrollView style={styles.news_container}>
    {items.map((item) => {
      return (
        <View key={item.postId} style={styles.news_item}>
          <View style={styles.text_container}>
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.text_container}>
              <Text style={styles.news_text}>{item.categoryId.name}</Text>
              <Text style={styles.news_text}>{item.buildingId.name}</Text>
              <Text style={styles.news_text}>Found on {item.date}</Text>
            </View>
          </View>
          <View style={styles.news_photo}>
            <Image source={{uri : item.imageUrl}} style={styles.photo}/>
          </View>
        </View>
      );
    })}
  </ScrollView>
  </View>
  )
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
