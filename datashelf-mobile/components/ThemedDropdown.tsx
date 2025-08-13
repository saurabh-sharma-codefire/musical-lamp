import { ThemeColors } from "@/constants/Colors";
import { ThemeConstants } from "@/constants/ThemeConstans";
import { Feather } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { ms } from "react-native-size-matters";
import { ThemedText } from "./ThemedText";

interface ThemedDropdownProps {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  variant?: "text" | "outlined" | "contained";
  dropdownStyles?: ViewStyle;
  textStyles?: TextStyle;
}

const ThemedDropdown = ({
  options,
  value,
  onChange,
  placeholder = "Select",
  variant = "outlined",
  dropdownStyles,
  textStyles,
}: ThemedDropdownProps) => {
  const [visible, setVisible] = useState(false);

  const handleSelect = (val: string) => {
    onChange(val);
    setVisible(false);
  };

  const optionsMapped = useMemo(
    () =>
      options.map((item) => ({
        value: item,
        label: item,
        selected: item === value,
      })),
    [options, value]
  );

  return (
    <>
      {/* Dropdown Button */}
      <TouchableOpacity
        style={[styles.wrapper, variantStyles[variant], dropdownStyles]}
        onPress={() => setVisible(true)}
      >
        <Text
          style={[styles.text, iconVariantStyles[variant], textStyles]}
          numberOfLines={1}
        >
          {value || placeholder}
        </Text>
        <Feather
          name={visible ? "chevron-up" : "chevron-down"}
          size={ms(16)}
          style={iconVariantStyles[variant]}
        />
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal transparent visible={visible} animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={styles.dropdownList}>
            <View style={styles.dropdownLabel}>
              <ThemedText type="subtitle">{placeholder}</ThemedText>
            </View>
            <FlatList
              data={optionsMapped}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    ...styles.option,
                    ...(item.selected && styles.optionSelected),
                  }}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text
                    style={{
                      ...styles.optionText,
                      ...(item.selected && styles.optionSelectedText),
                    }}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default ThemedDropdown;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    minWidth: ms(150),
    alignItems: "center",
    justifyContent: "space-between",
    padding: ms(8),
    borderWidth: 1,
    borderRadius: ThemeConstants.borderRadius.md,
  },
  text: {
    flex: 1,
    fontSize: ms(14),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  dropdownList: {
    padding: ms(15),
    backgroundColor: ThemeColors.white,
    borderTopEndRadius: ThemeConstants.borderRadius.xl,
    borderTopStartRadius: ThemeConstants.borderRadius.xl,
    maxHeight: ms(250),
    minHeight: ms(150),
  },
  dropdownLabel: {
    paddingBottom: ms(15),
    borderBottomWidth: 1,
    borderColor: ThemeColors.border,
  },
  option: {
    padding: ms(12),
    borderBottomWidth: 1,
    borderRadius: ThemeConstants.borderRadius.md,
    borderBottomColor: ThemeColors.transparent,
  },
  optionSelected: {
    backgroundColor: ThemeColors.primary,
  },
  optionSelectedText: {
    color: ThemeColors.white,
  },
  optionText: {
    fontSize: ms(14),
    color: ThemeColors.text,
  },
  // variants
  outlinedVariant: {
    borderColor: ThemeColors.primary,
  },
  containedVariant: {
    backgroundColor: ThemeColors.primary,
    borderColor: ThemeColors.primary,
  },
  textVariant: {
    borderColor: ThemeColors.transparent,
  },
  textIconVariant: {
    color: ThemeColors.primary,
  },
  outlinedIconVariant: {
    color: ThemeColors.primary,
  },
  containedIconVariant: {
    color: ThemeColors.white,
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
