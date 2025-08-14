import { ThemeColors } from "@/constants/Colors";
import { ThemeConstants } from "@/constants/ThemeConstans";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ms } from "react-native-size-matters";

const ThemedBreadCrumb = () => {
  return (
    <View style={styles.backgroundWrapper}>
      <Text>BreadCrumb / Folder</Text>
    </View>
  );
};

export default ThemedBreadCrumb;

const styles = StyleSheet.create({
  backgroundWrapper: {
    padding: ms(2),
    paddingHorizontal: ms(10),
    backgroundColor: ThemeColors.lightGray,
    borderRadius: ThemeConstants.borderRadius.lg,
  },
});
