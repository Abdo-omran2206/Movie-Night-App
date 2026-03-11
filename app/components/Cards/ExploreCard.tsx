import { router } from "expo-router";
import React, { useState } from "react";
import { View, Image, StyleSheet, Text, Pressable } from "react-native";
import Skeleton from "../Skeleton";
import { Ionicons } from "@expo/vector-icons";
import { useStore } from "../../store/store";
import { getImageUrl } from "@/app/lib/getImageUrl";
import generateMovieAvatar from "@/app/lib/generateMovieAvatar";
import { SvgXml } from "react-native-svg";

import { Movie } from "../../constant/interfaces";

export default function RenderMovieCard({
  item,
  Loading,
}: {
  item: Movie;
  Loading?: boolean;
}) {
  const [imgError, setImgError] = useState(false);
  const { dataSavermood } = useStore();
  const { posterImage } = getImageUrl(dataSavermood, "card");

  if (Loading) {
    return (
      <View style={styles.cardContainer}>
        <View style={styles.movieCard}>
          <Skeleton width="100%" height={260} borderRadius={12} />
          <Skeleton
            width="90%"
            height={20}
            style={{ marginTop: 10, alignSelf: "center" }}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 8,
              marginTop: 10,
            }}
          >
            <Skeleton width={40} height={15} />
            <Skeleton width={40} height={15} />
          </View>
          <Skeleton
            width="60%"
            height={12}
            style={{ marginTop: 10, marginLeft: 8, marginBottom: 10 }}
          />
        </View>
      </View>
    );
  }

  const isTV = item.media_type === "tv" || (!!item.name && !item.title);

  const handlePress = () => {
    if (isTV) {
      router.push({
        pathname: "/pages/tvdetails/[tvID]",
        params: { tvID: item.id.toString() },
      });
    } else {
      router.push({
        pathname: "/pages/moviedetails/[movieID]",
        params: { movieID: item.id.toString() },
      });
    }
  };
  const fallbackAvatarSvg = generateMovieAvatar(
    item.title || item.name || "Untitled Movie",
  );

  return (
    <Pressable onPress={handlePress} style={styles.cardContainer}>
      <View style={styles.movieCard}>
        {/* Poster */}
        {!imgError && item.poster_path ? (
          <Image
            source={{
              uri: posterImage + item.poster_path,
            }}
            style={styles.movieImage}
            resizeMode="cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <View style={[styles.movieImage, { overflow: "hidden" }]}>
            <SvgXml xml={fallbackAvatarSvg} width="100%" height="100%" />
          </View>
        )}

        {/* Title */}
        <Text style={styles.movieTitle} numberOfLines={2}>
          {item.title || item.name || "Untitled"}
        </Text>

        {/* Rating and Date Row */}
        <View style={styles.metaRow}>
          {item.vote_average !== undefined && (
            <Text style={styles.movieMeta}>
              <Ionicons
                name="star"
                size={15}
                color={"#FFD700"}
                style={{ marginRight: 5 }}
              />{" "}
              {item.vote_average.toFixed(1)}
            </Text>
          )}
          <Text style={styles.movieMeta}>
            {item.release_date
              ? item.release_date.slice(0, 4)
              : item.first_air_date
                ? item.first_air_date.slice(0, 4)
                : ""}
          </Text>
        </View>

        {/* Region / Category */}
        {(item.region || item.category) && (
          <Text style={styles.movieMetaSmall} numberOfLines={1}>
            {item.region ? `🌍 ${item.region}` : ""}{" "}
            {item.category ? `🎭 ${item.category}` : ""}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: "48%", // Perfect for 2 columns
    marginBottom: 20,
  },
  movieCard: {
    backgroundColor: "rgba(0,0,0)",
    borderRadius: 12,
    overflow: "hidden",
  },
  movieImage: {
    width: "100%",
    height: 260, // Taller for better proportions
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  movieTitle: {
    marginTop: 6,
    color: "#fff",
    fontFamily: "BebasNeue",
    fontSize: 18,
    textAlign: "left",
    paddingHorizontal: 8,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    marginTop: 2,
  },
  movieMeta: {
    color: "#aaa",
    fontSize: 13,
    fontFamily: "RobotoSlab",
  },
  movieMetaSmall: {
    color: "#999",
    fontSize: 12,
    fontFamily: "RobotoSlab",
    paddingHorizontal: 8,
    marginTop: 2,
    marginBottom: 6,
  },
});
