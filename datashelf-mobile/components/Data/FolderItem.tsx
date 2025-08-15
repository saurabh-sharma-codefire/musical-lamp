import { IconConstants } from "@/constants/IconConstants";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ms } from "react-native-size-matters";
import ThemedIconButton from "../ThemedIconButton";
import ThemedStack from "../ThemedStack";
import { ThemedText } from "../ThemedText";

const GridFolderItem = ({ icon, data }) => {
  return (
    <TouchableOpacity style={[styles.container, styles.gridStyle]}>
      {icon}
      <Text>{data.name}</Text>
    </TouchableOpacity>
  );
};
const ListFolderItem = ({ icon, data }) => {
  return (
    <ThemedStack direction="row" style={styles.listContainer}>
      <TouchableOpacity style={[styles.container, styles.listStyle]}>
        <ThemedStack
          direction="row"
          alignItems="center"
          style={{ width: "100%", flex: 1 }}
        >
          {icon}
          <View>
            <ThemedText type="defaultSemiBold">{data.name}</ThemedText>
            <ThemedText type="body">Path/Sample/something</ThemedText>
          </View>
        </ThemedStack>
      </TouchableOpacity>
      <ThemedStack>
        <ThemedIconButton icon="code" />
      </ThemedStack>
    </ThemedStack>
  );
};

const FolderItem = ({ data, view = "grid" }) => {
  const FolderIcon =
    data.type === "folder" ? IconConstants.folder : IconConstants.file;
  const isListView = view === "list";
  return isListView ? (
    <ListFolderItem
      data={data}
      icon={<FolderIcon style={{ height: ms(40), width: ms(40) }} />}
    />
  ) : (
    <GridFolderItem
      data={data}
      icon={<FolderIcon style={{ height: ms(120), width: ms(120) }} />}
    />
  );
};

export default FolderItem;

const styles = StyleSheet.create({
  container: {
    padding: ms(5),
    alignItems: "center",
  },
  listStyle: {
    width: "100%",
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "red",
  },
  listContainer: {
    width: "100%",
  },
  gridStyle: {
    width: "45%",
  },
});

