import React, { ReactNode } from "react";
import { FlexStyle, View, type ViewProps } from "react-native";
import { ms } from "react-native-size-matters";

type ThemedStackProps = ViewProps & {
  children: ReactNode;
  direction?: FlexStyle["flexDirection"];
  gap?: number;
  alignItems?: FlexStyle["alignItems"];
  justifyContent?: FlexStyle["justifyContent"];
};

const ThemedStack = ({
  children,
  direction = "column",
  gap = 5,
  alignItems = "flex-start",
  justifyContent = "flex-start",
  style,
}: ThemedStackProps) => {
  return (
    <View
      style={[
        { alignItems, justifyContent, flexDirection: direction, gap: ms(gap) },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default ThemedStack;
