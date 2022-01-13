import React from "react";
import { Input, FormControl, WarningOutlineIcon } from "native-base";

type ValidationState = {
  value: string;
  isInvalid: boolean;
  errorMessage: string;
};

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
        base: "80%",
        md: "25%",
      }}
      mt={props.mt}
      my={props.my}
    >
      <Input
        variant="outline"
        size="2xl"
        value={props.value}
        placeholder={props.title}
        onChangeText={(value) =>
          props.onChangeText({ value, isInvalid: false, errorMessage: "" })
        }
        style={{ borderColor: "#000", borderWidth: 1 }}
        borderRadius="15"
        backgroundColor="#ffffff"
      />
      <FormControl.ErrorMessage
        fontSize="xl"
        leftIcon={<WarningOutlineIcon size="xs" />}
      >
        {props.errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  );
};

export default TextInput;
