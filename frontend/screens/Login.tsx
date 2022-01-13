import React, { useState } from "react";
import * as yup from "yup";
import { StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
import { Button, Box, Text } from "native-base";
import { RootTabScreenProps } from "../types";
import TextInput from "../components/shared/TextInput";

type ValidationState = {
  value: string;
  isInvalid: boolean;
  errorMessage: string;
};

export default function Login({ navigation }: RootTabScreenProps<"Login">) {
  const schema = yup.object().shape({
    email: yup.string().required(),
    password: yup.string().required(),
  });

  const initialState = {
    value: "",
    isInvalid: false,
    errorMessage: "",
  };
  const [email, setEmail] = useState<ValidationState>(initialState);
  const [password, setPassword] = useState<ValidationState>(initialState);

  const goToSignUp = () => {
    resetFields();
    navigation.navigate("SignUp");
  };

  const goToForgotPassword = () => {
    resetFields();
    navigation.navigate("ForgotPassword");
  };

  const login = () => {
    schema
      .validate(
        { email: email.value, password: password.value },
        { abortEarly: false }
      )
      .then((value) => {
        console.log(value);
        resetFields();
        navigation.navigate("Home");
      })
      .catch((err) => {
        for (const error of err.inner) {
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
      });
  };

  const resetFields = () => {
    setEmail(initialState);
    setPassword(initialState);
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
      />
      <TextInput
        title="Password"
        value={password.value}
        isInvalid={password.isInvalid}
        errorMessage={password.errorMessage}
        onChangeText={setPassword}
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
          shadowOffset: {width: 1, height: 10}
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
          shadowOffset: {width: 1, height: 10}
        }}
        width="80%"
        height="59px"
        borderRadius="20"
        _text={{ color: "#000" }}
      >
        SIGN UP
      </Button>

      <TouchableOpacity onPress={goToForgotPassword}>
        <Text fontSize="lg" mt="6" underline style={{ alignSelf: "flex-end" }}>
          Forgot Password?
        </Text>
      </TouchableOpacity>
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
