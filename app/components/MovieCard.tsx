// components/moviecard.tsx
import { useFonts } from "expo-font";
import { router } from "expo-router";
import React, { useState } from "react";
import { View, Image, StyleSheet, Text, Pressable } from "react-native";

import Skeleton from "./Skeleton";
import generateMovieAvatar from "../lib/generateMovieAvatar";
import { SvgXml } from "react-native-svg";

type Movie = {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  release_date?: string;
  vote_average?: number;
};

export default function RenderMovieCard({
  item,
  Loading,
}: {
  item: Movie;
  Loading?: boolean;
}) {
  const [imgError, setImgError] = useState(false);
  const posterUrl = `https://image.tmdb.org/t/p/w500`;

  const fallbackAvatarSvg = generateMovieAvatar(
    item.title || item.name || "Untitled Movie",
  );

  const [fontsLoaded] = useFonts({
    BebasNeue: require("@/assets/fonts/BebasNeue-Regular.ttf"),
    RobotoSlab: require("@/assets/fonts/RobotoSlab-VariableFont_wght.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  if (Loading) {
    return (
      <View style={styles.movieCard}>
        <Skeleton width={200} height={300} borderRadius={10} />
        <Skeleton width={180} height={20} style={{ marginTop: 10 }} />
        <Skeleton width={150} height={15} style={{ marginTop: 8 }} />
        <Skeleton width={100} height={15} style={{ marginTop: 5 }} />
      </View>
    );
  }

  const handlePress = () => {
    router.push(`/pages/moviedetails/${item.id}`);
  };

  return (
    <Pressable onPress={handlePress}>
      <View style={styles.movieCard}>
        {/* 🎬 Poster */}
        {!imgError && item.poster_path ? (
          <Image
            source={{ uri: posterUrl + item.poster_path }}
            style={styles.movieImage}
            onError={() => setImgError(true)}
          />
        ) : (
          <View style={{ width: 200, height: 300, overflow: "hidden" }}>
            <SvgXml xml={fallbackAvatarSvg} width="100%" height="100%" />
          </View>
        )}

        {/* 🎥 Title */}
        <Text style={styles.movieTitle}>
          {item.title || item.name || "Untitled"}
        </Text>

        {/* 📅 Release Date */}
        {item.release_date && (
          <Text style={styles.movieMeta}>Release: {item.release_date}</Text>
        )}

        {/* ⭐ Rating */}
        {item.vote_average !== undefined && (
          <Text style={styles.movieMeta}>
            ⭐ {item.vote_average.toFixed(1)}/10
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  movieCard: {
    marginHorizontal: 10,
    marginVertical: 15,
    alignItems: "flex-start",
    width: 200,
  },
  movieImage: {
    width: 200,
    height: 300,
    borderRadius: 10,
  },
  movieTitle: {
    marginTop: 6,
    color: "#fff",
    fontFamily: "BebasNeue",
    fontSize: 20,
    textAlign: "left",
    width: "100%",
  },
  movieMeta: {
    marginTop: 2,
    color: "#aaa",
    fontSize: 13,
    fontFamily: "RobotoSlab",
  },
});
