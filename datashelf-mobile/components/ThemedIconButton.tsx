import { Colors } from "@/constants/Colors";
import { ThemeConstants } from "@/constants/ThemeConstans";
import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  GestureResponderEvent,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { ms } from "react-native-size-matters";

interface ThemedIconButtonProps {
  icon: React.ComponentProps<typeof Feather>["name"];
  iconSize: number;
  onPress: (event: GestureResponderEvent) => void;
  variant: "text" | "outlined" | "contained";
  buttonStyles?: TouchableOpacityProps["style"];
  buttonIconStyles?: TextStyle;
}

const ThemedIconButton = ({
  icon,
  iconSize = 20,
  variant = "text",
  onPress,
  buttonStyles,
  buttonIconStyles,
}: ThemedIconButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.buttonWrapper, variantStyles[variant], buttonStyles]}
    >
      <Feather
        size={ms(iconSize)}
        name={icon}
        style={[styles.iconStyle, iconVariantStyles[variant], buttonIconStyles]}
      />
    </TouchableOpacity>
  );
};

export default ThemedIconButton;

const styles = StyleSheet.create({
  buttonWrapper: {
    padding: ms(4),
    borderWidth: 1,
    borderColor: Colors.light.transparent,
    borderRadius: ThemeConstants.borderRadius.sm,
  },
  textVariant: {},
  outlinedVariant: {
    borderColor: Colors.light.primary,
  },
  containedVariant: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primary,
  },
  iconStyle: {
    color: Colors.light.primary,
  },
  textIconVariant: {
    color: Colors.light.primary,
  },
  outlinedIconVariant: {
    color: Colors.light.primary,
  },
  containedIconVariant: {
    color: Colors.light.white,
  },
});

const variantStyles = {
  text: styles.textVariant,
  outlined: styles.outlinedVariant,
  contained: styles.containedVariant,
};

const iconVariantStyles = {
  text: styles.textIconVariant,
  outlined: styles.outlinedIconVariant,
  contained: styles.containedIconVariant,
};
