// ThemedCard.tsx
import { Colors } from "@/constants/Colors";
import { ThemeConstants } from "@/constants/ThemeConstans";
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { ms } from "react-native-size-matters";

interface ThemedCardProps {
  header?: React.ReactNode;
  body?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: "elevated" | "outlined" | "filled";
  padding?: "none" | "small" | "medium" | "large";
  margin?: "none" | "small" | "medium" | "large";
  borderRadius?: "none" | "small" | "medium" | "large";
  style?: ViewStyle;
  headerStyle?: ViewStyle;
  bodyStyle?: ViewStyle;
  footerStyle?: ViewStyle;
}

const ThemedCard = ({
  header,
  body,
  footer,
  variant = "elevated",
  padding = "medium",
  margin = "none",
  borderRadius = "medium",
  style,
  headerStyle,
  bodyStyle,
  footerStyle,
}: ThemedCardProps) => {
  const getCardStyle = (): ViewStyle[] => {
    const baseStyle = [
      styles.cardWrapper,
      variantStyles[variant],
      paddingStyles[padding],
      marginStyles[margin],
      borderRadiusStyles[borderRadius],
    ];

    if (style) {
      baseStyle.push(style);
    }

    return baseStyle;
  };

  return (
    <View style={getCardStyle()}>
      {header && <View style={[styles.cardHeader, headerStyle]}>{header}</View>}

      {body && <View style={[styles.cardBody, bodyStyle]}>{body}</View>}

      {footer && <View style={[styles.cardFooter, footerStyle]}>{footer}</View>}
    </View>
  );
};

export default ThemedCard;

const styles = StyleSheet.create({
  cardWrapper: {
    backgroundColor: Colors.light.white,
    overflow: "hidden",
  },
  cardHeader: {
    paddingHorizontal: ms(16),
    paddingVertical: ms(12),
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border || "#E5E5E5",
  },
  cardBody: {
    flex: 1,
    paddingHorizontal: ms(16),
    paddingVertical: ms(16),
  },
  cardFooter: {
    paddingHorizontal: ms(16),
    paddingVertical: ms(12),
    borderTopWidth: 1,
    borderTopColor: Colors.light.border || "#E5E5E5",
  },
  // Variant styles
  elevatedVariant: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  outlinedVariant: {
    borderWidth: 1,
    borderColor: Colors.light.border || "#E5E5E5",
  },
  filledVariant: {
    backgroundColor: Colors.light.background || "#F8F9FA",
  },
  // Padding variants
  nonePadding: {
    padding: 0,
  },
  smallPadding: {
    padding: ms(8),
  },
  mediumPadding: {
    padding: ms(16),
  },
  largePadding: {
    padding: ms(24),
  },
  // Margin variants
  noneMargin: {
    margin: 0,
  },
  smallMargin: {
    margin: ms(8),
  },
  mediumMargin: {
    margin: ms(16),
  },
  largeMargin: {
    margin: ms(24),
  },
  // Border radius variants
  noneBorderRadius: {
    borderRadius: 0,
  },
  smallBorderRadius: {
    borderRadius: ThemeConstants.borderRadius.sm,
  },
  mediumBorderRadius: {
    borderRadius: ThemeConstants.borderRadius.md || ms(8),
  },
  largeBorderRadius: {
    borderRadius: ThemeConstants.borderRadius.lg || ms(16),
  },
});

// Style mappings
const variantStyles = {
  elevated: styles.elevatedVariant,
  outlined: styles.outlinedVariant,
  filled: styles.filledVariant,
};

const paddingStyles = {
  none: styles.nonePadding,
  small: styles.smallPadding,
  medium: styles.mediumPadding,
  large: styles.largePadding,
};

const marginStyles = {
  none: styles.noneMargin,
  small: styles.smallMargin,
  medium: styles.mediumMargin,
  large: styles.largeMargin,
};

const borderRadiusStyles = {
  none: styles.noneBorderRadius,
  small: styles.smallBorderRadius,
  medium: styles.mediumBorderRadius,
  large: styles.largeBorderRadius,
};
