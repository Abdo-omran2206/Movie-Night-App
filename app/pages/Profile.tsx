import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  Alert,
  Platform,
  ToastAndroid,
  Linking,
  ImageBackground,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BookmarkManager } from "../api/BookmarkManager";
import { useFocusEffect } from "@react-navigation/native";
import { useStore } from "../store/store";
import { generateUserAvatar } from "../lib/generateMovieAvatar";
import { SvgXml, Svg, Circle } from "react-native-svg";
import { useRouter } from "expo-router";
import { supabase } from "../api/supabase";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import { getImageUrl } from "../lib/getImageUrl";
import { regions } from "../constant/main";

const { width, height } = Dimensions.get("window");

export default function Account() {
  const {
    mood,
    setMood,
    user,
    setUser,
    setPage,
    config,
    region,
    dataSavermood,
    setDataSavermood,
  } = useStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isQualityModalVisible, setQualityModalVisible] = useState(false);
  const currentVersion = Constants.expoConfig?.version || "1.0.0";
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [stats, setStats] = useState({
    watching: 0,
    watchLater: 0,
    completed: 0,
    dropped: 0,
    total: 0,
  });
  const ifLatestVersion = config?.latest_app_version === currentVersion;

  const updateApp = () => {
    if (!ifLatestVersion && config?.latest_app_version) {
      Alert.alert(
        "Update Available",
        `A new version (${config?.latest_app_version}) is available. Please update to the latest version for the best experience.`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Update",
            onPress: async () => {
              const url = config?.app_link_update;
              Linking.openURL(url);
            },
          },
        ],
        { cancelable: true },
      );
    }
  };

  const fetchStatsAndBookmarks = useCallback(async () => {
    try {
      const allBookmarks: any = await BookmarkManager.getBookmarks();
      if (allBookmarks) {
        setBookmarks(allBookmarks);
        const counts = allBookmarks.reduce(
          (acc: any, curr: any) => {
            if (curr.status === "Watching") acc.watching++;
            else if (curr.status === "Watch Later") acc.watchLater++;
            else if (curr.status === "Completed") acc.completed++;
            else if (curr.status === "Dropped") acc.dropped++;
            return acc;
          },
          { watching: 0, watchLater: 0, completed: 0, dropped: 0 },
        );
        setStats({ ...counts, total: allBookmarks.length });
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  }, []);

  useEffect(() => {
    if (user) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleLogout = async () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            await supabase.auth.signOut();
            setMood("Guest");
            setUser(null);
            if (Platform.OS === "android") {
              ToastAndroid.show("Logged out successfully", ToastAndroid.SHORT);
            }
            setPage("Home");
            router.replace("/");
          },
          style: "destructive",
        },
      ],
      { cancelable: true },
    );
  };

  useFocusEffect(
    useCallback(() => {
      fetchStatsAndBookmarks();
    }, [fetchStatsAndBookmarks]),
  );

  const watchingMovies = React.useMemo(() => 
    bookmarks.filter((b) => b.status === "Watching"),
    [bookmarks]
  );
  const lastWatched = React.useMemo(() => watchingMovies[0], [watchingMovies]);

  const { posterImage, backdropImage } = getImageUrl(dataSavermood, "detail");

  // 🕐 Recently Added – last 5 items across all statuses
  const recentlyAdded = React.useMemo(() => 
    [...bookmarks]
      .sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0))
      .slice(0, 5),
    [bookmarks]
  );

  if (mood === "Guest") {
    return <AccountRequired router={router} />;
  }

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 150 }}
    >
      {/* 👤 Modern Header with Backdrop */}
      <View style={styles.headerWrapper}>
        <ImageBackground
          source={{
            uri: lastWatched?.backdrop_path
              ? `${backdropImage}${lastWatched.backdrop_path}`
              : "https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&q=80&w=1000",
          }}
          style={styles.headerBackdrop}
          blurRadius={40}
        >
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)", "#000"]}
            style={styles.headerGradient}
          >
            <View style={styles.profileInfo}>
              <View style={styles.avatarWrapper}>
                <View style={styles.avatar}>
                  <SvgXml
                    xml={generateUserAvatar(
                      user?.user_metadata?.username || user?.email || "Guest",
                      110,
                    )}
                    width="100%"
                    height="100%"
                  />
                </View>
                <TouchableOpacity style={styles.editAvatarBadge}>
                  <Ionicons name="camera" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
              <Text style={styles.userName}>
                {user?.user_metadata?.username || user?.email?.split("@")[0]}
              </Text>
              <Text style={styles.userHandle}>
                @{user?.user_metadata?.username || "user"}
              </Text>
            </View>

            {/* 📊 High-Level Stats Activity */}
            <View style={styles.statActivityRow}>
              <View style={styles.activityItem}>
                <Text style={styles.activityValue}>{stats.total}</Text>
                <Text style={styles.activityLabel}>Collection</Text>
              </View>
              <View style={styles.activityDivider} />
              <View style={styles.activityItem}>
                <Text style={styles.activityValue}>
                  {Math.round(stats.completed * 1.8)}
                </Text>
                <Text style={styles.activityLabel}>Hours</Text>
              </View>
              <View style={styles.activityDivider} />
              <View style={styles.activityItem}>
                <Text style={styles.activityValue}>{stats.completed}</Text>
                <Text style={styles.activityLabel}>Finished</Text>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>

      {/* 🎬 Continue Watching Shortcut */}
      {watchingMovies.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Continue Watching</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            {watchingMovies.map((item) => (
              <TouchableOpacity
                key={`watching-${item.movieID || item.id}`}
                onPress={() =>
                  router.push(
                    item.type === "tv"
                      ? `/pages/tvdetails/${item.movieID || item.id}`
                      : `/pages/moviedetails/${item.movieID || item.id}`,
                  )
                }
                style={styles.continueCard}
              >
                <Image
                  source={{
                    uri: `${backdropImage}${item.backdrop_path}`,
                  }}
                  style={styles.continueBackdrop}
                />
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.9)"]}
                  style={styles.continueGradient}
                >
                  <Ionicons name="play-circle" size={30} color="#E50914" />
                  <Text style={styles.continueTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* 🍩 Watchlist Progress Ring */}
      {stats.total > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Watchlist Breakdown</Text>
          <View style={styles.ringContainer}>
            <WatchlistRing stats={stats} />
            <View style={styles.ringLegend}>
              <LegendItem
                color="#4CAF50"
                label="Watching"
                count={stats.watching}
              />
              <LegendItem
                color="#9C27B0"
                label="Completed"
                count={stats.completed}
              />
              <LegendItem
                color="#2196F3"
                label="Watch Later"
                count={stats.watchLater}
              />
              <LegendItem
                color="#F44336"
                label="Dropped"
                count={stats.dropped}
              />
            </View>
          </View>
        </View>
      )}
      {/* 🕐 Recently Added */}
      {recentlyAdded.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recently Added</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            {recentlyAdded.map((item) => (
              <TouchableOpacity
                style={styles.recentCard}
                key={`recent-${item.movieID || item.id}`}
                onPress={() =>
                  router.push(
                    item.type === "tv"
                      ? `/pages/tvdetails/${item.movieID || item.id}`
                      : `/pages/moviedetails/${item.movieID || item.id}`,
                  )
                }
              >
                <Image
                  source={{
                    uri: `${posterImage}${item.poster_path}`,
                  }}
                  style={styles.recentPoster}
                />
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.9)"]}
                  style={styles.recentGradient}
                >
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          item.status === "Watching"
                            ? "#4CAF5030"
                            : item.status === "Completed"
                              ? "#9C27B030"
                              : item.status === "Dropped"
                                ? "#F4433630"
                                : "#2196F330",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        {
                          color:
                            item.status === "Watching"
                              ? "#4CAF50"
                              : item.status === "Completed"
                                ? "#CE93D8"
                                : item.status === "Dropped"
                                  ? "#F44336"
                                  : "#2196F3",
                        },
                      ]}
                    >
                      {item.status}
                    </Text>
                  </View>
                  <Text style={styles.recentTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* 📁 Library Overview */}
      <Text style={styles.sectionTitle}>Library</Text>
      <View style={styles.libraryGrid}>
        <LibraryItem
          label="Watching"
          count={stats.watching}
          icon="play"
          color="#4CAF50"
          onPress={() => {}}
        />
        <LibraryItem
          label="Watch Later"
          count={stats.watchLater}
          icon="time"
          color="#2196F3"
          onPress={() => {}}
        />
        <LibraryItem
          label="Completed"
          count={stats.completed}
          icon="checkmark-done"
          color="#9C27B0"
          onPress={() => {}}
        />
        <LibraryItem
          label="Dropped"
          count={stats.dropped}
          icon="close"
          color="#F44336"
          onPress={() => {}}
        />
      </View>

      {/* 🛠️ Support & App Info */}
      <View style={styles.footerSection}>
        <TouchableOpacity
          style={styles.versionRow}
          onPress={() => setQualityModalVisible(true)}
        >
          <View style={styles.versionInfo}>
            <Text style={styles.vLabel}>IMAGE QUALITY</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 5,
              }}
            >
              <Text style={styles.vValue}>
                {dataSavermood === "High"
                  ? "High Quality"
                  : dataSavermood === "Medium"
                    ? "Balanced"
                    : "Data Saver"}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: 5,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons
              name={
                dataSavermood === "High"
                  ? "wifi"
                  : dataSavermood === "Medium"
                    ? "speedometer-outline"
                    : "cellular-outline"
              }
              size={15}
              color="#E50914"
            />

            <Ionicons name="chevron-forward" size={20} color="#888" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.versionRow}>
          <View style={styles.versionInfo}>
            <Text style={styles.vLabel}>CONTENT REGION</Text>
            <Text style={styles.vValue}>{regions[region] || region}</Text>
          </View>
          <Ionicons name="location-outline" size={20} color="#E50914" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.versionRow} onPress={() => updateApp()}>
          <View style={styles.versionInfo}>
            <Text style={styles.vLabel}>APP VERSION</Text>
            <Text style={styles.vValue}>{currentVersion}</Text>
          </View>
          <View
            style={[
              styles.vBadge,
              { backgroundColor: ifLatestVersion ? "#34C75920" : "#FF3B3020" },
            ]}
          >
            <Text
              style={[
                styles.vBadgeText,
                { color: ifLatestVersion ? "#34C759" : "#FF3B30" },
              ]}
            >
              {ifLatestVersion ? "LATEST" : "UPDATE AVAILABLE"}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
          <Ionicons name="log-out-outline" size={20} color="#E50914" />
        </TouchableOpacity>
      </View>

      <View style={{ height: 100 }} />

      {/* 📡 Image Quality Selection Modal */}
      <Modal
        visible={isQualityModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setQualityModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setQualityModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Image Quality</Text>

            <TouchableOpacity
              style={[
                styles.qualityOption,
                dataSavermood === "High" && styles.qualityOptionSelected,
              ]}
              onPress={() => {
                setDataSavermood("High");
                setQualityModalVisible(false);
              }}
            >
              <Ionicons
                name="wifi"
                size={24}
                color={dataSavermood === "High" ? "#E50914" : "#fff"}
              />
              <View style={styles.qualityTextContainer}>
                <Text
                  style={[
                    styles.qualityLabel,
                    dataSavermood === "High" && styles.qualityLabelSelected,
                  ]}
                >
                  High Quality
                </Text>
                <Text style={styles.qualityDesc}>
                  Best visual experience. Uses original quality for details and
                  balanced for cards.
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.qualityOption,
                dataSavermood === "Medium" && styles.qualityOptionSelected,
              ]}
              onPress={() => {
                setDataSavermood("Medium");
                setQualityModalVisible(false);
              }}
            >
              <Ionicons
                name="speedometer-outline"
                size={24}
                color={dataSavermood === "Medium" ? "#E50914" : "#fff"}
              />
              <View style={styles.qualityTextContainer}>
                <Text
                  style={[
                    styles.qualityLabel,
                    dataSavermood === "Medium" && styles.qualityLabelSelected,
                  ]}
                >
                  Balanced
                </Text>
                <Text style={styles.qualityDesc}>
                  Good quality with lower data usage for cards and balanced
                  details.
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.qualityOption,
                (dataSavermood === "Low" || dataSavermood === true) &&
                  styles.qualityOptionSelected,
              ]}
              onPress={() => {
                setDataSavermood("Low");
                setQualityModalVisible(false);
              }}
            >
              <Ionicons
                name="cellular-outline"
                size={24}
                color={
                  dataSavermood === "Low" || dataSavermood === true
                    ? "#E50914"
                    : "#fff"
                }
              />
              <View style={styles.qualityTextContainer}>
                <Text
                  style={[
                    styles.qualityLabel,
                    (dataSavermood === "Low" || dataSavermood === true) &&
                      styles.qualityLabelSelected,
                  ]}
                >
                  Data Saver
                </Text>
                <Text style={styles.qualityDesc}>
                  Maximum data saving. Lowest resolution across all screens.
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}

