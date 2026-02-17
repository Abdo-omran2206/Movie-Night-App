import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type PageType = "Home" | "Explore" | "Search" | "Bookmark" | "Account";
type MoodType = "Guest" | "Account";

type StoreType = {
  page: PageType;
  setPage: (page: PageType) => void;
};


type UserMood = {
  mood: MoodType;
  setMood: (page: MoodType) => void;
};

type UserState = {
  user: any;
  setUser: (user: any) => void;
};


type AppConfig = {
  base_url: string;
  movie_slug: string;
  actor_slug: string;
  min_app_version: string;
  latest_app_version: string;
  force_stop: boolean;
  force_message: string;
  app_link_update: string;
  share_text_template_movie: string;
  share_text_template_actor: string;
};

type ConfigState = {
  config: AppConfig | null;
  webSiteUrl: string;
  setConfig: (config: AppConfig) => void;
};

type AppBlockState = {
  isAppBlocked: boolean;
  blockReason: string | null;
  blockMessage: string | null;
  setAppBlocked: (reason: string | null, message: string | null) => void;
};

// Zustand store with persistence
export const useStore = create<
  StoreType & UserMood & UserState & ConfigState & AppBlockState
>()(
  persist(
    (set) => ({
      page: "Home",
      setPage: (page: PageType) => set({ page }),

      // User Session
      user: null,
      setUser: (user: any) => set({ user }),

      mood: "Guest",
      setMood: (mood: MoodType) => set({ mood }),

      // App Config
      config: null,
      webSiteUrl: "https://abdo-omran2206.github.io/Movie-Night",
      setConfig: (config: AppConfig) =>
        set({
          config,
          webSiteUrl:
            config.base_url || "https://abdo-omran2206.github.io/Movie-Night",
        }),

      // App Blocking State
      isAppBlocked: false,
      blockReason: null,
      blockMessage: null,
      setAppBlocked: (reason: string | null, message: string | null) =>
        set({
          isAppBlocked: reason !== null,
          blockReason: reason,
          blockMessage: message,
        }),
    }),
    {
      name: "movie-night-user-data", // New more descriptive name
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Only persist these specific fields
        user: state.user,
        mood: state.mood,
      }),
    },
  ),
);
