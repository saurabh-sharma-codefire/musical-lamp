import { ThemeConstants } from "@/constants/ThemeConstans";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import Constants from "expo-constants";
import { useMemo } from "react";

const useScreenHeight = () => {
  const BottomTabHeight = useBottomTabBarHeight();
  const height = useMemo(
    () =>
      ThemeConstants.windowHeight -
      (ThemeConstants.headerHeight +
        Constants.statusBarHeight +
        BottomTabHeight),
    [BottomTabHeight]
  );
  return height;
};

export default useScreenHeight;
