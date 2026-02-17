import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { supabase } from "./api/supabase";
import { useStore } from "./store/store";
import { BookmarkManager } from "./api/BookmarkManager";
import { fetchAppConfig } from "./api/ConfigManager";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
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
    // 🛡️ Global Auth Listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
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

    // 🚀 Global Init
    (async () => {
      await fetchAppConfig();
      await BookmarkManager.init();
      // Initial check
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        useStore.getState().setUser(user);
        useStore.getState().setMood("Account");
      }
    })();

    // 🕒 Periodic Config Refresh (Every 30 Minutes)
    const configInterval = setInterval(
      async () => {
        await fetchAppConfig();
      },
      1000 * 60 * 30,
    );

    return () => {
      subscription.unsubscribe();
      clearInterval(configInterval);
    };
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
