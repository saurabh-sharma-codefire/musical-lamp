import { StyleSheet, View } from "react-native";

import FoldersGrid from "@/components/Data/FoldersGrid";
import ThemedBreadCrumb from "@/components/ThemedBreadCrumb";
import ThemedButton from "@/components/ThemedButton";
import ThemedDropdown from "@/components/ThemedDropdown";
import ThemedIconButton from "@/components/ThemedIconButton";
import ThemedStack from "@/components/ThemedStack";
import { ThemedText } from "@/components/ThemedText";
import ThemedToggleGroup from "@/components/ThemedToggle";
import { ThemeColors } from "@/constants/Colors";
import { ThemeConstants } from "@/constants/ThemeConstans";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import Constants from "expo-constants";
import { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ms } from "react-native-size-matters";

const PaginationBarHeight = ms(60),
  SubHeaderBarHeight = ms(60);

export default function DataScreen() {
  const handleGoBack = () => {};
  const [singleSelection, setSingleSelection] = useState<(string | number)[]>([
    "list",
  ]);

  // Options with only icons (labels hidden)
  const toolOptions = [
    { label: "List", value: "list", icon: "list" },
    { label: "Grid", value: "grid", icon: "grid" },
  ];

  const BottomTabHeight = useBottomTabBarHeight();
  const ScrollableAreaHeight = useMemo(
    () =>
      ThemeConstants.windowHeight -
      (ThemeConstants.headerHeight +
        PaginationBarHeight +
        SubHeaderBarHeight +
        Constants.statusBarHeight +
        BottomTabHeight),
    [BottomTabHeight]
  );
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
            <ThemedText type={"subtitle"}>Data</ThemedText>
          </ThemedStack>
          <ThemedDropdown
            placeholder="Select provider"
            options={[
              "AWS S3",
              "FTP",
              "AWS S32",
              "FTP2",
              "AWS S33",
              "FTP3",
              "AWS S34",
              "FTP4",
            ]}
            value={"FTP"}
            onChange={() => {}}
          />
        </ThemedStack>
        {/* Component */}
        <View>
          {/* BreadCrumb */}
          <ThemedStack
            height={SubHeaderBarHeight}
            px={8}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <ThemedStack>
              <ThemedText type="subtitle">Home</ThemedText>
              <ThemedBreadCrumb />
            </ThemedStack>
            <ThemedToggleGroup
              options={toolOptions}
              selectedValues={singleSelection}
              onSelectionChange={setSingleSelection}
              variant="outlined"
              size="medium"
              multiSelect={false}
              showLabels={true}
            />
          </ThemedStack>
          {/* Folders and Files */}
          <View style={{ height: ScrollableAreaHeight }}>
            <FoldersGrid />
          </View>
          {/* Pagination */}
          <ThemedStack
            px={8}
            height={PaginationBarHeight}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <ThemedButton
              size="small"
              title="Back"
              onPress={() => console.log("Primary pressed")}
              variant="outlined"
            />
            <ThemedText>25/478</ThemedText>
            <ThemedButton
              size="small"
              title="Next"
              onPress={() => console.log("Primary pressed")}
              variant="outlined"
            />
          </ThemedStack>
          {/* Folder Edit Model */}
        </View>
      </SafeAreaView>
    </View>
  );
}

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
