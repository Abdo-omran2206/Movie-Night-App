import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { fetchMovies } from "@/app/api/main";
import Skeleton from "@/app/components/Skeleton";

const { width } = Dimensions.get("window");
const NUM_COLUMNS = 3;
const CARD_SIZE = (width - 48) / NUM_COLUMNS; // 48 = padding 16*2 + gaps 8*2

type Provider = {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
  display_priority?: number;
};

export default function Providers() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [fontsLoaded] = useFonts({
    BebasNeue: require("@/assets/fonts/BebasNeue-Regular.ttf"),
    RobotoSlab: require("@/assets/fonts/RobotoSlab-VariableFont_wght.ttf"),
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchMovies("/watch/providers/movie");
        setProviders(data ?? []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return providers;
    return providers.filter((p) =>
      p.provider_name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, providers]);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Streaming Services</Text>
      </View>

      {/* ── Search ── */}
      <View style={styles.searchWrapper}>
        <Ionicons
          name="search"
          size={18}
          color="#aaa"
          style={{ marginRight: 8 }}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search providers..."
          placeholderTextColor="#666"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={18} color="#aaa" />
          </TouchableOpacity>
        )}
      </View>

      {/* ── Count label ── */}
      {!loading && (
        <Text style={styles.countLabel}>
          {filtered.length} {filtered.length === 1 ? "provider" : "providers"}{" "}
          found
        </Text>
      )}

      {/* ── Grid ── */}
      {loading ? (
        <View style={styles.skeletonGrid}>
          {[...Array(12)].map((_, i) => (
            <View key={i} style={styles.skeletonCard}>
              <Skeleton
                width={CARD_SIZE - 16}
                height={CARD_SIZE - 16}
                borderRadius={14}
              />
              <Skeleton
                width={(CARD_SIZE - 16) * 0.8}
                height={14}
                borderRadius={4}
                style={{ marginTop: 8 }}
              />
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.provider_id.toString()}
          numColumns={NUM_COLUMNS}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="tv-outline" size={54} color="#333" />
              <Text style={styles.emptyText}>No providers found</Text>
            </View>
          }
          renderItem={({ item }) => (
            <ProviderGridCard item={item} cardSize={CARD_SIZE} />
          )}
        />
      )}
    </View>
  );
}

// ── Individual card ──
function ProviderGridCard({
  item,
  cardSize,
}: {
  item: Provider;
  cardSize: number;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={[styles.card, { width: cardSize }]}
      onPress={() => router.push(`/pages/Provider/${item.provider_id}` as any)}
    >
      {!imgError && item.logo_path ? (
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w200${item.logo_path}` }}
          style={[styles.logo, { width: cardSize - 24, height: cardSize - 24 }]}
          onError={() => setImgError(true)}
        />
      ) : (
        <View
          style={[
            styles.logoFallback,
            { width: cardSize - 24, height: cardSize - 24 },
          ]}
        >
          <Text style={styles.fallbackChar}>
            {item.provider_name.charAt(0)}
          </Text>
        </View>
      )}
      <Text style={styles.providerName} numberOfLines={2}>
        {item.provider_name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 48,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: "#000",
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
  headerTitle: {
    color: "#fff",
    fontSize: 34,
    fontFamily: "BebasNeue",
    letterSpacing: 1.5,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
    fontFamily: "RobotoSlab",
  },
  countLabel: {
    color: "#666",
    fontSize: 13,
    fontFamily: "RobotoSlab",
    marginHorizontal: 16,
    marginBottom: 6,
  },
  grid: {
    paddingHorizontal: 10,
    paddingBottom: 40,
  },
  card: {
    alignItems: "center",
    margin: 6,
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.09)",
  },
  logo: {
    borderRadius: 14,
  },
  logoFallback: {
    borderRadius: 14,
    backgroundColor: "#E50914",
    alignItems: "center",
    justifyContent: "center",
  },
  fallbackChar: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "700",
  },
  providerName: {
    marginTop: 8,
    fontSize: 11,
    color: "#ccc",
    textAlign: "center",
    fontFamily: "RobotoSlab",
    lineHeight: 16,
  },
  skeletonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  skeletonCard: {
    width: (width - 48) / NUM_COLUMNS,
    alignItems: "center",
    margin: 6,
    padding: 12,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },
  emptyText: {
    color: "#555",
    marginTop: 12,
    fontSize: 16,
    fontFamily: "RobotoSlab",
  },
});
