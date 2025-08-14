import Constants from "expo-constants";
import { Dimensions } from "react-native";
import { ms } from "react-native-size-matters";

export const ThemeConstants = {
  borderRadius: {
    xs: ms(3),
    sm: ms(5),
    md: ms(8),
    lg: ms(10),
    xl: ms(13),
    xxl: ms(25),
    full: ms(50),
  },
  headerHeight: ms(60),
  statusBarHeight: Constants.statusBarHeight,
  windowHeight: Dimensions.get("window").height,
  windowWidth: Dimensions.get("window").width,
};
