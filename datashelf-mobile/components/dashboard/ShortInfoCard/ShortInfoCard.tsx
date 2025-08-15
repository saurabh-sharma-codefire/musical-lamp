import { StyleSheet } from "react-native";

import ThemedCard from "@/components/ThemedCard";
import ThemedIconButton from "@/components/ThemedIconButton";
import ThemedStack from "@/components/ThemedStack";
import { ThemedText } from "@/components/ThemedText";
import { ThemeColors } from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { ms } from "react-native-size-matters";

const ShortInfoCard = () => {
  return (
    <ThemedCard style={styles.cardContainer} variant="filled" padding={"small"}>
      {/* Header Part */}
      <ThemedStack direction="row" justifyContent="space-between">
        <Feather name="cloud" size={ms(20)} />
        <ThemedStack direction="row" gap={5}>
          <ThemedIconButton icon="edit-2" />
          <ThemedIconButton icon="info" />
        </ThemedStack>
      </ThemedStack>
      <ThemedStack
        style={{ marginTop: ms(15) }}
        direction="row"
        gap={2}
        alignItems="flex-end"
        justifyContent="space-between"
      >
        <ThemedStack>
          <ThemedText type="defaultSemiBold">Storage</ThemedText>
          <ThemedText type="subtitle">
            <ThemedText type="title">12.50GB</ThemedText> / 125GB
          </ThemedText>
        </ThemedStack>
        <ThemedStack justifyContent="center" alignItems="center">
          <ThemedText type="defaultSemiBold">Billing</ThemedText>
          <ThemedText>$12</ThemedText>
        </ThemedStack>
      </ThemedStack>
    </ThemedCard>
  );
};

export default ShortInfoCard;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: ThemeColors.lightGray,
  },
});
