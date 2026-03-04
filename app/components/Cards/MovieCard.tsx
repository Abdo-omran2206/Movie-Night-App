// components/moviecard.tsx
import { useFonts } from "expo-font";
import { router } from "expo-router";
import React, { useState } from "react";
import { View, Image, StyleSheet, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Skeleton from "../Skeleton";
import generateMovieAvatar from "../../lib/generateMovieAvatar";
import { SvgXml } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";

type Movie = {
  known_for_department?: string;
  popularity?: number;
  profile_path?: string;
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
    } else if (type === "person") {
      router.push(`/pages/actordata/${item.id}`);
    } else {
      router.push(`/pages/moviedetails/${item.id}`);
    }
  };

  if (mediaType === "person") {
    return (
      <PersonCard
        item={item}
        cardWidth={cardWidth}
        cardHeight={cardHeight}
        posterUrl={posterUrl}
        fallbackAvatarSvg={fallbackAvatarSvg}
        onPress={handlePress}
      />
    );
  }

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

interface PersonCardProps {
  item: Movie;
  cardWidth: number;
  cardHeight: number;
  posterUrl: string;
  fallbackAvatarSvg: string;
  onPress: () => void;
}

const PersonCard = ({
  item,
  cardWidth,
  cardHeight,
  posterUrl,
  fallbackAvatarSvg,
  onPress,
}: PersonCardProps) => {
  const [imgError, setImgError] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.personCard,
        { width: cardWidth, height: cardHeight },
        pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] },
      ]}
    >
      {/* ── Background Image ── */}
      <View style={StyleSheet.absoluteFill}>
        {!imgError && item.profile_path ? (
          <Image
            source={{ uri: posterUrl + item.profile_path }}
            style={{ width: "100%", height: "100%" }}
            onError={() => setImgError(true)}
          />
        ) : (
          <SvgXml xml={fallbackAvatarSvg} width="100%" height="100%" />
        )}
      </View>

      {/* ── Gradient Overlay ── */}
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.1)", "rgba(0,0,0,0.9)"]}
        style={styles.personGradient}
      >
        <View style={styles.personBottomInfo}>
          {/* ── Name ── */}
          <Text style={styles.personName} numberOfLines={2}>
            {item.name ?? "Unknown"}
          </Text>

          {/* ── Meta Info ── */}
          <View style={styles.personMetadataRow}>
            <Text style={styles.personDeptText} numberOfLines={1}>
              {item.known_for_department ?? "Talent"}
            </Text>
            <View style={styles.personPopContainer}>
              <Ionicons name="flame" size={12} color="#E50914" />
              <Text style={styles.personPopText}>
                {item.popularity?.toFixed(0) ?? "0"}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  // ── Person Card ──────────────────────────────────
  personCard: {
    marginHorizontal: 10,
    marginVertical: 14,
    backgroundColor: "#121212",
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  personGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  personBottomInfo: {
    padding: 12,
  },
  personName: {
    color: "#fff",
    fontFamily: "BebasNeue",
    fontSize: 20,
    letterSpacing: 0.6,
    lineHeight: 22,
    marginBottom: 4,
  },
  personMetadataRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 2,
  },
  personDeptText: {
    color: "#ccc", // Increased visibility on dark gradient
    fontSize: 10,
    fontFamily: "RobotoSlab",
    fontWeight: "600",
    maxWidth: "65%",
    textTransform: "uppercase",
  },
  personPopContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  personPopText: {
    color: "#fff",
    fontSize: 11,
    fontFamily: "RobotoSlab",
    fontWeight: "bold",
  },

  // ── Legacy (kept for safety, no longer used by PersonCard) ──
  gradient: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "60%",
  },

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
