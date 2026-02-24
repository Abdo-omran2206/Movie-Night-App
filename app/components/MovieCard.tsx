// components/moviecard.tsx
import { useFonts } from "expo-font";
import { router } from "expo-router";
import React, { useState } from "react";
import { View, Image, StyleSheet, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
  mediaType,
  starColor = "#FFD700",
  width: cardWidth = 200,
}: {
  item: Movie;
  Loading?: boolean;
  mediaType?: "movie" | "tv" | "person";
  starColor?: string;
  width?: number;
}) {
  const [imgError, setImgError] = useState(false);
  const cardHeight = (cardWidth * 3) / 2; // 2:3 aspect ratio
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
      <View style={[styles.movieCard, { width: cardWidth }]}>
        <Skeleton width={cardWidth} height={cardHeight} borderRadius={10} />
        <Skeleton
          width={cardWidth * 0.9}
          height={20}
          style={{ marginTop: 10 }}
        />
        <Skeleton
          width={cardWidth * 0.75}
          height={15}
          style={{ marginTop: 8 }}
        />
        <Skeleton
          width={cardWidth * 0.5}
          height={15}
          style={{ marginTop: 5 }}
        />
      </View>
    );
  }

  const handlePress = () => {
    // Determine the type to route properly
    const type =
      mediaType ||
      (item as any).media_type ||
      (item.name && !item.title ? "tv" : "movie");

    if (type === "tv") {
      router.push(`/pages/tvdetails/${item.id}`);
    } else {
      router.push(`/pages/moviedetails/${item.id}`);
    }
  };

  return (
    <Pressable onPress={handlePress}>
      <View style={[styles.movieCard, { width: cardWidth }]}>
        {/* 🎬 Poster */}
        {!imgError && item.poster_path ? (
          <Image
            source={{ uri: posterUrl + item.poster_path }}
            style={[
              styles.movieImage,
              { width: cardWidth, height: cardHeight },
            ]}
            onError={() => setImgError(true)}
          />
        ) : (
          <View
            style={{ width: cardWidth, height: cardHeight, overflow: "hidden" }}
          >
            <SvgXml xml={fallbackAvatarSvg} width="100%" height="100%" />
          </View>
        )}

        {/* 🎥 Title */}
        <Text style={styles.movieTitle}>
          {item.title || item.name || "Untitled"}
        </Text>

        {/* 📅 Release Date */}
        {(item.release_date || (item as any).first_air_date) && (
          <Text style={styles.movieMeta}>
            Release: {item.release_date || (item as any).first_air_date}
          </Text>
        )}

        {/* ⭐ Rating */}
        {item.vote_average !== undefined && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 4,
            }}
          >
            <Ionicons
              name="star"
              size={15}
              color={starColor}
              style={{ marginRight: 5 }}
            />
            <Text style={styles.movieMeta}>
              {item.vote_average.toFixed(1)}/10
            </Text>
          </View>
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
  },
  movieImage: {
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
