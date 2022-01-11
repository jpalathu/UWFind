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

type ValidationState = {
  value: string;
  isInvalid: boolean;
  errorMessage: string;
};

export default function SignIn({ navigation }: RootTabScreenProps<"SignIn">) {
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
        setFirstName(initialState);
        setLastName(initialState);
        setEmail(initialState);
        setPassword(initialState);
        setConfirmPassword(initialState);
        navigation.navigate("SignIn");
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
      />
      <TextInput
        title="Last Name"
        value={lastName.value}
        isInvalid={lastName.isInvalid}
        errorMessage={lastName.errorMessage}
        onChangeText={setLastName}
        my="3"
      />
      <TextInput
        title="Email"
        value={email.value}
        isInvalid={email.isInvalid}
        errorMessage={email.errorMessage}
        onChangeText={setEmail}
        my="3"
      />
      <TextInput
        title="Password"
        value={password.value}
        isInvalid={password.isInvalid}
        errorMessage={password.errorMessage}
        onChangeText={setPassword}
        my="3"
      />
      <TextInput
        title="Confirm Password"
        value={confirmPassword.value}
        isInvalid={confirmPassword.isInvalid}
        errorMessage={confirmPassword.errorMessage}
        onChangeText={setConfirmPassword}
        my="3"
      />
      <Button
        onPress={createAccount}
        size="lg"
        style={{ backgroundColor: "#6b6b6b" }}
        width="240px"
        height="59px"
        borderRadius="20"
        my="3"
        _text={{ color: "#000" }}
      >
        Create Account
      </Button>
    </Box>
  );
}

type TextInputProps = {
  isInvalid: boolean;
  value: string;
  onChangeText: (value: ValidationState) => void;
  errorMessage: string;
  title: string;
  mt?: string;
  my?: string;
};
const TextInput = (props: TextInputProps) => {
  return (
    <FormControl
      isInvalid={props.isInvalid}
      w={{
        base: "75%",
        md: "25%",
      }}
      mt={props.mt}
      my={props.my}
    >
      <Input
        variant="outline"
        size="lg"
        value={props.value}
        placeholder={props.title}
        onChangeText={(value) =>
          props.onChangeText({ value, isInvalid: false, errorMessage: "" })
        }
        backgroundColor="#fff"
      />
      <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
        {props.errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.gold,
  },
});
