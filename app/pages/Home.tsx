import { fetchMovies } from "@/app/api/main";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Swiper from "react-native-swiper";
import RenderMovieCard from "@/app/components/MovieCard";
import Trend from "@/app/components/treanding";

import Skeleton from "@/app/components/Skeleton";

type Movie = {
  id: number;
  title?: string;
  name?: string;
  backdrop_path?: string;
  poster_path?: string;
  vote_average?: number;
};

export default function Home() {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { height, width } = useWindowDimensions();
  useEffect(() => {
    async function loadData() {
      try {
        const [tr, trated, pop, upc, now] = await Promise.all([
          fetchMovies("/trending/movie/week"),
          fetchMovies("/movie/top_rated"),
          fetchMovies("/movie/popular"),
          fetchMovies("/movie/upcoming"),
          fetchMovies("/movie/now_playing"),
        ]);
        setTrending(tr);
        setTopRated(trated);
        setPopular(pop);
        setUpcoming(upc);
        setNowPlaying(now);
      } catch (err) {
        console.error("Error fetching movies:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const skeletonData = Array.from({ length: 5 }).map((_, index) => ({
    id: index,
  }));

  return (
    <ScrollView style={{ backgroundColor: "#000", flex: 1 }}>
      {/* 🎬 Hero Swiper */}
      {loading ? (
        <View style={{ height: height * 0.48, width: width }}>
          <Skeleton width="100%" height="100%" borderRadius={0} />
          <View style={{ position: "absolute", bottom: 40, left: 20 }}>
            <Skeleton width={200} height={40} borderRadius={4} />
            <Skeleton
              width={100}
              height={20}
              borderRadius={4}
              style={{ marginTop: 10 }}
            />
          </View>
        </View>
      ) : (
        <Swiper
          style={{ height: height * 0.48 }}
          showsPagination={true}
          dotColor="gray"
          activeDotColor="#E50914"
          loop
          autoplay
          autoplayTimeout={5}
        >
          {trending.map((item) => (
            <Trend
              key={item.id}
              cover={`https://image.tmdb.org/t/p/w780${item.backdrop_path}`}
              movieTitle={item.title || item.name || "Untitled"}
              id={item.id}
              rating={item.vote_average}
            />
          ))}
        </Swiper>
      )}

      {/* Sections */}
      <View style={styles.sectionHeader}>
        <View style={styles.beforeLine} />
        <Text style={styles.tags}>Top Rated Movies</Text>
      </View>
      <FlatList
        horizontal
        data={loading ? skeletonData : topRated}
        renderItem={({ item }) => (
          <RenderMovieCard item={item as any} Loading={loading} />
        )}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
      />

      <View style={styles.sectionHeader}>
        <View style={styles.beforeLine} />
        <Text style={styles.tags}>Popular Movies</Text>
      </View>
      <FlatList
        horizontal
        data={loading ? skeletonData : popular}
        renderItem={({ item }) => (
          <RenderMovieCard item={item as any} Loading={loading} />
        )}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
      />

      <View style={styles.sectionHeader}>
        <View style={styles.beforeLine} />
        <Text style={styles.tags}>Upcoming Movies</Text>
      </View>
      <FlatList
        horizontal
        data={loading ? skeletonData : upcoming}
        renderItem={({ item }) => (
          <RenderMovieCard item={item as any} Loading={loading} />
        )}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
      />

      <View style={styles.sectionHeader}>
        <View style={styles.beforeLine} />
        <Text style={styles.tags}>Now Playing</Text>
      </View>
      <FlatList
        horizontal
        data={loading ? skeletonData : nowPlaying}
        renderItem={({ item }) => (
          <RenderMovieCard item={item as any} Loading={loading} />
        )}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: {
    marginTop: 12,
    color: "#fff",
    fontSize: 16,
    fontFamily: "RobotoSlab",
  },
  dot: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: "#E50914",
    width: 20,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  pagination: {
    bottom: 20,
    justifyContent: "flex-end",
    paddingRight: 20,
  },
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
