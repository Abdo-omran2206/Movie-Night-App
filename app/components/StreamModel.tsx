import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import { supabase } from "../api/supabase";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { createAvatar, StyleOptions } from "@dicebear/core";
import { bottts } from "@dicebear/collection";
import { SvgXml } from "react-native-svg";

const { height } = Dimensions.get("window");

// Generate a deterministic avatar SVG string for a given seed
function makeAvatar(
  seed: string,
  size: number = 100,
  options?: Partial<StyleOptions<typeof bottts>>
): string {
  return createAvatar(bottts, { seed, size, ...options }).toString();
}

export default function StreamModal({
  contentId,
  visible,
  onClose,
}: {
  contentId: number;
  visible: boolean;
  onClose: () => void;
}) {
  const [streams, setStreams] = useState<
    { name: string; full_url: string; stream_domain?: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (visible && contentId) fetchStreams();
    if (!visible) setSelectedIndex(null);
  }, [visible, contentId]);

  const fetchStreams = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("stream_urls")
      .select("full_url,name")
      .eq("is_active", true);

    if (error) {
      console.error("Error fetching streams:", error);
      setStreams([]);
    } else {
      setStreams(data ?? []);
    }
    setLoading(false);
  };

  const openStream = (url: string, index: number) => {
    setSelectedIndex(index);
    router.push({
      pathname: "/pages/player/[player]",
      params: { player: encodeURIComponent(url + contentId) },
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Backdrop */}
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

      {/* Sheet */}
      <View style={styles.sheet}>
        {/* Handle */}
        <View style={styles.handle} />

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerEyebrow}>SELECT SOURCE</Text>
            <Text style={styles.headerTitle}>Available Streams</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Content */}
        {loading ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color="#FF2D55" />
            <Text style={styles.stateText}>Finding streams...</Text>
          </View>
        ) : streams.length === 0 ? (
          <View style={styles.centerState}>
            <Text style={styles.emptyIcon}>⚠</Text>
            <Text style={styles.stateTitle}>No Streams Found</Text>
            <Text style={styles.stateText}>Check back soon or try refreshing.</Text>
          </View>
        ) : (
          <FlatList
            data={streams}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => {
              const isSelected = selectedIndex === index;
              const label = item.name ?? `Server Stream ${index + 1}`;
              // ✅ Unique seed per item so each card gets a different avatar
              const avatarSvg = makeAvatar(item.name ?? `stream-${index}`, 100, { backgroundColor: ["222"] });

              return (
                <TouchableOpacity
                  onPress={() => openStream(item.full_url, index)}
                  style={[styles.streamCard, isSelected && styles.streamCardSelected]}
                  activeOpacity={0.75}
                >
                  {/* Left accent bar */}
                  <View style={[styles.cardAccent, isSelected && styles.cardAccentActive]} />

                  {/* Unique avatar per stream */}
                  <View style={[styles.streamIconWrap, isSelected && styles.streamIconWrapActive]}>
                    <SvgXml xml={avatarSvg} width="90%" height="90%" />
                  </View>

                  {/* Info */}
                  <View style={styles.streamInfo}>
                    <Text style={[styles.streamName, isSelected && styles.streamNameActive]}>
                      {label}
                    </Text>
                    <Text style={styles.streamSub}>Stream Server {index + 1}</Text>
                  </View>

                  {/* Play icon — color reacts to selected state */}
                  <Ionicons
                    name="play-circle"
                    size={32}
                    color={isSelected ? "#FF2D55" : "#3A3A3C"}
                  />
                </TouchableOpacity>
              );
            }}
          />
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {streams.length > 0
              ? `${streams.length} source${streams.length !== 1 ? "s" : ""} available`
              : ""}
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#111114",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: height * 0.45,
    maxHeight: height * 0.75,
    paddingBottom: 34,
    shadowColor: "#FF2D55",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 24,
  },
  handle: {
    alignSelf: "center",
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#3A3A3C",
    marginTop: 12,
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerEyebrow: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 3,
    color: "#FF2D55",
    marginBottom: 4,
    fontFamily: "Courier New",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#F5F5F7",
    letterSpacing: -0.5,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2C2C2E",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  closeBtnText: {
    color: "#8E8E93",
    fontSize: 13,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#2C2C2E",
    marginHorizontal: 24,
    marginBottom: 8,
  },
  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    gap: 10,
  },
  emptyIcon: {
    fontSize: 32,
    color: "#636366",
    marginBottom: 4,
  },
  stateTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#EBEBF5",
    letterSpacing: -0.3,
  },
  stateText: {
    fontSize: 13,
    color: "#636366",
    marginTop: 4,
    letterSpacing: 0.2,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  streamCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
    borderRadius: 14,
    paddingVertical: 14,
    paddingRight: 16,
    paddingLeft: 0,
    borderWidth: 1,
    borderColor: "#2C2C2E",
    overflow: "hidden",
    gap: 12,
  },
  streamCardSelected: {
    backgroundColor: "#1E0A12",
    borderColor: "#FF2D55",
  },
  cardAccent: {
    width: 3,
    alignSelf: "stretch",
    backgroundColor: "transparent",
    borderRadius: 2,
    marginLeft: 5,
  },
  cardAccentActive: {
    backgroundColor: "#FF2D55",
  },
  streamIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#2C2C2E",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  streamIconWrapActive: {
    backgroundColor: "#3D0A1B",
  },
  streamInfo: {
    flex: 1,
    gap: 2,
  },
  streamName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#EBEBF5",
    letterSpacing: -0.2,

  },
  streamNameActive: {
    color: "#FF6B81",
  },
  streamSub: {
    fontSize: 12,
    color: "#636366",
    letterSpacing: 0.2,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#48484A",
    letterSpacing: 0.5,
  },
});