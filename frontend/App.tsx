import { StatusBar } from "expo-status-bar";
import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { NativeBaseProvider, Center } from "native-base";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import { LogBox } from "react-native";

// Initialize Apollo Client
const client = new ApolloClient({
  uri: 'http://uwfind.us-east-2.elasticbeanstalk.com/graphql/',
  cache: new InMemoryCache()
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
