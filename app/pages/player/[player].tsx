import React, { useEffect } from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { WebView } from "react-native-webview";

import * as ScreenOrientation from "expo-screen-orientation";

export default function Player() {
  const { player: StreamUrl } = useLocalSearchParams();

  useEffect(() => {
    async function changeScreenOrientation() {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE,
      );
    }
    changeScreenOrientation();

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  if (!StreamUrl) return null;

  const embedUrl = StreamUrl;

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      {/* 🎬 Video Player - Using Absolute Fill to ensure it takes all screen */}
      <WebView
        source={{ uri: embedUrl } as any}
        style={styles.webview}
        allowsFullscreenVideo
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        scalesPageToFit
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  webview: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
  },
  backButton: {
    position: "absolute",
    top: 30, // Optimized for landscape
    left: 20,
    zIndex: 100,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 8,
    borderRadius: 25,
  },
});
