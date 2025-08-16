import { IconConstants } from "@/constants/IconConstants";
import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ms } from "react-native-size-matters";
import ThemedIconButton from "../ThemedIconButton";
import ThemedStack from "../ThemedStack";
import { ThemedText } from "../ThemedText";

const GridFolderItem = ({ icon, data, handleMenu, onResourceClick }) => {
  return (
    <TouchableOpacity
      onPress={onResourceClick}
      onLongPress={handleMenu}
      style={[styles.container, styles.gridStyle]}
    >
      {icon}
      <Text numberOfLines={1}>{data.name}</Text>
    </TouchableOpacity>
  );
};
const ListFolderItem = ({ icon, data, handleMenu, onResourceClick }) => {
  return (
    <ThemedStack
      direction="row"
      alignItems="center"
      style={styles.listContainer}
    >
      <TouchableOpacity
        onPress={onResourceClick}
        style={[styles.container, styles.listStyle]}
      >
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
        <ThemedIconButton onPress={handleMenu} icon="more-vertical" />
      </ThemedStack>
    </ThemedStack>
  );
};

const FolderItem = ({
  data,
  view = "grid",
  handleMenu = () => {},
  onResourceClick = () => {},
}) => {
  const FolderIcon =
    data.type === "folder" ? IconConstants.folder : IconConstants.file;
  const isListView = useMemo(() => view === "list", [view]);
  return isListView ? (
    <ListFolderItem
      data={data}
      handleMenu={() => handleMenu(data)}
      onResourceClick={() => onResourceClick(data)}
      icon={<FolderIcon style={{ height: ms(45), width: ms(45) }} />}
    />
  ) : (
    <GridFolderItem
      data={data}
      handleMenu={() => handleMenu(data)}
      onResourceClick={() => onResourceClick(data)}
      icon={<FolderIcon style={{ height: ms(80), width: ms(80) }} />}
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
  },
  listContainer: {
    width: "100%",
  },
  gridStyle: {
    width: "32%",
  },
});

