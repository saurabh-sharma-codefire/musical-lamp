import { Colors } from "@/constants/Colors";
import { ThemeConstants } from "@/constants/ThemeConstans";
import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  GestureResponderEvent,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native";
import { ms } from "react-native-size-matters";

interface ThemedButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  variant?: "text" | "outlined" | "contained";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ComponentProps<typeof Feather>["name"];
  rightIcon?: React.ComponentProps<typeof Feather>["name"];
  iconSize?: number;
  buttonStyles?: TouchableOpacityProps["style"];
  textStyles?: TextStyle;
  iconStyles?: TextStyle;
  loadingColor?: string;
}

const ThemedButton = ({
  title,
  onPress,
  variant = "contained",
  size = "medium",
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  iconSize = 18,
  buttonStyles,
  textStyles,
  iconStyles,
  loadingColor,
}: ThemedButtonProps) => {
  const handlePress = (event: GestureResponderEvent) => {
    if (!disabled && !loading) {
      onPress(event);
    }
  };

  const getButtonStyle = (): ViewStyle[] => {
    const baseStyle = [
      styles.buttonWrapper,
      sizeStyles[size],
      variantStyles[variant],
    ];

    if (fullWidth) {
      baseStyle.push(styles.fullWidth);
    }

    if (disabled || loading) {
      baseStyle.push(styles.disabledButton);
    }

    if (buttonStyles) {
      baseStyle.push(buttonStyles);
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle[] => {
    const baseStyle = [
      styles.textStyle,
      textSizeStyles[size],
      textVariantStyles[variant],
    ];

    if (disabled || loading) {
      baseStyle.push(styles.disabledText);
    }

    if (textStyles) {
      baseStyle.push(textStyles);
    }

    return baseStyle;
  };

  const getIconStyle = (): TextStyle[] => {
    const baseStyle = [styles.iconStyle, textVariantStyles[variant]];

    if (disabled || loading) {
      baseStyle.push(styles.disabledText);
    }

    if (iconStyles) {
      baseStyle.push(iconStyles);
    }

    return baseStyle;
  };

  const getLoadingColor = (): string => {
    if (loadingColor) return loadingColor;

    switch (variant) {
      case "contained":
        return Colors.light.white;
      case "outlined":
      case "text":
      default:
        return Colors.light.primary;
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="small"
            color={getLoadingColor()}
            style={styles.loadingIndicator}
          />
          <Text style={[getTextStyle(), styles.loadingText]}>{title}</Text>
        </View>
      );
    }

    return (
      <View style={styles.buttonContent}>
        {leftIcon && (
          <Feather
            name={leftIcon}
            size={ms(iconSize)}
            style={[getIconStyle(), styles.leftIcon]}
          />
        )}
        <Text style={getTextStyle()}>{title}</Text>
        {rightIcon && (
          <Feather
            name={rightIcon}
            size={ms(iconSize)}
            style={[getIconStyle(), styles.rightIcon]}
          />
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={getButtonStyle()}
      disabled={disabled || loading}
      activeOpacity={disabled || loading ? 1 : 0.7}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

export default ThemedButton;

const styles = StyleSheet.create({
  buttonWrapper: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.transparent,
    borderRadius: ThemeConstants.borderRadius.sm,
    flexDirection: "row",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingIndicator: {
    marginRight: ms(8),
  },
  loadingText: {
    opacity: 0.7,
  },
  textStyle: {
    fontWeight: "600",
    textAlign: "center",
  },
  iconStyle: {
    color: Colors.light.primary,
  },
  leftIcon: {
    marginRight: ms(8),
  },
  rightIcon: {
    marginLeft: ms(8),
  },
  fullWidth: {
    width: "100%",
  },
  disabledButton: {
    opacity: 0.6,
  },
  disabledText: {
    opacity: 0.6,
  },
  // Size variants
  smallButton: {
    paddingHorizontal: ms(16),
    paddingVertical: ms(8),
    minHeight: ms(36),
  },
  mediumButton: {
    paddingHorizontal: ms(20),
    paddingVertical: ms(12),
    minHeight: ms(44),
  },
  largeButton: {
    paddingHorizontal: ms(24),
    paddingVertical: ms(16),
    minHeight: ms(52),
  },
  // Text size variants
  smallText: {
    fontSize: ms(13),
  },
  mediumText: {
    fontSize: ms(15),
  },
  largeText: {
    fontSize: ms(17),
  },
  // Variant styles
  textVariant: {
    backgroundColor: Colors.light.transparent,
    borderColor: Colors.light.transparent,
  },
  outlinedVariant: {
    backgroundColor: Colors.light.transparent,
    borderColor: Colors.light.primary,
  },
  containedVariant: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  // Text color variants
  textVariantText: {
    color: Colors.light.primary,
  },
  outlinedVariantText: {
    color: Colors.light.primary,
  },
  containedVariantText: {
    color: Colors.light.white,
  },
});

// Style mappings
const sizeStyles = {
  small: styles.smallButton,
  medium: styles.mediumButton,
  large: styles.largeButton,
};

const textSizeStyles = {
  small: styles.smallText,
  medium: styles.mediumText,
  large: styles.largeText,
};

const variantStyles = {
  text: styles.textVariant,
  outlined: styles.outlinedVariant,
  contained: styles.containedVariant,
};

const textVariantStyles = {
  text: styles.textVariantText,
  outlined: styles.outlinedVariantText,
  contained: styles.containedVariantText,
};
