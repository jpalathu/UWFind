import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { NativeBaseProvider, Center } from "native-base";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import { LogBox, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";

// Initialize Apollo Client
const client = new ApolloClient({
  uri: "http://uwfind.us-east-2.elasticbeanstalk.com/graphql/",
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "no-cache",
      errorPolicy: "ignore",
    },
    query: {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    },
  },
});

// Ignoring these annoying logs
LogBox.ignoreLogs([
  "NativeBase:",
  "VirtualizedList:",
  "When server rendering,",
]);

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  useEffect(() => {
    (async () => {
      if (Constants.platform.ios) {
        const cameraRollStatus =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        if (
          cameraRollStatus.status !== "granted" ||
          cameraStatus.status !== "granted"
        ) {
          alert(
            "Sorry, we need both camera and photo library permissions for the app to operate correctly! Please go to your phone's settings and grant them from there"
          );
        }
      }
    })();
  }, []);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <ApolloProvider client={client}>
        <NativeBaseProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </NativeBaseProvider>
      </ApolloProvider>
    );
  }
}
