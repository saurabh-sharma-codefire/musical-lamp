import { StyleSheet, View } from "react-native";

import FoldersGrid from "@/components/Data/FoldersGrid";
import Headerbar from "@/components/Headerbar";
import ThemedBreadCrumb from "@/components/ThemedBreadCrumb";
import ThemedButton from "@/components/ThemedButton";
import ThemedDropdown from "@/components/ThemedDropdown";
import ThemedStack from "@/components/ThemedStack";
import { ThemedText } from "@/components/ThemedText";
import ThemedToggleGroup, { ToggleOption } from "@/components/ThemedToggle";
import { ThemeColors } from "@/constants/Colors";
import useScreenHeight from "@/hooks/useScreenHeight";
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
  const toolOptions: ToggleOption[] = [
    { label: "List", value: "list", icon: "list" },
    { label: "Grid", value: "grid", icon: "grid" },
  ];

  const ScreenHeight = useScreenHeight();
  const ScrollableAreaHeight = useMemo(
    () => ScreenHeight - (PaginationBarHeight + SubHeaderBarHeight),
    [ScreenHeight]
  );
  return (
    <View style={{ backgroundColor: ThemeColors.white }}>
      <SafeAreaView>
        {/* Header Components */}
        <Headerbar title="Data" showGoBack={false}>
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
        </Headerbar>
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

const styles = StyleSheet.create({});
