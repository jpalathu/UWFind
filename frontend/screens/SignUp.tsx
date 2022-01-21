import React, { useState } from "react";
import { StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import {
  Button,
  Box,
  Text,
  Select,
  CheckIcon,
  FormControl,
  WarningOutlineIcon,
  Heading,
} from "native-base";
import { RootTabScreenProps } from "../types";
import TextInput from "../components/shared/TextInput";
import { gql, useMutation } from "@apollo/client";

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

export default function SignUp({ navigation }: RootTabScreenProps<"SignUp">) {
  const [firstName, setFirstName] = useState<ValidationState>(initialState);
  const [lastName, setLastName] = useState<ValidationState>(initialState);
  const [bio, setBio] = useState<ValidationState>(initialState);
  const [email, setEmail] = useState<ValidationState>(initialState);
  const [password, setPassword] = useState<ValidationState>(initialState);
  const [confirmPassword, setConfirmPassword] =
    useState<ValidationState>(initialState);

  const resetFields = () => {
    setFirstName(initialState);
    setLastName(initialState);
    setBio(initialState);
    setEmail(initialState);
    setPassword(initialState);
    setConfirmPassword(initialState);
  };

  const validate = () => {
    let isError = false;
    /* Check if value exists */
    if (!firstName.value) {
      setFirstName({
        ...firstName,
        isInvalid: true,
        errorMessage: "First name is required",
      });
      isError = true;
    }
    if (!lastName.value) {
      setLastName({
        ...lastName,
        isInvalid: true,
        errorMessage: "Last name is required",
      });
      isError = true;
    }
    if (!bio.value) {
      setBio({
        ...bio,
        isInvalid: true,
        errorMessage: "Bio is required",
      });
      isError = true;
    }
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
    /* Make sure passwords match */
    if (password.value && password.value != confirmPassword.value) {
      setConfirmPassword({
        ...confirmPassword,
        isInvalid: true,
        errorMessage: "Passwords don't match",
      });
      isError = true;
    }
    /* Check if UW email */
    if (email.value && !email.value.endsWith("@uwaterloo.ca")) {
      setEmail({
        ...email,
        isInvalid: true,
        errorMessage: "Use a UW email ending with @uwaterloo.ca",
      });
      isError = true;
    }

    return !isError;
  };

  const SIGN_UP_MUTATION = gql`
    mutation (
      $firstName: String!
      $lastName: String!
      $bio: String!
      $email: String!
      $password: String!
    ) {
      signUp(
        input: {
          firstName: $firstName
          lastName: $lastName
          bio: $bio
          email: $email
          password: $password
        }
      ) {
        user {
          userId
          firstName
        }
      }
    }
  `;

  const [executeMutation] = useMutation(SIGN_UP_MUTATION);
  const [isMutationLoading, setIsMutationLoading] = useState(false);
  const createAccount = async () => {
    setIsMutationLoading(true);
    if (validate()) {
      try {
        const result = await executeMutation({
          variables: {
            firstName: firstName.value,
            lastName: lastName.value,
            bio: bio.value,
            email: email.value,
            password: password.value,
          },
        });

        console.log("GOOD", result);
        resetFields();
        navigation.navigate("Login");
      } catch (error) {
        console.log("ERROR", JSON.stringify(error, null, 2));
      }
    }
    setIsMutationLoading(false);
  };

  return (
    <Box style={styles.container}>
      <Heading size="xl" alignSelf="flex-start" ml="8">
        Create Account
      </Heading>
      <Text fontSize={20} alignSelf="flex-start" ml="8" mb="3">
        Sign up to get started!
      </Text>
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
        title="Tell Us About Yourself"
        value={bio.value}
        isInvalid={bio.isInvalid}
        errorMessage={bio.errorMessage}
        onChangeText={setBio}
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
        hideEntry
      />
      <TextInput
        title="Confirm Password"
        value={confirmPassword.value}
        isInvalid={confirmPassword.isInvalid}
        errorMessage={confirmPassword.errorMessage}
        onChangeText={setConfirmPassword}
        my="3"
        icon="lock"
        hideEntry
      />

      <Button
        onPress={createAccount}
        isLoading={isMutationLoading}
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
