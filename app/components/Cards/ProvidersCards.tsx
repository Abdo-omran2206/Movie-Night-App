import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import Skeleton from "../Skeleton";
import React, { useEffect, useState } from "react";
import { fetchMovies } from "@/app/api/main";
import { Ionicons } from "@expo/vector-icons";
import { Provider } from "../../constant/interfaces";

export default function ProvidersCards() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProviders() {
      try {
        const data = await fetchMovies("/watch/providers/movie");
        setProviders(data.slice(0, 20) ?? []);
      } catch {
        setError("Failed to load providers");
      } finally {
        setLoading(false);
      }
    }

    loadProviders(); // ✅ كانت ناقصة
  }, []);

  if (loading) {
    return (
      <View style={styles.row}>
        {[...Array(3)].map((_, i) => (
          <View key={i} style={styles.card}>
            <Skeleton width={100} height={100} borderRadius={8} />
            <Skeleton
              width={80}
              height={20}
              borderRadius={4}
              style={{ marginTop: 10 }}
            />
          </View>
        ))}
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={providers}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.provider_id.toString()}
      renderItem={({ item }) => <ProviderCard item={item} />}
      contentContainerStyle={{ paddingHorizontal: 10 }}
      ListFooterComponent={
        <TouchableOpacity
          onPress={() => router.push(`/pages/Provider/Providers` as any)}
        >
          <View style={styles.seeAllCard}>
            <Ionicons name="add" size={35} color="#E50914" />
            <Text style={styles.seeAllText}>See All</Text>
          </View>
        </TouchableOpacity>
      }
    />
  );
}

// ── Card مستقل ──
function ProviderCard({ item }: { item: Provider }) {
  const [imgError, setImgError] = useState(false);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => router.push(`/pages/Provider/${item.provider_id}` as any)}
    >
      <View style={styles.card}>
        {!imgError && item.logo_path ? (
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w500${item.logo_path}` }}
            style={styles.logo}
            onError={() => setImgError(true)}
          />
        ) : (
          <View style={styles.logoFallback}>
            <Text style={styles.fallbackText}>
              {item.provider_name.charAt(0)}
            </Text>
          </View>
        )}
        <Text style={styles.providerName} numberOfLines={1}>
          {item.provider_name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    alignItems: "center",
    margin: 8,
    marginVertical: 20,
    borderRadius: 12,
    padding: 10,
    width: 100,
    borderWidth: 1,
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 15,
  },
  logoFallback: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: "#E50914",
    alignItems: "center",
    justifyContent: "center",
  },
  fallbackText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },
  providerName: {
    marginTop: 8,
    fontSize: 12,
    color: "#fff",
    textAlign: "center",
    width: "100%",
  },
  errorText: {
    color: "#E50914",
    fontSize: 14,
  },
  seeAllCard: {
    width: 100,
    height: 105, // نفس حجم باقي الكروت
    margin: 8,
    marginVertical: 20,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: "rgba(255,255,255,0.07)",
    alignItems: "center",
    justifyContent: "center",
  },
  seeAllText: {
    color: "#E50914",
    fontSize: 13,
    fontWeight: "600",
  },
});
