import { Tabs } from "expo-router";
import Navbar from "@/src/components/shared/Navbar";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <Navbar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="explore" />
      <Tabs.Screen name="bookmark" />
      <Tabs.Screen name="account" />
    </Tabs>
  );
}
