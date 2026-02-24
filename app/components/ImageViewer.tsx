import { Ionicons } from "@expo/vector-icons";
import {
  Modal,
  Pressable,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import React from "react";

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
  if (!imageUrl) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalBackground} onPress={onClose}>
        <View style={styles.modalContainer}>
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
    top: 50,
    right: 30,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 25,
    padding: 8,
  },
});
