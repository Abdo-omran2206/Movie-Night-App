import { supabase } from "./supabase";
import { useStore } from "../store/store";
import Constants from "expo-constants";

export async function fetchAppConfig() {
  try {
    const { data, error } = await supabase
      .from("app_config")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;

    if (data) {
      useStore.getState().setConfig(data);
      const blockStatus = checkVersionAndStatus(data);
      
      // Store the blocking status in the store
      if (blockStatus.isBlocked) {
        useStore.getState().setAppBlocked(blockStatus.reason, blockStatus.message);
      } else {
        useStore.getState().setAppBlocked(null, null);
      }
    }
    return data;
  } catch (error) {
    console.error("❌ Fetch app config error:", error);
    return null;
  }
}

function checkVersionAndStatus(config: any): { isBlocked: boolean; reason: string | null; message: string | null } {
  const currentVersion = Constants.expoConfig?.version || "1.0.0";

  // 1️⃣ Check Force Stop
  if (config.force_stop) {
    return {
      isBlocked: true,
      reason: "maintenance",
      message: config.force_message || "App is under maintenance."
    };
  }

  // 2️⃣ Check Min Version (Force Update)
  if (config.min_app_version && isVersionLower(currentVersion, config.min_app_version)) {
    return {
      isBlocked: true,
      reason: "update_required",
      message: "This version of the app is no longer supported. Please update to continue."
    };
  }

  // 3️⃣ Check Latest Version (Optional Update)
  if (config.latest_app_version && isVersionLower(currentVersion, config.latest_app_version)) {
    return { 
      isBlocked: false, 
      reason: "update_available", 
      message: config.latest_app_version 
    };
  }

  return { isBlocked: false, reason: null, message: null };
}

function isVersionLower(current: string, required: string) {
  const currParts = current.split(".").map(Number);
  const reqParts = required.split(".").map(Number);

  for (let i = 0; i < Math.max(currParts.length, reqParts.length); i++) {
    const curr = currParts[i] || 0;
    const req = reqParts[i] || 0;
    if (curr < req) return true;
    if (curr > req) return false;
  }
  return false;
}
