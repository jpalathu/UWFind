/*
  This isn't used right now, but might be helpful to have in case 
  we ever want to do some specific logic using the screen dimensions.
*/
import { Dimensions } from "react-native";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
};
