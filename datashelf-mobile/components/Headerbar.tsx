import { ThemeColors } from "@/constants/Colors";
import { ThemeConstants } from "@/constants/ThemeConstans";
import React, { ReactElement } from "react";
import { StyleSheet } from "react-native";
import { ms } from "react-native-size-matters";
import ThemedIconButton from "./ThemedIconButton";
import ThemedStack from "./ThemedStack";
import { ThemedText } from "./ThemedText";

interface HeaderbarProps {
    handleGoBack?:()=>void;
    title? : string;
    showGoBack?: boolean;
    children?:ReactElement
}

const Headerbar = ({
  handleGoBack = () => {},
  title = "Screen Title",
  showGoBack = true,
  children,
}: HeaderbarProps) => {
  return (
    <ThemedStack
      direction="row"
      justifyContent="space-between"
      style={styles.headerbar}
    >
      <ThemedStack direction="row" gap={8} alignItems="center">
        {showGoBack && handleGoBack && (
          <ThemedIconButton
            variant={"contained"}
            onPress={handleGoBack}
            icon="arrow-left"
            iconSize={16}
          />
        )}
        <ThemedText type={"subtitle"}>{title}</ThemedText>
      </ThemedStack>
      {children}
    </ThemedStack>
  );
};

export default Headerbar;

const styles = StyleSheet.create({
  headerbar: {
    height: ThemeConstants.headerHeight,
    paddingHorizontal: ms(14),
    gap: ms(8),
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: ms(1),
    borderColor: ThemeColors.border,
    backgroundColor: ThemeColors.white,
  },
});
