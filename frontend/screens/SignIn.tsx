import React, { useState } from "react";
import * as yup from "yup";
import { StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import {
  Button,
  Input,
  Box,
  FormControl,
  WarningOutlineIcon,
} from "native-base";
import { RootTabScreenProps } from "../types";

export default function SignIn({ navigation }: RootTabScreenProps<"SignIn">) {
  const schema = yup.object().shape({
    // disable required for now
    email: yup.string(),
    password: yup.string(),
  });

  type ValidationState = {
    value: string;
    isInvalid: boolean;
    errorMessage: string;
  };

  const [email, setEmail] = useState<ValidationState>({
    value: "",
    isInvalid: false,
    errorMessage: "",
  });
  const [password, setPassword] = useState<ValidationState>({
    value: "",
    isInvalid: false,
    errorMessage: "",
  });

  const goToSignUp = () => {
    navigation.navigate("Home");
  };

  const login = () => {
    schema
      .validate(
        { email: email.value, password: password.value },
        { abortEarly: false }
      )
      .then((value) => {
        console.log(value);
        navigation.navigate("Home");
      })
      .catch((err) => {
        for (const error of err.inner) {
          if (error.path === "email") {
            setEmail({
              ...email,
              isInvalid: true,
              errorMessage: error.message,
            });
          }
          if (error.path === "password") {
            setPassword({
              ...password,
              isInvalid: true,
              errorMessage: error.message,
            });
          }
        }
      });
  };

  return (
    <Box style={styles.container}>
      <FormControl
        isInvalid={email.isInvalid}
        w={{
          base: "75%",
          md: "25%",
        }}
        mb="6"
      >
        <Input
          variant="outline"
          size="lg"
          value={email.value}
          placeholder="UW Email"
          onChangeText={(value) =>
            setEmail({ value, isInvalid: false, errorMessage: "" })
          }
          backgroundColor="#fff"
        />
        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
          {email.errorMessage}
        </FormControl.ErrorMessage>
      </FormControl>
      <FormControl
        isInvalid={password.isInvalid}
        w={{
          base: "75%",
          md: "25%",
        }}
      >
        <Input
          variant="outline"
          size="lg"
          value={password.value}
          placeholder="Password"
          onChangeText={(value) =>
            setPassword({ value, isInvalid: false, errorMessage: "" })
          }
          backgroundColor="#fff"
        />
        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
          {password.errorMessage}
        </FormControl.ErrorMessage>
      </FormControl>
      <Button
        onPress={login}
        size="lg"
        my="6"
        style={{ backgroundColor: "#ffc50b"}}
        width="240px"
        height="59px"
        borderRadius="20"
        _text={{color: "#000"}}
      >
        Log In
      </Button>
      <Button
        onPress={goToSignUp}
        size="lg"
        style={{ backgroundColor: "#ffc50b"}}
        width="240px"
        height="59px"
        borderRadius="20"
        _text={{color: "#000"}}
      >
        Sign Up
      </Button>
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.gold,
  },
});
