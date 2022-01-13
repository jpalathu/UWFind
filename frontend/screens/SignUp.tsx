import React, { useState } from "react";
import * as yup from "yup";
import { StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import { Button, Box, Text } from "native-base";
import { RootTabScreenProps } from "../types";
import TextInput from "../components/shared/TextInput";

type ValidationState = {
  value: string;
  isInvalid: boolean;
  errorMessage: string;
};

export default function SignUp({ navigation }: RootTabScreenProps<"SignUp">) {
  const schema = yup.object().shape({
    // disable required for now
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().required(),
    password: yup.string().required(),
    confirmPassword: yup.string().required(),
  });

  const initialState = {
    value: "",
    isInvalid: false,
    errorMessage: "",
  };
  const [firstName, setFirstName] = useState<ValidationState>(initialState);
  const [lastName, setLastName] = useState<ValidationState>(initialState);
  const [email, setEmail] = useState<ValidationState>(initialState);
  const [password, setPassword] = useState<ValidationState>(initialState);
  const [confirmPassword, setConfirmPassword] =
    useState<ValidationState>(initialState);

  const createAccount = () => {
    schema
      .validate(
        {
          firstName: firstName.value,
          lastName: lastName.value,
          email: email.value,
          password: password.value,
        },
        { abortEarly: false }
      )
      .then((value) => {
        console.log(value);
        // create the user

        // reset everyting back to initial state
        resetFields();
        navigation.navigate("Login");
      })
      .catch((err) => {
        for (const error of err.inner) {
          const errorState = { isInvalid: true, errorMessage: error.message };
          switch (error.path) {
            case "firstName":
              setFirstName({
                ...password,
                ...errorState,
              });
              break;
            case "lastName":
              setLastName({
                ...password,
                ...errorState,
              });
              break;
            case "email":
              setEmail({
                ...email,
                ...errorState,
              });
              break;
            case "password":
              setPassword({
                ...password,
                ...errorState,
              });
              break;
          }
        }
      });
  };

  const resetFields = () => {
    setFirstName(initialState);
    setLastName(initialState);
    setEmail(initialState);
    setPassword(initialState);
    setConfirmPassword(initialState);
  };

  // TODO: compare the passwords and make sure they are the same
  // TODO: see if we can create custom error messages
  // TODO: validate that it's a UW email
  return (
    <Box style={styles.container}>
      <TextInput
        title="First Name"
        value={firstName.value}
        isInvalid={firstName.isInvalid}
        errorMessage={firstName.errorMessage}
        onChangeText={setFirstName}
        my="3"
        icon="person"
      />
      <TextInput
        title="Last Name"
        value={lastName.value}
        isInvalid={lastName.isInvalid}
        errorMessage={lastName.errorMessage}
        onChangeText={setLastName}
        my="3"
        icon="person"
      />
      <TextInput
        title="Email"
        value={email.value}
        isInvalid={email.isInvalid}
        errorMessage={email.errorMessage}
        onChangeText={setEmail}
        my="3"
        icon="email"
      />
      <TextInput
        title="Password"
        value={password.value}
        isInvalid={password.isInvalid}
        errorMessage={password.errorMessage}
        onChangeText={setPassword}
        my="3"
        icon="lock"
      />
      <TextInput
        title="Confirm Password"
        value={confirmPassword.value}
        isInvalid={confirmPassword.isInvalid}
        errorMessage={confirmPassword.errorMessage}
        onChangeText={setConfirmPassword}
        my="3"
        icon="lock"
      />
      <Button
        onPress={createAccount}
        size="lg"
        my="3"
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
        CREATE ACCOUNT
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
