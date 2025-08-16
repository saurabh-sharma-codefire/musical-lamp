import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import Headerbar from "@/components/Headerbar";
import ThemedButton from "@/components/ThemedButton";
import ThemedSearchBar from "@/components/ThemedSearchBar";
import ThemedStack from "@/components/ThemedStack";
import { ThemedText } from "@/components/ThemedText";
import { ThemeColors } from "@/constants/Colors";
import { ThemeConstants } from "@/constants/ThemeConstans";
import useScreenHeight from "@/hooks/useScreenHeight";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { ms } from "react-native-size-matters";

const MenuOptions = [
  {
    label: "Personal information",
    description: "Manage your profile",
    icon: "user",
  },
  {
    label: "Account Setting",
    description: "Manage your account",
    icon: "settings",
  },
  {
    label: "Help & Support",
    description: "Get solutions for your problems",
    icon: "headphones",
  },
];

export default function ProfileScreen() {
  const ScreenHeight = useScreenHeight();
  const handleLogout = () => {};
  return (
    <View style={{ backgroundColor: ThemeColors.white }}>
      <SafeAreaView>
        {/* Header Components */}
        <Headerbar title="Profile Screen" />
        {/* Component */}
        <View style={[{ minHeight: ScreenHeight }, styles.container]}>
          <ScrollView contentContainerStyle={styles.containerScroll}>
            <ThemedSearchBar />
            {MenuOptions.map((menu, menuIndex) => (
              <MenuListItem key={menuIndex} data={menu} />
            ))}
            <ThemedButton
              buttonStyles={styles.logout}
              textStyles={styles.logoutText}
              iconStyles={styles.logoutIcon}
              onPress={handleLogout}
              leftIcon="log-out"
              title="Log Out"
              variant="text"
            />
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

const MenuListItem = ({ data }) => {
  return (
    <TouchableOpacity>
      <ThemedStack
        p={10}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <ThemedStack direction="row" gap={10}>
          <View style={styles.menuIconWrapper}>
            <Feather name={data.icon} size={ms(25)} color={ThemeColors.white} />
          </View>
          <View>
            <ThemedText type="subtitle">{data.label}</ThemedText>
            <ThemedText style={styles.menuListSubtitle}>
              {data.description}
            </ThemedText>
          </View>
        </ThemedStack>
        <Feather size={30} color={ThemeColors.bodyText2} name="chevron-right" />
      </ThemedStack>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {},
  containerScroll: { padding: ms(20), gap: ms(10) },
  menuItem: { borderBottomWidth: 1, borderBottomColor: ThemeColors.border },
  menuIconWrapper: {
    backgroundColor: ThemeColors.primary,
    padding: ms(14),
    borderRadius: ThemeConstants.borderRadius.xl,
  },
  menuListSubtitle: {
    color: ThemeColors.bodyText2,
  },
  logout: {
    backgroundColor: ThemeColors.tintRed,
    marginHorizontal: ms(10),
    marginTop: ms(10),
  },
  logoutText: {
    color: ThemeColors.red,
  },
  logoutIcon: {
    color: ThemeColors.red,
  },
});
