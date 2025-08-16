import { StyleSheet, Text, type TextProps } from "react-native";

import { ThemeColors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | "body"
    | "body2"
    | "body3"
    | "default"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "link";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      style={[
        { color },
        type === "body3" ? styles.body3 : undefined,
        type === "body2" ? styles.body2 : undefined,
        type === "body" ? styles.body : undefined,
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  body3: {
    fontSize: 8,
    lineHeight: 12,
    color: ThemeColors.bodyText,
  },
  body2: {
    fontSize: 10,
    lineHeight: 14,
    color: ThemeColors.bodyText,
  },
  body: {
    fontSize: 12,
    lineHeight: 16,
    color: ThemeColors.bodyText,
  },
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
  },
});
