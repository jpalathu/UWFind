import { gql, useLazyQuery } from "@apollo/client";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Pressable,
  FlatList,
  useWindowDimensions,
} from "react-native";
import { Button } from "native-base";

import Colors from "../constants/Colors";
import { RootTabScreenProps } from "../types";
import { Searchbar } from 'react-native-paper';

import { TabView, SceneMap } from "react-native-tab-view";
import FoundForm from "../components/FoundForm";
import LostForm from "../components/LostForm";
import FilterForm from "../components/FilterForm";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { FlatGrid } from "react-native-super-grid";

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
    { key: "first", title: "First" },
    { key: "second", title: "Second" },
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
function memoize(func) {
  // Create a new cache, just for this function
  let cache = new Map();

  const memoized = function (...args) {
    // Use the first argument as the cache key.
    // If your function takes multiple args, you may
    // want to come up with a more complex scheme
    let key = args[0];

    // Return the cached value if one exists
    if (cache.has(key)) {
      return cache.get(key);
    }

    // Otherwise, compute the result and save it
    // before returning it.
    let result = func.apply(this, args);
    cache.set(key, result);
    return result;
  };

  return memoized;
}

const getSearchItems = (items: any[], searchQuery: string) => {
  return items.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
}

const searchedItems = memoize(getSearchItems);

const LostFeed = () => {
  const navigation = useNavigation();

  const [items, setItems] = useState<any[]>([]);

  const setFilteredItems = (filteredItems: any[]) => {
    setItems(filteredItems);
  };

  const LOST_ITEM_POSTS = gql`
    query {
      lostItemPosts(filter: {}) {
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
        lostUserId {
          userId
          firstName
          lastName
          email
          imageUrl
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
    }
  };
  // used to tell if we've switched to this screen
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      getItems();
    }
  }, [isFocused]);

  const [searchQuery, setSearchQuery] = React.useState('');

  const onChangeSearch = async (query: any) => {
    setSearchQuery(query)
    const { data, error } = await executeQuery();
    if (error) {
      console.error("ERROR", JSON.stringify(error, null, 2));
    } else {
      setItems(data.lostItemPosts);
    }
    setItems(searchedItems)
  };
  
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
      <Searchbar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
        />
      <View style={{ flexDirection: "row" }}>
        <View style={styles.header_button}>
          <LostForm refreshPosts={getItems} />
        </View>
        <View style={styles.header_button}>
          <FilterForm
            isLost={true}
            items={items}
            setFilteredItems={setFilteredItems}
          />
        </View>
      </View>
      <FlatGrid
        itemDimension={130}
        data={searchedItems(items, searchQuery)}
        style={styles.gridView}
        // staticDimension={300}
        // fixed
        spacing={10}
        renderItem={({ item }) => (
          <View style={[styles.news_container, { backgroundColor: "#000" }]}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("LostDetailedItem", {
                  itemPostId: item.postId,
                  itemTitle: item.title,
                  itemCategory: item.categoryId.name,
                  itemLocation: item.buildingId.name,
                  itemDate: item.date,
                  itemDescription: item.description,
                  itemImage: item.imageUrl,
                  itemLostUser: item.lostUserId,
                });
              }}
            >
              <View style={styles.news_photo}>
                <Image source={{ uri: item.imageUrl }} style={styles.photo} />
              </View>
            </TouchableOpacity>
            <Text style={styles.title}>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );
};

const FoundFeed = () => {
  const navigation = useNavigation();

  const [items, setItems] = useState<any[]>([]);

  const setFilteredItems = (filteredItems: any[]) => {
    setItems(filteredItems);
  };

  const FOUND_ITEM_POSTS = gql`
    query {
      foundItemPosts(filter: {}) {
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
        foundUserId {
          userId
          firstName
          lastName
          email
          imageUrl
        }
        claimedUserId {
          userId
          firstName
          lastName
          email
          imageUrl
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
    }
  };

  // used to tell if we've switched to this screen
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      getItems();
    }
  }, [isFocused]);

  const [searchQuery, setSearchQuery] = React.useState('');

  const onChangeSearch = async (query: any) => {
    setSearchQuery(query)
    const { data, error } = await executeQuery();
    if (error) {
      console.error("ERROR", JSON.stringify(error, null, 2));
    } else {
      setItems(data.foundItemPosts);
    }
    setItems(searchedItems)
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.header_text}>
          <Text style={styles.header_text_label}>Found Items</Text>
        </View>
        <View style={styles.whitespace}></View>
      </View>
      <View style={styles.instruction}>
        <Text style={styles.instruction_text}>SWIPE RIGHT FOR LOST ITEMS</Text>
      </View>
      <Searchbar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
        />
      <View style={{ flexDirection: "row" }}>
        <View style={styles.header_button}>
          <FoundForm refreshPosts={getItems} />
        </View>
        <View style={styles.header_button}>
          <FilterForm
            isLost={false}
            items={items}
            setFilteredItems={setFilteredItems}
          />
        </View>
      </View>
      <FlatGrid
        itemDimension={130}
        data={searchedItems(items, searchQuery)}
        style={styles.gridView}
        // staticDimension={300}
        // fixed
        spacing={10}
        renderItem={({ item }) => (
          <View style={[styles.news_container, { backgroundColor: "#000" }]}>
            <TouchableOpacity
              onPress={() => {
                /* 1. Navigate to the Details route with params */
                navigation.navigate("FoundDetailedItem", {
                  itemPostId: item.postId,
                  itemTitle: item.title,
                  itemCategory: item.categoryId.name,
                  itemLocation: item.buildingId.name,
                  itemOtherLocation: item.otherDropOffLocation,
                  itemDate: item.date,
                  itemDescription: item.description,
                  itemImage: item.imageUrl,
                  itemFoundUser: item.foundUserId,
                  itemClaimedUser: item.claimedUserId,
                });
              }}
            >
              <View style={styles.news_photo}>
                <Image source={{ uri: item.imageUrl }} style={styles.photo} />
              </View>
            </TouchableOpacity>
            <Text style={styles.title}>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );
};

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
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFD54F",
    alignSelf: "center",
    // fontFamily: 'georgia'
  },
  news_photo: {
    flex: 1,
    paddingTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  photo: {
    width: 170,
    height: 170,
  },
  gridView: {
    marginTop: 10,
    flex: 1,
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
