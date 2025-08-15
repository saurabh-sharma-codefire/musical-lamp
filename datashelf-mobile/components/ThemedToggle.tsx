import { Colors, ThemeColors } from "@/constants/Colors";
import { ThemeConstants } from "@/constants/ThemeConstans";
import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native";
import { ms } from "react-native-size-matters";

export interface ToggleOption {
  label: string;
  value: string | number;
  icon?: React.ComponentProps<typeof Feather>["name"];
}

interface ThemedToggleGroupProps {
  options: ToggleOption[];
  selectedValues: (string | number)[];
  onSelectionChange: (selectedValues: (string | number)[]) => void;
  variant?: "text" | "outlined" | "contained";
  size?: "small" | "medium" | "large";
  multiSelect?: boolean;
  showLabels?: boolean;
  disabled?: boolean;
  iconSize?: number;
  containerStyles?: ViewStyle;
  buttonStyles?: TouchableOpacityProps["style"];
  textStyles?: TextStyle;
  activeButtonStyles?: ViewStyle;
  activeTextStyles?: TextStyle;
}

const ThemedToggleGroup = ({
  options,
  selectedValues,
  onSelectionChange,
  variant = "outlined",
  size = "medium",
  multiSelect = false,
  showLabels = true,
  disabled = false,
  iconSize = 16,
  containerStyles,
  buttonStyles,
  textStyles,
  activeButtonStyles,
  activeTextStyles,
}: ThemedToggleGroupProps) => {
  const handleOptionPress = (value: string | number) => {
    if (disabled) return;

    let newSelectedValues: (string | number)[];

    if (multiSelect) {
      if (selectedValues.includes(value)) {
        newSelectedValues = selectedValues.filter((v) => v !== value);
      } else {
        newSelectedValues = [...selectedValues, value];
      }
    } else {
      newSelectedValues = [value];
    }

    onSelectionChange(newSelectedValues);
  };

  const isSelected = (value: string | number) => selectedValues.includes(value);

  const getButtonStyle = (value: string | number) => {
    const baseStyle = [
      styles.buttonWrapper,
      sizeStyles[size],
      variantStyles[variant],
    ];

    if (isSelected(value)) {
      baseStyle.push(activeVariantStyles[variant]);
      if (activeButtonStyles) {
        baseStyle.push(activeButtonStyles);
      }
    }

    if (disabled) {
      baseStyle.push(styles.disabledButton);
    }

    if (buttonStyles) {
      baseStyle.push(buttonStyles);
    }

    return baseStyle;
  };

  const getTextStyle = (value: string | number) => {
    const baseStyle = [
      styles.textStyle,
      textSizeStyles[size],
      textVariantStyles[variant],
    ];

    if (isSelected(value)) {
      baseStyle.push(activeTextVariantStyles[variant]);
      if (activeTextStyles) {
        baseStyle.push(activeTextStyles);
      }
    }

    if (disabled) {
      baseStyle.push(styles.disabledText);
    }

    if (textStyles) {
      baseStyle.push(textStyles);
    }

    return baseStyle;
  };

  const getIconStyle = (value: string | number) => {
    const baseStyle = [styles.iconStyle, textVariantStyles[variant]];

    if (isSelected(value)) {
      baseStyle.push(activeTextVariantStyles[variant]);
    }

    if (disabled) {
      baseStyle.push(styles.disabledText);
    }

    return baseStyle;
  };

  return (
    <View style={[styles.container, containerStyles]}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          onPress={() => handleOptionPress(option.value)}
          style={getButtonStyle(option.value)}
          disabled={disabled}
          activeOpacity={disabled ? 1 : 0.7}
        >
          <View style={styles.buttonContent}>
            {option.icon && (
              <Feather
                name={option.icon}
                size={ms(iconSize)}
                style={getIconStyle(option.value)}
              />
            )}
            {showLabels && isSelected(option.value) && (
              <Text
                style={[
                  getTextStyle(option.value),
                  option.icon && showLabels ? styles.textWithIcon : {},
                ]}
              >
                {option.label}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ThemedToggleGroup;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: ms(2),
    borderWidth: 1,
    borderColor: ThemeColors.border,
    backgroundColor: ThemeColors.lightGray,
    padding: ms(3),
    borderRadius: ThemeConstants.borderRadius.md,
  },
  buttonWrapper: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: ThemeConstants.borderRadius.sm,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  textStyle: {
    fontWeight: "500",
    textAlign: "center",
    minWidth: ms(40),
  },
  iconStyle: {
    color: Colors.light.primary,
  },
  textWithIcon: {
    marginLeft: ms(6),
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.5,
  },
  // Size variants
  smallButton: {
    paddingHorizontal: ms(8),
    paddingVertical: ms(2),
    minHeight: ms(30),
  },
  mediumButton: {
    paddingHorizontal: ms(8),
    paddingVertical: ms(3),
    minHeight: ms(35),
  },
  largeButton: {
    paddingHorizontal: ms(20),
    paddingVertical: ms(12),
    minHeight: ms(40),
  },
  // Text size variants
  smallText: {
    fontSize: ms(12),
  },
  mediumText: {
    fontSize: ms(14),
  },
  largeText: {
    fontSize: ms(16),
  },
  // Inactive variant styles
  textVariant: {},
  outlinedVariant: {
    borderColor: Colors.light.primary,
  },
  containedVariant: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primary,
  },
  // Active variant styles
  activeTextVariant: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  activeOutlinedVariant: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  activeContainedVariant: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  // Text color variants - inactive
  textVariantText: {
    color: Colors.light.primary,
  },
  outlinedVariantText: {
    color: Colors.light.primary,
  },
  containedVariantText: {
    color: Colors.light.white,
  },
  // Text color variants - active
  activeTextVariantText: {
    color: Colors.light.white,
  },
  activeOutlinedVariantText: {
    color: Colors.light.white,
  },
  activeContainedVariantText: {
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

const activeVariantStyles = {
  text: styles.activeTextVariant,
  outlined: styles.activeOutlinedVariant,
  contained: styles.activeContainedVariant,
};

const textVariantStyles = {
  text: styles.textVariantText,
  outlined: styles.outlinedVariantText,
  contained: styles.containedVariantText,
};

const activeTextVariantStyles = {
  text: styles.activeTextVariantText,
  outlined: styles.activeOutlinedVariantText,
  contained: styles.activeContainedVariantText,
};
