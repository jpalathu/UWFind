import React, { useState } from "react";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import * as yup from "yup";
import { StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
import { Button, Box, Text, Actionsheet, Heading } from "native-base";
import { RootTabScreenProps } from "../types";
import TextInput from "../components/shared/TextInput";

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

  const schema = yup.object().shape({
    email: yup.string().required(),
    password: yup.string().required(),
  });

  const goToSignUp = () => {
    resetFields();
    navigation.navigate("SignUp");
  };

  const resetFields = () => {
    setEmail(initialState);
    setPassword(initialState);
  };

  const handleFormError = (err: any) => {
    for (const error of err) {
      const errorState = { isInvalid: true, errorMessage: error.message };
      if (error.path === "email") {
        setEmail({
          ...email,
          ...errorState,
        });
      } else if (error.path === "password") {
        setPassword({
          ...password,
          ...errorState,
        });
      }
    }
  };

  const handleResult = (result: any) => {
    const { error, data } = result;
    if (error) {
      // display the error message
      console.log("ERROR", JSON.stringify(error, null, 2));
    } else {
      console.log("GOOD", data);
      // store the user details, access token, and id token somewhere
      resetFields();
      navigation.navigate("Home");
    }
  };

  const LOGIN_QUERY = gql`
    query Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
      }
    }
  `;
  const [executeQuery] = useLazyQuery(LOGIN_QUERY);
  const login = () => {
    schema
      .validate(
        { email: email.value, password: password.value },
        { abortEarly: false }
      )
      .then(async (details) => {
        // const result = await executeQuery({
        //   variables: { email: details.email, password: details.password },
        // });
        // handleResult(result);
        // TODO: remove when fully connected
        navigation.navigate("Home");
      })
      .catch((err) => {
        handleFormError(err.inner);
      });
  };

  // TODO: Try to use svg to fix scaling issue
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
      />
      <Button
        onPress={login}
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

  const schema = yup.object().shape({
    email: yup.string().required(),
  });

  const handleFormError = (err: any) => {
    for (const error of err) {
      const errorState = { isInvalid: true, errorMessage: error.message };
      if (error.path === "email") {
        setEmail({
          ...email,
          ...errorState,
        });
      }
    }
  };

  const handleResult = (result: any) => {
    const { error, data } = result;
    if (error) {
      // display the error message
      console.log("ERROR", JSON.stringify(error, null, 2));
    } else {
      console.log("GOOD", data);
      closeSheet();
    }
  };

  const RESET_PASSWORD_MUTATION = gql`
    mutation ResetPassword($email: String!) {
      resetPassword(email: $email) {
        isSent
      }
    }
  `;

  const [executeMutation] = useMutation(RESET_PASSWORD_MUTATION);
  const forgotPassword = () => {
    schema
      .validate({ email: email.value }, { abortEarly: false })
      .then(async (details) => {
        const result = await executeMutation({
          variables: { email: details.email },
        });

        handleResult(result);
      })
      .catch((err) => {
        handleFormError(err.inner);
      });
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
