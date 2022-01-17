import React from "react";
import { Input, FormControl, WarningOutlineIcon, Icon } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";

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
  icon: string;
  hideEntry?: boolean;
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
        secureTextEntry={props.hideEntry}
        variant="outline"
        size="2xl"
        value={props.value}
        placeholder={props.title}
        onChangeText={(value) =>
          props.onChangeText({ value, isInvalid: false, errorMessage: "" })
        }
        // style={{ borderColor: "#000", borderWidth: 1 }}
        borderRadius="15"
        backgroundColor="#ffffff"
        InputLeftElement={
          <Icon
            as={<MaterialIcons name={props.icon} />}
            size={7}
            ml="2"
            color="muted.400"
          />
        }
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
