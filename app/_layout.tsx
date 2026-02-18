import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { supabase } from "./api/supabase";
import { useStore } from "./store/store";
import { BookmarkManager } from "./api/BookmarkManager";
import { fetchAppConfig } from "./api/ConfigManager";
import * as NavigationBar from "expo-navigation-bar";

export { ErrorBoundary } from "expo-router";

// prevent splash auto hide
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    BebasNeue: require("../assets/fonts/BebasNeue-Regular.ttf"),
    RobotoSlab: require("../assets/fonts/RobotoSlab-VariableFont_wght.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    // Auth listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_, session) => {
      const { setUser, setMood } = useStore.getState();

      if (session?.user) {
        setUser(session.user);
        setMood("Account");
        await BookmarkManager.syncGuestToOnline();
      } else {
        setUser(null);
        setMood("Guest");
      }
    });

    // App init
    (async () => {
      await fetchAppConfig();
      await BookmarkManager.init();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        useStore.getState().setUser(user);
        useStore.getState().setMood("Account");
      }
    })();

    // refresh config every 30 min
    const configInterval = setInterval(
      async () => {
        await fetchAppConfig();
      },
      1000 * 60 * 30
    );

    return () => {
      subscription.unsubscribe();
      clearInterval(configInterval);
    };
  }, []);

  // hide splash + navigation bar AFTER fonts load
  useEffect(() => {
    if (!loaded) return;

    (async () => {
      await SplashScreen.hideAsync();

      // FULL immersive navigation bar hide
      await NavigationBar.setPositionAsync("absolute");
      await NavigationBar.setBackgroundColorAsync("transparent");
      await NavigationBar.setBehaviorAsync("overlay-swipe");
      await NavigationBar.setVisibilityAsync("hidden");
    })();
  }, [loaded]);

  if (!loaded) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}
