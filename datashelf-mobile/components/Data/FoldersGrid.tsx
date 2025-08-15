import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ms } from "react-native-size-matters";
import FolderItem from "./FolderItem";

const foldersData = [
  { id: "f1", name: "Main Folder", type: "folder" },
  { id: "f2", name: "Projects", type: "folder" },
  { id: "f3", name: "Documents", type: "folder" },
  { id: "f4", name: "Images", type: "folder" },
  { id: "f5", name: "Videos", type: "folder" },
  { id: "f6", name: "Music", type: "folder" },
  { id: "f7", name: "Backups", type: "folder" },
  { id: "f8", name: "Work", type: "folder" },
  { id: "f9", name: "Personal", type: "folder" },

  { id: "file1", name: "Resume.pdf", type: "file", fileType: "pdf" },
  { id: "file2", name: "Invoice_July.xlsx", type: "file", fileType: "excel" },
  { id: "file3", name: "Profile_Pic.jpg", type: "file", fileType: "image" },
  { id: "file4", name: "Presentation.pptx", type: "file", fileType: "ppt" },
  { id: "file5", name: "Notes.txt", type: "file", fileType: "text" },
  {
    id: "file6",
    name: "Background_Music.mp3",
    type: "file",
    fileType: "audio",
  },
  { id: "file7", name: "Demo_Video.mp4", type: "file", fileType: "video" },
];
const FoldersGrid = () => {
  return (
    <ScrollView>
      <View style={styles.folderWrapper}>
        {foldersData.map((folderData) => {
          return (
            <FolderItem view={"list"} key={folderData.id} data={folderData} />
          );
        })}
      </View>
    </ScrollView>
  );
};

export default FoldersGrid;

const styles = StyleSheet.create({
  folderWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    gap: ms(8),
    padding: ms(10),
  },
});
