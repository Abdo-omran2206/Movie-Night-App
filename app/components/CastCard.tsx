import { router } from "expo-router";
import React, { useState } from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import generateMovieAvatar from "../lib/generateMovieAvatar";
import { SvgXml } from "react-native-svg";

type CastProps = {
  item: {
    id: number;
    profile_path: string;
    name: string;
    character: string;
    known_for_department: string;
  };
};

export default function RenderCastCard({ item }: CastProps) {
  const [imgError, setImgError] = useState(false);
  const posterUrl = `https://image.tmdb.org/t/p/w500`;

  const fallbackAvatarSvg = generateMovieAvatar(
    item.name || "Untitled Actor",
    512
  );

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/pages/actordata/[actorID]",
          params: { actorID: item.id.toString() },
        })
      }
    >
      <View style={styles.card}>
        {!imgError && item.profile_path ? (
          <Image
            source={{ uri: posterUrl + item.profile_path }}
            style={styles.image}
            onError={() => setImgError(true)}
          />
        ) : (
          <View style={{ width: 140, height: 180, overflow: "hidden" }}>
            <SvgXml xml={fallbackAvatarSvg} width="100%" height="100%" />
          </View>
        )}
        <View style={styles.textField}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.character}>{item.character}</Text>
          <Text style={styles.department}>{item.known_for_department}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    margin: 10,
    backgroundColor: "#131313ff",
    marginHorizontal: 10,
    width: 140,
    borderRadius: 5,
    paddingBottom: 10,
  },
  image: {
    width: 140,
    height: 180,
    borderRadius: 10,
    marginBottom: 6,
  },
  name: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  character: {
    color: "#ccc",
    fontSize: 12,
    textAlign: "center",
  },
  department: {
    color: "gray",
    fontSize: 11,
    textAlign: "center",
  },
  textField: {
    padding: 5,
  },
});
