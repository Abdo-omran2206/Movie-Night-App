import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type PageType = "Home" | "Explore" | "Bookmark" | "Account";
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


export type AppConfig = {
  base_url: string;
  movie_slug: string;
  tv_slug: string;
  actor_slug: string;
  min_app_version: string;
  latest_app_version: string;
  force_stop: boolean;
  platform:string;
  force_message: string;
  app_link_update: string;
  share_text_template_movie: string;
  share_text_template_tv: string;
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

type RegionState = {
  region: string;
  setRegion: (region: string) => void;
};

export type ImageQuality = "High" | "Medium" | "Low";

type DataSaver = {
  dataSavermood : ImageQuality | boolean;
  setDataSavermood: (dataSavermood: ImageQuality | boolean) => void;
};

// Zustand store with persistence
export const useStore = create<
  StoreType & UserMood & UserState & ConfigState & AppBlockState & RegionState & DataSaver
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

      // Region
      region: "US", // Default to US
      setRegion: (region: string) => set({ region }),

      //DataSaver
      dataSavermood: "High",
      setDataSavermood:(dataSavermood: ImageQuality | boolean) => set({ dataSavermood }),

      // App Config
      config: null,
      webSiteUrl: "https://movie-night-self.vercel.app",
      setConfig: (config: AppConfig) =>
        set({
          config,
          webSiteUrl:
            config.base_url || "https://movie-night-self.vercel.app",
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
        region: state.region,
        dataSavermood: state.dataSavermood,
      }),
    },
  ),
);
