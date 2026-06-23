import { Ionicons, FontAwesome6 } from "@expo/vector-icons";
import React, { ComponentProps } from "react";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type IconName =
  | ComponentProps<typeof Ionicons>["name"]
  | ComponentProps<typeof FontAwesome6>["name"];

export default function Navbar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const navpages: {
    icon: IconName;
    activeIcon: IconName;
    name: string;
    routeName: string | null;
    type: string;
  }[] = [
    {
      icon: "home-outline",
      activeIcon: "home",
      name: "Home",
      routeName: "index",
      type: "ion",
    },
    {
      icon: "compass-outline",
      activeIcon: "compass",
      name: "Explore",
      routeName: "explore",
      type: "ion",
    },
    {
      icon: "robot",
      activeIcon: "robot",
      name: "NightGuide",
      routeName: null,
      type: "fa",
    },
    {
      icon: "bookmark-outline",
      activeIcon: "bookmark",
      name: "Bookmark",
      routeName: "bookmark",
      type: "ion",
    },
    {
      icon: "person-outline",
      activeIcon: "person",
      name: "Account",
      routeName: "account",
      type: "ion",
    },
  ];

  const activeRouteName = state ? state.routes[state.index].name : "index";

  const handlePress = (item: typeof navpages[0]) => {
    if (item.name === "NightGuide") {
      router.push("/nightguide");
      return;
    }

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (item.routeName && activeRouteName !== item.routeName) {
      if (navigation) {
        navigation.navigate(item.routeName);
      } else {
        // router.push(item.routeName === "index" ? "/(tabs)" : `/(tabs)/${item.routeName}`);
      }
    }
  };

  return (
    <View style={[styles.container, { bottom: Math.max(insets.bottom, 15) }]}>
      <View style={styles.navigator}>
        {navpages.map((item, index) => {
          const isActive = activeRouteName === item.routeName;

          return (
            <Pressable
              key={index}
              style={styles.navItem}
              onPress={() => handlePress(item)}
            >
              <View
                style={[
                  styles.iconContainer,
                  isActive && styles.activeIconContainer,
                ]}
              >
                {item.type === "ion" ? (
                  <Ionicons
                    name={isActive ? item.activeIcon : item.icon}
                    size={23}
                    color={isActive ? "#E50914" : "#ffffff"}
                  />
                ) : (
                  <FontAwesome6
                    name={isActive ? item.activeIcon : item.icon}
                    size={23}
                    color={isActive ? "#E50914" : "#ffffff"}
                  />
                )}
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
    paddingVertical: 0,
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
    fontSize: 9,
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
