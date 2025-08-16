import { ScrollView, StyleSheet, View } from "react-native";

import ShortInfoCard from "@/components/dashboard/ShortInfoCard/ShortInfoCard";
import FoldersGrid from "@/components/Data/FoldersGrid";
import Headerbar from "@/components/Headerbar";
import ThemedIconButton from "@/components/ThemedIconButton";
import ThemedSearchBar from "@/components/ThemedSearchBar";
import ThemedStack from "@/components/ThemedStack";
import { ThemedText } from "@/components/ThemedText";
import { ThemeColors } from "@/constants/Colors";
import { ThemeConstants } from "@/constants/ThemeConstans";
import useScreenHeight from "@/hooks/useScreenHeight";
import { Feather, Octicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { ms } from "react-native-size-matters";

export default function HomeScreen() {
  const handleAddNew = () => {};
  const screenHeight = useScreenHeight();
  return (
    <View style={{ backgroundColor: ThemeColors.white }}>
      <SafeAreaView>
        {/* Header Components */}
        <Headerbar showGoBack={false} title="Dashboard">
          <ThemedIconButton bgColor="black" variant="contained" icon="plus" />
        </Headerbar>
        {/* Component */}
        <View style={[styles.container, { height: screenHeight }]}>
          <ScrollView contentContainerStyle={styles.scrollContentContainer}>
            {/* This Feature requires indexing of the Storage first */}
            <ThemedSearchBar variant="outlined" placeholder="Search file" />
            {/* Cloud Credentials Info Card Icon */}
            <ShortInfoCard />

            {/* Action Buttons */}
            <ThemedStack>
              <ThemedText type="subtitle">Manage Files</ThemedText>
              <ThemedStack
                style={{ width: "100%" }}
                justifyContent="space-between"
                direction="row"
              >
                <ThemedStack
                  style={styles.actionbutton}
                  alignItems="center"
                  gap={8}
                >
                  <View style={styles.actionbuttonIcon}>
                    <Feather name="folder" size={ms(30)} />
                  </View>
                  <ThemedText style={styles.actionButtonLabel}>
                    Create Folder
                  </ThemedText>
                </ThemedStack>
                <ThemedStack
                  style={styles.actionbutton}
                  alignItems="center"
                  gap={8}
                >
                  <View style={styles.actionbuttonIcon}>
                    <Feather name="upload-cloud" size={ms(30)} />
                  </View>
                  <ThemedText style={styles.actionButtonLabel}>
                    Upload File
                  </ThemedText>
                </ThemedStack>

                <ThemedStack
                  style={styles.actionbutton}
                  alignItems="center"
                  gap={8}
                >
                  <View style={styles.actionbuttonIcon}>
                    <Feather name="pie-chart" size={ms(30)} />
                  </View>
                  <ThemedText style={styles.actionButtonLabel}>
                    Analytics
                  </ThemedText>
                </ThemedStack>
                <ThemedStack
                  style={styles.actionbutton}
                  alignItems="center"
                  gap={8}
                >
                  <View style={styles.actionbuttonIcon}>
                    <Feather name="image" size={ms(30)} />
                  </View>
                  <ThemedText style={styles.actionButtonLabel}>
                    Gallery
                  </ThemedText>
                </ThemedStack>
              </ThemedStack>
            </ThemedStack>

            {/* Pinned Folders */}
            <ThemedStack>
              <ThemedStack direction="row" alignItems="flex-end" gap={8}>
                <ThemedText type="subtitle">Pinned Folders</ThemedText>
                <Octicons name="pin" size={ms(18)} />
              </ThemedStack>
              <FoldersGrid view="list" data={foldersData} />
            </ThemedStack>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

const foldersData = [
  { id: "f1", name: "Main Folder", type: "folder" },
  { id: "f2", name: "Projects", type: "folder" },
  { id: "f3", name: "Documents", type: "folder" },
  { id: "f4", name: "Images", type: "folder" },
  { id: "f5", name: "Videos", type: "folder" },
  { id: "f6", name: "Music", type: "folder" },
  { id: "f7", name: "Backups", type: "folder" },
  { id: "f8", name: "Work", type: "folder" },
];

const styles = StyleSheet.create({
  container: {},
  scrollContentContainer: {
    padding: ms(15),
    paddingVertical: ms(18),
    gap: ms(20),
  },
  actionbutton: {
    borderRadius: ThemeConstants.borderRadius.md,
    width: "24%",
    paddingVertical: ms(20),
  },
  actionButtonLabel: {
    color: ThemeColors.bodyText,
    fontSize: ms(13),
    textAlign: "center",
  },
  actionbuttonIcon: {
    backgroundColor: ThemeColors.lightGray,
    padding: ms(10),
    borderRadius: ThemeConstants.borderRadius.lg,
  },
  folderWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    gap: ms(8),
    padding: ms(10),
  },
});
