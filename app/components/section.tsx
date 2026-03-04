import { fetchMovies } from "@/app/api/main";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import RenderMovieCard from "@/app/components/Cards/MovieCard";
import Skeleton from "./Skeleton";

interface SectionProps {
  endpoint: string;
  title: string;
  mediaType?: "movie" | "tv" | "person";
  isPlaceholder?: boolean;
}

interface Movie {
  id: number;
  [key: string]: any;
}

export default function Section({
  endpoint,
  title,
  mediaType,
  isPlaceholder = false,
}: SectionProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Movie[]>([]);

  useEffect(() => {
    if (isPlaceholder) {
      setLoading(true);
      return;
    }

    let isMounted = true;
    const loadData = async () => {
      try {
        setLoading(true);
        const results = await fetchMovies(endpoint);
        if (isMounted) {
          setData(results);
        }
      } catch (error) {
        console.error("Error loading section data:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, [endpoint, isPlaceholder]);

  const skeletonData = Array.from({ length: 5 }).map((_, index) => ({
    id: -(index + 1), // Using negative IDs to avoid collision with real movie IDs
  }));

  if (data.length === 0 && !loading) {
    return null; // ما نعرض القسم إذا ما في بيانات بعد ما انتهى التحميل
  }
  return (
    <View key={endpoint}>
      <View style={styles.sectionHeader}>
        <View style={styles.beforeLine} />
        {loading ? (
          <Skeleton
            width={120}
            height={30}
            borderRadius={8}
            style={{ marginHorizontal: 10 }}
          />
        ) : (
          title && <Text style={styles.tags}>{title}</Text>
        )}
      </View>
      <FlatList
        horizontal
        data={loading ? skeletonData : data}
        renderItem={({ item }) => (
          <RenderMovieCard
            item={item as any}
            Loading={loading}
            mediaType={mediaType}
          />
        )}
        keyExtractor={(item) =>
          item.id ? item.id.toString() : Math.random().toString()
        }
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 5 }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
    marginTop: 20,
  },
  beforeLine: {
    width: 5,
    height: 30,
    backgroundColor: "#E50914",
    marginRight: 8,
    borderRadius: 2,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 4,
  },
  tags: {
    color: "#fff",
    fontFamily: "BebasNeue",
    fontSize: 28,
    letterSpacing: 1,
  },
});
