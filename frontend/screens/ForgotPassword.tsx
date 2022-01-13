import React, { useState } from "react";
import * as yup from "yup";
import { StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import { Button, Box } from "native-base";
import { RootTabScreenProps } from "../types";
import TextInput from "../components/shared/TextInput";

type ValidationState = {
  value: string;
  isInvalid: boolean;
  errorMessage: string;
};

export default function ForgotPassword({
  navigation,
}: RootTabScreenProps<"ForgotPassword">) {
  const schema = yup.object().shape({
    // disable required for now
    email: yup.string().required(),
  });

  const initialState = {
    value: "",
    isInvalid: false,
    errorMessage: "",
  };
  const [email, setEmail] = useState<ValidationState>(initialState);

  const forgotPassword = () => {
    schema
      .validate({ email: email.value }, { abortEarly: false })
      .then((value) => {
        console.log(value);
        setEmail(initialState);
        navigation.navigate("Login");
      })
      .catch((err) => {
        for (const error of err.inner) {
          const errorState = { isInvalid: true, errorMessage: error.message };
          if (error.path === "email") {
            setEmail({
              ...email,
              ...errorState,
            });
          }
        }
      });
  };

  return (
    <Box style={styles.container}>
      <TextInput
        title="Email"
        value={email.value}
        isInvalid={email.isInvalid}
        errorMessage={email.errorMessage}
        onChangeText={setEmail}
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
          shadowOffset: {width: 1, height: 10}
        }}
        width="80%"
        height="59px"
        borderRadius="20"
        _text={{ color: "#000" }}
      >
        SEND RESET PASSWORD EMAIL
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
