import React, { Component, useState, useEffect } from "react";
import Colors from "../constants/Colors";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import {
  Heading,
  Text,
  VStack,
  Center,
  NativeBaseProvider,
  Container,
  Divider,
  Modal,
  FormControl,
  Input,
  Button,
  IconButton,
  Box,
  Icon,
  HStack,
} from "native-base";
import { Foundation } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

import TextInput from "../components/shared/TextInput";
import * as yup from "yup";
import { RootTabScreenProps } from "../types";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useStore } from "../store";
import ProfileImage from "../components/shared/ProfileImage";
import { useRoute } from "@react-navigation/native";

// export default function SignUp({ navigation }: RootTabScreenProps<"SignUp">) {
//     const schema = yup.object().shape({
//       // disable required for now
//       initialMessage: yup.string().required(),

//     });

export default function PublicProfile() {
  const route = useRoute();

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    email: "",
    imageUrl: "",
  });

  /* Getting the user data initially */
  const USER_BY_ID_QUERY = gql`
    query ($id: Int!) {
      userById(id: $id) {
        firstName
        lastName
        bio
        email
        imageUrl
      }
    }
  `;

  const [executeQuery] = useLazyQuery(USER_BY_ID_QUERY);
  const loadProfile = async () => {
    const { data, error } = await executeQuery({
      variables: { id: route.params?.userID },
    });
    if (error) {
      console.error("ERROR", JSON.stringify(error, null, 2));
    } else {
      setProfile(data.userById);
      console.log("GOOD", data);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // handleEmail = (text: any) => {
  //     this.setState({ email: text })
  //  }

  // export default class PublicProfile extends Component {

  // const initialState = {
  //     value: "",
  //     isInvalid: false,
  //     errorMessage: "",
  //   };

  // state = {
  //     email: '',
  //     password: ''
  //  }
  //  handleEmail = (text: any) => {
  //     this.setState({ email: text })
  //  }
  //  handlePassword = (text: any) => {
  //     this.setState({ password: text })
  //  }

  // render() {

  return (
    <View>
      <View style={styles.header}>
        <ProfileImage
          style={styles.avatar}
          imageUrl={profile.imageUrl}
          firstName={profile.firstName}
          lastName={profile.lastName}
        />
      </View>

      {/* <Image
            style={styles.avatar}
            source={{ uri: "https://bootdey.com/img/Content/avatar/avatar6.png" }}
          /> */}

      <View style={styles.body}>
        <View>
          <Text style={styles.name}>
            {profile.firstName} {profile.lastName}
          </Text>
          <Text style={styles.info}>{profile.bio}</Text>

          <Divider my="2" />
          <Text style={styles.name}>Email </Text>
          <Text style={styles.info}>{profile.email}</Text>
        </View>
      </View>

      <Center>
        {/* <TextInput title= " Send James a Message"
               onChangeText = {this.handleEmail}
               value={""}
               isInvalid={true}
               errorMessage={""}
               my="3"
               icon="mail"
               
/> */}
      </Center>
      <Center>
        <Button
          size="lg"
          my="6"
          style={{
            backgroundColor: "#ffc50b",
            borderColor: "#000",
            borderWidth: 1,
            shadowOpacity: 0.3,
            shadowRadius: 10,
            shadowOffset: { width: 1, height: 10 },
          }}
          width="50%"
          height="59px"
          borderRadius="20"
          _text={{ color: "#000" }}
        >
          Send
        </Button>
      </Center>
    </View>
  );
  // }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.gold,
    height: 200,
  },
  input: {
    margin: 15,
    height: 40,
    borderColor: "white",
    borderWidth: 1,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10,
    alignSelf: "center",
    position: "absolute",
    marginTop: 130,
  },
  name: {
    fontSize: 22,
    color: Colors.white,
    fontWeight: "600",
  },
  body: {
    marginTop: 40,
  },
  info: {
    fontSize: 16,
    color: "#00BFFF",
    marginTop: 10,
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: "#696969",
    marginTop: 10,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
    backgroundColor: Colors.gold,
  },
});
