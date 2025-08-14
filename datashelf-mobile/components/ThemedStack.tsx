import React, { ReactNode } from "react";
import { FlexStyle, View, ViewStyle, type ViewProps } from "react-native";
import { ms } from "react-native-size-matters";

type ThemedStackProps = ViewProps & {
  children: ReactNode;
  direction?: FlexStyle["flexDirection"];
  gap?: number;
  alignItems?: FlexStyle["alignItems"];
  p?: number;
  px?: number;
  py?: number;
  height?: ViewStyle["height"];
  justifyContent?: FlexStyle["justifyContent"];
};

const ThemedStack = ({
  children,
  direction = "column",
  gap = 5,
  alignItems = "flex-start",
  justifyContent = "flex-start",
  p = 0,
  px = 0,
  py = 0,
  height = "auto",
  style,
}: ThemedStackProps) => {
  return (
    <View
      style={[
        {
          alignItems,
          justifyContent,
          flexDirection: direction,
          gap: ms(gap),
          ...(px > 0 || py > 0
            ? { paddingHorizontal: ms(px), paddingVertical: ms(py) }
            : { padding: ms(p) }),
          height: height,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default ThemedStack;
