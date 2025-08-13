import { StyleSheet, View } from "react-native";

import ThemedIconButton from "@/components/ThemedIconButton";
import ThemedStack from "@/components/ThemedStack";
import { ThemedText } from "@/components/ThemedText";
import { ThemeColors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { ms } from "react-native-size-matters";

export default function ProfileScreen() {
  const handleGoBack = () => {};

  return (
    <View style={{ backgroundColor: ThemeColors.white }}>
      <SafeAreaView>
        {/* Header Components */}
        <ThemedStack
          direction="row"
          justifyContent="space-between"
          style={styles.headerbar}
        >
          <ThemedStack direction="row" gap={8} alignItems="center">
            <ThemedIconButton
              variant={"contained"}
              onPress={handleGoBack}
              icon="arrow-left"
              iconSize={16}
            />
            <ThemedText type={"subtitle"}>Profile</ThemedText>
          </ThemedStack>
        </ThemedStack>
        {/* Component */}
        <View></View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerbar: {
    height: ms(50),
    paddingHorizontal: ms(14),
    gap: ms(8),
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: ms(1),
    borderColor: ThemeColors.border,
    backgroundColor: ThemeColors.white,
  },
});
