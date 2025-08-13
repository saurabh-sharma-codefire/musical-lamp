import fileIcon from "@/assets/icon/dataicons/document.png";
import folderIcon from "@/assets/icon/dataicons/folder.png";
import { Image } from "expo-image";
import { ms } from "react-native-size-matters";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const defaultProps = {
  height: ms(20),
  width: ms(20),
  contentFit: "cover",
};
export const IconConstants = {
  folder: ({ style = {}, ...props }: any) => (
    <Image
      style={{
        height: defaultProps.height,
        width: defaultProps.width,
        ...style,
      }}
      source={folderIcon}
      placeholder={{ blurhash }}
      contentFit={defaultProps.contentFit}
    />
  ),
  file: ({ style = {}, ...props }: any) => (
    <Image
      style={{
        height: defaultProps.height,
        width: defaultProps.width,
        ...style,
      }}
      source={fileIcon}
      placeholder={{ blurhash }}
      contentFit={defaultProps.contentFit}
    />
  ),
};
