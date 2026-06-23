import { Movie } from "@/src/types/interfaces";
import React from "react";
import { View, Image, StyleSheet, Text, Pressable } from "react-native";
import { useStore } from "@/src/store/store";
import { getImageUrl } from "@/src/lib/getImageUrl";
import { Link } from "expo-router";
import generateMovieAvatar from "@/src/lib/generateMovieAvatar";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function NightguideMovieCard({ item }: { item: Movie }) {
  const { dataSavermood } = useStore();
  const { posterImage } = getImageUrl(dataSavermood, "card");

  const imageUrl = item.poster_path
    ? posterImage + item.poster_path
    : generateMovieAvatar(item.name || item.title || "movie");

  const year =
    item.media_type === "movie"
      ? item.release_date
        ? new Date(item.release_date).getFullYear()
        : "N/A"
      : item.media_type === "tv"
        ? item.first_air_date
          ? new Date(item.first_air_date).getFullYear()
          : "N/A"
        : "N/A";

  return (
    <Link
      href={{
        pathname:
          item.media_type === "movie" ? "/movie/[movieID]" : "/tv/[tvID]",
        params:
          item.media_type === "movie"
            ? { movieID: item.id.toString() }
            : { tvID: item.id.toString() },
      }}
      asChild
    >
      <Pressable style={styles.card}>
        {/* BACKGROUND IMAGE */}
        <Image source={{ uri: imageUrl }} style={styles.image} />

        {/* GRADIENT OVERLAY */}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.6)", "rgba(0,0,0,0.95)"]}
          locations={[0, 0.7, 1]}
          style={styles.overlay}
        />

        {/* RATING BADGE */}
        <View style={styles.rating}>
          <Text style={styles.ratingText}>
            <Ionicons name="star" color="#E50914" size={10} />{" "}
            {item.vote_average?.toFixed(1) ?? "N/A"}
          </Text>
        </View>

        {/* TEXT CONTENT */}
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {item.media_type === "movie" ? item.title : item.name}
          </Text>

          <Text style={styles.sub}>
            {year} • {item.media_type?.toUpperCase()}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}
const styles = StyleSheet.create({
  card: {
    width: 140,
    height: 230,
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 6,
  },

  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  content: {
    position: "absolute",
    bottom: 0,
    padding: 8,
    width: "100%",
  },

  title: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },

  sub: {
    color: "#ccc",
    fontSize: 10,
    marginTop: 2,
  },

  rating: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },

  ratingText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
});
