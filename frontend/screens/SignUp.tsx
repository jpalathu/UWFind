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
    year: yup.string().required(),
    program: yup.string().required(),
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
  const [year, setYear] = useState<ValidationState>(initialState);
  const [program, setProgram] = useState<ValidationState>(initialState);
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
          year: year.value,
          program: program.value,
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
                ...firstName,
                ...errorState,
              });
              break;
            case "lastName":
              setLastName({
                ...lastName,
                ...errorState,
              });
              break;
            case "year":
              setYear({
                ...year,
                ...errorState,
              });
              break;
            case "program":
              setProgram({
                ...program,
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
    setYear(initialState);
    setProgram(initialState);
    setEmail(initialState);
    setPassword(initialState);
    setConfirmPassword(initialState);
  };

  // TODO: compare the passwords and make sure they are the same
  // TODO: see if we can create custom error messages
  // TODO: validate that it's a UW email
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
        isInvalid={year.isInvalid}
        w={{
          base: "80%",
          md: "25%",
        }}
        my="3"
      >
        <Select
          selectedValue={year.value}
          placeholder="School Year"
          _selectedItem={{
            bg: "trueGray.300",
            endIcon: <CheckIcon size="5" />,
          }}
          size="2xl"
          borderRadius="15"
          backgroundColor="#ffffff"
          onValueChange={(value) =>
            setYear({ value, isInvalid: false, errorMessage: "" })
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
          {year.errorMessage}
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
