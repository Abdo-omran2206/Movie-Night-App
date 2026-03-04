import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StatusBar,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import RenderMovieCard from "@/app/components/Cards/MovieCard";

const { width } = Dimensions.get("window");
const api_key = process.env.EXPO_PUBLIC_API_KEY;
const base_url = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w200";

type Provider = {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
};

type Tab = "movie" | "tv";

// ── Fetch provider info by ID from the full list ──
async function fetchProviderInfo(providerId: string): Promise<Provider | null> {
  try {
    const res = await fetch(
      `${base_url}/watch/providers/movie?api_key=${api_key}`,
    );
    const data = await res.json();
    const found = (data.results as Provider[])?.find(
      (p) => String(p.provider_id) === providerId,
    );
    return found ?? null;
  } catch {
    return null;
  }
}

// ── Fetch titles available on a provider ──
async function fetchByProvider(
  providerId: string,
  type: Tab,
  page = 1,
): Promise<{ results: any[]; total_pages: number }> {
  try {
    const res = await fetch(
      `${base_url}/discover/${type}?api_key=${api_key}&with_watch_providers=${providerId}&watch_region=US&sort_by=popularity.desc&page=${page}`,
    );
    const data = await res.json();
    return { results: data.results ?? [], total_pages: data.total_pages ?? 1 };
  } catch {
    return { results: [], total_pages: 1 };
  }
}

export default function ProviderDetail() {
  const { ProviderId } = useLocalSearchParams<{ ProviderId: string }>();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("movie");
  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [imgError, setImgError] = useState(false);

  const [fontsLoaded] = useFonts({
    BebasNeue: require("@/assets/fonts/BebasNeue-Regular.ttf"),
    RobotoSlab: require("@/assets/fonts/RobotoSlab-VariableFont_wght.ttf"),
  });

  // Load provider info once
  useEffect(() => {
    if (ProviderId) {
      fetchProviderInfo(ProviderId).then(setProvider);
    }
  }, [ProviderId]);

  // Reload content whenever tab changes
  useEffect(() => {
    if (!ProviderId) return;
    setLoading(true);
    setItems([]);
    setPage(1);
    fetchByProvider(ProviderId, activeTab, 1).then(
      ({ results, total_pages }) => {
        setItems(results);
        setTotalPages(total_pages);
        setLoading(false);
      },
    );
  }, [ProviderId, activeTab]);

  const loadMore = async () => {
    if (loadingMore || page >= totalPages) return;
    const next = page + 1;
    setLoadingMore(true);
    const { results } = await fetchByProvider(ProviderId!, activeTab, next);
    setItems((prev) => [...prev, ...results]);
    setPage(next);
    setLoadingMore(false);
  };

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* ── Sticky Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>

        {/* Provider Logo + Name */}
        <View style={styles.providerBrand}>
          {provider?.logo_path && !imgError ? (
            <Image
              source={{ uri: `${IMAGE_BASE}${provider.logo_path}` }}
              style={styles.providerLogo}
              onError={() => setImgError(true)}
            />
          ) : (
            <View style={styles.logoFallback}>
              <Text style={styles.fallbackChar}>
                {provider?.provider_name?.charAt(0) ?? "?"}
              </Text>
            </View>
          )}
          <Text style={styles.providerName} numberOfLines={1}>
            {provider?.provider_name ?? "Provider"}
          </Text>
        </View>
      </View>

      {/* ── Tab Bar ── */}
      <View style={styles.tabBar}>
        {(["movie", "tv"] as Tab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Ionicons
              name={tab === "movie" ? "film-outline" : "tv-outline"}
              size={16}
              color={activeTab === tab ? "#fff" : "#666"}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab === "movie" ? "Movies" : "TV Shows"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Content ── */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#E50914" />
        </View>
      ) : items.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="film-outline" size={60} color="#333" />
          <Text style={styles.emptyText}>
            No {activeTab === "movie" ? "movies" : "shows"} found
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator
                size="small"
                color="#E50914"
                style={{ marginVertical: 20 }}
              />
            ) : null
          }
          renderItem={({ item }) => (
            <RenderMovieCard
              item={item}
              mediaType={activeTab}
              starColor="#E50914"
              width={(width - 60) / 2}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 48,
    paddingBottom: 14,
    paddingHorizontal: 16,
    backgroundColor: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.07)",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  providerBrand: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  providerLogo: {
    width: 44,
    height: 44,
    borderRadius: 10,
    marginRight: 12,
  },
  logoFallback: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#E50914",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  fallbackChar: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  providerName: {
    color: "#fff",
    fontSize: 28,
    fontFamily: "BebasNeue",
    letterSpacing: 1,
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 4,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: "#E50914",
  },
  tabText: {
    color: "#666",
    fontSize: 14,
    fontFamily: "RobotoSlab",
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#fff",
  },
  grid: {
    paddingHorizontal: 12,
    paddingBottom: 40,
    paddingTop: 8,
  },
  emptyText: {
    color: "#555",
    marginTop: 14,
    fontSize: 16,
    fontFamily: "RobotoSlab",
  },
});
