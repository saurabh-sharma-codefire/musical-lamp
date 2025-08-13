import { IconConstants } from "@/constants/IconConstants";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { ms } from "react-native-size-matters";

const FolderItem = ({ data }) => {
  const FolderIcon =
    data.type === "folder" ? IconConstants.folder : IconConstants.file;
  return (
    <TouchableOpacity style={styles.container}>
      <FolderIcon style={{ height: ms(120), width: ms(120) }} />
      <Text>{data.name}</Text>
    </TouchableOpacity>
  );
};

export default FolderItem;

const styles = StyleSheet.create({
  container: {
    padding: ms(5),
    alignItems: "center",
    width: "45%",
  },
});
