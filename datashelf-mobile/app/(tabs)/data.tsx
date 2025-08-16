import { StyleSheet, View } from "react-native";

import FolderResourceMenu from "@/components/Data/FolderResourceMenu";
import FoldersGrid, { foldersDummyData } from "@/components/Data/FoldersGrid";
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
  const [viewMode, setViewMode] = useState("grid");
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

  const [resourceData, setResourceData] = useState(foldersDummyData);
  const [showResourceMenu, setShowResourceMenu] = useState({
    status: true,
    resourceId: null,
  });

  const closeResourceMenu = () => {
    setShowResourceMenu({
      status: false,
      resourceId: null,
    });
  };
  const handleResourceMenu = (resourceData) => {
    // Open Resource Info Folder with actions
    console.log("Pressed Menu");
    setShowResourceMenu({ status: true, resourceId: resourceData?.id });
  };

  const handleResourcePress = () => {
    console.log("Pressed Handle  resouce");

    // Redirect to resource Folder or show a preview of it
  };
  return (
    <View style={{ backgroundColor: ThemeColors.white }}>
      <SafeAreaView>
        {/* Header Components */}
        <Headerbar title="Data" showGoBack={false}>
          <ThemedDropdown
            placeholder="Select"
            variant="text"
            options={["AWS S3", "FTP", "G Drive", "Dropbox"]}
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
              selectedValues={[viewMode]}
              onSelectionChange={(UpdatedView) => {
                setViewMode(UpdatedView[0]);
              }}
              variant="outlined"
              size="medium"
              multiSelect={false}
              showLabels={true}
            />
          </ThemedStack>
          {/* Folders and Files */}
          <View style={{ height: ScrollableAreaHeight }}>
            <FoldersGrid
              data={resourceData}
              view={viewMode}
              handleMenu={handleResourceMenu}
              onResourceClick={handleResourcePress}
            />
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
              leftIcon={"arrow-left"}
              size="small"
              title="Back"
              onPress={() => console.log("Primary pressed")}
              variant="text"
            />
            <ThemedText>25/478</ThemedText>
            <ThemedButton
              rightIcon={"arrow-right"}
              size="small"
              title="Next"
              onPress={() => console.log("Primary pressed")}
              variant="text"
            />
          </ThemedStack>
          {/* Folder Edit Model */}
        </View>
        <FolderResourceMenu
          show={showResourceMenu.status}
          resourceId={showResourceMenu.resourceId}
          resourceList={resourceData}
          handleClose={closeResourceMenu}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({});
