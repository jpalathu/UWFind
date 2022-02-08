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
  useWindowDimensions,
} from "react-native";
import Colors from "../constants/Colors";
import { TabView, SceneMap } from 'react-native-tab-view';
import FoundForm from "../components/FoundForm";
import LostForm from "../components/LostForm";
const arrayOfItems = [
  { category: "Electronics", location: "E7", image: "", key: "1" },
  { category: "Jewellery", location: "RCH", image: "", key: "2" },
  { category: "Clothing Item", location: "E2", image: "", key: "3" },
];
const FirstRoute = () => (
  <View style={styles.container}>
  <View style={styles.header}></View>
  <LostFeed></LostFeed>
</View>
);

const SecondRoute = () => (
  <View style={styles.container}>
  <View style={styles.header}></View>
  <FoundFeed></FoundFeed>
</View>
);

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
});
export default function Home() {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'First' },
    { key: 'second', title: 'Second' },
  ]);

  return (
    
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );

}
const LostFeed = () => {
  const [items, setItems] = useState<any[]>([]);
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
  return (
    <View style={styles.container}>
    <View style={styles.header}>
      <View style={styles.header_text}>
        <Text style={styles.header_text_label}>Lost Items</Text>
      </View>
      <View style={styles.whitespace}></View>
    </View>
    <View style={styles.instruction}>
      <Text style={styles.instruction_text}>SWIPE LEFT FOR FOUND ITEMS</Text>
    </View>
    <View>
        <LostForm />
      </View>
      <ScrollView style={styles.news_container}>
        {items.map((item) => {
          return (
            <View key={item.postId} style={styles.news_item}>
              <View style={styles.text_container}>
              <Text style={styles.title}>{item.title}</Text>
                <View style={styles.text_container}>
                  <Text style={styles.news_text}>{item.categoryId.name}</Text>
                  <Text style={styles.news_text}>{item.buildingId.name}</Text>
                  <Text style={styles.news_text}>Lost on {item.date}</Text>
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
  );
  
}

const FoundFeed = () => {
  const [items, setItems] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const FOUND_ITEM_POSTS = gql`
    query {
      foundItemPosts {
        postId
        title
        description
        imageUrl
        date
        categoryId {
          name
        }
        buildingId {
          name
        }
        otherDropOffLocation
        dropOffLocationId {
          name
        }
      }
    }
  `;
  const [executeQuery] = useLazyQuery(FOUND_ITEM_POSTS);
  const getItems = async () => {
    const { data, error } = await executeQuery();
    if (error) {
      console.error("ERROR", JSON.stringify(error, null, 2));
    } else {
      setItems(data.foundItemPosts);
      console.log("ITEMS", items);
    }
  };
  useEffect(() => {
    getItems();
  }, []);
  
  return (
    <View style={styles.container}>
    <View style={styles.header}>
      <View style={styles.header_text}>
        <Text style={styles.header_text_label}>Found Items</Text>
      </View>
      <View style={styles.whitespace}></View>
    </View>
    <View style={styles.instruction}>
      <Text style={styles.instruction_text}>SWIPE LEFT FOR LOST ITEMS</Text>
    </View>
      <View>
        <FoundForm />
      </View>
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