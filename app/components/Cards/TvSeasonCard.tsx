import React, { useState } from "react";
import { View, Image, StyleSheet, Text, Pressable } from "react-native";
import { useFonts } from "expo-font";
import { SvgXml } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import generateMovieAvatar from "../../lib/generateMovieAvatar";
import { useRouter } from "expo-router";

type Season = {
  id: number;
  name: string;
  poster_path: string | null;
  season_number: number;
  episode_count: number;
  air_date: string | null;
  vote_average: number;
};

type Props = { item: Season; tvID?: string };

export default function TvSeasonCard({ item, tvID }: Props) {
  const [imgError, setImgError] = useState(false);
  const posterUrl = `https://image.tmdb.org/t/p/w500`;
  const router = useRouter();
  const fallbackAvatarSvg = generateMovieAvatar(
    item.name || `Season ${item.season_number}`,
  );

  const [fontsLoaded] = useFonts({
    BebasNeue: require("@/assets/fonts/BebasNeue-Regular.ttf"),
    RobotoSlab: require("@/assets/fonts/RobotoSlab-VariableFont_wght.ttf"),
  });

  const onPress = () => {
    if (tvID) {
      router.push({
        pathname: "/pages/tvdetails/season/[...slug]",
        params: { slug: [tvID, String(item.season_number)] },
      });
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Pressable onPress={onPress}>
      <View style={styles.card}>
        {/* 🎬 Poster */}
        {!imgError && item.poster_path ? (
          <Image
            source={{ uri: posterUrl + item.poster_path }}
            style={styles.image}
            onError={() => setImgError(true)}
          />
        ) : (
          <View
            style={{
              width: 140,
              height: 210,
              overflow: "hidden",
              borderRadius: 10,
            }}
          >
            <SvgXml xml={fallbackAvatarSvg} width="100%" height="100%" />
          </View>
        )}

        {/* 🎥 Title */}
        <Text style={styles.title} numberOfLines={2}>
          {item.name || `Season ${item.season_number}`}
        </Text>

        {/* 📅 Episodes & Release */}
        {item.episode_count > 0 && (
          <Text style={styles.meta}>{item.episode_count} Episodes</Text>
        )}

        {item.air_date && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Text style={styles.metaYear}>{item.air_date.substring(0, 4)}</Text>
            <Ionicons name="star" size={12} color="#E50914" />
            <Text style={styles.metaYear}>{item.vote_average.toFixed(1)}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10, // use marginRight on older RN versions
    marginTop: 4,
  },
  metaItem: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 4,
  },
  metaText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "RobotoSlab",
  },
  card: {
    marginHorizontal: 10,
    marginVertical: 15,
    alignItems: "flex-start",
    width: 140,
  },
  image: {
    width: 140,
    height: 210,
    borderRadius: 10,
  },
  title: {
    marginTop: 6,
    color: "#fff",
    fontFamily: "BebasNeue",
    fontSize: 18,
    textAlign: "left",
    width: "100%",
  },
  meta: {
    marginTop: 2,
    color: "#E50914",
    fontSize: 13,
    fontFamily: "RobotoSlab",
    fontWeight: "bold",
  },
  metaYear: {
    marginTop: 2,
    color: "#aaa",
    fontSize: 12,
    fontFamily: "RobotoSlab",
  },
});
