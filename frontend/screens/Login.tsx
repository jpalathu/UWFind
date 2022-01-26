import React, { useState } from "react";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
import { Button, Box, Text, Actionsheet, Heading } from "native-base";
import { RootTabScreenProps } from "../types";
import TextInput from "../components/shared/TextInput";
import { useStore } from "../store";

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
  const [email, setEmail] = useState<ValidationState>(initialState);
  const [password, setPassword] = useState<ValidationState>(initialState);
  const goToSignUp = () => {
    resetFields();
    navigation.navigate("SignUp");
  };

  const resetFields = () => {
    setEmail(initialState);
    setPassword(initialState);
  };

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
    query ($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        user {
          userId
        }
        token
      }
    }
  `;
  const [executeQuery] = useLazyQuery(LOGIN_QUERY);
  const [isQueryLoading, setIsQueryLoading] = useState(false);
  const { updateUserID, updateAuthToken } = useStore();
  const login = async () => {
    setIsQueryLoading(true);
    if (validate()) {
      const { data, error } = await executeQuery({
        variables: { email: email.value, password: password.value },
      });

      if (error) {
        console.error("ERROR", JSON.stringify(error, null, 2));
      } else {
        console.log("GOOD", data);
        // store the user ID and auth token
        updateUserID(data.login.user.userId)
        updateAuthToken(data.login.token)
        resetFields();
        navigation.navigate("Home");
      }
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
        onChangeText={setEmail}
        my="6"
        mt="200"
        icon="email"
      />
      <TextInput
        title="Password"
        value={password.value}
        isInvalid={password.isInvalid}
        errorMessage={password.errorMessage}
        onChangeText={setPassword}
        icon="lock"
        hideEntry
      />
      <Button
        onPress={login}
        isLoading={isQueryLoading}
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
        width="80%"
        height="59px"
        borderRadius="20"
        _text={{ color: "#000" }}
      >
        LOGIN
      </Button>
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
    mutation ($email: String!) {
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
        console.log("GOOD", result);
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
