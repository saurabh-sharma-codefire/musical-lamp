import { Colors } from "@/constants/Colors";
import { ThemeConstants } from "@/constants/ThemeConstans";
import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    TextInput,
    TextInputProps,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";
import { ms } from "react-native-size-matters";

interface ThemedSearchBarProps extends Omit<TextInputProps, "onChange"> {
  value?: string;
  onChange?: (text: string) => void;
  placeholder?: string;
  variant?: "outlined" | "filled" | "transparent";
  icon?: React.ComponentProps<typeof Feather>["name"];
  iconSize?: number;
  onClear?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
}

const ThemedSearchBar: React.FC<ThemedSearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  variant = "outlined",
  icon = "search",
  iconSize = 18,
  onClear,
  containerStyle,
  inputStyle,
  ...textInputProps
}) => {
  const [internalValue, setInternalValue] = useState(value || "");

  // Keep internal value in sync with controlled value
  useEffect(() => {
    if (typeof value === "string" && value !== internalValue) {
      setInternalValue(value);
    }
  }, [value]);

  const handleChangeText = (text: string) => {
    if (onChange) onChange(text);
    if (value === undefined) setInternalValue(text); // uncontrolled
  };

  const handleClear = () => {
    if (onChange) onChange("");
    if (value === undefined) setInternalValue("");
    if (onClear) onClear();
  };

  const showClear = internalValue.length > 0;

  return (
    <View style={[styles.container, variantStyles[variant], containerStyle]}>
      {/* Left Icon */}
      {icon && (
        <Feather
          name={icon}
          size={ms(iconSize)}
          color={iconColors[variant]}
          style={styles.iconLeft}
        />
      )}

      {/* Input */}
      <TextInput
        value={internalValue}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.light.textMuted}
        style={[styles.input, inputStyle, { color: Colors.light.text }]}
        {...textInputProps}
      />

      {/* Clear Button */}
      {showClear && (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <Feather
            name="x"
            size={ms(iconSize)}
            color={Colors.light.textMuted}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ThemedSearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: ThemeConstants.borderRadius.md,
    paddingHorizontal: ms(12),
    height: ms(44),
  },
  iconLeft: {
    marginRight: ms(8),
  },
  input: {
    flex: 1,
    fontSize: ms(14),
    paddingVertical: ms(6),
  },
  clearButton: {
    marginLeft: ms(8),
  },
  // Variants
  outlined: {
    borderWidth: 1,
    borderColor: Colors.light.border || "#E5E5E5",
    backgroundColor: Colors.light.white,
  },
  filled: {
    backgroundColor: Colors.light.background || "#F5F5F5",
  },
  transparent: {
    backgroundColor: "transparent",
  },
});

const variantStyles = {
  outlined: styles.outlined,
  filled: styles.filled,
  transparent: styles.transparent,
};

const iconColors = {
  outlined: Colors.light.textMuted,
  filled: Colors.light.textMuted,
  transparent: Colors.light.textMuted,
};
