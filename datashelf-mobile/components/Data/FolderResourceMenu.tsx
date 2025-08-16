import { ThemeColors } from "@/constants/Colors";
import { IconConstants } from "@/constants/IconConstants";
import { ThemeConstants } from "@/constants/ThemeConstans";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { ms } from "react-native-size-matters";
import ThemedIconButton from "../ThemedIconButton";
import ThemedStack from "../ThemedStack";
import { ThemedText } from "../ThemedText";

const FolderResourceMenu = ({
  show = false,
  resourceId = null,
  resourceList = [],
  handleClose = () => {},
}) => {
  const CurrentResource = useMemo(
    () => resourceList.find((item) => item.id === resourceId),
    [resourceId, resourceList]
  );

  const ResourceIcon =
    CurrentResource?.type === "folder"
      ? IconConstants.folder
      : IconConstants.file;

  const FolderDetailsList = [
    { label: "Type", value: ".PDF" },
    { label: "File Size", value: "2.4 MB" },
    { label: "Created", value: "12 August 2025" },
    { label: "Modified", value: "15 August 2025" },
  ];
  return (
    CurrentResource &&
    show && (
      <Modal transparent visible={true} animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleClose}
        >
          <ThemedStack style={styles.wrapper}>
            <ThemedIconButton onPress={handleClose} iconSize={24} buttonStyles={styles.close} icon="x-circle" />
            <ThemedStack
              style={{ width: "100%" }}
              alignItems="center"
              justifyContent="center"
            >
              <ResourceIcon style={{ height: ms(60), width: ms(60) }} />
              <View>
                <ThemedText style={{ textAlign: "center" }} type="subtitle">
                  {CurrentResource?.name}
                </ThemedText>
                <ThemedText
                  style={{ textAlign: "center", color: ThemeColors.bodyText }}
                >
                  Size 1.2 MB
                </ThemedText>
              </View>
              {/* File/Folder Actions */}
              <ThemedStack direction="row" gap={2}>
                <ThemedStack
                  style={styles.actionbutton}
                  alignItems="center"
                  gap={8}
                >
                  <View style={styles.actionbuttonIcon}>
                    <Feather name="download" size={ms(30)} />
                  </View>
                  <ThemedText>Download</ThemedText>
                </ThemedStack>
                <ThemedStack
                  style={styles.actionbutton}
                  alignItems="center"
                  gap={8}
                >
                  <View style={styles.actionbuttonIcon}>
                    <MaterialCommunityIcons
                      name="folder-move-outline"
                      size={ms(30)}
                    />
                  </View>
                  <ThemedText>Move Folder</ThemedText>
                </ThemedStack>
                <ThemedStack
                  style={styles.actionbutton}
                  alignItems="center"
                  gap={8}
                >
                  <View style={styles.actionbuttonIcon}>
                    <Feather name="trash-2" size={ms(30)} />
                  </View>
                  <ThemedText>Delete</ThemedText>
                </ThemedStack>
              </ThemedStack>
              {/* File/Folder Details */}
              <ThemedStack style={{ width: "100%" }} gap={20}>
                <ThemedText type="defaultSemiBold">Details</ThemedText>
                {FolderDetailsList.map((detailItem) => {
                  return (
                    <ThemedStack
                      style={{ width: "100%" }}
                      direction="row"
                      justifyContent="space-between"
                    >
                      <ThemedText style={{ color: ThemeColors.bodyText }}>
                        {detailItem.label}
                      </ThemedText>
                      <ThemedText type="defaultSemiBold">
                        {detailItem.value}
                      </ThemedText>
                    </ThemedStack>
                  );
                })}
              </ThemedStack>
            </ThemedStack>
          </ThemedStack>
        </TouchableOpacity>
      </Modal>
    )
  );
};

export default FolderResourceMenu;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
    zIndex:-1
  },
  close:{
    position:'absolute',
    top:15,
    right:15
  },
  wrapper: {
    zIndex:2,
    position:'relative',
    padding: ms(15),
    paddingTop: ms(30),
    paddingBottom: ms(80),
    backgroundColor: ThemeColors.white,
    borderTopEndRadius: ThemeConstants.borderRadius.xxl,
    borderTopStartRadius: ThemeConstants.borderRadius.xxl,
    maxHeight: ms(600),
    minHeight: ms(350),
  },
  actionbutton: {
    borderRadius: ThemeConstants.borderRadius.md,
    width: "30%",
    paddingVertical: ms(20),
  },
  actionbuttonIcon: {
    backgroundColor: ThemeColors.lightGray,
    padding: ms(10),
    borderRadius: ThemeConstants.borderRadius.lg,
  },
});
