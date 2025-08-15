import { StyleSheet, View } from "react-native";

import Headerbar from "@/components/Headerbar";
import { ThemeColors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  return (
    <View style={{ backgroundColor: ThemeColors.white }}>
      <SafeAreaView>
        {/* Header Components */}
        <Headerbar title="Profile Screen" />
        {/* Component */}
        <View></View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({

});
