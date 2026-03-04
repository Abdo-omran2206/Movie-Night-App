import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  useWindowDimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getActorById } from "../../api/main";
import RenderMovieCard from "../../components/Cards/MovieCard";
import { useFonts } from "expo-font";

export default function Filmography() {
  const { actorID, actorName } = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const numColumns = width > 1024 ? 4 : width > 768 ? 3 : 2;
  const padding = width > 768 ? 20 : 18;
  const gap = 8;
  const cardWidth =
    (width - padding * (numColumns + 1) - gap * (numColumns - 1)) / numColumns;

  const [fontsLoaded] = useFonts({
    BebasNeue: require("@/assets/fonts/BebasNeue-Regular.ttf"),
    RobotoSlab: require("@/assets/fonts/RobotoSlab-VariableFont_wght.ttf"),
  });

  useEffect(() => {
    async function fetchFilmography() {
      try {
        if (typeof actorID === "string") {
          const data = await getActorById(actorID);
          if (data && data.movie_credits && data.movie_credits.cast && data.tv_credits && data.tv_credits.cast) {
            const sortedMovies = [...data.movie_credits.cast, ...data.tv_credits.cast].sort(
              (a: any, b: any) =>
                (b.release_date || b.first_air_date || "").localeCompare(
                  a.release_date || a.first_air_date || "",
                ),
            );
            setMovies(sortedMovies);
          }
        }
      } catch (error) {
        console.error("Error fetching filmography:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchFilmography();
  }, [actorID]);

  if (!fontsLoaded) return null;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>{actorName}&apos;s Filmography</Text>
          <Text style={styles.headerSubtitle}>{movies.length} Movies</Text>
        </View>
      </View>

      <FlatList
        data={movies}
        numColumns={numColumns}
        key={numColumns} // Force re-render when column count changes
        horizontal={false}
        renderItem={({ item }) => (
          <RenderMovieCard item={item} starColor="#E50914" width={cardWidth} />
        )}
        keyExtractor={(item, index) => item.id.toString() + index}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={[styles.columnWrapper, { gap: gap }]}
        showsVerticalScrollIndicator={false}
      />
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
  },
  backButton: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontFamily: "BebasNeue",
    letterSpacing: 1,
  },
  headerSubtitle: {
    color: "#E50914",
    fontSize: 14,
    fontFamily: "RobotoSlab",
    fontWeight: "bold",
  },
  listContainer: {
    backgroundColor: "#000",
    paddingHorizontal: 10,
    paddingBottom: 100,
    paddingTop: 10,
  },
  columnWrapper: {
    marginBottom: 0,
  },
  cardContainer: {
    flex: 1,
    padding: 5,
    alignItems: "center",
  },
});
