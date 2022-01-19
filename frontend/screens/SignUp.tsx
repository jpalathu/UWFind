import React, { useState } from "react";
import * as yup from "yup";
import { StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import {
  Button,
  Box,
  Text,
  Select,
  CheckIcon,
  FormControl,
  Icon,
  WarningOutlineIcon,
  Heading,
} from "native-base";
import { RootTabScreenProps } from "../types";
import TextInput from "../components/shared/TextInput";
import { MaterialIcons } from "@expo/vector-icons";
import { validate } from "graphql";
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
  const [term, setTerm] = useState<ValidationState>(initialState);
  const [program, setProgram] = useState<ValidationState>(initialState);
  const [email, setEmail] = useState<ValidationState>(initialState);
  const [password, setPassword] = useState<ValidationState>(initialState);
  const [confirmPassword, setConfirmPassword] =
    useState<ValidationState>(initialState);

  const resetFields = () => {
    setFirstName(initialState);
    setLastName(initialState);
    setTerm(initialState);
    setProgram(initialState);
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
    if (!term.value) {
      setTerm({
        ...term,
        isInvalid: true,
        errorMessage: "Term is required",
      });
      isError = true;
    }
    if (!program.value) {
      setProgram({
        ...program,
        isInvalid: true,
        errorMessage: "Program is required",
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

  const handleResult = (result: any) => {
    const { error, data } = result;
    if (error) {
      // display the error message
      console.error("ERROR", JSON.stringify(error, null, 2));
    } else {
      resetFields();
      console.log("GOOD", data);
    }
  };

  const SIGN_UP_MUTATION = gql`
    mutation (
      $firstName: String!
      $lastName: String!
      $term: String!
      $program: String!
      $email: String!
      $password: String!
    ) {
      signUp(
        input: {
          firstName: $firstName
          lastName: $lastName
          term: $term
          program: $program
          email: $email
          password: $password
        }
      ) {
        userId
        firstName
      }
    }
  `;

  const [executeMutation] = useMutation(SIGN_UP_MUTATION);
  const [isMutationLoading, setIsMutationLoading] = useState(false);
  const createAccount = async () => {
    setIsMutationLoading(true);
    if (validate()) {
      const result = await executeMutation({
        variables: { email: email.value },
      });

      handleResult(result);
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
      <FormControl
        isInvalid={term.isInvalid}
        w={{
          base: "80%",
          md: "25%",
        }}
        my="3"
      >
        <Select
          selectedValue={term.value}
          placeholder="School Term"
          _selectedItem={{
            bg: "trueGray.300",
            endIcon: <CheckIcon size="5" />,
          }}
          size="2xl"
          borderRadius="15"
          backgroundColor="#ffffff"
          onValueChange={(value) =>
            setTerm({ value, isInvalid: false, errorMessage: "" })
          }
        >
          <Select.Item key="1st" label="1st Year" value="1st" />
          <Select.Item key="2nd" label="2nd Year" value="2nd" />
          <Select.Item key="3rd" label="3rd Year" value="3rd" />
        </Select>
        <FormControl.ErrorMessage
          fontSize="xl"
          leftIcon={<WarningOutlineIcon size="xs" />}
        >
          {term.errorMessage}
        </FormControl.ErrorMessage>
      </FormControl>
      <FormControl
        isInvalid={program.isInvalid}
        w={{
          base: "80%",
          md: "25%",
        }}
        my="3"
      >
        <Select
          selectedValue={program.value}
          placeholder="School Program"
          _selectedItem={{
            bg: "trueGray.300",
            endIcon: <CheckIcon size="5" />,
          }}
          size="2xl"
          borderRadius="15"
          backgroundColor="#ffffff"
          onValueChange={(value) =>
            setProgram({ value, isInvalid: false, errorMessage: "" })
          }
        >
          <Select.Item key="1st" label="Computer Engineering" value="1st" />
          <Select.Item key="2nd" label="Electrical Engineering" value="2nd" />
          <Select.Item key="3rd" label="Mechatronics Engineering" value="3rd" />
        </Select>
        <FormControl.ErrorMessage
          fontSize="xl"
          leftIcon={<WarningOutlineIcon size="xs" />}
        >
          {program.errorMessage}
        </FormControl.ErrorMessage>
      </FormControl>
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
