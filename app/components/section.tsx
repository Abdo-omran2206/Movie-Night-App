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

const Section = React.memo(({
  endpoint,
  title,
  mediaType,
  isPlaceholder = false,
}: SectionProps) => {
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

  const skeletonData = React.useMemo(() => 
    Array.from({ length: 5 }).map((_, index) => ({
      id: -(index + 1),
    })), []);

  const keyExtractor = React.useCallback((item: any) => 
    item.id ? item.id.toString() : Math.random().toString(), []);

  if (data.length === 0 && !loading) {
    return null;
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
        keyExtractor={keyExtractor}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 5 }}
        maxToRenderPerBatch={5}
        windowSize={5}
        removeClippedSubviews={true}
      />
    </View>
  );
});

Section.displayName = "Section";

export default Section;
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
