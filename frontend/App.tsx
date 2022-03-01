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
import { StreamChat } from "stream-chat";
import { OverlayProvider, Chat } from "stream-chat-expo";
import IGNORE_LOGS from "./ignoreLogs";

// Intitialize Chat Client
const chatClient = StreamChat.getInstance("yjnpxas6ctem");

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
LogBox.ignoreLogs(IGNORE_LOGS);

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

  useEffect(() => {
    return () => chatClient.disconnectUser();
  }, []);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <ApolloProvider client={client}>
        <OverlayProvider>
          <Chat client={chatClient}>
            <NativeBaseProvider>
              <Navigation colorScheme={colorScheme} />
            </NativeBaseProvider>
          </Chat>
        </OverlayProvider>
        <StatusBar />
      </ApolloProvider>
    );
  }
}