function LibraryItem({ label, count, icon, color, onPress }: any) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={styles.libraryCard}
    >
      <View style={[styles.libIconBox, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <View>
        <Text style={styles.libLabel}>{label}</Text>
        <Text style={styles.libCount}>{count} items</Text>
      </View>
    </TouchableOpacity>
  );
}

// 🍩 Circular Progress Ring
function WatchlistRing({ stats }: { stats: any }) {
  const size = 140;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = stats.total || 1;

  const segments = [
    { value: stats.watching, color: "#4CAF50" },
    { value: stats.completed, color: "#9C27B0" },
    { value: stats.watchLater, color: "#2196F3" },
    { value: stats.dropped, color: "#F44336" },
  ];

  let offset = 0;
  const arcs = segments.map((seg) => {
    const ratio = seg.value / total;
    const dash = ratio * circumference;
    const gap = circumference - dash;
    const arc = { dash, gap, offset, color: seg.color };
    offset += dash;
    return arc;
  });

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Svg width={size} height={size}>
        {/* Background track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1a1a1a"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Colored arcs */}
        {arcs.map((arc, i) =>
          arc.dash > 0 ? (
            <Circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={arc.color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${arc.dash} ${arc.gap}`}
              strokeDashoffset={-arc.offset}
              strokeLinecap="round"
              rotation="-90"
              origin={`${size / 2}, ${size / 2}`}
            />
          ) : null,
        )}
      </Svg>
      {/* Center label */}
      <View style={{ position: "absolute", alignItems: "center" }}>
        <Text style={{ color: "#fff", fontSize: 26, fontFamily: "BebasNeue" }}>
          {stats.total}
        </Text>
        <Text style={{ color: "#888", fontSize: 10 }}>TITLES</Text>
      </View>
    </View>
  );
}

function LegendItem({
  color,
  label,
  count,
}: {
  color: string;
  label: string;
  count: number;
}) {
  return (
    <View style={styles.legendRow}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
      <Text style={styles.legendCount}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  loaderContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  headerWrapper: { height: height * 0.45, width: "100%" },
  headerBackdrop: { flex: 1, justifyContent: "flex-end" },
  headerGradient: {
    flex: 1,
    paddingTop: height * 0.1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 30,
  },
  profileInfo: { alignItems: "center", marginBottom: 30 },
  avatarWrapper: { position: "relative", marginBottom: 15 },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    backgroundColor: "#E50914",
    borderColor: "rgba(255,255,255,0.2)",
  },
  editAvatarBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    backgroundColor: "#E50914",
    padding: 6,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#000",
  },
  userName: {
    fontFamily: "BebasNeue",
    fontSize: 28,
    color: "#fff",
    letterSpacing: 1,
  },
  userHandle: { color: "#888", fontSize: 13, marginTop: -2 },
  statActivityRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 10,
    width: width * 0.85,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  activityItem: { flex: 1, alignItems: "center" },
  activityValue: { color: "#fff", fontSize: 20, fontFamily: "BebasNeue" },
  activityLabel: { color: "#888", fontSize: 10, textTransform: "uppercase" },
  activityDivider: {
    width: 1,
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  section: { marginVertical: 20 },
  sectionTitle: {
    fontFamily: "BebasNeue",
    fontSize: 22,
    color: "#fff",
    marginLeft: 20,
    marginBottom: 15,
    letterSpacing: 0.8,
  },
  continueCard: {
    width: width * 0.6,
    height: 120,
    borderRadius: 15,
    overflow: "hidden",
    marginRight: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  continueBackdrop: { ...StyleSheet.absoluteFillObject },
  continueGradient: {
    ...StyleSheet.absoluteFillObject,
    padding: 12,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  continueTitle: { color: "#fff", fontSize: 14, fontWeight: "bold", flex: 1 },
  // Progress Ring
  ringContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 20,
  },
  ringLegend: { flex: 1, gap: 10 },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendLabel: { color: "#ccc", fontSize: 12, flex: 1 },
  legendCount: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  // Genre DNA
  genreDnaCard: {
    marginHorizontal: 15,
    marginBottom: 20,
    backgroundColor: "#161618",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2a1010",
    flexDirection: "column",
    gap: 10,
  },
  genreDnaTitle: {
    color: "#fff",
    fontFamily: "BebasNeue",
    fontSize: 18,
    letterSpacing: 0.5,
  },
  genreDnaText: { color: "#aaa", fontSize: 13, lineHeight: 18 },
  genreTagsRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    marginTop: 4,
  },
  genreTag: {
    backgroundColor: "#E5091420",
    borderWidth: 1,
    borderColor: "#E5091460",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  genreTagText: { color: "#E50914", fontSize: 11, fontWeight: "bold" },
  // Recently Added
  recentCard: {
    width: 110,
    height: 165,
    borderRadius: 14,
    overflow: "hidden",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  recentPoster: { ...StyleSheet.absoluteFillObject },
  recentGradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    padding: 8,
  },
  recentTitle: { color: "#fff", fontSize: 11, fontWeight: "bold" },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  statusBadgeText: { fontSize: 9, fontWeight: "bold" },
  quickActionContainer: {
    flexDirection: "row",
    paddingHorizontal: 15,
    gap: 12,
    marginBottom: 25,
  },
  actionBtn: { flex: 1 },
  actionInner: {
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  actionText: { color: "#888", fontSize: 11, fontWeight: "600" },
  libraryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 15,
    justifyContent: "space-between",
  },
  libraryCard: {
    width: (width - 45) / 2,
    backgroundColor: "#161618",
    padding: 15,
    borderRadius: 18,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#222",
  },
  libIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  libLabel: { color: "#fff", fontSize: 13, fontWeight: "bold" },
  libCount: { color: "#777", fontSize: 10 },
  footerSection: {
    marginHorizontal: 15,
    backgroundColor: "#161618",
    borderRadius: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: "#222",
  },
  versionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  versionInfo: {},
  vLabel: { color: "#555", fontSize: 10, fontWeight: "bold" },
  vValue: { color: "#fff", fontSize: 14, fontWeight: "600" },
  vBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  vBadgeText: { fontSize: 10, fontWeight: "bold" },
  logoutBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 15,
    gap: 8,
  },
  logoutText: {
    color: "#E50914",
    fontFamily: "BebasNeue",
    fontSize: 18,
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "#161618",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#222",
  },
  modalTitle: {
    color: "#fff",
    fontFamily: "BebasNeue",
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    letterSpacing: 1,
  },
  qualityOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "transparent",
  },
  qualityOptionSelected: {
    borderColor: "#E50914",
    backgroundColor: "rgba(229, 9, 20, 0.1)",
  },
  qualityTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  qualityLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  qualityLabelSelected: {
    color: "#E50914",
  },
  qualityDesc: {
    color: "#888",
    fontSize: 12,
  },
});

function AccountRequired({ router }: { router: any }) {
  return (
    <View style={style.container}>
      <Ionicons
        name="person-circle-outline"
        size={80}
        color="#E50914"
        style={{ marginBottom: 20 }}
      />
      <Text style={style.title}>Cinema Center</Text>
      <Text style={style.subtitle}>
        Sign in to track your library, unlock rewards, and personalize your
        experience.
      </Text>
      <TouchableOpacity
        style={style.primaryBtn}
        onPress={() => router.push("/pages/account/register")}
      >
        <Text style={style.primaryText}>Create Account</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={style.secondaryBtn}
        onPress={() => router.push("/pages/account/login")}
      >
        <Text style={style.secondaryText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontFamily: "BebasNeue",
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    color: "#aaa",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 40,
    fontFamily: "RobotoSlab",
    lineHeight: 22,
  },
  primaryBtn: {
    backgroundColor: "#E50914",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 15,
    width: "100%",
    shadowColor: "#E50914",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  primaryText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  secondaryBtn: { padding: 10 },
  secondaryText: { color: "#E50914", fontSize: 15, fontWeight: "600" },
});
