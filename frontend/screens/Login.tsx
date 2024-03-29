import React, { useState } from "react";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
import {
  Button,
  Box,
  Text,
  Actionsheet,
  Heading,
  FormControl,
  WarningOutlineIcon,
} from "native-base";
import { RootTabScreenProps } from "../types";
import TextInput from "../components/shared/TextInput";
import { useStore } from "../store";
import { useChatContext } from "stream-chat-expo";

type ValidationState = {
  value: string;
  isInvalid: boolean;
  errorMessage: string;
};

const initialState = {
  value: "",
  isInvalid: false,
  errorMessage: "",
};

export default function Login({ navigation }: RootTabScreenProps<"Login">) {
  const { client } = useChatContext();
  const connectUser = async (id: string, name: string, image: string) => {
    client.disconnectUser();
    await client.connectUser(
      {
        id,
        name,
        image,
      },
      client.devToken(id)
    );
  };

  const [email, setEmail] = useState<ValidationState>(initialState);
  const [password, setPassword] = useState<ValidationState>(initialState);
  const goToSignUp = () => {
    resetFields();
    navigation.navigate("SignUp");
  };

  const resetFields = () => {
    setIsLoginFailed(false);
    setEmail(initialState);
    setPassword(initialState);
  };

  const [isLoginFailed, setIsLoginFailed] = useState(false);

  const validate = () => {
    let isError = false;
    if (!email.value) {
      setEmail({
        ...email,
        isInvalid: true,
        errorMessage: "Email is required",
      });
      isError = true;
    }
    if (!password.value) {
      setPassword({
        ...password,
        isInvalid: true,
        errorMessage: "Password is required",
      });
      isError = true;
    }

    return !isError;
  };

  const LOGIN_QUERY = gql`
    query($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        user {
          userId
          firstName
          lastName
          imageUrl
        }
        token
      }
    }
  `;
  const [executeQuery] = useLazyQuery(LOGIN_QUERY);
  const [isQueryLoading, setIsQueryLoading] = useState(false);
  const { updateUserID, updateUser, updateAuthToken } = useStore();
  const login = async () => {
    setIsQueryLoading(true);
    try {
      if (validate()) {
        const { data, error } = await executeQuery({
          variables: { email: email.value, password: password.value },
        });
        console.log("error", error, "data", data);
        if (error || !data.login) {
          setIsLoginFailed(true);
          console.log("ERROR", JSON.stringify(error, null, 2));
        } else {
          setIsLoginFailed(false);
          const { userId, firstName, lastName, imageUrl } = data.login.user;
          // store the user ID and auth token
          updateUserID(userId);
          updateUser(data.login.user);
          updateAuthToken(data.login.token);
          connectUser(
            userId,
            `${firstName} ${lastName}`,
            imageUrl ? imageUrl : ""
          );
          resetFields();
          navigation.navigate("Home");
        }
      }
    } catch (err) {
      console.log(err);
    }
    setIsQueryLoading(false);
  };

  return (
    <Box style={styles.container}>
      <ImageBackground
        resizeMode="cover"
        source={require("../assets/images/sign-in.jpg")}
        style={{ flex: 1, width: "100%", height: "100%", position: "absolute" }}
      />
      <TextInput
        title="Email"
        value={email.value}
        isInvalid={email.isInvalid}
        errorMessage={email.errorMessage}
        onChangeText={(value) => {
          setEmail(value);
          setIsLoginFailed(false);
        }}
        my="6"
        mt="200"
        icon="email"
      />
      <TextInput
        title="Password"
        value={password.value}
        isInvalid={password.isInvalid}
        errorMessage={password.errorMessage}
        onChangeText={(value) => {
          setPassword(value);
          setIsLoginFailed(false);
        }}
        icon="lock"
        hideEntry
      />
      <FormControl mt="1" isInvalid={isLoginFailed}>
        <Button
          onPress={login}
          isLoading={isQueryLoading}
          size="lg"
          mt="6"
          mb="3"
          style={{
            alignSelf: "center",
            backgroundColor: "#ffc50b",
            borderColor: "#000",
            borderWidth: 1,
            shadowOpacity: 0.3,
            shadowRadius: 10,
            shadowOffset: { width: 1, height: 10 },
          }}
          width="80%"
          height="59px"
          borderRadius="20"
          _text={{ color: "#000" }}
        >
          LOGIN
        </Button>

        <FormControl.ErrorMessage
          mb="3"
          style={{ alignSelf: "center" }}
          fontSize="xl"
          leftIcon={<WarningOutlineIcon size="xs" />}
        >
          {"Failed to login. Please check your email/password and try again!"}
        </FormControl.ErrorMessage>
      </FormControl>

      <Button
        onPress={goToSignUp}
        size="lg"
        style={{
          backgroundColor: "#fff",
          borderColor: "#000",
          borderWidth: 1,
          shadowOpacity: 0.3,
          shadowRadius: 10,
          shadowOffset: { width: 1, height: 10 },
        }}
        width="80%"
        height="59px"
        borderRadius="20"
        _text={{ color: "#000" }}
      >
        SIGN UP
      </Button>
      <ForgotPassword />
    </Box>
  );
}

const ForgotPassword = () => {
  const [email, setEmail] = useState<ValidationState>(initialState);
  const [isOpen, setIsOpen] = useState(false);

  const validate = () => {
    let isError = false;
    if (!email.value) {
      setEmail({
        ...email,
        isInvalid: true,
        errorMessage: "Email is required",
      });
      isError = true;
    }

    return !isError;
  };

  const RESET_PASSWORD_MUTATION = gql`
    mutation($email: String!) {
      resetPassword(email: $email) {
        isSent
      }
    }
  `;

  const [executeMutation] = useMutation(RESET_PASSWORD_MUTATION);
  const [isMutationLoading, setIsMutationLoading] = useState(false);
  const forgotPassword = async () => {
    setIsMutationLoading(true);
    if (validate()) {
      try {
        const result = await executeMutation({
          variables: { email: email.value },
        });
        closeSheet();
      } catch (error) {
        console.error("ERROR", JSON.stringify(error, null, 2));
      }
    }
    setIsMutationLoading(false);
  };

  const openSheet = () => {
    setIsOpen(true);
  };
  const closeSheet = () => {
    setIsOpen(false);
    setEmail(initialState);
  };

  return (
    <Box>
      <TouchableOpacity onPress={openSheet}>
        <Text fontSize="lg" mt="6" underline>
          Forgot Password?
        </Text>
      </TouchableOpacity>
      <Actionsheet isOpen={isOpen} onClose={closeSheet}>
        <Actionsheet.Content>
          <Heading>Forgot Password</Heading>
          <Text fontSize={16} my="4" mx="2">
            Enter your email and we'll send you an email with a link to reset
            your password.
          </Text>
          <TextInput
            title="Email"
            value={email.value}
            isInvalid={email.isInvalid}
            errorMessage={email.errorMessage}
            onChangeText={setEmail}
            icon="email"
          />
          <Button
            onPress={forgotPassword}
            isLoading={isMutationLoading}
            size="lg"
            my="6"
            style={{
              backgroundColor: "#d4d4d4",
              borderColor: "#000",
              borderWidth: 1,
              shadowOpacity: 0.3,
              shadowRadius: 10,
              shadowOffset: { width: 1, height: 10 },
            }}
            width="80%"
            height="59px"
            borderRadius="20"
            _text={{ color: "#000" }}
          >
            SEND RESET PASSWORD EMAIL
          </Button>
        </Actionsheet.Content>
      </Actionsheet>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
