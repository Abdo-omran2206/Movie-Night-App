import { Ionicons } from "@expo/vector-icons";
import React, { ComponentProps } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
} from "react-native";
import { useStore } from "../store/store";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
type PageType = "Home" | "Explore" | "Bookmark" | "Account";
type IconName = ComponentProps<typeof Ionicons>["name"];

export default function Navbar({ navigation }: any) {
  const { page } = useStore();
  const insets = useSafeAreaInsets();

  const navpages: { icon: IconName; activeIcon: IconName; name: PageType }[] = [
    {
      icon: "home-outline",
      activeIcon: "home",
      name: "Home",
    },
    {
      icon: "compass-outline",
      activeIcon: "compass",
      name: "Explore",
    },
    {
      icon: "bookmark-outline",
      activeIcon: "bookmark",
      name: "Bookmark",
    },
    {
      icon: "person-outline",
      activeIcon: "person",
      name: "Account",
    },
  ];

  const handlePress = (targetPage: PageType) => {
    if (page !== targetPage) {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      (navigation as any).navigate(targetPage);
    }
  };

  return (
    <View style={[styles.container, { bottom: Math.max(insets.bottom, 15) }]}>
      <View style={styles.navigator}>
        {navpages.map((item, index) => {
          const isActive = page === item.name;

          return (
            <Pressable
              key={index}
              style={styles.navItem}
              onPress={() => handlePress(item.name)}
            >
              <View
                style={[
                  styles.iconContainer,
                  isActive && styles.activeIconContainer,
                ]}
              >
                <Ionicons
                  name={isActive ? item.activeIcon : item.icon}
                  size={24}
                  color={isActive ? "#E50914" : "#ffffff"}
                />
              </View>

              <Text
                style={[
                  styles.text,
                  isActive ? styles.activeText : styles.inactiveText,
                ]}
              >
                {item.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  navigator: {
    flexDirection: "row",
    backgroundColor: "rgba(10, 10, 10, 0.95)", // Darker glass effect
    width: "92%",
    height: 60,
    borderRadius: 30,
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical:0,
    paddingTop: 5,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 15,
  },
  navItem: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  activeIconContainer: {},
  text: {
    fontSize: 10,
    fontFamily: "RobotoSlab",
    letterSpacing: 0.3,
    marginTop: 2,
  },
  activeText: {
    color: "#E50914",
    fontWeight: "bold",
  },
  inactiveText: {
    color: "#888",
  },
});
