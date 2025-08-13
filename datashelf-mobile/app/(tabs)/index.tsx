import { Image } from "expo-image";
import { Platform, StyleSheet } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      // In Parallex View there will the Cards Showing the Resources and It will allow to add new Services providers
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome! Saurabh</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Migrate Data Service</ThemedText>
        <ThemedText>
          Edit{" "}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText>{" "}
          to see changes. Press{" "}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: "cmd + d",
              android: "cmd + m",
              web: "F12",
            })}
          </ThemedText>{" "}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Manage Users</ThemedText>
        <ThemedText>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quis
          reiciendis magnam necessitatibus nobis nam porro? Vel saepe deleniti
          non odit. Qui similique laborum facilis eius suscipit hic ea veniam
          blanditiis. Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Natus atque vitae possimus aspernatur incidunt, quas deserunt
          repellendus voluptate quidem molestiae ratione odio ipsum veniam
          perferendis quis illum? Odit, tempora quod.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">
          Another Service Card ! Not Yet Decided
        </ThemedText>
        <ThemedText>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quis
          reiciendis magnam necessitatibus nobis nam porro? Vel saepe deleniti
          non odit. Qui similique laborum facilis eius suscipit hic ea veniam
          blanditiis. Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Natus atque vitae possimus aspernatur incidunt, quas deserunt
          repellendus voluptate quidem molestiae ratione odio ipsum veniam
          perferendis quis illum? Odit, tempora quod.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
