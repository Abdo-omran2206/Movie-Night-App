import { Ionicons } from "@expo/vector-icons";
import {
  Modal,
  Pressable,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
  Text,
} from "react-native";
import React, { useState } from "react";
import { File, Paths } from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

const { width, height } = Dimensions.get("window");

interface ImageViewerProps {
  visible: boolean;
  imageUrl: string | null;
  onClose: () => void;
}

export default function ImageViewer({
  visible,
  imageUrl,
  onClose,
}: ImageViewerProps) {
  const [downloadStatus, setDownloadStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  if (!imageUrl) return null;

  const handleDownload = async () => {
    if (downloadStatus !== "idle") return;

    try {
      setDownloadStatus("loading");
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status !== "granted") {
        setDownloadStatus("idle");
        Alert.alert(
          "Permission required",
          "Gallery access is required to save images.",
        );
        return;
      }

      const filename = imageUrl.split("/").pop() || "download.jpg";

      const file = new File(Paths.cache, filename);

      await File.downloadFileAsync(imageUrl, file);

      const asset = await MediaLibrary.createAssetAsync(file.uri);

      await MediaLibrary.createAlbumAsync("Movie Night", asset, false);

      setDownloadStatus("success");
      setTimeout(() => setDownloadStatus("idle"), 3000);
    } catch (e) {
      console.log("Download error:", e);
      setDownloadStatus("error");
      setTimeout(() => setDownloadStatus("idle"), 3000);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalBackground} onPress={onClose}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={[
              styles.downloadButton,
              downloadStatus === "success" && styles.downloadButtonSuccess,
              downloadStatus === "error" && styles.downloadButtonError,
            ]}
            onPress={handleDownload}
            disabled={downloadStatus !== "idle"}
          >
            {downloadStatus === "loading" ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : downloadStatus === "success" ? (
              <Ionicons name="checkmark" size={24} color="#fff" />
            ) : downloadStatus === "error" ? (
              <Ionicons name="alert-circle" size={24} color="#fff" />
            ) : (
              <Ionicons name="download" size={24} color="#fff" />
            )}
          </TouchableOpacity>
          {downloadStatus === "success" && (
            <View style={styles.toast}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.toastText}>Saved to gallery</Text>
            </View>
          )}
          <Image
            source={{ uri: imageUrl }}
            style={styles.fullScreenImage}
            resizeMode="contain"
          />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    width: "100%",
    height: "80%",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 25,
    padding: 8,
  },
  downloadButton: {
    position: "absolute",
    top: 20,
    left: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 25,
    padding: 10,
    width: 46,
    height: 46,
    justifyContent: "center",
    alignItems: "center",
  },
  downloadButtonSuccess: {
    backgroundColor: "#4CAF50",
  },
  downloadButtonError: {
    backgroundColor: "#F44336",
  },
  toast: {
    position: "absolute",
    top: 60,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toastText: {
    marginLeft: 8,
    color: "#333",
    fontWeight: "600",
    fontSize: 14,
  },
});
