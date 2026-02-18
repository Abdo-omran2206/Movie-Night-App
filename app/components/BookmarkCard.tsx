import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";

import Skeleton from "./Skeleton";

interface Bookmark {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  movieID: string;
  type: "movie" | "tv";
  status: string;
}

export default function BookmarkCard({
  item,
  onRemove,
  Loading,
}: {
  item: Bookmark;
  onRemove: (id: string) => void;
  Loading?: boolean;
}) {
  if (Loading) {
    return (
      <View style={styles.card}>
        <View
          style={[
            styles.bgImage,
            { backgroundColor: "#1a1a1a", padding: 10, flexDirection: "row" },
          ]}
        >
          <Skeleton width={100} height={150} borderRadius={8} />
          <View
            style={{ flex: 1, marginLeft: 15, justifyContent: "space-between" }}
          >
            <View>
              <Skeleton width="80%" height={24} borderRadius={4} />
              <Skeleton
                width={60}
                height={15}
                borderRadius={4}
                style={{ marginTop: 8 }}
              />
              <Skeleton
                width="100%"
                height={15}
                borderRadius={4}
                style={{ marginTop: 10 }}
              />
              <Skeleton
                width="100%"
                height={15}
                borderRadius={4}
                style={{ marginTop: 5 }}
              />
              <Skeleton
                width="70%"
                height={15}
                borderRadius={4}
                style={{ marginTop: 5 }}
              />
            </View>
            <Skeleton
              width={30}
              height={30}
              borderRadius={15}
              style={{ alignSelf: "flex-end" }}
            />
          </View>
        </View>
      </View>
    );
  }

  function handlePress() {
    if (item.type === "tv") {
      router.push({
        pathname: "/pages/tvdetails/[tvID]",
        params: { tvID: item.movieID.toString() },
      });
    } else {
      router.push({
        pathname: "/pages/moviedetails/[movieID]",
        params: { movieID: item.movieID.toString() },
      });
    }
  }

  return (
    <View style={styles.card}>
      <ImageBackground
        source={{
          uri: `https://image.tmdb.org/t/p/w500${item.backdrop_path}`,
        }}
        style={styles.bgImage}
        imageStyle={{ borderRadius: 10 }}
      >
        <View style={styles.overlay}>
          <Pressable
            style={{ flexDirection: "row", flex: 1 }}
            onPress={handlePress}
          >
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
              }}
              style={styles.poster}
            />
            <View
              style={{
                flex: 1,
                marginHorizontal: 10,
                justifyContent: "space-between",
                paddingVertical: 5,
              }}
            >
              <View>
                <Text style={styles.title}>{item.title}</Text>
                {item.status && (
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{item.status}</Text>
                  </View>
                )}
                <Text style={styles.overview} numberOfLines={3}>
                  {item.overview}
                </Text>
              </View>
              {/* 🗑 زر الحذف */}
              <TouchableOpacity
                onPress={() => onRemove(item.movieID)}
                style={styles.deleteButton}
              >
                <Ionicons name="trash-outline" size={24} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 10,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  bgImage: {
    width: "100%",
    height: 180,
    justifyContent: "flex-end",
  },
  overlay: {
    flexDirection: "row",
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
    alignItems: "center",
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: 8,
  },
  title: {
    color: "#fff",
    fontFamily: "BebasNeue",
    fontSize: 24,
    marginBottom: 4,
  },
  statusBadge: {
    backgroundColor: "#E50914",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: 6,
  },
  statusText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  overview: {
    color: "#ccc",
    fontFamily: "RobotoSlab",
    fontSize: 13,
    lineHeight: 18,
  },
  deleteButton: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 6,
    borderRadius: 20,
  },
});
