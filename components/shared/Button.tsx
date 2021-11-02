import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type ButtonProps = {
    text: string;
    color: string;
    onPress: () => void;
};

const Button = ({
    ...props
}: ButtonProps) => {
    return (
        <TouchableOpacity style={{ ...styles.button, backgroundColor: props.color }}
            onPress={props.onPress}>
            <Text style={styles.text}>{props.text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 20,
        marginHorizontal: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
      },
    text: {
        color:"#fff",
        fontWeight: "bold",
    }
});

export default Button;
