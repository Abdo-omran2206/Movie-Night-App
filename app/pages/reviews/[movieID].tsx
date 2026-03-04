import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  getMovieReviews,
  getTvReviews,
  getMovieById,
  getTvById,
} from "../../api/main";
import { useFonts } from "expo-font";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function ReviewsPage() {
  const { movieID, type } = useLocalSearchParams();
  const router = useRouter();
  const [reviews, setReviews] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {},
  );

  const [fontsLoaded] = useFonts({
    BebasNeue: require("@/assets/fonts/BebasNeue-Regular.ttf"),
    RobotoSlab: require("@/assets/fonts/RobotoSlab-VariableFont_wght.ttf"),
  });

  useEffect(() => {
    async function loaddata() {
      try {
        const id = Array.isArray(movieID) ? movieID[0] : movieID;
        const mediaType = (Array.isArray(type) ? type[0] : type) || "movie";

        if (id) {
          let reviewsData, contentData;
          if (mediaType === "tv") {
            [reviewsData, contentData] = await Promise.all([
              getTvReviews(id),
              getTvById(id),
            ]);
            setTitle(contentData?.name || "TV Show");
          } else {
            [reviewsData, contentData] = await Promise.all([
              getMovieReviews(id),
              getMovieById(id),
            ]);
            setTitle(contentData?.title || "Movie");
          }
          setReviews(reviewsData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loaddata();
  }, [movieID, type]);

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  const renderReviewItem = ({ item }: { item: any }) => {
    const isExpanded = expandedItems[item.id];
    const avatarPath = item.author_details?.avatar_path;
    const avatarUrl = avatarPath
      ? avatarPath.startsWith("/http")
        ? avatarPath.substring(1)
        : `https://image.tmdb.org/t/p/w185${avatarPath}`
      : null;

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => toggleExpand(item.id)}
        style={styles.reviewCard}
      >
        <View style={styles.reviewHeader}>
          <View style={styles.authorContainer}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.placeholderAvatar]}>
                <Ionicons name="person" size={20} color="#666" />
              </View>
            )}
            <View>
              <Text style={styles.authorName}>{item.author}</Text>
              <Text style={styles.dateText}>
                {new Date(item.created_at).toLocaleDateString()}
              </Text>
            </View>
          </View>
          {item.author_details?.rating && (
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={12} color="#FFD700" />
              <Text style={styles.ratingText}>
                {item.author_details.rating}
              </Text>
            </View>
          )}
        </View>
        <Text
          style={styles.reviewContent}
          numberOfLines={isExpanded ? undefined : 6}
        >
          {item.content}
        </Text>
        {!isExpanded && item.content.length > 250 && (
          <Text style={styles.readMore}>Read More...</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title} Reviews
        </Text>
      </View>

      {reviews.length > 0 ? (
        <FlatList
          data={reviews}
          renderItem={renderReviewItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbox-ellipses-outline" size={80} color="#333" />
          <Text style={styles.emptyText}>
            No reviews found for this {type || "movie"}
          </Text>
        </View>
      )}
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
    backgroundColor: "#111",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    flex: 1,
    color: "#fff",
    fontSize: 24,
    fontFamily: "BebasNeue",
    marginLeft: 15,
    letterSpacing: 1,
  },
  listContent: {
    padding: 15,
  },
  reviewCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#333",
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  placeholderAvatar: {
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  authorName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "RobotoSlab",
  },
  dateText: {
    color: "#888",
    fontSize: 12,
    marginTop: 2,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
  },
  reviewContent: {
    color: "#ccc",
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "RobotoSlab",
  },
  readMore: {
    color: "#E50914",
    fontSize: 12,
    marginTop: 10,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    color: "#666",
    fontSize: 18,
    fontFamily: "RobotoSlab",
    textAlign: "center",
    marginTop: 20,
  },
});
