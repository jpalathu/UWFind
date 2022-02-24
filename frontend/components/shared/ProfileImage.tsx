import React from "react";
import { View, Image, Text } from "react-native";

interface ProfileImageProps {
  style?: any;
  imageUrl: String;
  firstName: String;
  lastName: String;
  textSize: Number;
}
const ProfileImage = (props: ProfileImageProps) => {
  return (
    <View>
      {props.imageUrl ? (
        <Image
          source={{
            uri: props.imageUrl,
          }}
          style={props.style}
        />
      ) : (
        <View
          style={[
            props.style,
            {
              backgroundColor: "#DAC6E1",
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <Text style={{fontSize: props.textSize}}>
            {props.firstName.charAt(0).toUpperCase()}
            {props.lastName.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
    </View>
  );
};

export default ProfileImage;
